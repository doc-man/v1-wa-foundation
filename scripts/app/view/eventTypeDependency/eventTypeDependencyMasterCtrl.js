'use strict';
angular.module('myApp').controller("eventTypeDependencyMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'eventTypeDependencyMasterService', 'eventTypesMasterService',
    function($scope, $state, $stateParams, $timeout, eventTypeDependencyMasterService, eventTypesMasterService)
    {
        $scope.nameToShowInBreadcrumb = "Dependency between Event Types";
        $scope.msgObj = {open:false,mclass:'',text:''};
        $scope.eventTypeDependencySet = [];
        $scope.displayEventTypeDependencyList = [];
        $scope.eventTypesDataSet = [];

        $scope.fnAddEventTypeDependency = function() {
            var objNewDependency = {dependencyID:null,eventTypeId:null,dependantEventType:null,dependencyAddedBy:null,dependencyAddedOn:null,dependencyAddedTimezone:null};

            $scope.eventTypeDependencySet.splice(0,0,objNewDependency);
            $scope.displayEventTypeDependencyList =[].concat($scope.eventTypeDependencySet);
        }
        $scope.fnSaveDependency = function(eventType,index) {
            if(eventType.dependencyID == null) {
                /**Create new dependency*/
                var currDate = new Date();
                var currDateTime = currDate.toLocaleString();
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec(currDate.toString());
                var currentTimezone = matches[1];

                var objToPass = {currDateTime:currDateTime,timeZone:currentTimezone,addedBy:$scope.loggedInUserId,eventTypeDependency:eventType};

                eventTypeDependencyMasterService.eventDependency('create').create(objToPass,function(data)
                {
                    if(data.data) {
                        var val = data.data;
                        var eventTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.eventTypeId});
                        var dependantTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.dependantEventType});

                        var objNewDependency = {dependencyID:val.dependencyID,eventTypeId:eventTypeSelected[0],dependantEventType:dependantTypeSelected[0],
                            dependencyAddedBy:val.addedBy,dependencyAddedOn:val.dependencyAddedOn,dependencyAddedTimezone:val.dependencyAddedTimezone};
                        eventType.dependencyID=val.dependencyID;
                        eventType.dependencyAddedBy=val.addedBy;
                        eventType.dependencyAddedOn=val.dependencyAddedOn;
                        eventType.dependencyAddedTimezone=val.dependencyAddedTimezone;
                        $scope.eventTypeDependencySet.splice(0,1,objNewDependency);
                        $scope.displayEventTypeDependencyList =[].concat($scope.eventTypeDependencySet);

                        $timeout(function(){
                            if(!$scope.msgObj.open) {
                                $scope.msgObj.open = true;
                                $scope.msgObj.mclass = 'alert-success';
                                $scope.msgObj.text = 'Event type dependency saved';
                                $timeout(function(){
                                    if($scope.msgObj.open) {
                                        $scope.msgObj.open = false;
                                        $scope.msgObj.mclass = '';
                                        $scope.msgObj.text = '';
                                    }
                                },5000)
                            }
                        },1000)
                    }
                    else {
                        if(data.message) {
                            $timeout(function(){
                                if(!$scope.msgObj.open) {
                                    $scope.msgObj.open = true;
                                    $scope.msgObj.mclass = 'alert-danger';
                                    $scope.msgObj.text = data.message;
                                    $timeout(function(){
                                        if($scope.msgObj.open) {
                                            $scope.msgObj.open = false;
                                            $scope.msgObj.mclass = '';
                                            $scope.msgObj.text = '';
                                        }
                                    },5000)
                                }
                            },1000)
                        }
                    }
                })

            }
            else {
                /**Update existing dependency*/
                var currDate = new Date();
                var currDateTime = currDate.toLocaleString();
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec(currDate.toString());
                var currentTimezone = matches[1];

                var objToPass = {id:eventType.dependencyID,currDateTime:currDateTime,timeZone:currentTimezone,addedBy:$scope.loggedInUserId,eventTypeDependency:eventType};

                eventTypeDependencyMasterService.eventDependency('update').update(objToPass,function(data)
                {
                    if(data.data) {
                        var val = data.data;
                        var eventTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.eventTypeId});
                        var dependantTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.dependantEventType});

                        var objNewDependency = {dependencyID:val.dependencyID,eventTypeId:eventTypeSelected[0],dependantEventType:dependantTypeSelected[0],
                            dependencyAddedBy:val.addedBy,dependencyAddedOn:val.dependencyAddedOn,dependencyAddedTimezone:val.dependencyAddedTimezone};
                        eventType.dependencyAddedBy=val.addedBy;
                        eventType.dependencyAddedOn=val.dependencyAddedOn;
                        eventType.dependencyAddedTimezone=val.dependencyAddedTimezone;
                        $scope.eventTypeDependencySet.splice(0,1,objNewDependency);
                        $scope.displayEventTypeDependencyList =[].concat($scope.eventTypeDependencySet);

                        $timeout(function(){
                            if(!$scope.msgObj.open) {
                                $scope.msgObj.open = true;
                                $scope.msgObj.mclass = 'alert-success';
                                $scope.msgObj.text = 'Event type dependency saved';
                                $timeout(function(){
                                    if($scope.msgObj.open) {
                                        $scope.msgObj.open = false;
                                        $scope.msgObj.mclass = '';
                                        $scope.msgObj.text = '';
                                    }
                                },5000)
                            }
                        },1000)
                    }
                    else {
                        if(data.message) {
                            $timeout(function(){
                                if(!$scope.msgObj.open) {
                                    $scope.msgObj.open = true;
                                    $scope.msgObj.mclass = 'alert-danger';
                                    $scope.msgObj.text = data.message;
                                    $timeout(function(){
                                        if($scope.msgObj.open) {
                                            $scope.msgObj.open = false;
                                            $scope.msgObj.mclass = '';
                                            $scope.msgObj.text = '';
                                        }
                                    },5000)
                                }
                            },1000)
                        }
                    }

                })
            }
        }

        $scope.fnRemoveDependency = function(eventType,index) {
            if(eventType.dependencyID != null) {
                var objToPass = {id:eventType.dependencyID};

                eventTypeDependencyMasterService.eventDependency('remove').remove(objToPass,function(data)
                {
                    if(data.status == 'success') {

                        $scope.eventTypeDependencySet.splice(index,1);
                        $scope.displayEventTypeDependencyList =[].concat($scope.eventTypeDependencySet);

                        $timeout(function(){
                            if(!$scope.msgObj.open) {
                                $scope.msgObj.open = true;
                                $scope.msgObj.mclass = 'alert-success';
                                $scope.msgObj.text = 'Event type dependency removed';
                                $timeout(function(){
                                    if($scope.msgObj.open) {
                                        $scope.msgObj.open = false;
                                        $scope.msgObj.mclass = '';
                                        $scope.msgObj.text = '';
                                    }
                                },5000)
                            }
                        },1000)
                    }
                    else {
                        if(data.message) {
                            $timeout(function(){
                                if(!$scope.msgObj.open) {
                                    $scope.msgObj.open = true;
                                    $scope.msgObj.mclass = 'alert-danger';
                                    $scope.msgObj.text = data.message;
                                    $timeout(function(){
                                        if($scope.msgObj.open) {
                                            $scope.msgObj.open = false;
                                            $scope.msgObj.mclass = '';
                                            $scope.msgObj.text = '';
                                        }
                                    },5000)
                                }
                            },1000)
                        }
                    }
                })

            }
            else{
                $scope.eventTypeDependencySet.splice(index,1);
                $scope.displayEventTypeDependencyList =[].concat($scope.eventTypeDependencySet);
            }
        }

        eventTypesMasterService.eventTypes('query').query(function(data)
        {
            data.forEach(function(val){
                $scope.eventTypesDataSet.push({id:val.id,name:val.name});
            })
            eventTypeDependencyMasterService.eventDependency('query').query(function(data)
            {
                if(data.data.length>0) {
                    data.data.forEach(function(val){
                        var eventTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.eventTypeId});
                        var dependantTypeSelected = jQuery.grep($scope.eventTypesDataSet,function(e){return e.id==val.dependantEventType});

                        var objNewDependency = {dependencyID:val.dependencyID,eventTypeId:eventTypeSelected[0],dependantEventType:dependantTypeSelected[0],
                            dependencyAddedBy:val.addedBy,dependencyAddedOn:val.dependencyAddedOn,dependencyAddedTimezone:val.dependencyAddedTimezone};

                        $scope.eventTypeDependencySet.push(objNewDependency);
                    })
                }
                $scope.displayEventTypeDependencyList = [].concat($scope.eventTypeDependencySet);
            });
        });

    }
]);
angular.module('myApp').service("eventTypeDependencyMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.eventDependency = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eventTypeDependency';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'eventTypeDependency';
            } if (queryType == 'create') {
                hsRESTUri = apiResourceUrl + 'eventTypeDependency';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'eventTypeDependency/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'eventTypeDependency/:id';
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