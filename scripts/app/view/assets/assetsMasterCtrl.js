'use strict';
angular.module('myApp').controller("assetsMasterCtrl", ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'assetsMasterService',
    function($scope, $rootScope, $state, $stateParams, $timeout, assetsMasterService) {
        $scope.nameToShowInBreadcrumb = "Assets";
        //$scope.assetsListDataSet = [];
        $scope.masterData.messageVal = ''; 
        //$rootScope.pageSubTitle = "Assets list";
        $scope.masterData.assetsList = [];
        $scope.masterData.assetTypesDataSet = [];
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        assetsMasterService.assets('query').query(function(data) {
            if(data.length==0){
                $scope.masterData.messageVal ='Nothing found!';
            }else{
                $scope.masterData.messageVal ='';
            } 
            $scope.assetsListDataSet = data;
            $scope.displayassetsListCollection =[].concat($scope.assetsListDataSet);  
        });
        ////$scope.loggedInUserObj = $cookieStore.get("loginObj");
            //console.log($scope.loggedInUserObj);
        
        if(_.isEmpty($scope.masterData.assetTypesDataSet)) {
            assetsMasterService.assets('getTypes').getTypes(function(data) {
                data.data.forEach(function(val, idx) {
                    $scope.masterData.assetTypesDataSet.push({
                        id: val.id,
                        label: val.name
                    })
                })
            });
        }
        
        $scope.addmasterassets = function() {
            var assets = {
                name: '',
                id: null,
                typeId:'',
                typeName:'',
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.assetsListDataSet.unshift(assets);
            $scope.displayassetsListCollection =[].concat($scope.assetsListDataSet);
        }
        
        $scope.updatemasterassets = function(rowEntity) {
            //console.log(rowEntity);
            //rowEntity.companyID =  $scope.loggedInUserObj.companyID;
            rowEntity.companyID =  $scope.loginObj.companyID;
            if (!rowEntity.id)
            {
                if( rowEntity.name === "" && rowEntity.typeId !== "")
                {
                    $scope.showPannelMessageBoard('Insert Asset Name before Asset Type.', 'alert-danger', 3000);
                } 
                else if(rowEntity.name === "")
                {
                     $scope.showPannelMessageBoard('Asset Name is required.', 'alert-danger', 3000);
                }
                else
                {
                       
                    assetsMasterService.assets('create').create({}, rowEntity, function(data) {
                        $scope.showPannelMessageBoard('Added', 'alert-success', 3000);
                    });
                }
            }
            else 
            {
                if(rowEntity.name === "")
                {
                     $scope.showPannelMessageBoard('Asset Name must not be blank.', 'alert-danger', 3000);
                     return;
                }
                else
                {  
                    
                    assetsMasterService.assets('update').update({
                        id: rowEntity.id
                    }, rowEntity, function(data) {
                        $scope.showPannelMessageBoard('Updated.', 'alert-success');
                    });                
                    
                }
            }                 
        } 
        
        $scope.deleteassets = function(rowObj) {
            
            if(!rowObj.id)
            {
                 $scope.assetsListDataSet.splice($scope.assetsListDataSet.indexOf(rowObj), 1);
            }
            else
            {
                 var r = confirm("Do you really want to remove this Asset from database?");
                 if (r) {
                            assetsMasterService.assets('remove').remove({
                                id: rowObj.id
                            }, function(data) {
                                //$scope.assetsDataSet.splice($scope.assetsDataSet.indexOf(rowObj), 1);
                                /*$scope.assetsListDataSet.splice($scope.assetsListDataSet.indexOf(rowObj), 1);
                                if($scope.assetsListDataSet.length==0){
                                  $scope.masterData.messageVal ='Nothing found!';
                                  
                                }*/
                                if(data.data == 'success')
                                {
                                    $scope.showPannelMessageBoard('Deleted', 'alert-success');
                                }
                                else if(data.data == 'failed')
                                {
                                    $scope.showPannelMessageBoard('This Asset can\'t be deleted' , 'alert-danger', 3000);
                                } 
                                //$scope.showPannelMessageBoard('Deleted.', 'alert-success');
                            });
                        }
                 }
        }; 
              
        $scope.checkAssetName = function(rowObj, data, fieldname) {
            //console.log(rowObj);        
            if(data !== "")
            {
                $scope.flgNameMached = false;
                $scope.assetsListDataSet.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = data;
                    $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if(obj != rowObj && $scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgNameMached = true; 
                    };

                }); 
                if( $scope.flgNameMached == true ) 
                {               
                    $scope.showPannelMessageBoard('Asset Name already exist.', 'alert-danger', 3000); 
                    return "";        
                }
            }     
            if (data === '' || data === 'undefined') {
                //return fieldname + " must not be blank.";
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000)
                return "";
            }
            
        };
        
        $scope.bindassetsListInView = function(arData) {
            $scope.assetsListDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.assetsListDataSet.push(obj);
            });
            $scope.displayassetsListCollection = [].concat($scope.assetsListDataSet);

        };

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'assetRemove') 
            {
                console.info('Asset removed by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.assetsListDataSet, 
                    {
                        id: objSocketData.dataSet
                    });
                    var idx = $scope.assetsListDataSet.indexOf(obj);
                    $scope.assetsListDataSet.splice(idx, 1);
                    if($scope.assetsListDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
            else if(objSocketData.action == 'assetAdd') 
            {
                console.info('Asset added by socket');
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.assetsListDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.assetsListDataSet.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.assetsListDataSet.unshift(objSocketData.dataSet);
                        $scope.bindassetsListInView($scope.assetsListDataSet);
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.assetsListDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindassetsListInView($scope.assetsListDataSet);   
                    });
                }   
            }
            else if(objSocketData.action == 'assetUpdate') 
            {
                console.info('Asset updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.assetsListDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.assetsListDataSet.indexOf(obj);
                    $scope.assetsListDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedUserRoleData = $scope.assetsListDataSet;
                $scope.bindassetsListInView($scope.updatedUserRoleData);
            }
        });        
    }
]);

angular.module('myApp').filter('assettypes', function() {
    // console.log("Medication=>"+names);
    return function(input, entity) {
        if (!input) {
            return '';
        } else {
            return entity.typeName;
        }
    };
});

angular.module('myApp').service("assetsMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.assets = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'asset';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'asset';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'asset/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'asset/:id';
            }else if (queryType == 'getTypes') {
                hsRESTUri = apiResourceUrl + 'getTypesOfAssets';
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
                getTypes: {
                    method: 'GET',
                    isArray: false,
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