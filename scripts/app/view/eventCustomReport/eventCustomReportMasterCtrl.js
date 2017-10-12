
'use strict';
angular.module('myApp').controller("eventCustomReportMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'eventCustomReportMasterService','$cookieStore',
    function($scope, $state, $stateParams, $timeout, eventCustomReportMasterService, $cookieStore) 
    {
        $scope.nameToShowInBreadcrumb = "Event custom report";
        $scope.itemsByPage = 20; 

        $scope.masterData.messageVal ='';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        
        $scope.loginObj = $cookieStore.get("loginObj");
        //companyID: $scope.loginObj.companyID}
        //console.log($scope.loginObj.companyID); 
        if (!$scope.eventCustomReportDataSet)
        {
            $scope.eventCustomReportDataSet = [];
            eventCustomReportMasterService.eventCustomReport('show').show({id: $scope.loggedInUserId }, function(data) 
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
                $scope.eventCustomReportDataSet = data.data;
                $scope.bindeventCustomReportsInView($scope.eventCustomReportDataSet);
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
            eventCustomReportMasterService.eventCustomReport('update').update(
            {
                id: arData.event_Cus_report_id,
                data: arData.name
            }, function(data) 
            {
                if(data.data == 'success')
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    
                }
                else if(data.data == 'failed')
                {
                    $scope.showPannelMessageBoard('This event report isn\'t be updated' , 'alert-danger', 3000);
                }
                
            });
        };
        $scope.fnDelete = function(arData) 
        {
            var r = confirm("Do you really want to remove this event custom report from database?");
            if (r) 
            {
                eventCustomReportMasterService.eventCustomReport('remove').remove(
                {
                    id: arData.event_Cus_report_id
                }, function(data) 
                {
                    if(data.data == 'success')
                    {
                        $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        var obj = _.findWhere($scope.eventCustomReportDataSet, 
                        {
                            event_Cus_report_id: data.id
                        });
                        var idx = $scope.eventCustomReportDataSet.indexOf(obj);
                        $scope.eventCustomReportDataSet.splice(idx, 1);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                        if($scope.eventCustomReportDataSet.length==0)
                        {
                            $scope.masterData.messageVal ='Nothing found!';
                        }
                        $scope.bindeventCustomReportsInView($scope.eventCustomReportDataSet); 
                    }
                    else if(data.data == 'failed')
                    {
                        $scope.showPannelMessageBoard('This custom report can\'t be deleted' , 'alert-danger', 3000);
                    } 
                });
            }
        };
        $scope.bindeventCustomReportsInView = function(arData) 
        {
            $scope.eventCustomReportDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.eventCustomReportDataSet.push(obj);
            });
            $scope.displayEventCustomReportDataSet = [].concat($scope.eventCustomReportDataSet);
        };
    }
]);
angular.module('myApp').service("eventCustomReportMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.eventCustomReport = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eventCustomReport';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'eventCustomReport/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'eventCustomReport/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'eventCustomReport/:id';
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