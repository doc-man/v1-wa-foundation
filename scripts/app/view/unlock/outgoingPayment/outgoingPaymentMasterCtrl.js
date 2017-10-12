'use strict';
angular.module('myApp').controller("outgoingPaymentMasterCtrl", ['$scope', '$state', '$stateParams', 'unlockService', 'userServices', '$filter',
    function($scope, $state, $stateParams, unlockService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Unlock / outgoingPayment";
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
            if(prName == 'outgoingPayments')
            {
                $scope.eventIDPayments = true;
                unlockService.unlock('showOutgoingPayments').showOutgoingPayments({id: $scope.unlockData.eventID}, function(data)
                {
                    $scope.outgoingPaymentList = data.data;
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
            if(_.isUndefined($scope.unlockData.paymentID))
            {
                alert('Choose a payment from the list');
                $scope.unlockDetailConfirm = 'No';
                $scope.eventIDPayments = true;
                return '';
            }
            $scope.unlockData.newValue = 'Outgoing payment : '+$scope.unlockData.paymentID.paymentAmountInSCAccount+' unlocked, Reason: '+$scope.unlockData.reason;
            $scope.unlockData.pluginRowNameWhereActivityIsDone = 'Incoming Payments';
            $scope.unlockData.pluginFieldName = 'MasterDB';
            $scope.unlockData.idOfEventOnWhichAcitivtyIsDone = $scope.unlockData.eventID;
            unlockService.unlock('unlockPayment').unlockPayment({}, $scope.unlockData, function(data)
            {
                if(data.data=="success")
                {
                    alert('Outgoing payment:'+$scope.unlockData.paymentID.paymentAmountInSCAccount+' unlocked successfully.')
                    $scope.unlockData = {};
                    $scope.unlockDetailName = 'List';
                    $scope.eventIDPayments = false;
                    $scope.unlockDetailConfirm = 'No';
                }
                else
                {
                    alert('Outgoing payment:'+$scope.unlockData.paymentID.paymentAmountInSCAccount+' not found.')
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