'use strict';
angular.module('myApp').controller("doctorsAliasNameMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'doctorsAliasNameService', '$filter','$window',
    function($scope, $state, $stateParams, $timeout, doctorsAliasNameService, $filter,$window)
    {
        $scope.nameToShowInBreadcrumb = "Provider Specific settings";

        $scope.masterData = {};
        $scope.displayData = {};
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }

        //$scope.displayCollection = [].concat($scope.rowCollection);

        $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
        $scope.selectedPredicate = $scope.predicates[0];
        $scope.ShowConfirm=function(data,textBtnForm){
            if(data.alias==null || data.alias == '') {
                var x = $window.confirm("Do you realy want to add ?");
            } else {
                var x = $window.confirm("Do you realy want to edit ?");
            }
            if (x) {
                textBtnForm.$show();
            }
        };

        doctorsAliasNameService.getDoctorList('getDoctorListWithAliasName').getDoctorListWithAliasName({}, function (data) {
            $scope.rowCollection=data.Doctors;
            $scope.displayCollection = [].concat($scope.rowCollection);


        });

        $scope.fnSaveAlias = function(row,data) {
            var counter = 0;
            angular.forEach($scope.rowCollection, function (value, key) {
                if (data == value.alias  && (value.alias!='' && value.alias!=null)) {
                    counter++;
                }
            });
            if (counter == 0)
            {
                doctorsAliasNameService.getDoctorList('updateDoctorAliasName').updateDoctorAliasName({id: row.id}, row, function (data)
                {
                    if (data.data == 'success') {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    }
                   /* else if (data.data == 'error') {
                        $scope.showPannelMessageBoard('Duplicate Entry Not Allowed', 'alert-danger', 3000);
                    }*/
                    else {
                        $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
                    }


                });
            }
            else {
                $scope.showPannelMessageBoard('Duplicate Entry Not Allowed', 'alert-danger', 3000);
                return '';
            }
        }

        var d = new Date();
        var currenrYear = d.getFullYear();

        var allYear=[];
        var i='';
        for(i=currenrYear;i>currenrYear-50;i--)
        {
            allYear.push({'value': i, 'text': i});
        }
        $scope.statuses = allYear;
        $scope.showStatus = function(year) {

            var selected = $filter('filter')($scope.statuses, {value: year});
            return (year && selected.length) ? selected[0].text : 'Not set';
        };
        $scope.totalExp=function(year)
        {
            var total_exp='';
            if(!year)
            {
               total_exp='';
            }
            else
            {
                var d = new Date();
                var currenrYear = d.getFullYear();
                var exp=currenrYear-year;
                if (exp==0)
                {
                    total_exp=1;
                }
                else
                {
                    total_exp=exp;
                }
            }

            return total_exp;
        }

        $scope.fnSaveYear=function(row,data)
        {
            doctorsAliasNameService.getDoctorList('updatePracticeYear').updatePracticeYear({id: row.id}, data, function (data)
            {

                if (data.status == 'success') {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                }
                else if(data.status == 'error')
                {
                    $scope.showPannelMessageBoard('Please try again', 'alert-danger', 3000);
                }


            });

        }



    }
]);

angular.module('myApp').service("doctorsAliasNameService", ['$resource',
    function($resource) {

        var factory = {};

        factory.getDoctorList = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl;

            if (queryType == 'getDoctorListWithAliasName') {
                hsRESTUri = apiResourceUrl + 'getDoctorListWithAliasName';
            }
            else if(queryType=="updateDoctorAliasName"){
                hsRESTUri = apiResourceUrl + 'updateDoctorAliasName/:id';
            }
            else if(queryType=="updatePracticeYear"){
                hsRESTUri = apiResourceUrl + 'updatePracticeYear/:id';
            }
            return $resource(hsRESTUri, {}, {
                getDoctorListWithAliasName: {
                    method: 'GET',
                    //isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                updateDoctorAliasName: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updatePracticeYear: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                }
            });
        };


        factory.getAdwordCode = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl;

            if (queryType == 'getDoctorAdwordCode') {
                hsRESTUri = apiResourceUrl + 'getDoctorAdwordCode';
            }
            else if(queryType=="updateDoctorAdwordCode"){
                hsRESTUri = apiResourceUrl + 'updateDoctorAdwordCode/:id';

            }

            return $resource(hsRESTUri, {}, {
                getDoctorAdwordCode: {
                    method: 'GET',
                    //isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                updateDoctorAdwordCode: {
                    method: 'PUT',
                    params: {
                        id: '@id'

                    },

                }

            });

        };




        return factory;
    }
]);