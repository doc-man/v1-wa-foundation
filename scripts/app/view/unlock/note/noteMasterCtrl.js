'use strict';
angular.module('myApp').controller("noteMasterCtrl", ['$scope', '$state', '$stateParams', 'unlockService', 'userServices', '$filter',
    function($scope, $state, $stateParams, unlockService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Unlock / Note";
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
            unlockService.unlock('unlockNote').unlockNote({}, $scope.unlockData, function(data)
            {
                if(data.data=="success")
                {
                    alert('Event id:'+$scope.unlockData.eventID+' note unlocked successfully.')
                    $scope.unlockData = {};
                    $scope.unlockDetailName = 'List';
                    $scope.unlockDetailConfirm = 'No';
                }
                else
                {
                    alert('Event id:'+$scope.unlockData.eventID+' no locked note found.')
                    $scope.unlockDetailConfirm = 'No';
                }
            });
        };
        $scope.fnGoBack = function () {
            $scope.unlockDetailConfirm = 'No'
        };
        $scope.filterDate = $filter('date')(new Date(), 'yyyy-MM');
    }
]);