
'use strict';
angular.module('myApp').controller("paymentsCustomReportMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'paymentsCustomReportMasterService','$cookieStore',
    function($scope, $state, $stateParams, $timeout, paymentsCustomReportMasterService, $cookieStore)
    {
        $scope.nameToShowInBreadcrumb = "Payment custom report master";
        $scope.itemsByPage = 20; 

        $scope.masterData.messageVal ='';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        
        $scope.loginObj = $cookieStore.get("loginObj");
        //companyID: $scope.loginObj.companyID}
        //console.log($scope.loginObj.companyID); 
        if (!$scope.paymentsCustomReportDataSet)
        {
            $scope.paymentsCustomReportDataSet = [];
            paymentsCustomReportMasterService.paymentsCustomReport('show').show({id: $scope.loggedInUserId }, function(data)
            {   
                if(data.data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found'; 
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.paginationInfo = {};
                $scope.paymentsCustomReportDataSet = data.data;
                $scope.bindPaymentsCustomReportsInView($scope.paymentsCustomReportDataSet);
                $scope.paginationInfo =  data.data; 
                $scope.paginationInfo.totalItemCount = data.data.length;
                /*$scope.tableColumn.total = 6 + data.data.length;
                $scope.tableColumn.ceilVal = Math.ceil($scope.tableColumn.total/2);
                $scope.tableColumn.floorVal = Math.floor($scope.tableColumn.total/2);
                */
            });
        }
         $scope.fnUpdate = function(arData) 
        {        
            paymentsCustomReportMasterService.paymentsCustomReport('update').update(
            {
                id: arData.payment_custom_report_id,
                data: arData.name
            }, function(data) 
            {
                if(data.data == 'success')
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    
                }
                else if(data.data == 'failed')
                {
                    $scope.showPannelMessageBoard('This custom report isn\'t be update' , 'alert-danger', 3000);
                }
                
            });
        };
        $scope.fnDelete = function(arData) 
        {
            var r = confirm("Do you really want to remove this payments custom report from database?");
            if (r) 
            {
                paymentsCustomReportMasterService.paymentsCustomReport('remove').remove(
                {
                    id: arData.payment_custom_report_id
                }, function(data) 
                {
                    if(data.data == 'success')
                    {
                        $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        var obj = _.findWhere($scope.paymentsCustomReportDataSet,
                        {
                            payment_custom_report_id: data.id
                        });
                        var idx = $scope.paymentsCustomReportDataSet.indexOf(obj);
                        $scope.paymentsCustomReportDataSet.splice(idx, 1);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                        if($scope.paymentsCustomReportDataSet.length==0)
                        {
                            $scope.masterData.messageVal ='Nothing found!';
                        }
                        $scope.bindPaymentsCustomReportsInView($scope.paymentsCustomReportDataSet);
                    }
                    else if(data.data == 'failed')
                    {
                        $scope.showPannelMessageBoard('This custom report can\'t be deleted' , 'alert-danger', 3000);
                    } 
                });
            }
        };
        $scope.bindPaymentsCustomReportsInView = function(arData)
        {
            $scope.paymentsCustomReportDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.paymentsCustomReportDataSet.push(obj);
            });
            $scope.displayPaymentsCustomReportDataSet = [].concat($scope.paymentsCustomReportDataSet);
        };
    }
]);
angular.module('myApp').service("paymentsCustomReportMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.paymentsCustomReport = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'paymentsCustomReport';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'paymentsCustomReport/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'paymentsCustomReport/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'paymentsCustomReport/:id';
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