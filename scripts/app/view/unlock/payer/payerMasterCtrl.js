'use strict';
angular.module('myApp').controller("payerMasterCtrl", ['$scope', '$state', '$stateParams', 'unlockService', 'userServices', '$filter',
    function($scope, $state, $stateParams, unlockService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Unlock / Payer";
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
        };

        $scope.fnGoBack = function () {
            $scope.unlockDetailConfirm = 'No'
        };
        $scope.filterDate = $filter('date')(new Date(), 'yyyy-MM');
    }
]);