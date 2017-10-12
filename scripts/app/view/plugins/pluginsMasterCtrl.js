'use strict';
angular.module('myApp').controller("pluginsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', '$filter', 'pluginMasterService', 'userRoleMasterService',
    function($scope, $state, $stateParams, $timeout, $filter, pluginMasterService, userRoleMasterService) {
        $scope.nameToShowInBreadcrumb = "User plugins";
        $scope.masterData.messageVal = '';
        //$scope.loggedInUser = $cookieStore.get("loginObj");
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        userRoleMasterService.userRole('query').query({companyId:$scope.loginObj.companyID},function(data) {

            if(data.length==0){
                    
                    $scope.masterData.messageVal ='Nothing found';
                    
                }else{
                    $scope.masterData.messageVal ='';
                }
            $scope.all_roles = [];
            $scope.all_sections = [];
            data.forEach(function(role, idx) {
                var newColumn = {
                    field: role.id,
                    displayName: role.name,
                }
                $scope.all_roles.push(newColumn);
            });
            
            pluginMasterService.plugins('allsections').allsections({},function(section){
              $scope.all_sections = section;
            });
            pluginMasterService.plugins('allplugin').allplugin({id: $scope.loginObj.companyID,companyId:$scope.loginObj.companyID}, function(plugindata) {

                $scope.masterData.pluginList = [];
                plugindata.forEach(function(eachPlugin, index) {
                    $scope.masterData.pluginList.push(eachPlugin);
                })
                $scope.pluginDataSet = [].concat($scope.masterData.pluginList);
            });
        });
        $scope.enabledOptions = [{
            id: 1,
            label: 'Yes'
        }, {
            id: 2,
            label: 'No'
        }]
        
        $scope.showSectionName = function(sId) {
            var selected = $filter('filter')($scope.all_sections, {
                id: sId
            });
            if (selected) return (sId && selected.length) ? selected[0].name : 'Click to set';
            else return 'Click to set';
        };

        $scope.addplugin = function() {
            var newPlugin = {
                title: '',
                name: '',
                hotkey: '',
                enabled: 0,
                companyId: $scope.loginObj.companyID,
                userID: $scope.loggedInUserId
            }
            pluginMasterService.plugins('create').create({}, newPlugin, function(data) {
                $scope.Success = true;
                $scope.showPannelMessageBoard('saved', 'alert-success');
                newPlugin.id = data.id;
                newPlugin.permission = data.permission;
                $scope.masterData.pluginList.push(newPlugin);
            });
        }
        $scope.fnUpdatePlugin = function(rowEntity) {

            pluginMasterService.plugins('update').update({
              id: rowEntity.id,
              companyID: $scope.loginObj.companyID
          }, rowEntity, function(data) {
              if (!data.flag) {
                  alert('Data not updated.');
              } 
              else {
                    var indx = $scope.masterData.pluginList.indexOf(rowEntity);
                  }
              });
        }
        $scope.updatePerm = function(rowEntity) {
            pluginMasterService.plugins('updatePermission').updatePermission({
                id: rowEntity.id,
                companyID: $scope.loginObj.companyID
            }, rowEntity, function(data) {
                if (!data.flag) {
                    alert('Data not updated.');
                }
            });
        }
        $scope.enableDisable = function(rowEntity) {
            var enableDisable = rowEntity.enabled;
            pluginMasterService.plugins('update').update({
                id: rowEntity.id,
                companyID: $scope.loginObj.companyID,
                userID: $scope.loggedInUserId
            }, rowEntity, function(data) {
                if (!data.flag) {
                    alert('Data not updated.');
                } else {

                }
            });
        }
        /// custom action for delete ///
        $scope.deletePlugin = function(rowEntity) {
            var r = confirm("Do you really want to remove this Plugin from database?");
            if (r) {
                pluginMasterService.plugins('remove').remove({
                    id: rowEntity.id,
                    companyID: $scope.loginObj.companyID
                }, function(data) {
                    $scope.masterData.pluginList.splice($scope.masterData.pluginList.indexOf(rowEntity), 1);
                    $scope.pluginDataSet.splice($scope.pluginDataSet.indexOf(rowEntity), 1);
                    if($scope.masterData.pluginList.length==0){
                      $scope.masterData.messageVal ='Nothing found';
                    }
                });
            }
        };
    }
]);

angular.module('myApp').service("pluginMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.plugins = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'plugins';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'plugins';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'plugins/:id';
            } else if (queryType == 'allplugin') {
                hsRESTUri = apiResourceUrl + 'allplugin/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'plugins/:id';
            } else if (queryType == 'updatePermission') {
                hsRESTUri = apiResourceUrl + 'plugins/updatePermission/:id';
            } else if (queryType == 'allsections') {
                hsRESTUri = apiResourceUrl + 'getSections';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                allsections: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                allplugin: {
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