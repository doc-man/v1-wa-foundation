'use strict';
angular.module('myApp').controller("eventTypesMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'eventTypesMasterService',
    function($scope, $state, $stateParams, $timeout, eventTypesMasterService) 
    {
        $scope.nameToShowInBreadcrumb = "Event type";
        $scope.masterData = {};
        $scope.masterData.isThisEventTypeBillableArr = [
        {
            'isThisEventTypeBillableVal': 'No',
            'id': '0'
        }, 
        {
            'isThisEventTypeBillableVal': 'Yes',
            'id': '1'
        }]
        $scope.masterData.messageVal = '';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        if (!$scope.eventTypesDataSet) 
        {
            $scope.eventTypesDataSet = [];
            eventTypesMasterService.eventTypes('query').query({}, function(data) 
            {
                if(data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';    
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.eventTypesDataSet = data;
                $scope.displayEventTypesListCollection =[].concat($scope.eventTypesDataSet);
            });
        } 
        else 
        {
            $scope.displayEventTypesListCollection =[].concat($scope.eventTypesDataSet);
        }
        $scope.fnDeleteEventTypes = function(arData) 
        {
            if(arData.newlyAdded===true)
            {
                var obj = _.findWhere($scope.eventTypesDataSet, 
                {
                    uniqueId: arData.uniqueId
                });
                var idx = $scope.eventTypesDataSet.indexOf(obj);
                $scope.eventTypesDataSet.splice(idx,1);
            }
            else
            {
                var r = confirm("Do you really want to remove this Event Type from database?");
                if (r) 
                {
                    eventTypesMasterService.eventTypes('remove').remove(
                    {
                        id: arData.id
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard('Event type cant\'t be deleted', 'alert-danger', 3000);
                        }
                    });
                }
            }
        };
        $scope.fnAddeventTypes = function(eventTypes) 
        {
            var eventTypes = {
                name: null,
                id: null,
                isThisEventTypeBillable: null,
                newlyAdded: true,
                countOfEventOfThisType: 0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            
            $scope.eventTypesDataSet.splice(0,0,eventTypes);
            $scope.displayEventTypesListCollection =[].concat($scope.eventTypesDataSet);
            
            /*eventTypesMasterService.eventTypes('create').create({}, eventTypes, function(data) 
            {
                $scope.showPannelMessageBoard('Added', 'alert-success');
            });*/
        };
        $scope.fnSaveEventType = function(arData) 
        {
            if((arData.name != '' && arData.name != null) || (arData.description != '' && arData.description != null))
            {
                if(arData.newlyAdded===true){
                    eventTypesMasterService.eventTypes('create').create({}, arData, function(data) 
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });                    
                }
                else{
                    eventTypesMasterService.eventTypes('update').update(
                    {
                        id: arData.id
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
            
        }
        $scope.bindEventTypesInView = function(arData) 
        {
            $scope.eventTypesDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.eventTypesDataSet.push(obj);
            }); 
            $scope.displayEventTypesListCollection = [].concat($scope.eventTypesDataSet);
            if($scope.eventTypesDataSet.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';    
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
        };
        var channelId = 's6-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addEventType') 
            {
                console.info('Event type added by socket');
                /*$scope.$apply(function () 
                {
                    $scope.eventTypesDataSet.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.eventTypesDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.eventTypesDataSet.indexOf(obj);
                if(idx<0){
                    $scope.$apply(function () 
                    {
                        $scope.eventTypesDataSet.unshift(objSocketData.dataSet);
                        $scope.bindEventTypesInView($scope.eventTypesDataSet);
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.eventTypesDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindEventTypesInView($scope.eventTypesDataSet);   
                    });
                }   
            }
            else if(objSocketData.action == 'updateEventType') 
            {
                console.info('Event Type updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.eventTypesDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.eventTypesDataSet.indexOf(obj);
                    $scope.eventTypesDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedEventTypesData = $scope.eventTypesDataSet;
                $scope.bindEventTypesInView($scope.updatedEventTypesData);
            }
            else if(objSocketData.action == 'removeEventType') 
            {
                console.info('Event type removed by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.eventTypesDataSet, 
                    {
                        id: objSocketData.dataSet
                    });
                    var idx = $scope.eventTypesDataSet.indexOf(obj);
                    $scope.eventTypesDataSet.splice(idx, 1);
                    if($scope.eventTypesDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
        });
    }
]);

angular.module('myApp').service("eventTypesMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.eventTypes = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eventTypes';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'eventTypes/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'eventTypes/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'eventTypes/:id';
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