'use strict';
angular.module('myApp').controller("usersAssociatedWithProviderMasterCtrl", ['$scope', 'usersAssociatedWithProviderMasterService','$filter',
    function($scope, usersAssociatedWithProviderMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "User associated with provider";
        // Q) Why do we use String(String(rightNow).split("(")[1]).split(")")[0]?
        // A) For 1 reasons
        // 1. We want to save Timezone Abbreviation in our DB. This will help us to know from which time zone activity is done
        // Added by: Kamlesh on 5th Jan 2016.
        var rightNow = new Date();
        $scope.timezoneAbbreviation = String(String(rightNow).split("(")[1]).split(")")[0];
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'updateUsersAssociatedWithDoctor') {
                $scope.bindCareerHighlightsLettersInView(objSocketData.dataSet);
            }
        });
        $scope.confObj = {
            allProvidersList: [],
            allDoctorAssociatedList: [],
            allUserList: [],
            allDoctorsAdminList: [],
            allHealthCoachList: [],
            allIntakeCoordinatorList: [],
            //allTherapistList: [],
            allUserAssociationMasterTypes: []
        };
        $scope.getData = function()
        {
            usersAssociatedWithProviderMasterService.usersAssociatedWithDoctor('show').show({id:$scope.loggedInUserId}, function(data)
            {
                //$scope.confObj.allDoctorsListWithDoctorAdminInfo = data.doctorAndDoctorAdminMappingList;
                $scope.confObj.allProvidersList = data.providerFullList;
                $scope.confObj.allDoctorAssociatedList = data.doctorAssociatedList;
                $scope.confObj.allUserList = data.userFullList;
                $scope.confObj.allDoctorsAdminList = data.doctorAdminFullList;
                $scope.confObj.allUserAssociationMasterTypes = data.userAssociationMasterTypes;
                $scope.confObj.allHealthCoachList = data.healthCoachFullList;
                $scope.confObj.allIntakeCoordinatorList = data.doctorAssociatedList;
                //$scope.confObj.allTherapistList = data.therapistList;
                $scope.bindCareerHighlightsLettersInView($scope.confObj.allDoctorAssociatedList);
            });
        };
        $scope.bindCareerHighlightsLettersInView = function (arData) {
            $scope.confObj.allDoctorAssociatedList = [];
            arData.forEach(function (item, index) {
                $scope.confObj.allDoctorAssociatedList.push(item);
            });
            $scope.displayedRowCollection = [].concat($scope.confObj.allDoctorAssociatedList);
            };
        $scope.saveChange = function(rowObj){
            // Q) Why do we use $filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss')?
            // A) For 1 reasons
            // 1. We want to save current Datetme in our DB. This will help us to save the local time of activity.
            // Added by: Kamlesh on 4th Jan 2016.
            var newDate = new Date();
            rowObj.created_at = $filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss');
            rowObj.timezoneAbbreviation = $scope.timezoneAbbreviation;
            usersAssociatedWithProviderMasterService.usersAssociatedWithDoctor('create').create({}, rowObj, function()
            {
                $scope.showPannelMessageBoard('Updated', 'alert-success');
            });

        }
        
        /*$scope.addToDoctorsAdminList = function(row){
            var daObjOfMasterList = _.findWhere($scope.confObj.allDoctorsAdminList, {uidOfDoctorsAdmin: row.doctorsAdminInfo.uidOfDoctorsAdmin});
            var daObjIndexInMasterList = _.indexOf($scope.confObj.allDoctorsAdminList, daObjOfMasterList);
            if(daObjIndexInMasterList > -1){
                $scope.confObj.allDoctorsAdminList.splice(daObjIndexInMasterList, 1); 
            }
        }*/
        $scope.getData();
    }
]);
angular.module('myApp').service("usersAssociatedWithProviderMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.usersAssociatedWithDoctor = function(queryType) {
            var usersAssociatedWithDoctorServiceRESTUri = apiResourceUrl + 'usersAssociatedWithDoctor';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                usersAssociatedWithDoctorServiceRESTUri += '/:id';
            }
            return $resource(usersAssociatedWithDoctorServiceRESTUri, {}, {
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
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
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