'use strict';
angular.module('myApp').controller("noteLockPermissionMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'noteLockPermissionMasterService',
    function($scope, $state, $stateParams, $timeout, noteLockPermissionMasterService)
    {
        $scope.nameToShowInBreadcrumb = "Note lock permission setting";
        $scope.msgObj = {open:false,mclass:'',text:''};
        $scope.savedNoteLockPermission = [];
        $scope.displayedNoteLockPermission = [];
        $scope.fnAddEventNoteLockPermission = function() {
            var objNewPermission = {settingsId:null,roleId:null,roleName:null,mse:false,ros:false,subjective:false,assessment:false,plan:false,coding:false,reason:false,diagnosis:false,isLocked:'no'};

            $scope.savedNoteLockPermission.splice(0,0,objNewPermission);
            $scope.displayedNoteLockPermission =[].concat($scope.savedNoteLockPermission);
        }

        $scope.fnSavePermission = function(permission,index) {
            if(permission.settingsId == null) {
                noteLockPermissionMasterService.lockSettings('create').create(permission,function(data)
                {
                    $scope.savedNoteLockPermission.splice(index,1,data.data);
                    $scope.displayedNoteLockPermission = angular.copy($scope.savedNoteLockPermission);
                    $timeout(function(){
                        if(!$scope.msgObj.open) {
                            $scope.msgObj.open = true;
                            $scope.msgObj.mclass = 'alert-success';
                            $scope.msgObj.text = 'Permission saved';
                            $timeout(function(){
                                if($scope.msgObj.open) {
                                    $scope.msgObj.open = false;
                                    $scope.msgObj.mclass = '';
                                    $scope.msgObj.text = '';
                                }
                            },5000)
                        }
                    },1000)
                });
            }
            else{
                $scope.fnUpdatePermission(permission,'roleId');
            }
        }

        $scope.fnUpdatePermission = function(permission,field) {
            noteLockPermissionMasterService.lockSettings('update').update({id:permission.settingsId,section:field,permission:permission},function(data)
            {
                $timeout(function(){
                    if(!$scope.msgObj.open) {
                        $scope.msgObj.open = true;
                        $scope.msgObj.mclass = 'alert-success';
                        $scope.msgObj.text = 'Permission saved';
                        $timeout(function(){
                            if($scope.msgObj.open) {
                                $scope.msgObj.open = false;
                                $scope.msgObj.mclass = '';
                                $scope.msgObj.text = '';
                            }
                        },5000)
                    }
                },1000)
            });
        }

        $scope.fnDeleteEventNoteLockPermission = function(permission,index) {
            if(confirm("Are you sure to remove the permission for locking note for the user role?")) {
                noteLockPermissionMasterService.lockSettings('remove').remove({id:permission.settingsId},function(data)
                {

                    $scope.savedNoteLockPermission.splice(index,1);
                    $scope.displayedNoteLockPermission = angular.copy($scope.savedNoteLockPermission);
                    $timeout(function(){
                        if(!$scope.msgObj.open) {
                            $scope.msgObj.open = true;
                            $scope.msgObj.mclass = 'alert-success';
                            $scope.msgObj.text = 'Permission removed';
                            $timeout(function(){
                                if($scope.msgObj.open) {
                                    $scope.msgObj.open = false;
                                    $scope.msgObj.mclass = '';
                                    $scope.msgObj.text = '';
                                }
                            },5000)
                        }
                    },1000)
                });
            }
        }
        noteLockPermissionMasterService.lockSettings('query').query(function(data)
        {
            if(data.data.length>0) {
                data.data.forEach(function(val){
                    $scope.savedNoteLockPermission.push(val);
                })
            }
            $scope.displayedNoteLockPermission = [].concat($scope.savedNoteLockPermission);;
            $scope.allRoleList = data.roles;
        });

    }
]);
angular.module('myApp').service("noteLockPermissionMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.lockSettings = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'getNoteLockPermission';
            if (queryType == 'create') {
                hsRESTUri = apiResourceUrl + 'noteLockPermission';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'noteLockPermission/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'noteLockPermission/:id';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false
                },
                create: {
                    method: 'POST'
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