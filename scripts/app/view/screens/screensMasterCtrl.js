'use strict';
angular.module('myApp').controller("screensMasterCtrl", ['$scope', '$rootScope','userServices','$state','$stateParams', '$timeout', 'screensService','$uibModal','$filter',
    function($scope, $rootScope, userServices, $state, $stateParams, $timeout, screensService,$uibModal,$filter) {
        $scope.nameToShowInBreadcrumb = "Screens Master";
        var actionButtons = '<button class="btn btn-warning btn-xs" ng-click="grid.appScope.removethis(row.entity)">Remove</button>';
        $scope.itemsByPage = 25;
        $scope.paginationInfo = {};
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $rootScope.pageSubTitle = "Screens";
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.msg = {};
/*==================================================================Fetch and show==================================================================================*/
        /*
         Q) Why we need this?
         A) For 1 reason:
         1. To fetch the data from the screen master table
         Fetch
         1. screenName
         2. fetch all data from the table
         Added by: Kiran on 27 July 2016.
         */
        if (!$scope.masterData.screensList) {
            screensService.masterScreens('getAllScreensData').getAllScreensData({

            }, function(data) {
                $scope.masterData.screensList = [];

                if( data.data.length == 0 ) {
                    $scope.masterData.messageVal = 'Nothing found';
                } else {
                    $scope.masterData.messageVal ='';
                }

                $scope.masterData.screensList = data.data;
                $scope.displayScreensList = [].concat($scope.masterData.screensList);

                /* For Pagignation */
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo =  data.data;
                $scope.paginationInfo.totalItemCount = data.data.length;

            });
        };

        $scope.fnToAddNewScreenData = function(screensId, screensScreenName){
            /*$state.go('masterDb.sectionPage',{id :'0'+screens.id, title :'Screen details of '+screens.screenName});*/
            $state.go('masterDb.screenDetail',{id : '0'+screensId});

        }


/*==================================================================Add new row==================================================================================*/
        /*
         Q) Why we need this  function  fnAddScreens()?
         A) For 1 reason:
         1. To add new row for adding new screens details when clicked on '+' sign of master screens panel.
         Add
         1. screenName
         2. scientificName
         3. clinicalStudies
         Added by: Kiran on 27 July 2016.
         */
        $scope.fnAddScreens = function()
        {
            var screens = {
                id: null,
                screenName: null,
                scientificName: null,
                clinicalStudies: null,
                isItLocked: 'no',
                uniqueRowId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.masterData.screensList.splice(0,0,screens);
            $scope.displayScreensList =[].concat($scope.masterData.screensList);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        };

/*==================================================================Lock Screen==================================================================================*/
        $scope.fnLockScreens = function(rowObj, fieldname){
            if(rowObj.id != null)
            {
                if( fieldname == "lock"){
                    var rowEntity = {};
                    rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                    var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
                    rowEntity.uidOnActivityDone = vrActiveUserTabid;
                    rowEntity.createdByUserId = $scope.loggedInUserId;
                    rowEntity.tableId = rowObj.id;
                    rowEntity.typeOfActivityLog = 'edit';
                    rowEntity.nameOfSectionOnActivityDone = 'screensMaster';
                    //---- Value set completed ----//

                    screensService.masterScreens('lockScreensFromMasterdb').lockScreensFromMasterdb(rowEntity,
                        function (data) {
                            $scope.showPannelMessageBoard('Row locked successfully', 'alert-success', 3000);
                        });
                }
            }

        }
/*==================================================================Check screen name present in master table==================================================================================*/
        /*
         Q) Why we need this  function  checkScreensName(rowObj, data, fieldname)?
         A) For 1 reason:
         1. To check screens name is not blanked and screens is already present or not in master database.
         Added by: Kiran on 28 July 2016.
         */
        $scope.fnSaveScreens = function(rowObj, data, fieldname) {

            if( fieldname == "screenName"){
                var fieldVal = rowObj.screenName;
                var fieldText = "Screen name";
            }
            else if( fieldname == "scientificName"){
                var fieldVal = rowObj.scientificName;
                var fieldText = "Scientific name";
            }
            else if( fieldname == "clinicalStudies"){
                var fieldVal = rowObj.clinicalStudies;
                var fieldText = "Clinical studies";
            }
            else if( fieldname == "color"){
                var fieldVal = rowObj.color;
                var fieldText = "Color";
            }
            else {
                var fieldVal = null;
            }

            if( data == fieldVal ){
                // if data and field value is same.
                $scope.showPannelMessageBoard( 'Can not update as data is not changed.', 'alert-danger', 3000)
            }
            else {
                var rowEntity = {};
                //--important data to store in  DB during activitylog---------//
                rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ?  $scope.activeUserTabId: $scope.loggedInUserId;
                rowEntity.uidOnActivityDone = vrActiveUserTabid;
                rowEntity.createdByUserId = $scope.loggedInUserId;
                rowEntity.nameOfSectionOnActivityDone = 'screensMaster';
                rowEntity.tblFieldName = fieldText;


                //---- Value set completed ----//

                // check weather it is a new row or old row.
                if(rowObj.id == null){
                    // create
                    rowEntity.uniqueRowId = rowObj.uniqueRowId;
                    rowEntity.typeOfActivityLog = 'add';
                    if(fieldname == "screenName"){
                        if(data.trim()!=''){
                            rowEntity.screenName = data;

                            var obj = _.findWhere($scope.masterData.screensList,
                                {
                                    screenName: data
                                });

                            var idx = $scope.masterData.screensList.indexOf(obj);
                            if(idx != -1)
                            {
                                $scope.showPannelMessageBoard('Screen name is already exists', 'alert-success',  3000);
                            }
                            else{
                                screensService.masterScreens('createScreensFromMasterdb').createScreensFromMasterdb({}, rowEntity, function(data)
                                {
                                    $scope.showPannelMessageBoard('Created successfully', 'alert-success',  3000);
                                });
                            }
                        }
                        else{
                            $scope.showPannelMessageBoard('Screen name should not be blank', 'alert-danger',  3000);
                            return "";
                        }
                    }
                    else if( fieldname == "scientificName" || fieldname == "clinicalStudies" || fieldname == "color"){
                        $scope.showPannelMessageBoard('Please add screen name first', 'alert-success',  3000);
                    }
                }
                else {
                    // update
                    rowEntity.tableId = rowObj.id;
                    rowEntity.typeOfActivityLog = 'edit';
                    if( fieldname == "screenName"){
                        rowEntity.screenName = data;
                    }
                    if( fieldname == "scientificName"){
                        rowEntity.scientificName = data;
                    }
                    if( fieldname == "clinicalStudies"){
                        rowEntity.clinicalStudies = data;
                    }
                    if( fieldname == "color"){
                        rowEntity.color = data;
                    }

                    screensService.masterScreens('updateScreensFromMasterdb').updateScreensFromMasterdb({}, rowEntity, function(data)
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
        };
/*==================================================================Remove screens from master table==================================================================================*/
        /*
         Q) Why we need this  function  removeScreens(rowObj)?
         A) For 1 reason:
         1. To delete screens details when click on delete buttons.
         Added by: Kiran on 29 July 2016.
         */
        $scope.removeScreens = function(rowObj) {
            if(rowObj.id != null)
            {
                $scope.$modalInstance = $uibModal.open(
                    {
                        scope: $scope,
                        templateUrl: 'view/screens/popupConfirm.html',
                        size: "500",
                    });
                $scope.assignScreensData = rowObj;
            }
            else {
                var obj = _.findWhere($scope.masterData.screensList,
                    {
                        uniqueRowId: rowObj.uniqueRowId
                    });
                var idx = $scope.masterData.screensList.indexOf(obj);
                $scope.masterData.screensList.splice(idx,1);
            }

        };

        /*
         Q) Why we need this  function  cancelDelete()?
         A) For 1 reason:
         1. To cancel delete screens details when click on cancel button of popup.
         Added by: Kiran on 28th July 2016.
         */
        $scope.cancelDelete = function()
        {
            $scope.$modalInstance.close();
        };

        /*
         Q) Why we need this  function  fnConfirmAddNewScreens(arMedicineData)?
         A) For 1 reason:
         1. To add new screens when click on confirm button of popup.
         Added by: Kiran on 28th June 2016.
         */
        $scope.confirmTrue = function(arScreensData) {
            //----Set some important data to store DB during activitylog---------//
            var rowEntity = {};
            rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
            rowEntity.uidOnActivityDone = vrActiveUserTabid;
            rowEntity.createdByUserId = $scope.loggedInUserId;
            rowEntity.tableId = arScreensData.id;
            rowEntity.typeOfActivityLog = 'delete';
            rowEntity.nameOfSectionOnActivityDone = 'screensMaster';
            //---- Value set completed ----//
            screensService.masterScreens('removeScreensFromMasterdb').removeScreensFromMasterdb(rowEntity, function (data) {
                if(data.status=='failed') {
                    $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
                } else if(data.status=='success') {
                    $scope.showPannelMessageBoard(data.message, 'alert-success', 3000);
                }
                });
            $scope.$modalInstance.close();
        };
/*================================================================Show message panel====================================================================================*/

        /*
         Q) Why we need this  function  showPannelMessageBoard(message, classname, time)?
         A) For 1 reason:
         1. To show add,update,delete message notification on master screens panel..
         Added by: Kiran on 28th July 2016.
         */
        $scope.showPannelMessageBoard = function(message, classname, time) {
            if (_.isUndefined(time))
            {
                time = 1000;
            }
            $scope.msgObj = {};
            if (!$scope.msgObj.msg) $scope.msgObj.msg = {};
            $scope.msgObj.msg.text = message;
            $scope.msgObj.msg.mclass = classname;
            $scope.msgObj.msg.open = true;
            var timer = $timeout(function()
            {
                $scope.msgObj.msg.open = false;
                $timeout.cancel(timer);
            }, time);
        };

/*================================================================Bind Function====================================================================================*/
        /*
         Q) Why we need this  function  fnBindScreensListInView(arData)?
         A) For 1 reason:
         1. To update st table screens list data when any updation done by socket.
         Added by: kiran on 28th June 2016.
         */
        $scope.fnBindScreensListInView = function(arData)
        {
            $scope.masterData.screensList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.screensList.push(obj);
            });
            $scope.displayScreensList = [].concat($scope.masterData.screensList);
            if($scope.masterData.screensList.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
        };
/*================================================================Socket IO====================================================================================*/
        /*
         * start of socket block to update screens details by socket.
         */
        var channelId = 's6-p19-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addScreenNameFromMasterdb')
            {
                var uniqueRowId = objSocketData.dataSet.uniqueRowId;
                var obj = _.findWhere($scope.masterData.screensList,
                    {
                        uniqueRowId: uniqueRowId
                    });
                var idx = $scope.masterData.screensList.indexOf(obj);
                if(idx != -1 ){
                    $scope.$apply(function ()
                    {
                        objSocketData.dataSet.uniqueRowId = null;
                        $scope.masterData.screensList.splice(idx, 1, objSocketData.dataSet);
                        $scope.fnBindScreensListInView($scope.masterData.screensList);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    });
                }
                else
                {
                    objSocketData.dataSet.uniqueRowId = null;
                    $scope.masterData.screensList.push(objSocketData.dataSet);
                    $scope.fnBindScreensListInView($scope.masterData.screensList);
                    $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                }
            }
            else if(objSocketData.action == 'updateScreenNameFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.screensList,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.masterData.screensList.indexOf(obj);
                    $scope.masterData.screensList[idx] = objSocketData.dataSet;
                });
                $scope.updatedScreensData = $scope.masterData.screensList;
                $scope.fnBindScreensListInView($scope.updatedScreensData);

            }
            else if(objSocketData.action == 'lockScreenNameFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.screensList,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.masterData.screensList.indexOf(obj);
                    $scope.masterData.screensList[idx] = objSocketData.dataSet;
                });
                $scope.updatedScreensData = $scope.masterData.screensList;
                $scope.fnBindScreensListInView($scope.updatedScreensData);

            }
            else if(objSocketData.action == 'removeScreenNameFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.screensList,
                        {
                            id: objSocketData.dataSet
                        });
                    var idx = $scope.masterData.screensList.indexOf(obj);
                    if(idx != -1)
                    {
                        $scope.masterData.screensList.splice(idx, 1);
                    }
                    if($scope.masterData.screensList.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });
            }

        });
/*================================================================Activity log====================================================================================*/

        /*
         Q) Why we need this  function  fnOpenActivityStreamForMasterScreens(index, screens)?
         A) For 1 reason:
         1. To show activity log details for add,edit screens details.
         Added by: Kiran on 28th July 2016.
         */
        $scope.fnOpenActivityStreamForMasterScreens = function (index, screens) {
            var objApp = _.findWhere($scope.displayScreensList, {
                id: screens.id
            });
            var idxApp = $scope.displayScreensList.indexOf(objApp);
            if (idxApp != -1) {
                $scope.displayScreensList.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.displayScreensList[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.displayScreensList[idxApp].activityLogIconForEvent = !$scope.displayScreensList[idxApp].activityLogIconForEvent;
                $scope.showEventsActivityLogForEvent = $scope.displayScreensList[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: screens.id,
                    pluginId: 0,
                    sectionName: 'ScreensMasterForAddEdit'
                },
                function (data) {

                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'edit' && eachData.idOfEventOnWhichAcitivtyIsDone == screens.id) {
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                        else if (eachData.typeOfActivity == 'add' && eachData.idOfEventOnWhichAcitivtyIsDone == screens.id) {
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                    });
                    $scope.displayScreensActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);

                });
        };

        $scope.activityLogIconForScreens=false;

        /*
         Q) Why we need this  function  fnDeletedActivityStream()?
         A) For 1 reason:
         1. To show deleted activitylog details.
         Added by: Kiran on 29th July 2016.
         */
        $scope.fnDeletedActivityStream = function () {

            $scope.activityLogIconForScreens = !$scope.activityLogIconForScreens;
            $scope.showMasterScreensActivityLog=!$scope.showMasterScreensActivityLog;
            $scope.screensActivityLogData = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'ScreensMasterForDelete'
                },
                function (data) {
                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'delete') {
                            $scope.screensActivityLogData.push(eachData);
                        }
                    });
                    $scope.displayScreensActivityLogCollection = [].concat($scope.screensActivityLogData);

                });
        };
    }
]);

angular.module('myApp').service("screensService", ['$resource',
    function($resource) {
        var factory = {};
        factory.masterScreens = function(queryType) {
            var queryType = arguments[0] || '';
            //var userRESTUri = serviceUrl+"screens";
            var userRESTUri = apiResourceUrl + "masterScreens";
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                userRESTUri += '/:id';
            }
            if (queryType == 'getAllScreensData') {
                var userRESTUri = apiResourceUrl + "getAllScreensData";
            } else if (queryType == 'createScreensFromMasterdb') {
                var userRESTUri = apiResourceUrl + "createScreensFromMasterdb";
            } else if (queryType == 'updateScreensFromMasterdb') {
                var userRESTUri = apiResourceUrl + "updateScreensFromMasterdb";
            } else if (queryType == 'removeScreensFromMasterdb') {
                var userRESTUri = apiResourceUrl + "removeScreensFromMasterdb";
            } else if (queryType == 'lockScreensFromMasterdb') {
                var userRESTUri = apiResourceUrl + "lockScreensFromMasterdb";
            }
            return $resource(userRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                createScreensFromMasterdb: {
                    method: 'POST'
                },
                updateScreensFromMasterdb: {
                    method: 'POST'
                },
                show: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                getAllScreensData: {
                    method: 'GET',
                },
                removeScreensFromMasterdb: {
                    method: 'POST',
                },
                lockScreensFromMasterdb: {
                    method: 'POST',
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        return factory;
    }
]);