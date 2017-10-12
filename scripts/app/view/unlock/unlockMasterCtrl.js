'use strict';
angular.module('myApp').controller("unlockMasterCtrl", ['$scope', '$state', '$stateParams', 'unlockService', 'userServices', '$filter',
    function($scope, $state, $stateParams, unlockService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Unlock";
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        $scope.unlockDetailName = 'List';
        $scope.unlockData = {};
        // Q) Why do we use String(String(rightNow).split("(")[1]).split(")")[0]?
        // A) For 1 reasons
        // 1. We want to save Timezone Abbreviation in our DB. This will help us to know from which time zone activity is done
        // Added by: Kamlesh on 12th Jan 2016.
        var rightNow = new Date();
        $scope.timezoneAbbreviation = String(String(rightNow).split("(")[1]).split(")")[0];
        $scope.masterDataForUnlock = {};
        $scope.masterDataForUnlock.hideTree = 'No';
        $scope.fnCallUnlock = function(prName)
        {
            $scope.unlockDetailConfirm = 'No';
            $scope.masterDataForUnlock.hideTree = 'Yes';
            if(prName == 'log')
            {
                if($scope.showOldActivityLog)
                {
                    $scope.showOldActivityLog = false;
                }
                else
                {
                    $scope.showOldActivityLog = true;
                } 
                $scope.eventActivityLogData = [];
                userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: -1,
                    sectionName: 'MasterDB'
                }, 
                function(data) 
                {
                    $scope.eventActivityLogData = data.data;
                    $scope.displayEventActivityLogCollection = [].concat($scope.eventActivityLogData);
                });
            }
            else
            {
                $scope.unlockDetailName = prName;
                $scope.getSelectListIfRequired(prName);
            }
        };
        $scope.getSelectListIfRequired = function(prName){
            if(prName=='screenQuestion' || prName=='screenGroup'){
                $scope.unlockData = {};
                unlockService.unlock('getScreenList').getScreenList(function(data)
                {
                    $scope.screenList = data.data;
                });
            }
        };
        $scope.getScreenQuestionList = function(screenID){
            if(screenID!=""){
                unlockService.unlock('getLockedScreenQuestionList').getLockedScreenQuestionList({screenID:screenID},function(data)
                {
                    $scope.unlockData.screenLockedQuestionList = data.data;
                    angular.forEach($scope.screenLockedQuestionList, function(objQuestion,index){
                        objQuestion.isChecked = false;
                    });
                });
            }
        }
        $scope.getScreenGroupList = function(screenID){
            if(screenID!=""){
                unlockService.unlock('getLockedScreenGroupList').getLockedScreenGroupList({screenID:screenID},function(data)
                {
                    $scope.unlockData.screenLockedGroupList = data.data;
                    angular.forEach($scope.screenLockedGroupList, function(objGroup,index){
                        objGroup.isChecked = false;
                    });
                });
            }
        }
        $scope.getSelectedQuestionArrayList = function(objQuestion){
            if(_.isUndefined($scope.unlockData.selectedQuestionID)){
                $scope.unlockData.selectedQuestionID = [];
            }
            if(objQuestion.isChecked){
                ($scope.unlockData.selectedQuestionID).push(objQuestion.questionID);
            }
            else{
                $scope.unlockData.selectedQuestionID = _.without($scope.unlockData.selectedQuestionID, objQuestion.questionID);
            }
        }
        $scope.getSelectedGroupArrayList = function(objGroup){
            if(_.isUndefined($scope.unlockData.selectedGroupID)){
                $scope.unlockData.selectedGroupID = [];
            }
            if(objGroup.isChecked){
                ($scope.unlockData.selectedGroupID).push(objGroup.groupID);
            }
            else{
                $scope.unlockData.selectedGroupID = _.without($scope.unlockData.selectedGroupID, objGroup.groupID);
            }
        }
        $scope.fnGoBack = function(prName)
        {
            $scope.unlockDetailName = prName;
            $scope.unlockData = {};
            $scope.unlockDetailConfirm = 'No';
            $scope.eventIDPayments = false;
            $scope.eventIDCodes = false;
            $scope.userIDPayer = false;
            $scope.userIDRedFlags = false;
            $scope.masterDataForUnlock.hideTree = 'No';
        };
        $scope.fnUnlockEvent = function(prName) 
        {
            $scope.unlockDetailConfirm = 'Yes';
        };
        $scope.fnShowEventCodes = function(prName) 
        {
            if(prName == 'payer')
            {
                $scope.userIDPayer = true;
                unlockService.unlock('showPayer').showPayer({id: $scope.unlockData.userID}, function(data)
                {
                    $scope.payerList = data.data;
                });
            }
            else if(prName == 'RedFlags')
            {
                $scope.userIDRedFlags = true;
                unlockService.unlock('showRedFlags').showRedFlags({id: $scope.unlockData.userID}, function(data)
                {
                    $scope.RedFlagsList = data.data;
                });
            }
        };
        $scope.fnSaveUnlockedEvent = function(prName) 
        {
            $scope.unlockData.uidOfActivityDoneBy = $scope.loggedInUserId;
            $scope.unlockData.createdByUserId = $scope.loggedInUserId;
            $scope.unlockData.uidOfActivityDoneOn = null;
            $scope.unlockData.pluginID = null;
            $scope.unlockData.oldValue = null;
            $scope.unlockData.newValue = null;
            $scope.unlockData.typeOfActivity = 'edit';
            $scope.unlockData.pluginFieldName = null;
            $scope.unlockData.activityLogSection = null;
            $scope.unlockData.pluginRowNameWhereActivityIsDone = null;
            $scope.unlockData.timezoneAbbreviation = $scope.timezoneAbbreviation;
            $scope.unlockData.pluginRowIDWhereActivityIsDone = null;
            $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = null;
            var localDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var localTimeZoneName = String(String(new Date()).split("(")[1]).split(")")[0];
            if(prName == 'payer')
            {
                if(_.isUndefined($scope.unlockData.payerID))
                {
                    alert('Choose a payer from the list');
                    $scope.unlockDetailConfirm = 'No';
                    $scope.userIDPayer = true;
                    return '';
                }
                $scope.unlockData.newValue = 'Payer : '+$scope.unlockData.payerID.name+' unlocked, Reason: '+$scope.unlockData.reason;
                $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Payer';
                $scope.unlockData.pluginFieldName = 'MasterDB';
                $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.userID;
                unlockService.unlock('unlockPayer').unlockPayer({}, $scope.unlockData, function(data)
                {
                    if(data.data=="success")
                    {
                        alert('Payer:'+$scope.unlockData.payerID.name+' unlocked successfully.')
                        $scope.unlockData = {};
                        $scope.unlockDetailName = 'List';
                        $scope.userIDPayer = false;
                        $scope.unlockDetailConfirm = 'No';
                    }
                    else
                    {
                        alert('Payer:'+$scope.unlockData.payerID.name+' not found.')
                        $scope.unlockDetailConfirm = 'No';
                    }
                });
            }
            else if(prName == 'RedFlags')
            {
                if(_.isUndefined($scope.unlockData.redFlagsID))
                {
                    alert('Choose a red flags from the list');
                    $scope.unlockDetailConfirm = 'No';
                    $scope.userIDRedFlags = true;
                    return '';
                }
                $scope.unlockData.newValue = 'Red flags : '+$scope.unlockData.redFlagsID.name+' unlocked, Reason: '+$scope.unlockData.reason;
                $scope.unlockData.pluginRowNameWhereActivityIsDone = 'RedFlags';
                $scope.unlockData.pluginFieldName = 'MasterDB';
                $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.userID;
                unlockService.unlock('unlockRedFlags').unlockRedFlags({}, $scope.unlockData, function(data)
                {
                    if(data.data=="success")
                    {
                        alert('Red flags:'+$scope.unlockData.redFlagsID.name+' unlocked successfully.');
                        $scope.unlockData = {};
                        $scope.unlockDetailName = 'List';
                        $scope.userIDRedFlags = false;
                        $scope.unlockDetailConfirm = 'No';
                    }
                    else
                    {
                        alert('Red flags:'+$scope.unlockData.redFlagsID.name+' not found.');
                        $scope.unlockDetailConfirm = 'No';
                    }
                });
            }
            else if(prName == 'video')
            {
                $scope.unlockData.newValue = 'Video id: '+$scope.unlockData.eventID+' unlocked, Reason: '+$scope.unlockData.reason;
                $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Video';
                $scope.unlockData.pluginFieldName = 'MasterDB';
                $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.screenID;
                unlockService.unlock('unlockVideo').unlockVideo({}, $scope.unlockData, function(data)
                {
                    if(data.data=="success")
                    {
                        alert('Video id:'+$scope.unlockData.eventID+' unlocked successfully.')
                        $scope.unlockData = {};
                        $scope.unlockDetailName = 'List';
                        $scope.unlockDetailConfirm = 'No';
                        $scope.masterDataForUnlock.hideTree = 'No';
                    }
                    else
                    {
                        alert('Video id:'+$scope.unlockData.eventID+' in locked state not found.')
                        $scope.unlockDetailConfirm = 'No';
                    }
                });
            }
            else if(prName == 'screenQuestion')
            {
                $scope.unlockData.newValue = 'Screen ID:'+ $scope.unlockData.screenID +', Question IDs: '+$scope.unlockData.selectedQuestionID.toString()+' unlocked, Reason: '+$scope.unlockData.reason;
                $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Screen Question';
                $scope.unlockData.pluginFieldName = 'MasterDB';
                $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.screenID;
                unlockService.unlock('unlockScreenQuestion').unlockScreenQuestion({}, $scope.unlockData, function(data)
                {
                    if(data.data=="success")
                    {
                        alert('Screen ID:'+ $scope.unlockData.screenID +', Question IDs:'+$scope.unlockData.selectedQuestionID.toString()+' unlocked successfully.')
                        $scope.unlockData = {};
                        $scope.unlockDetailName = 'List';
                        $scope.masterDataForUnlock.hideTree = 'No';
                        $scope.unlockDetailConfirm = 'No';
                    }
                    else
                    {
                        alert('Screen ID:'+ $scope.unlockData.screenID +', Question IDs:'+$scope.unlockData.selectedQuestionID.toString()+' in locked state not found.')
                        $scope.unlockDetailConfirm = 'No';
                    }
                });
            }
            else if(prName == 'screenGroup')
            {
                $scope.unlockData.newValue = 'Screen ID:'+ $scope.unlockData.screenID +', Group IDs: '+$scope.unlockData.selectedGroupID.toString()+' unlocked, Reason: '+$scope.unlockData.reason;
                $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Screen Group';
                $scope.unlockData.pluginFieldName = 'MasterDB';
                $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.screenID;
                unlockService.unlock('unlockScreenGroup').unlockScreenGroup({}, $scope.unlockData, function(data)
                {
                    if(data.data=="success")
                    {
                        alert('Screen ID:'+ $scope.unlockData.screenID +', Group IDs:'+$scope.unlockData.selectedGroupID.toString()+' unlocked successfully.')
                        $scope.unlockData = {};
                        $scope.masterDataForUnlock.hideTree = 'No';
                        $scope.unlockDetailName = 'List';
                        $scope.unlockDetailConfirm = 'No';
                    }
                    else
                    {
                        alert('Screen ID:'+ $scope.unlockData.screenID +', Group IDs:'+$scope.unlockData.selectedGroupID.toString()+' in locked state not found.')
                        $scope.unlockDetailConfirm = 'No';
                    }
                });
            }
        };
        $scope.filterDate = $filter('date')(new Date(), 'yyyy-MM');
        $scope.openActivityLog = false;
        $scope.fnOpenActivityStream = function(){
            $scope.showOldActivityLog = false;
            $scope.openActivityLog = !$scope.openActivityLog;
            $scope.eventNewActivityLogData = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: -1,
                    sectionName: 'activityOfMasterDB'
                },
                function(data)
                {
                    $scope.eventNewActivityLogData = data.data;
                    $scope.displayEventNewActivityLogCollection = [].concat($scope.eventNewActivityLogData);
                });
            //console.log($scope.eventNewActivityLogData);
        };
    }
]);
angular.module('myApp').service("unlockService", ['$resource', '$http',
    function($resource, $http) {
        var factory = {};
        factory.unlock = function(queryType) {
            var unlockRESTUri = apiResourceUrl;
            var queryType = arguments[0] || '';
            if (queryType == 'unlockEvent')
            {
                unlockRESTUri += 'unlockEvent';
            }
            else if (queryType == 'show')
            {
                unlockRESTUri += 'unlock/:id';
            }
            else if (queryType == 'unlockVideo')
            {
                unlockRESTUri += 'unlockVideo';
            }
            else if (queryType == 'unlockCode')
            {
                unlockRESTUri += 'unlockCode';
            }
            else if (queryType == 'unlockPayment')
            {
                unlockRESTUri += 'unlockPayment';
            }
            else if (queryType == 'unlockNote')
            {
                unlockRESTUri += 'unlockNote';
            }
            else if (queryType == 'showCodes')
            {
                unlockRESTUri += 'showCodes/:id';
            }
            else if (queryType == 'showIncomingPayments')
            {
                unlockRESTUri += 'showIncomingPayments/:id';
            }
            else if (queryType == 'showOutgoingPayments')
            {
                unlockRESTUri += 'showOutgoingPayments/:id';
            }
            else if (queryType == 'showPayer')
            {
                unlockRESTUri += 'showPayer/:id';
            }
            else if (queryType == 'unlockPayer')
            {
                unlockRESTUri += 'unlockPayer';
            }
            else if (queryType == 'showRedFlags')
            {
                unlockRESTUri += 'showRedFlags/:id';
            }
            else if (queryType == 'unlockRedFlags')
            {
                unlockRESTUri += 'unlockRedFlags';
            }
            else if (queryType == 'getScreenList')
            {
                unlockRESTUri += 'getScreenListForUnlock';
            }
            else if (queryType == 'getLockedScreenQuestionList')
            {
                unlockRESTUri += 'getLockedScreenQuestionListForUnlock/:screenID';
            }
            else if (queryType == 'unlockScreenQuestion')
            {
                unlockRESTUri += 'unlockScreenQuestion';
            }
            else if (queryType == 'getLockedScreenGroupList')
            {
                unlockRESTUri += 'getLockedScreenGroupListForUnlock/:screenID';
            }
            else if (queryType == 'unlockScreenGroup')
            {
                unlockRESTUri += 'unlockScreenGroup';
            }
            else if (queryType == 'reverseIsCodingFinishedForThisAppointment')
            {
                unlockRESTUri += 'reverseIsCodingFinishedForThisAppointment';
            }
            else if (queryType == 'updatedHelp')
            {
                unlockRESTUri += 'updateUserRoleHelpContent/:id';
            }
            return $resource(unlockRESTUri, {}, {
                query: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                showCodes: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                showIncomingPayments: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                showOutgoingPayments: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                showPayer: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                unlockPayer: {
                    method: 'POST'
                },
                showRedFlags: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                unlockRedFlags: {
                    method: 'POST'
                },
                unlockEvent: {
                    method: 'POST'
                },
                unlockVideo: {
                    method: 'POST'
                },
                unlockCode: {
                    method: 'POST'
                },
                unlockPayment: {
                    method: 'POST'
                },
                unlockNote: {
                    method: 'POST'
                },
                deleterec: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                showdetail: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        type: '@type'
                    }
                },
                getScreenList: {
                    method: 'GET',
                },
                getLockedScreenQuestionList: {
                    method: 'GET',
                    params: {
                        screenID: '@screenID'
                    }
                },
                unlockScreenQuestion: {
                    method: 'POST'
                },
                getLockedScreenGroupList: {
                    method: 'GET',
                    params: {
                        screenID: '@screenID'
                    }
                },
                unlockScreenGroup: {
                    method: 'POST'
                },
                reverseIsCodingFinishedForThisAppointment: {
                    method: 'POST'
                },
                updatedHelp: {
                    method: 'PUT',
                    params: {
                    id: '@id'
                },
            },
            });
        };
        return factory;
    }
]);