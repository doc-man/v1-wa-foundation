'use strict';
angular.module('myApp').controller("reasonsForVisitListMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'reasonsForVisitListMasterService',
    function($scope, $state, $stateParams, $timeout, reasonsForVisitListMasterService)
    {
        $scope.nameToShowInBreadcrumb = "Reason for visit";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;
        }
        if (!$scope.reasonForVisitDataSet)
        {
            $scope.reasonForVisitDataSet = [];
            reasonsForVisitListMasterService.reason('query').query({}, function(data)
            {
                if(data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.reasonForVisitDataSet = data.data;
                $scope.displayReasonForVisitCollection =[].concat($scope.reasonForVisitDataSet);
                console.log($scope.displayReasonForVisitCollection);
            });
        }
        else
        {
            $scope.displayReasonForVisitCollection =[].concat($scope.reasonForVisitDataSet);
        }
        $scope.fnDeleteReasonsForVisit = function(arData)
        {
            if(arData.newlyAdded===true)
            {
                var obj = _.findWhere($scope.reasonForVisitDataSet,
                    {
                        uniqueId: arData.uniqueId
                    });
                var idx = $scope.reasonForVisitDataSet.indexOf(obj);
                $scope.reasonForVisitDataSet.splice(idx,1);
            }
            else
            {
                var r = confirm("Do you really want to remove this reason for visit from database?");
                if (r)
                {
                    reasonsForVisitListMasterService.reason('remove').remove(
                        {
                            id: arData.id
                        }, function(data)
                        {
                            if(data.data.status == 'success')
                            {
                                $scope.showPannelMessageBoard('Deleted', 'alert-success');
                            }
                            else if(data.data.status == 'failed')
                            {
                                $scope.showPannelMessageBoard(data.data.reason, 'alert-danger', 3000);
                            }
                        });
                }
            }
        };
        $scope.lockReasonForVisit = function(reasonForVisit) {
            reasonForVisit.isLocked = 1;
            $scope.fnSaveReasonForVisit(reasonForVisit,'locking');
        }
        $scope.fnAddReasonForVisit = function()
        {
            var reasonForVisit = {
                title: null,
                id: null,
                newlyAdded: true,
                hasDetail: 0,
                isLocked: 0,
                usedBy:0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }

            $scope.reasonForVisitDataSet.splice(0,0,reasonForVisit);
            $scope.displayReasonForVisitCollection =[].concat($scope.reasonForVisitDataSet);
        };
        $scope.fnSaveReasonForVisitTitle = function(arData,data,section) {
            if(arData.title!==data) {
                arData.title = data;
                $scope.fnSaveReasonForVisit(arData,section);
            }
        }
        $scope.fnSaveReasonForVisit = function(arData,section)
        {
            if(arData.title != '' && arData.title != null)
            {
                if(arData.newlyAdded===true){
                    reasonsForVisitListMasterService.reason('create').create({}, arData, function(data)
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });
                }
                else{

                    reasonsForVisitListMasterService.reason('update').update(
                        {
                            id: arData.id
                        }, arData, function()
                        {
                            $scope.showPannelMessageBoard('Updated', 'alert-success');
                        }
                    );

                }
            }

        }
        $scope.bindReasonsForVisitInView = function(arData)
        {
            $scope.reasonForVisitDataSet = [];
            arData.forEach(function(obj, idx)
            {
                $scope.reasonForVisitDataSet.push(obj);
            });
            $scope.displayReasonForVisitCollection = [].concat($scope.reasonForVisitDataSet);
            if($scope.reasonForVisitDataSet.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
        };

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'reasonForVisitAdd')
            {
                console.info('Reason for visit added by socket');
                /*$scope.$apply(function () 
                 {
                 $scope.reasonForVisitDataSet.unshift(objSocketData.dataSet);
                 });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.reasonForVisitDataSet,
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.reasonForVisitDataSet.indexOf(obj);
                if(idx<0){
                    $scope.$apply(function ()
                    {
                        $scope.reasonForVisitDataSet.unshift(objSocketData.dataSet);
                        $scope.bindReasonsForVisitInView($scope.reasonForVisitDataSet);
                    });
                }
                else{
                    $scope.$apply(function ()
                    {
                        $scope.reasonForVisitDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindReasonsForVisitInView($scope.reasonForVisitDataSet);
                    });
                }
            }
            else if(objSocketData.action == 'updateReasonForVisit')
            {
                console.info('Reason for visit updated by socket');
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.reasonForVisitDataSet,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.reasonForVisitDataSet.indexOf(obj);
                    $scope.reasonForVisitDataSet[idx] = objSocketData.dataSet;
                });
                $scope.updatedReasonsForVisitData = $scope.reasonForVisitDataSet;
                $scope.bindReasonsForVisitInView($scope.updatedReasonsForVisitData);
            }
            else if(objSocketData.action == 'removeReasonForVisit')
            {
                console.info('Reason for visit removed by socket');
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.reasonForVisitDataSet,
                        {
                            id: objSocketData.dataSet
                        });
                    var idx = $scope.reasonForVisitDataSet.indexOf(obj);
                    $scope.reasonForVisitDataSet.splice(idx, 1);
                    if($scope.reasonForVisitDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });
            }
        });
    }
]);

angular.module('myApp').service("reasonsForVisitListMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.reason = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'reasonForVisit';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'reasonForVisit/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'reasonForVisit/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'reasonForVisit/:id';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
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