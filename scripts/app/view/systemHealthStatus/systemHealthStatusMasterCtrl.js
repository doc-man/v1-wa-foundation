
'use strict';
angular.module('myApp').controller("systemHealthStatusMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'systemHealthStatusMasterService','$cookieStore',
    function($scope, $state, $stateParams, $timeout, systemHealthStatusMasterService, $cookieStore) 
    {
        $scope.nameToShowInBreadcrumb = "System health status";
        //$scope.fetchDataFromSytemHealthDb = function(){
            systemHealthStatusMasterService.systemHealthStatus('getSystemHealthData').getSystemHealthData( function(data)
            {
                $scope.rowCollection = data.data;
                //console.log($scope.rowCollection);
            });
        //}
        var vrChannelId = 's5-p0-sh0';

        vrGlobalSocket.on(vrChannelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.dataSet != '')
            {
                if(objSocketData.action == 'updated')
                {
                    $scope.$apply(function () {
                        var obj = _.findWhere($scope.rowCollection, {
                            id: parseInt(objSocketData.dataSet.tableID)
                        });
                        var idx = $scope.rowCollection.indexOf(obj);
                        if (idx != -1) {
                            $scope.rowCollection[idx].lastStatusReportTime = objSocketData.dataSet.lastStatusReportTime;
                            $scope.rowCollection[idx].lastStatusReportTimeZone = objSocketData.dataSet.lastStatusReportTimeZone;
                        }
                    });
                }
            }
        });
    }
]);
angular.module('myApp').service("systemHealthStatusMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.systemHealthStatus = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'systemHealthStatus';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'systemHealthStatus/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'systemHealthStatus/:id';
            } else if (queryType == 'edit') {
                hsRESTUri = apiResourceUrl + 'systemHealthStatus/edit/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'systemHealthStatus/:id';
            } else if (queryType == 'getSystemHealthData') {
                hsRESTUri = apiResourceUrl + 'getSystemHealthData';
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
                edit: {
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
                getSystemHealthData: {
                    method: 'GET'
                },
            });
        };
        return factory;
    }
]);