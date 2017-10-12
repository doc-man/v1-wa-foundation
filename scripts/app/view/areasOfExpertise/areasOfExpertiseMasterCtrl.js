'use strict';
angular.module('myApp').controller("areasOfExpertiseMasterCtrl", ['$scope', '$state', '$stateParams', '$filter', '$timeout', 'areasOfExpertiseMasterService',
    function($scope, $state, $stateParams, $filter, $timeout, areasOfExpertiseMasterService)
    {
        $scope.nameToShowInBreadcrumb = "Areas Of Expertise";
        $scope.itemsByPage = 25;
        $scope.paginationInfo = {};
        $scope.masterData = [];
        $scope.masterData.messageVal ='';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        if (!$scope.areasOfExpertiseDataSet)
        {
            $scope.areasOfExpertiseDataSet = [];
            areasOfExpertiseMasterService.areasOfExpertise('show').show({id: $scope.loggedInUserId }, function(data)
            {   
                if(data.data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found'; 
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.areasOfExpertiseDataSet = data.data;
                $scope.displayAreasOfExpertiseCollection =[].concat($scope.areasOfExpertiseDataSet);
                /* For Pagignation */
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo.totalItemCount = data.data.length;

            });
        }
        $scope.fnDeleteAreaOfExpertise = function(arData) 
        {
            if(arData.newlyAdded===true)
            {
                var obj = _.findWhere($scope.areasOfExpertiseDataSet, 
                {
                    uniqueId: arData.uniqueId
                });
                var idx = $scope.areasOfExpertiseDataSet.indexOf(obj);
                $scope.areasOfExpertiseDataSet.splice(idx,1);
                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
            }
            else
            {
                var r = confirm("Do you really want to remove this Area of Expertise from database?");
                if (r) 
                {
                    areasOfExpertiseMasterService.areasOfExpertise('remove').remove(
                    {
                        id: arData.id
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.showPannelMessageBoard(data.message, 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard(data.message , 'alert-danger', 3000);
                        } 
                    });
                }
            }
        };


        //sitewideHelpIcon

        $scope.activityLogIcon = false;
        

        $scope.fnAddAreaOfExpertise = function() 
        {
            var areaOfExperise = 
            {
                id: null,
                name: '',
                loggedInUserId: $scope.loggedInUserId,
                newlyAdded: true,
                usersCount: 0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.areasOfExpertiseDataSet.splice(0,0,areaOfExperise);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
            $scope.displayAreasOfExpertiseCollection =[].concat($scope.areasOfExpertiseDataSet);
            
        };

        $scope.fnSaveAreaOfExpertise = function(arData)
        {
            //console.log(arData);
            if(arData.name != '' && arData.name != null)
            {
                if(arData.newlyAdded===true){
                    // insert
                    arData.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    arData.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                    areasOfExpertiseMasterService.areasOfExpertise('create').create({}, arData, function()
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });                    
                }
                else{
                    areasOfExpertiseMasterService.areasOfExpertise('update').update(
                    {
                        id: arData.id
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
            
        };

        $scope.bindAreaOfExpertiseInView = function(arData) 
        {
            $scope.areasOfExpertiseDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.areasOfExpertiseDataSet.push(obj);
            });
            $scope.displayAreasOfExpertiseCollection = [].concat($scope.areasOfExpertiseDataSet);
        };
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'areaOfExpertiseRemove')
            {
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.areasOfExpertiseDataSet, 
                    {
                        id: parseInt(objSocketData.dataSet)
                    });
                    var idx = $scope.areasOfExpertiseDataSet.indexOf(obj);
                    if(idx !=-1){
                        $scope.areasOfExpertiseDataSet.splice(idx, 1);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                    }
                    if($scope.areasOfExpertiseDataSet.length < 1 )
                    {
                        $scope.masterData.messageVal ='Nothing found';
                        $scope.showPannelMessageBoard('Nothing found', 'alert-success');
                    }
                });   
            }
            else if(objSocketData.action == 'areaOfExpertiseAdd')
            {
                console.info('Area of expertise added by socket');
                /*$scope.$apply(function () 
                {
                    $scope.areasOfExpertiseDataSet.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.areasOfExpertiseDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.areasOfExpertiseDataSet.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.areasOfExpertiseDataSet.unshift(objSocketData.dataSet);
                        $scope.bindAreaOfExpertiseInView($scope.areasOfExpertiseDataSet);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.areasOfExpertiseDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindAreaOfExpertiseInView($scope.areasOfExpertiseDataSet);   
                    });
                }   
            }
            else if(objSocketData.action == 'areaOfExpertiseUpdate')
            {
                console.info('Area of expertise updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.areasOfExpertiseDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    }); 
                    var idx = $scope.areasOfExpertiseDataSet.indexOf(obj);
                    $scope.areasOfExpertiseDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedAreasOfExpertiseData = $scope.areasOfExpertiseDataSet;
                $scope.bindAreaOfExpertiseInView($scope.updatedAreasOfExpertiseData);
            }
        });
    }
]);


angular.module('myApp').service("areasOfExpertiseMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.areasOfExpertise = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'areasOfExpertise';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'areasOfExpertise/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'areasOfExpertise/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'areasOfExpertise/:id';
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