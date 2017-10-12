'use strict';
angular.module('myApp').controller("eventPluginsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', '$filter', 'eventPluginMasterService',
    function($scope, $state, $stateParams, $timeout, $filter, eventPluginMasterService) {
        $scope.nameToShowInBreadcrumb = "Event plugins";
        $scope.masterData.messageVal = '';
        //$scope.loggedInUser = $cookieStore.get("loginObj");
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        eventPluginMasterService.eventPlugins('query').query(function(data) {
            if(data.length==0){                    
                $scope.masterData.messageVal ='Nothing found';                    
            }else{
                $scope.masterData.messageVal ='';
            }
            $scope.all_types = [];
            data.forEach(function(type, idx) {
                var newColumn = {
                    field: type.id,
                    displayName: type.name,
                }
                $scope.all_types.push(newColumn);
            });
            
            eventPluginMasterService.eventPlugins('allEventPlugin').allEventPlugin({id: $scope.loginObj.companyID,companyId:$scope.loginObj.companyID}, function(plugindata) {

                $scope.masterData.pluginList = [];
                plugindata.forEach(function(eachPlugin, index) {
                    $scope.masterData.pluginList.push(eachPlugin);
                })
                $scope.pluginDataSet = [].concat($scope.masterData.pluginList);
            });
        });
        
        $scope.updatePerm = function(rowEntity,data) {
            var dataObj = {
                pluginID: rowEntity.id,
                typeID: data.id,
                flag: data.flag
            }
            eventPluginMasterService.eventPlugins('updatePermission').updatePermission({
                id: data.id,
                companyID: $scope.loginObj.companyID
            }, dataObj, function(data) {
                if (!data.flag) {
                    //alert('Data not updated.');
                    $scope.showPannelMessageBoard('Some error occered. Display Status not updated.', 'alert-danger', 3000);
                }
                else if(data.flag)
                {
                    if(data.status=='added')
                        $scope.showPannelMessageBoard('Event plugin successfully added.', 'alert-success',2000);
                    if(data.status=='removed')
                        $scope.showPannelMessageBoard('Event plugin successfully removed.', 'alert-success',2000);
                }
            });
        }
    }
]);

angular.module('myApp').service("eventPluginMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.eventPlugins = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eventPlugins';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'eventPlugins';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'eventPlugins/:id';
            } else if (queryType == 'allEventPlugin') {
                hsRESTUri = apiResourceUrl + 'allEventPlugin/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'eventPlugins/:id';
            } else if (queryType == 'updatePermission') {
                hsRESTUri = apiResourceUrl + 'eventPlugins/updatePermission/:id';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                allEventPlugin: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                show: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updatePermission: {
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