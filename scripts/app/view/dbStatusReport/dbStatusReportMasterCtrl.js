'use strict';
angular.module('myApp').controller("dbStatusReportMasterCtrl", ['$scope', '$state', '$timeout', 'usersMasterService',  '$cookieStore',
        function($scope, $state, $timeout, usersMasterService, $cookieStore)
        {
            $scope.nameToShowInBreadcrumb = "DB Status Report";

            if(($cookieStore.get("loginObj")).offset!=null) 
                {
                var d = new Date();
                var n = d.getTimezoneOffset();
                $scope.tzOffset = parseInt(($cookieStore.get("loginObj")).offset) + n*60;
            }
            else 
                {
                $scope.tzOffset = null
            }

            //$scope.masterData = {};
            usersMasterService.user('getDBStatusReport').getDBStatusReport({}, function(data) {
                    //console.info(data);  
                    $scope.dbStatusDataSet = data;
                    $scope.dbStatusDataSet.forEach(function(obj, idx)
                    {
                        if($scope.tzOffset!=null)
                        {
                            var createdAt = (obj.created_at + $scope.tzOffset) * 1000; //appointment.eventstartTime * 1000;
                            var updatedAt = (obj.updated_at + $scope.tzOffset) * 1000; //appointment.eventendTime * 1000;
                        }
                        else 
                            {
                            var createdAt = (obj.created_at) * 1000; //appointment.eventstartTime * 1000;
                            var updatedAt = (obj.updated_at) * 1000; //appointment.eventendTime * 1000;
                        }
                        var newcreatedAt = new Date(createdAt);
                        var newupdatedAt = new Date(updatedAt);
                        $scope.dbStatusDataSet[idx].created_at = newcreatedAt;
                        $scope.dbStatusDataSet[idx].updated_at = newupdatedAt; 
                    }); 

                    $scope.displaydbStatusListCollection =[].concat($scope.dbStatusDataSet);
            });

        }
    ]);