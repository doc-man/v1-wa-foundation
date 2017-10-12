'use strict';
angular.module('myApp').controller("isCodingFinishedForAppointmentMasterCtrl", ['$scope', '$state', '$stateParams', 'unlockService', 'userServices', '$filter',
    function($scope, $state, $stateParams, unlockService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Unlock / isCodingFinishedForAppointment";
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
        $scope.getHelpData = function() {
            unlockService.unlock('show').show({id: $scope.loggedInUserId}, function (data) {
                $scope.siteWideHelpData[data.siteWideHelpData.helpID] = data.siteWideHelpData;
            });
        };
        $scope.getHelpData();
        $scope.unlockDetailConfirm = 'No';
        $scope.fnUnlockEvent = function(prName) 
        {
            $scope.unlockDetailConfirm = 'Yes';
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
            $scope.unlockData.newValue = 'Event id: '+$scope.unlockData.eventID+' note unlocked, Reason: '+$scope.unlockData.reason;
            $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Note';
            $scope.unlockData.pluginFieldName = 'MasterDB';
            $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.eventID;
            unlockService.unlock('reverseIsCodingFinishedForThisAppointment').reverseIsCodingFinishedForThisAppointment({}, $scope.unlockData, function(data)
            {
                if(data.data=="success")
                {
                    alert('Event id:'+$scope.unlockData.eventID+' "Is coding finished for this appointment" unlocked successfully.')
                    $scope.unlockData = {};
                    $scope.unlockDetailName = 'List';
                    $scope.unlockDetailConfirm = 'No';
                }
                else
                {
                    alert('Event id:'+$scope.unlockData.eventID+' no locked "Is coding finished for this appointment" found.')
                    $scope.unlockDetailConfirm = 'No';
                }
            });
        };
        $scope.filterDate = $filter('date')(new Date(), 'yyyy-MM');
        $scope.helpReverseIsCodingFinishedForThisAppointment = false;
        $scope.fnShowSiteWideHelpData = function(helpID)
        {
            $scope.helpReverseIsCodingFinishedForThisAppointment = !$scope.helpReverseIsCodingFinishedForThisAppointment;
            $scope.siteWideHelpData[helpID].isVissible = !$scope.siteWideHelpData[helpID].isVissible;
        };
        $scope.fnEditSiteWideHelpData = function(helpID, prAct)
        {
            if(prAct == 'edit') {
                $scope.siteWideHelpData[helpID].editable = !$scope.siteWideHelpData[helpID].editable;
            } else if(prAct == 'save') {
                $scope.siteWideHelpData[helpID].loggedInUserId = $scope.loggedInUserId;
                $scope.siteWideHelpData[helpID].actDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                unlockService.unlock('updatedHelp').updatedHelp({
                    id: helpID
                }, $scope.siteWideHelpData[helpID], function(data) {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    $scope.siteWideHelpData[helpID].context = data.siteWideHelpData.context;
                    $scope.siteWideHelpData[helpID].updated_at = data.siteWideHelpData.updated_at;
                    $scope.siteWideHelpData[helpID].firstNameofUser = data.siteWideHelpData.firstNameofUser;
                    $scope.siteWideHelpData[helpID].editable = !$scope.siteWideHelpData[helpID].editable;
                });
            }
        };
        $scope.fnGoBack = function () {
            $scope.unlockDetailConfirm = 'No'
        };
    }
]);