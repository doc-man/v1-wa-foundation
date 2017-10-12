'use strict';
angular.module('myApp').controller("eventStatusMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'eventStatusMasterService', 'eventTypesMasterService',
    function($scope, $state, $stateParams, $timeout, eventStatusMasterService, eventTypesMasterService) 
    {
        $scope.nameToShowInBreadcrumb = "Event Status";
        $scope.itemsByPage = 25; 
        $scope.paginationInfo = {};
        $scope.eventStatusDataSet = [];
        $scope.eventTypesDataSet = [];
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        eventTypesMasterService.eventTypes('query').query(function(data) 
        {
            $scope.eventTypesDataSet = data;
        });
        eventStatusMasterService.eventStatus('query').query(function(data) 
        {
            $scope.eventStatusDataSet = data.data;
            if(data.data.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
            $scope.displayEventStatusListCollection =[].concat($scope.eventStatusDataSet);
            /!* For Pagignation *!/
            $scope.paginationInfo.currentItemCount = data.data.length;
            $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
            //$scope.paginationInfo =  data.data;
            $scope.paginationInfo.totalItemCount = data.data.length;
        });
        $scope.fnSaveEventStatus = function(arData) 
        {
            if((arData.name != '' && arData.name != null) || (arData.eventTypeID != '' && arData.eventTypeID != null))
            {
                if(arData.newlyAdded===true){
                    eventStatusMasterService.eventStatus('create').create({}, arData, function(data) 
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });                    
                }
                else{
                    eventStatusMasterService.eventStatus('update').update(
                    {
                        id: arData.id
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
        } 
        $scope.fnAddEventStatus = function() 
        {
            var newEventStatus = 
            {
                name: null,
                eventTypeID: null,
                newlyAdded: true,
                countOfEventInThisStatus: 0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            };
            $scope.eventStatusDataSet.splice(0,0,newEventStatus);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
            $scope.displayEventStatusListCollection =[].concat($scope.eventStatusDataSet);
            /*eventStatusMasterService.eventStatus('create').create({}, newEventStatus, function(data) 
            {
                $scope.showPannelMessageBoard('Added', 'alert-success');
            });*/
        }
        $scope.fnDeleteEventStatus = function(rowEntity) 
        {
            if(rowEntity.newlyAdded===true)
            {
                var obj = _.findWhere($scope.eventStatusDataSet, 
                {
                    uniqueId: rowEntity.uniqueId
                });
                var idx = $scope.eventStatusDataSet.indexOf(obj);
                $scope.eventStatusDataSet.splice(idx,1);
                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
            }
            else
            {
                var r = confirm("Do you really want to remove this Event Status from database?");
                if (r) 
                {
                    eventStatusMasterService.eventStatus('remove').remove(
                    {
                        id: rowEntity.id
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard('Event status cant\'t be deleted', 'alert-danger', 3000);
                        }
                    });
                }
            }
            
        };
        $scope.bindEventStatusInView = function(arData) 
        {
            $scope.eventStatusDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.eventStatusDataSet.push(obj);
            });
            $scope.displayEventStatusListCollection = [].concat($scope.eventStatusDataSet);
        };

        var channelId = 's6-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addEventStatus') 
            {
                console.info('Event status added by socket');
                console.log(objSocketData.dataSet);
                /*$scope.$apply(function ()
                {
                    $scope.eventStatusDataSet.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.eventStatusDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.eventStatusDataSet.indexOf(obj);
                if(idx<0){
                    $scope.$apply(function () 
                    {
                        $scope.eventStatusDataSet.unshift(objSocketData.dataSet);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                        $scope.bindEventStatusInView($scope.eventStatusDataSet);
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.eventStatusDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindEventStatusInView($scope.eventStatusDataSet);   
                    });
                } 
            }
            else if(objSocketData.action == 'updateEventStatus') 
            {
                console.info('Event status updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.eventStatusDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.eventStatusDataSet.indexOf(obj);
                    $scope.eventStatusDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedEventStatusData = $scope.eventStatusDataSet;
                $scope.bindEventStatusInView($scope.updatedEventStatusData);
            }
            else if(objSocketData.action == 'removeEventStatus') 
            {
                console.info('Event status removed by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.eventStatusDataSet, 
                    {
                        id: objSocketData.dataSet
                    });
                    var idx = $scope.eventStatusDataSet.indexOf(obj);
                    $scope.eventStatusDataSet.splice(idx, 1);
                    $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                    if($scope.eventStatusDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
        });
    }
]);
angular.module('myApp').service("eventStatusMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.eventStatus = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eventStatus';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'eventStatus';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'eventStatus/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'eventStatus/:id';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false
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