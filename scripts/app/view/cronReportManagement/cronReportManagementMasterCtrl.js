
'use strict';
angular.module('myApp').controller("cronReportManagementMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'cronReportManagementMasterService','$cookieStore',
    function($scope, $state, $stateParams, $timeout, cronReportManagementMasterService, $cookieStore) 
    {
        $scope.nameToShowInBreadcrumb = "Cron report management";
        $scope.timeOnServer = '';
        $scope.timeZoneUsedOnServer = '';
        $scope.itemsByPage = 20;

        $scope.masterData.messageVal ='';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        
        $scope.loginObj = $cookieStore.get("loginObj");
        //companyID: $scope.loginObj.companyID}
        //console.log($scope.loginObj.companyID); 
        if (!$scope.cronReportManagementDataSet)
        {
            $scope.cronReportManagementDataSet = [];
            cronReportManagementMasterService.cronReportManagement('show').show({id: $scope.loggedInUserId }, function(data) 
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
                $scope.cronReportManagementDataSet = data.data;
                $scope.cronReportManagementInView($scope.cronReportManagementDataSet);
                $scope.paginationInfo =  data.data; 
                $scope.paginationInfo.totalItemCount = data.data.length;
                /*$scope.tableColumn.total = 6 + data.data.length;
                $scope.tableColumn.ceilVal = Math.ceil($scope.tableColumn.total/2);
                $scope.tableColumn.floorVal = Math.floor($scope.tableColumn.total/2);
                 2015-12-22 13:00:03 UTC
                */
                $scope.timeOnServer = data.serverTime;
                $scope.timeZoneUsedOnServer = data.timeZoneUsed.timezone;
            });
        }
        
        $scope.fnEnableOrDisable = function(arData,value,index) 
        {        
            cronReportManagementMasterService.cronReportManagement('update').update(
            {
                id: arData.cron_id,
                data: value
                
            }, function(data) 
            {
                if(data.data == 'success')
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    
                    if(value == 'YES')
                    {
                        $scope.cronReportManagementDataSet[index].enableOrDisable = 'Yes';
                    }else
                    {
                        $scope.cronReportManagementDataSet[index].enableOrDisable = 'No';
                    }
                    
                }
                else if(data.data == 'failed')
                {
                    $scope.showPannelMessageBoard('This Cron Report isn\'t be updated' , 'alert-danger', 3000);
                    
                }
                
            });
            
        };
        $scope.fnDelete = function(arData) 
        {
            //
        };
        $scope.fnUpdate = function(arData) 
        {
            cronReportManagementMasterService.cronReportManagement('edit').edit(
            {
                id: arData.cron_id,
                dataDescrip: arData.scriptDescription
            }, function(data) 
            {
                if(data.data == 'success')
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    
                }
                else if(data.data == 'failed')
                {
                    $scope.showPannelMessageBoard('This Cron Report isn\'t be updated' , 'alert-danger', 3000);
                }
                
            });
        };
        $scope.cronReportManagementInView = function(arData) 
        {
            $scope.cronReportManagementDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.cronReportManagementDataSet.push(obj);
            });
            $scope.displaycronReportManagementDataSet = [].concat($scope.cronReportManagementDataSet);
        };
    }
]);
angular.module('myApp').service("cronReportManagementMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.cronReportManagement = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'cronReportManagement';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'cronReportManagement/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'cronReportManagement/:id';
            } else if (queryType == 'edit') {
                hsRESTUri = apiResourceUrl + 'cronReportManagement/edit/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'cronReportManagement/:id';
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
            });
        };
        return factory;
    }
]);