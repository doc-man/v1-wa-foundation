'use strict';
angular.module('myApp').controller("careTeamMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'careTeamMasterService',
    function($scope, $state, $stateParams, $timeout, careTeamMasterService) 
    {
        $scope.nameToShowInBreadcrumb = "Care Team";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        } 
        $scope.fnDeleteDesignation = function(arData) 
        {
            if(arData.id===null)
            {
                var obj = _.findWhere($scope.masterData.designationList, 
                {
                    uniqueId: arData.uniqueId
                });
                var idx = $scope.masterData.designationList.indexOf(obj);
                $scope.masterData.designationList.splice(idx,1);
            }
            else
            {
                var r = confirm("Do you really want to remove this Designation from database?");
                if (r) 
                {
                    careTeamMasterService.careTeam('remove').remove({
                        id: arData.id
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard('Designation cant\'t be deleted', 'alert-danger', 3000);
                        }
                    });
                }
            }
        };
        $scope.fnAddDesignation = function() 
        {
            var arData = 
            {
                designationName: '',
                uid:$scope.loggedInUserId,
                id: null,
                countOfPatientWithThisDsignation: 0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.masterData.designationList.splice(0,0,arData);
            $scope.displayDesignationListCollection =[].concat($scope.masterData.designationList);
            /*careTeamMasterService.careTeam('create').create({}, arData, function(data) 
            {
                $scope.showPannelMessageBoard('Added', 'alert-success');
            });*/
        }
        $scope.fnLoadMasterDesignationDataFromServer = function()
        {
            careTeamMasterService.careTeam('show').show({id: $scope.loggedInUserId },function(data) 
            {
                if(data.data.length==0)
                { 
                    $scope.masterData.messageVal ='Nothing found!';  
                }
                $scope.masterData.designationList = data.data;
                $scope.displayDesignationListCollection =[].concat($scope.masterData.designationList);
            });
        }
        $scope.fnSaveDesignation = function(arData)
        {
            if(arData.designationName != null)
            {
                if(arData.id===null){
                    // insert
                    careTeamMasterService.careTeam('create').create({}, arData, function(data) 
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });                    
                }
                else{
                    careTeamMasterService.careTeam('update').update(
                    {
                        id: arData.id
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
        };
        $scope.bindDesignationsInView = function(arData) 
        {
            $scope.masterData.designationList = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.masterData.designationList.push(obj);
            });
            $scope.displayDesignationListCollection = [].concat($scope.masterData.designationList);
        };
        $scope.fnLoadMasterDesignationDataFromServer();

        var channelId = 's6-p6-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addDesignation') 
            {
                console.info('Designation added by socket');
                /*$scope.$apply(function () 
                {
                    $scope.masterData.designationList.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.masterData.designationList, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.masterData.designationList.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.masterData.designationList.unshift(objSocketData.dataSet);
                        $scope.bindDesignationsInView($scope.masterData.designationList);
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.masterData.designationList.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindDesignationsInView($scope.masterData.designationList);   
                    });
                }
            }
            else if(objSocketData.action == 'updateDesignation') 
            {
                console.info('Designation updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.masterData.designationList, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.masterData.designationList.indexOf(obj);
                    $scope.masterData.designationList[idx] = objSocketData.dataSet;
                });   
                $scope.updatedDesignationData = $scope.masterData.designationList;
                $scope.bindDesignationsInView($scope.updatedDesignationData);
            }
            else if(objSocketData.action == 'removeDesignation') 
            {
                console.info('Designation removed by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.masterData.designationList, 
                    {
                        id: objSocketData.dataSet
                    });
                    var idx = $scope.masterData.designationList.indexOf(obj);
                    $scope.masterData.designationList.splice(idx, 1);
                    if($scope.masterData.designationList.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
        });
    }
]);

angular.module('myApp').service("careTeamMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.careTeam = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'designation';
            if (queryType == 'show')
            {
                hsRESTUri = apiResourceUrl + 'designation/:id';
            }
            else if (queryType == 'update')
            {
                hsRESTUri = apiResourceUrl + 'designation/:id';
            }
            else if (queryType == 'remove')
            {
                hsRESTUri = apiResourceUrl + 'designation/:id';
            }
            else if (queryType == 'getTypes')
            {
                hsRESTUri = apiResourceUrl + 'getTypesOfAssets';
            }
            return $resource(hsRESTUri, {},
                {
                    query:
                    {
                        method: 'GET',
                        isArray: true,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    create:
                    {
                        method: 'POST'
                    },
                    show:
                    {
                        method: 'GET',
                        isArray: false,
                        params:
                        {
                            id: '@id'
                        },
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    getTypes:
                    {
                        method: 'GET',
                        isArray: false,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    update:
                    {
                        method: 'PUT',
                        params:
                        {
                            id: '@id'
                        },
                    },
                    remove:
                    {
                        method: 'DELETE',
                        params:
                        {
                            id: '@id'
                        }
                    },
                });
        };
        return factory;
    }
]);