'use strict';
angular.module('myApp').controller("faxMasterCtrl", ['$scope', '$state', '$stateParams', 'faxService', 'userServices', '$filter',
    function($scope, $state, $stateParams, faxService, userServices, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Fax Documents";
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        // Q) Why do we use String(String(rightNow).split("(")[1]).split(")")[0]?
        // A) For 1 reasons
        // 1. We want to save Timezone Abbreviation in our DB. This will help us to know from which time zone activity is done
        // Added by: Kamlesh on 12th Jan 2016.
        var rightNow = new Date();
        $scope.timezoneAbbreviation = String(String(rightNow).split("(")[1]).split(")")[0];

        $scope.apiUrl = apiResourceUrl;

        if(!$scope.faxDataSet)
        {
            $scope.faxDataSet = [];
            faxService.fax('faxList').faxList({
                id: $scope.loggedInUserId
            }, function(data)
            {
                if(data.list.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.faxDataSet = data.list;
                $scope.masterData.patientList = JSON.parse(JSON.stringify(data.patientList));
                $scope.displayFaxCollection =[].concat($scope.faxDataSet);

            });
        }

        $scope.assignFax = function (objFax) {
            //console.log(objFax);
            faxService.fax('updateFax').updateFax({fax:objFax, loggedInUserId: $scope.loggedInUserId}, function(data)
            {
                var faxObj = _.findWhere($scope.faxDataSet, {
                        faxMailId: data.faxMailId
                });
                var idx = $scope.faxDataSet.indexOf(faxObj);
                if(idx != -1) {
                    $scope.faxDataSet[idx].isDisabled = true;
                }
            });


        };
    }
]);

angular.module('myApp').service("faxService", ['$resource', '$http',
    function($resource, $http) {
        var factory = {};

        factory.fax = function(queryType) {
            var unlockRESTUri = apiResourceUrl;
            var queryType = arguments[0] || '';

            if (queryType == 'faxList')
            {
                unlockRESTUri += 'faxList/:id';
            }
            if (queryType == 'downloadFax')
            {
                unlockRESTUri += 'downloadFax/:id';
            }
            if (queryType == 'updateFax')
            {
                unlockRESTUri += 'updateFax';
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
                faxList: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                    /*isArray: true,
                     headers: {
                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                     },*/
                },
                downloadFax: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                    /*isArray: true,
                     headers: {
                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                     },*/
                },
                updateFax: {
                    method: 'POST'
                },

            });
        };
        return factory;
    }
]);