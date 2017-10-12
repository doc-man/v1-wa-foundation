'use strict';
angular.module('myApp').controller("patientPortalConfigsMasterCtrl", ['$scope','$filter','patientPortalConfigsMasterService','$cookieStore',
    function($scope, $filter, patientPortalConfigsMasterService,$cookieStore)
    {
        $scope.nameToShowInBreadcrumb = "Patient portal configuration";

        $scope.loggedInUser = $cookieStore.get("loginObj");

      //  console.info($scope.loggedInUser.accesskey);

        $scope.plugins = [];
        $scope.roleData=[];
        $scope.role= [];
        //$scope.plugins.role= [];

        patientPortalConfigsMasterService.patientPortalConfiguration('query').query(function(data){
            $scope.plugins = data.data;
            $scope.roleData = data.role;
            console.log($scope.plugins);




        });

        $scope.fnToggleEnableOrDisable = function(plugin){
            plugin.isEnabled = plugin.isEnabled=='No' ? 'Yes' : 'No';
            patientPortalConfigsMasterService.patientPortalConfiguration('update').update({id:plugin.pluginID},plugin,function(data){
                $scope.plugins = data.data;
          //      console.log(data.data);
            });
        }



        //$scope.role = {};

        $scope.setRoleType=function(plugin){
                console.log(plugin);

            patientPortalConfigsMasterService.patientPortalConfiguration('insert').insert({id:plugin.pluginID},plugin,function(data)
            {
                console.log(data);

            });

        }



        $scope.remove=function(){
            console.info('removed');
        }

       // console.info($scope.role);

        /*$scope.roleData=
            [
                {
                    "id": 1,
                    "name": "sneakers",
                    "category": "shoes",
                    "disabled": true
                },{
                "id": 2,
                "name": "shoes",
                "category": "shoes"
            },{
                "id": 3,
                "name": "slippers",
                "category": "shoes"
            },{
                "id": 4,
                "name": "boots",
                "category": "shoes",
                "disabled": true
            },{
                "id": 5,
                "name": "shirt",
                "category": "clothes",
                "disabled": true
            }
            ];
*/
    }
]);
angular.module('myApp').service("patientPortalConfigsMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.patientPortalConfiguration = function(queryType) {
            var patientPortalConfigurationServiceRESTUri = apiResourceUrl + 'patientPortalConfiguration';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                patientPortalConfigurationServiceRESTUri += '/:id';
            }
            else if (queryType == 'insert') {
                patientPortalConfigurationServiceRESTUri += '/:id';
            }
            return $resource(patientPortalConfigurationServiceRESTUri, {}, {
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
                },insert: {
                    method: 'POST',
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