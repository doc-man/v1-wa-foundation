'use strict';
angular.module('myApp').controller("manageGuiFeaturesMasterCtrl", ['$rootScope','$scope', '$http','$cookies', 'manageGuiFeaturesMasterService', '$timeout', '$interval', '$filter','$uibModal',
    function($rootScope, $scope, $http,$cookies,  manageGuiFeaturesMasterService, $timeout, $interval, $filter, $uibModal)
    {
        $scope.nameToShowInBreadcrumb = "Manage GUI features";
        //$scope = $scope.$parent;
        if(!_.isUndefined($scope.masterdbObj))
        {
            if($scope.masterdbObj.allowedToMasterDB == 'No')
            {
                $scope.masterdbObj.showNextLevel = false;
            }
        }

        $scope.logedInUserId = $cookies.getObject("loginObj").accesskey;
        $scope.forAddNewUser = false;
        $scope.roleList = [];
        $scope.masterData.messageVal ='';
        $scope.itemsByPage = 25;
        $scope.guiFeaturesSet = {};
        $scope.masterCodeList = {};
        //$scope.paginationInfo = {};

        $scope.fnAddNewConflictCode = function()
        {
            var arCode = {
                id: null,
                code: null,
                changedByUserFirstName: null,
                /*changedByUserLastName: '',*/
                codeThatConflict: null,
                /*createdByUID: null,
                createdOnDateTime: null,
                createdOnTimeZone: null,*/
                uniqueRowId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.guiFeaturesSet.splice(0,0,arCode);
            $scope.guiFeaturesSet =[].concat($scope.guiFeaturesSet);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        }

        $scope.getGuiFeaturesData = function()
        {
            $scope.masterData.userRolelistDataSet = [];
            manageGuiFeaturesMasterService.manageGuiFeaturesData('getGuiFeaturesData').getGuiFeaturesData( function(data)
            {
                console.log(data);
                if(data.data.length==0)
                {
                  $scope.masterData.messageVal ='Nothing found';
                }
                else
                {
                  $scope.masterData.messageVal ='';
                }

                $scope.guiFeaturesSet = data.data;
                $scope.masterCodeList = data.masterData;
                $scope.displayGuiFeaturesSetCollection =[].concat($scope.guiFeaturesSet);
                /!* For Pagignation *!/
                $scope.paginationInfo = {};
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo =  data.data;
                $scope.paginationInfo.totalItemCount = data.data.length;
            });
        }

        $scope.getGuiFeaturesData();


        $scope.bindUsersInView = function(arData)
        {
            $scope.guiFeaturesSet = [];
            arData.forEach(function(obj, idx)
            {
                $scope.guiFeaturesSet.push(obj);
            });
            $scope.displayGuiFeaturesSetCollection = [].concat($scope.guiFeaturesSet);
        };


        $scope.saveChange = function(arChangesData, prRowName){

            if(arChangesData.code != null || arChangesData.codeThatConflict != null) {
                if (arChangesData.code != null && arChangesData.code.name != null) {
                    arChangesData.code = arChangesData.code.name;
                }

                if(prRowName =='codeThatConflict' && arChangesData.codeThatConflict.length > $scope.guiFeaturesSet)
                {

                }

                //--important data to store in  DB during activitylog and for ConflictingCode table---------//
                arChangesData.rowName = prRowName;
                $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ?  $scope.activeUserTabId: $scope.loggedInUserId;
                arChangesData.uidOnActivityDone = vrActiveUserTabid;
                arChangesData.createdByUID = $scope.logedInUserId;
                arChangesData.nameOfSectionOnActivityDone = 'conflictingCode';
                arChangesData.createdOnDateTime = $scope.todayDate;
                arChangesData.createdOnTimeZone = $scope.createdTimeZone;
                arChangesData.tblFieldName = prRowName;
                arChangesData.typeOfActivityLog='';
                //---- Value set completed ----//
                manageGuiFeaturesMasterService.conflictCodeData('insertUpdateConflictCode').insertUpdateConflictCode({arChangesData}, function (data) {
                    if(data.status == 'success')
                    {
                        $scope.showPannelMessageBoard(data.message, 'alert-success');
                    }else{
                        $scope.showPannelMessageBoard('Already exist', 'alert-danger');
                    }
                });
            }
        }

        $scope.removeConflictCodes = function(arData)
        {

            //--important data to store in  DB during activitylog and for ConflictingCode table---------//
            $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ?  $scope.activeUserTabId: $scope.loggedInUserId;
            arData.uidOnActivityDone = vrActiveUserTabid;
            arData.createdByUID = $scope.logedInUserId;
            arData.nameOfSectionOnActivityDone = 'conflictingCode';
            arData.createdOnDateTime = $scope.todayDate;
            arData.createdOnTimeZone = $scope.createdTimeZone;
            arData.typeOfActivityLog='delete';
            //--important data to store in  DB during activitylog and for ConflictingCode table---------//

            if(arData.id===null)
            {
                var obj = _.findWhere($scope.guiFeaturesSet,
                    {
                        uniqueRowId: arData.uniqueRowId
                    });
                var idx = $scope.guiFeaturesSet.indexOf(obj);
                $scope.guiFeaturesSet.splice(idx,1);
            }else{
                manageGuiFeaturesMasterService.conflictCodeData('removeCode').removeCode({arData}, function (data) {
                    if(data.status =='success')
                    {
                        var obj = _.findWhere($scope.guiFeaturesSet,
                            {
                                id: arData.id
                            });

                        var idx = $scope.guiFeaturesSet.indexOf(obj);
                        if(idx != -1)
                        {
                            $scope.guiFeaturesSet.splice(idx, 1);
                        }
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                        $scope.showPannelMessageBoard(data.message, 'alert-success');
                    }else{
                        $scope.showPannelMessageBoard(data.message, 'alert-danger');
                    }
                });
            }

        }

        /*
         Q) Why we need this  function  fnOpenActivityStreamForMasterConflictCodes(index, code)?
         A) For 1 reason:
         1. To show activity log details for add,edit conflicting codes details.
         Added by: Vivek Deka on 28 Nov 2016.
         */
        $scope.fnOpenActivityStreamForMasterConflictCodes = function (index, code) {
            
           $scope.showEventsCodeActivityForEventLogLoading=false;
            
            var objApp = _.findWhere($scope.guiFeaturesSet, {
                id: code.id
            });
            var idxApp = $scope.guiFeaturesSet.indexOf(objApp);
             if (idxApp != -1) {
                $scope.guiFeaturesSet.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.guiFeaturesSet[idx].activityLogIconForEvent = false;
                    }
                });

                $scope.guiFeaturesSet[idxApp].activityLogIconForEvent = !$scope.guiFeaturesSet[idxApp].activityLogIconForEvent;
                
            }
            
            $scope.eventsActivityLogDataForEvent = [];

            manageGuiFeaturesMasterService.conflictCodeData('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Conflicting code'
                },
                function (data) {
                   data.data.forEach(function (eachData) {
                        eachData.finalValue = "";
                        if (eachData.typeOfActivity == 'edit' && eachData.idOfEventOnWhichAcitivtyIsDone == code.id) {
                            if(eachData.pluginRowNameWhereActivityIsDone == 'Code' && eachData.oldValue.trim() == "")
                            {
                                eachData.finalValue = eachData.newValue+'(Added)'
                            }else if(eachData.pluginRowNameWhereActivityIsDone == 'Code' && eachData.oldValue.trim() != "")
                            {
                                eachData.finalValue = 'Previous : ' + eachData.oldValue +  ', Updated: '+eachData.newValue;
                            }


                            if(eachData.oldValue.trim() != "" && eachData.newValue.trim()!="" && eachData.pluginRowNameWhereActivityIsDone == 'conflicting code')
                            {
                               eachData.finalValue = eachData.newValue+ ", "+ eachData.oldValue;
                            }else if(eachData.newValue.trim()!="" && eachData.oldValue.trim() == "" && eachData.pluginRowNameWhereActivityIsDone == 'conflicting code')
                            {
                               eachData.finalValue = eachData.newValue+'(Added)';
                            }else if(eachData.oldValue.trim() != "" && eachData.newValue.trim()=="" && eachData.pluginRowNameWhereActivityIsDone == 'conflicting code')
                            {
                               eachData.finalValue = eachData.oldValue+'(Removed)';
                            }
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                        else if (eachData.typeOfActivity == 'add' && eachData.idOfEventOnWhichAcitivtyIsDone == code.id) {
                            eachData.finalValue = eachData.newValue+'(Added)'
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }

                    });
                   $scope.showEventsCodeActivityForEventLogLoading=true;
                   $scope.showEventsActivityLogForEvent = $scope.guiFeaturesSet[idxApp].activityLogIconForEvent;
                    $scope.displayConflictingCodeActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);

                });
        };

        $scope.activityLogIconForConflictingCodes=false;

        /*
         Q) Why we need this  function  fnDeletedActivityStream()?
         A) For 1 reason:
         1. To show deleted activitylog details.
         Added by: Vivek Deka on 28 Nov 2016.
         */
        $scope.fnDeletedActivityStream = function () {
            $scope.activityLogIconForConflictingCodes = !$scope.activityLogIconForConflictingCodes;
            
            $scope.showEventsCodeActivityLogLoading=false;
            $scope.codesActivityLogDataForEvent = [];
            manageGuiFeaturesMasterService.conflictCodeData('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Conflicting code'
                },
                function (data) {
                    data.data.forEach(function (eachData) {

                        if (eachData.typeOfActivity == 'delete') {
                            if(eachData.oldValue.trim() != "")
                            {
                                eachData.oldValue = eachData.oldValue+"(Deleted)";
                            }
                            $scope.codesActivityLogDataForEvent.push(eachData);
                            
                        }

                    });
                    $scope.showEventsCodeActivityLogLoading=true;
                    $scope.showEventsCodeActivityLogForEvent=!$scope.showEventsCodeActivityLogForEvent;
                    $scope.displayCodeActivityLogCollection = [].concat($scope.codesActivityLogDataForEvent);

                });
        };

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) 
        { 
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addConflictRelationData') 
            {
                var uniqueId = objSocketData.dataSet.uniqueRowId;
                var obj = _.findWhere($scope.guiFeaturesSet,
                    {
                        uniqueRowId: uniqueId
                    });
                var idx = $scope.guiFeaturesSet.indexOf(obj);
                if(idx<0){
                    $scope.$apply(function ()
                    {
                        $scope.guiFeaturesSet.unshift(objSocketData.dataSet);
                        $scope.bindUsersInView($scope.guiFeaturesSet);
                    });
                } else {
                    $scope.$apply(function ()
                    {
                        $scope.guiFeaturesSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindUsersInView($scope.guiFeaturesSet);
                    });
                }
            }  else if (objSocketData.action == 'updateConflictRelationData') {
                $scope.$apply(function ()
                {
                    $scope.guiFeaturesSet = objSocketData.dataSet.data;
                    $scope.bindUsersInView($scope.guiFeaturesSet);
                });
            }else if (objSocketData.action == 'deleteConflictRelationData') {
                $scope.$apply(function ()
                {
                    $scope.guiFeaturesSet = objSocketData.dataSet.data;
                    $scope.bindUsersInView($scope.guiFeaturesSet);
                });
            }

        });
    }
]).service("manageGuiFeaturesMasterService", ['$resource', '$http',
    function ($resource, $http) {
        var factory = {};
        factory.manageGuiFeaturesData = function (queryType) {
            if (queryType == 'getGuiFeaturesData') {
                var scBrainRestRESTUri = apiResourceUrl + 'getGuiFeaturesData';
            }else if(queryType == 'insertUpdateConflictCode'){
                var scBrainRestRESTUri = apiResourceUrl + 'insertUpdateConflictCode';
            }else if(queryType == 'removeCode'){
                var scBrainRestRESTUri = apiResourceUrl + 'removeCode';
            }else if(queryType == 'getActivityLog'){
                var scBrainRestRESTUri = apiResourceUrl + 'getActivityLog/:id/:pluginId';
            }else if(queryType == 'deleteConflictingCodeActivityLog'){
                var scBrainRestRESTUri = apiResourceUrl + 'deleteConflictingCodeActivityLog';
            }
            return $resource(scBrainRestRESTUri, {},
                {
                    getGuiFeaturesData: {
                        method: 'GET'
                    },
                    insertUpdateConflictCode: {
                        method: 'PUT'
                    },
                    removeCode: {
                        method: 'PUT'
                    },
                    getActivityLog: {
                        method: 'GET'
                    }
                });
        };
        return factory;
    }]);