'use strict';

angular.module('myApp').controller("screensDetailMasterCtrl", ['$scope', '$rootScope',  '$stateParams', '$window', 'screensDetailsServices', 'userServices','$timeout', '$filter', '$uibModal', 'FileUploader',
    function($scope, $rootScope, $stateParams, $window, screensDetailsServices, userServices, $timeout, $filter, $uibModal, FileUploader)
    {
        $scope.nameToShowInBreadcrumb = "Screen details";
        $scope.screensDetails = {};
        $scope.screensTableID = parseInt($stateParams.id);
        $scope.screensDetailPageTitle = $stateParams.title;
        $scope.requiredList = ['Yes','No'];
        $scope.answerInputTypeList = ['Select box', 'Text box', 'Text area'];

/*==================================================================Show screen message board==================================================================================*/
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
/*==================================================================Show screen Question board==================================================================================*/

        /*show*/
        $scope.fnLoadDataOfScreensDetailsPanel = function(screensTableID) {
            screensDetailsServices.masterQuestions('getLoadDataForScreens').getLoadDataForScreens({id: screensTableID}, function (data) {
                $scope.screensDetails = data.allQuestions;
                $scope.screensDetails.forEach(function(val,index){
                    val.uploader = $scope.instantiateUploader(val.questionId);
                });
                $scope.questionGroupList = data.questionGroupList;
                $scope.bindToDisplayDataSetOfScreensDetails($scope.screensDetails);

            });
        }
        function ucwords (str) {
            return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }
        /*bind*/
        $scope.bindToDisplayDataSetOfScreensDetails = function (arData) {
            $scope.srcScreensDetailsDataSet = [];
            if(arData.length>0) {
                arData.forEach(function (item) {
                    var str = item.answerInputType;
                    item.answerInputType = ucwords(str);
                    $scope.srcScreensDetailsDataSet.push(item);
                });
            }
            $scope.displayScreensDetailsData = [].concat($scope.srcScreensDetailsDataSet);
        };

        /*add new comment data*/
        $scope.addNewScreensDetailsData = function(){
            var uniqueRowId = Math.floor((Math.random() * 9000) + 1) + (new Date().getTime());
            var newScreensDetailsDataSet = {
                questionId: null,
                isItLocked: 'No',
                question: null,
                groupID: null,
                groupName: null,
                requiredToAnswer: 'No',
                answerInputType: 'Select box',
                option1: null,
                pointsForOption1: null,
                option2: null,
                pointsForOption2: null,
                option3: null,
                pointsForOption3: null,
                option4: null,
                pointsForOption4: null,
                option5: null,
                pointsForOption5: null,
                uniqueRowId: uniqueRowId,
                uploader: $scope.instantiateUploader(null,uniqueRowId),
                imageUrl:''
            };
            $scope.srcScreensDetailsDataSet.unshift(newScreensDetailsDataSet);
            $scope.bindToDisplayDataSetOfScreensDetails($scope.srcScreensDetailsDataSet);
        };
/*==================================================================Check and save==================================================================================*/
        /*
         Q) Why we need this  function  updateScreensDetailsData(rowObj, data, fieldname)?
         A) For 1 reason:
         1. Add questions to the master question db.
         Added by: Kiran on 2nd August 2016.
         */
        $scope.updateScreensDetailsData = function(rowObj, data, fieldname) {
            if( fieldname == "question"){
                var fieldVal = rowObj.question;
            } else if( fieldname == "questionGroup"){
                var fieldVal = rowObj.groupID;
            } else if( fieldname == "requiredToAnswer"){
                var fieldVal = rowObj.requiredToAnswer;
            } else if( fieldname == "answerInputType"){
                var fieldVal = rowObj.answerInputType;
            } else if( fieldname == "option1"){
                var fieldVal = rowObj.option1;
            } else if( fieldname == "option2"){
                var fieldVal = rowObj.option2;
            } else if( fieldname == "option3"){
                var fieldVal = rowObj.option3;
            } else if( fieldname == "option4"){
                var fieldVal = rowObj.option4;
            } else if( fieldname == "option5"){
                var fieldVal = rowObj.option5;
            } else if( fieldname == "pointsForOption1"){
                var fieldVal = rowObj.pointsForOption1;
            } else if( fieldname == "pointsForOption2"){
                var fieldVal = rowObj.pointsForOption2;
            } else if( fieldname == "pointsForOption3"){
                var fieldVal = rowObj.pointsForOption3;
            } else if( fieldname == "pointsForOption4"){
                var fieldVal = rowObj.pointsForOption4;
            } else if( fieldname == "pointsForOption5"){
                var fieldVal = rowObj.pointsForOption5;
            } else {
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
                rowEntity.uidOnActivityDone = !_.isUndefined($scope.activeUserTabId) ?  $scope.activeUserTabId: $scope.loggedInUserId;
                rowEntity.createdByUserId = $scope.loggedInUserId;
                rowEntity.nameOfSectionOnActivityDone = 'screensQuestions';
                rowEntity.tblFieldName = fieldname;
                rowEntity.screenMasterTableId = $scope.screensTableID;
                //---- Value set completed ----//

                // check weather it is a new row or old row.
                if( rowObj.questionId == null ){
                    // create
                        rowEntity.uniqueRowId = rowObj.uniqueRowId;
                        rowEntity.typeOfActivityLog = 'add';
                        if( fieldname == "question"){
                            if(data.trim!="")
                            {
                                rowEntity.question = data;
                                screensDetailsServices.masterQuestions('createScreensQuestionsFromMasterdb').createScreensQuestionsFromMasterdb({}, rowEntity, function(data)
                                {
                                    $scope.showPannelMessageBoard('Question successfully created', 'alert-success',  3000);
                                });
                            }
                            else {
                                $scope.showPannelMessageBoard('Question should not be blank', 'alert-danger',  3000);
                                return "";
                            }
                        } else {
                            $scope.showPannelMessageBoard('Please add a question first', 'alert-danger',  3000);
                        }
                }
                else {
                    // update
                    rowEntity.tableId = rowObj.questionId;
                    rowEntity.typeOfActivityLog = 'edit';
                    if( fieldname == "question"){
                        rowEntity.question = data;
                    }
                    if( fieldname == "questionGroup"){
                        rowEntity.groupID = data;
                    }
                    if( fieldname == "requiredToAnswer"){
                        rowEntity.requiredToAnswer = data;
                    }
                    if( fieldname == "answerInputType"){
                        rowEntity.answerInputType = data;
                    }
                    if( fieldname == "option1"){
                        rowEntity.option1 = data;
                    }
                    if( fieldname == "option2"){
                        rowEntity.option2 = data;
                    }
                    if( fieldname == "option3"){
                        rowEntity.option3 = data;
                    }
                    if( fieldname == "option4"){
                        rowEntity.option4 = data;
                    }
                    if( fieldname == "option5"){
                        rowEntity.option5 = data;
                    }
                    if( fieldname == "pointsForOption1"){
                        rowEntity.pointsForOption1 = data;
                    }
                    if( fieldname == "pointsForOption2"){
                        rowEntity.pointsForOption2 = data;
                    }
                    if( fieldname == "pointsForOption3"){
                        rowEntity.pointsForOption3 = data;
                    }
                    if( fieldname == "pointsForOption4"){
                        rowEntity.pointsForOption4 = data;
                    }
                    if( fieldname == "pointsForOption5"){
                        rowEntity.pointsForOption5 = data;
                    }
                    screensDetailsServices.masterQuestions('updateScreensQuestionsFromMasterdb').updateScreensQuestionsFromMasterdb({}, rowEntity, function(data)
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
        };
/*==================================================================Lock Question==================================================================================*/
        $scope.fnLockQuestion = function(rowObj, fieldname){
            if(rowObj.questionId != null)
            {
                if( fieldname == "lock"){
                    var rowEntity = {};
                    rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                    var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
                    rowEntity.uidOnActivityDone = vrActiveUserTabid;
                    rowEntity.createdByUserId = $scope.loggedInUserId;
                    rowEntity.tableId = rowObj.questionId;
                    rowEntity.typeOfActivityLog = 'edit';
                    rowEntity.nameOfSectionOnActivityDone = 'screensQuestions';
                    rowEntity.screenMasterTableId = $scope.screensTableID;
                    //---- Value set completed ----//

                    screensDetailsServices.masterQuestions('lockScreensQuestionFromMasterdb').lockScreensQuestionFromMasterdb(rowEntity,
                        function (data) {
                            $scope.showPannelMessageBoard('Question successfully locked', 'alert-success', 3000);
                        });
                }
            }

        }

/*==================================================================Remove screens from master table==================================================================================*/
        /*
         Q) Why we need this  function  removeScreens(rowObj)?
         A) For 1 reason:
         1. To delete screens details when click on delete buttons.
         Added by: Kiran on 29 July 2016.
         */
        $scope.removeScreenQuestionAndAnswers = function(rowObj) {
            if(rowObj.questionId != null)
            {
                $scope.$modalInstance = $uibModal.open(
                    {
                        scope: $scope,
                        templateUrl: 'view/screenDetail/popupConfirm.html',
                        size: "500",
                    });
                $scope.assignScreensData = rowObj;
            }
            else {
                var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                    {
                        uniqueRowId: rowObj.uniqueRowId
                    });
                var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                $scope.srcScreensDetailsDataSet.splice(idx, 1);
                $scope.bindToDisplayDataSetOfScreensDetails($scope.srcScreensDetailsDataSet);
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
            if(arScreensData.questionId != null) {

                //----Set some important data to store DB during activitylog---------//
                var rowEntity = {};
                rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
                rowEntity.uidOnActivityDone = vrActiveUserTabid;
                rowEntity.createdByUserId = $scope.loggedInUserId;
                rowEntity.tableId = arScreensData.questionId;
                rowEntity.typeOfActivityLog = 'delete';
                rowEntity.nameOfSectionOnActivityDone = 'screensQuestions';
                rowEntity.screenMasterTableId = $scope.screensTableID;
                //---- Value set completed ----//

                screensDetailsServices.masterQuestions('removeScreensQuestionFromMasterdb').removeScreensQuestionFromMasterdb(rowEntity,
                    function (data) {
                        if(data.status=='failed') {
                            $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
                        } else if(data.status=='success') {
                            $scope.showPannelMessageBoard(data.message, 'alert-success', 3000);
                        }
                    });
            }
            else {
                var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                    {
                        uniqueRowId: rowObj.uniqueRowId
                    });
                var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                $scope.srcScreensDetailsDataSet.splice(idx,1);
            }
            $scope.$modalInstance.close();
        };


/*================================================================Socket IO====================================================================================*/
        /*
         * start of socket block to update screens details by socket.
         */
        var channelId = 's6-p19-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addScreenQuestionFromMasterdb')
            {
                var uniqueRowId = objSocketData.dataSet.uniqueRowId;
                var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                    {
                        uniqueRowId: parseInt(uniqueRowId)
                    });
                var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                if(idx != -1 ){
                    $scope.$apply(function ()
                    {
                        objSocketData.dataSet.uniqueRowId = null;
                        objSocketData.dataSet.uploader = $scope.instantiateUploader(objSocketData.dataSet.questionId);
                        $scope.srcScreensDetailsDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindToDisplayDataSetOfScreensDetails($scope.srcScreensDetailsDataSet);

                    });
                }
                else
                {
                    objSocketData.dataSet.uniqueRowId = null;
                    objSocketData.dataSet.uploader = $scope.instantiateUploader(objSocketData.dataSet.questionId);
                    $scope.srcScreensDetailsDataSet.push(objSocketData.dataSet);
                    $scope.bindToDisplayDataSetOfScreensDetails($scope.srcScreensDetailsDataSet);
                }
            }
            else if(objSocketData.action == 'updateScreenQuestionFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                        {
                            questionId: objSocketData.dataSet.questionId
                        });
                    var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                    objSocketData.dataSet.uploader = $scope.instantiateUploader(objSocketData.dataSet.questionId);
                    $scope.srcScreensDetailsDataSet[idx] = objSocketData.dataSet;
                });
                $scope.updatedScreensData = $scope.srcScreensDetailsDataSet;
                $scope.bindToDisplayDataSetOfScreensDetails($scope.updatedScreensData);

            }
            else if(objSocketData.action == 'removeScreenQuestionsNameFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                        {
                            questionId: objSocketData.dataSet
                        });

                    var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                    if(idx != -1)
                    {
                        $scope.srcScreensDetailsDataSet.splice(idx, 1);
                    }
                    if($scope.srcScreensDetailsDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });
            }
            else if(objSocketData.action == 'lockScreenQuestionsNameFromMasterdb')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.srcScreensDetailsDataSet,
                        {
                            questionId: objSocketData.dataSet.questionId
                        });
                    var idx = $scope.srcScreensDetailsDataSet.indexOf(obj);
                    objSocketData.dataSet.uploader = $scope.instantiateUploader(objSocketData.dataSet.questionId);
                    $scope.srcScreensDetailsDataSet[idx] = objSocketData.dataSet;
                });
                $scope.updatedScreensData = $scope.srcScreensDetailsDataSet;
                $scope.bindToDisplayDataSetOfScreensDetails($scope.updatedScreensData);

            }

        });
/*================================================================Activity log====================================================================================*/
        $scope.fnOpenActivityStreamForMasterScreensQuestionDetails = function (index, screenDetails) {
            var objApp = _.findWhere($scope.displayScreensDetailsData, {
                questionId: screenDetails.questionId
            });
            var idxApp = $scope.displayScreensDetailsData.indexOf(objApp);
            if (idxApp != -1) {
                $scope.displayScreensDetailsData.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.displayScreensDetailsData[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.displayScreensDetailsData[idxApp].activityLogIconForEvent = !$scope.displayScreensDetailsData[idxApp].activityLogIconForEvent;
                $scope.showEventsActivityLogForEvent = $scope.displayScreensDetailsData[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            userServices.activityLog('getActivityLogForScreensQuestions').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: $scope.screensTableID,
                    sectionName: 'ScreensMasterForAddEditQuestion',
                    questionId : screenDetails.questionId
                },
                function (data) {
                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'edit' && eachData.idOfEventOnWhichAcitivtyIsDone == screenDetails.questionId) {
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                        else if (eachData.typeOfActivity == 'add' && eachData.idOfEventOnWhichAcitivtyIsDone == screenDetails.questionId) {
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
            $scope.showMasterScreensActivityLog = !$scope.showMasterScreensActivityLog;
            $scope.screensActivityLogData = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: $scope.screensTableID,
                    sectionName: 'ScreensMasterForDeleteQuestion'
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


        //----------------------------------- Image Upload -----------------------------------------

        $scope.instantiateUploader = function (questionId,uniqueRowID) {
            var createdByUserId = $scope.loggedInUserId;
            var vrTimeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrCurrentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            if(questionId){
                var uploader = new FileUploader({
                    url: apiResourceUrl + 'uploadImageForScreenQuestion/?createdByUserId=' + createdByUserId + '&timeZoneAbbreviation='+vrTimeZoneAbbreviationOfClient+'&currentDateTimeOfClient='+vrCurrentDateTimeOfClient+'&screenId='+$scope.screensTableID+'&questionId='+questionId
                });
            }
            else {
                var uploader = new FileUploader({
                    url: apiResourceUrl + 'uploadImageForScreenQuestion/?createdByUserId=' + createdByUserId + '&timeZoneAbbreviation='+vrTimeZoneAbbreviationOfClient+'&currentDateTimeOfClient='+vrCurrentDateTimeOfClient+'&screenId='+$scope.screensTableID+'&uniqueRowID='+uniqueRowID
                });

            }
            /*uploader.onWhenAddingFileFailed = function (item /!*{File|FileLikeObject}*!/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };*/
            uploader.onAfterAddingFile = function (fileItem) {

                uploader.uploadAll();
            };
            /*uploader.onAfterAddingAll = function (addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);

            };
            uploader.onBeforeUploadItem = function (item) {
                //console.info('onBeforeUploadItem', item);
            };*/
            uploader.onProgressItem = function (fileItem, progress) {
                // console.info('onProgressItem', fileItem, progress);
                $scope.showPannelMessageBoard('Uploading.....', 'alert-success', 5000);
            };/*
            uploader.onProgressAll = function (progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                //console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };*/
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                if(response.status == 'success') {
                    $scope.showPannelMessageBoard('Image uploaded', 'alert-success', 3000);
                }
                else if(response.status == 'file not supported'){
                    $scope.showPannelMessageBoard('File not supported', 'alert-danger', 3000);
                }
                else{
                    $scope.showPannelMessageBoard('Image failed to upload', 'alert-danger', 3000);
                }
                //$scope.showPannelMessageBoard('Image uploaded', 'alert-success', 3000);
            };
            uploader.onCompleteAll = function () {
                //console.info('onCompleteAll');
            };
            return uploader;
        };
        $scope.removeCurrentImage =function(questionID){
            screensDetailsServices.masterQuestions('removeScreensQuestionImage').removeScreensQuestionImage(
                {
                    screenID: $scope.screensTableID,
                    questionID: questionID,
                    createdByUserId: $scope.loggedInUserId,
                    timeZoneAbbreviation: String(String(new Date()).split("(")[1]).split(")")[0],
                    currentDateTimeOfClient: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }, function(data)
            {
                $scope.showPannelMessageBoard('Image removed', 'alert-success',  3000);
            });
        }
        $scope.displayFullImage = function(screensDetails){
            $scope.modalData = screensDetails;
            $('#displayQuestionImage').modal();
        }

    }
]);

'use strict';
angular.module('myApp').service("screensDetailsServices", ['$resource',
    function($resource) {
        var factory = {};

        factory.masterQuestions = function(queryType) {
            var queryType = arguments[0] || '';
            var screensDetailsRESTUri = apiResourceUrl + 'screenDetail';
            if (queryType == 'getLoadDataForScreens') {
                screensDetailsRESTUri = apiResourceUrl + 'getLoadDataForScreens/:id';
            } else if (queryType == 'createScreensQuestionsFromMasterdb') {
                screensDetailsRESTUri = apiResourceUrl + 'createScreensQuestionsFromMasterdb';
            } else if (queryType == 'updateScreensQuestionsFromMasterdb') {
                screensDetailsRESTUri = apiResourceUrl + 'updateScreensQuestionsFromMasterdb';
            } else if (queryType == 'removeScreensQuestionFromMasterdb') {
                screensDetailsRESTUri = apiResourceUrl + 'removeScreensQuestionFromMasterdb';
            } else if (queryType == 'lockScreensQuestionFromMasterdb') {
                screensDetailsRESTUri = apiResourceUrl + 'lockScreensQuestionFromMasterdb';
            } else if (queryType == 'removeScreensQuestionImage') {
                screensDetailsRESTUri = apiResourceUrl + 'removeScreensQuestionImage/:questionID/:screenID';
            }
            return $resource(screensDetailsRESTUri, {}, {
                getLoadDataForScreens: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                },
                createScreensQuestionsFromMasterdb: {
                    method: 'POST'
                },
                updateScreensQuestionsFromMasterdb: {
                    method: 'POST'
                },
                removeScreensQuestionFromMasterdb: {
                    method: 'POST'
                },
                lockScreensQuestionFromMasterdb: {
                    method: 'POST'
                },
                removeScreensQuestionImage: {
                    method: 'POST',
                    params: {
                        questionID: '@questionID',
                        screenID: '@screenID'
                    },
                }
            });
        };

        return factory;
    }
]);