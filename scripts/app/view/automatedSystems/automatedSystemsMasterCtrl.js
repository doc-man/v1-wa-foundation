
'use strict';
angular.module('myApp').controller("automatedSystemsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'automatedSystemsMasterService','$cookieStore','$filter',
    function($scope, $state, $stateParams, $timeout, automatedSystemsMasterService, $cookieStore, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "Work done by automated systems";
        $scope.bindForDisplayForApi = function(prData){
            $timeout(50);
            $scope.storeSrcData = [];
            if(prData.length > 0) {
                prData.forEach(function (item) {
                    $scope.storeSrcData.push(item);
                });
            }
            $scope.displayedCollection = [].concat($scope.storeSrcData);
        };
        $scope.fetchDataFromDb = function(){
            automatedSystemsMasterService.automatedSystem('show').show({id:$scope.loggedInUserId}, function(data){
                $scope.bindForDisplayForApi(data.viewData);
                //console.log(data);
                $scope.refreshData = false;
            });
        }
        $scope.fetchDataFromDb();
        $scope.fnRefreshDataList = function(){
            $scope.refreshData = true;
            $scope.fetchDataFromDb();
        };
        $scope.fnUpdate = function(prData, vaule, field) {
            if(field == 'Status'){
                if(prData.workStatus == vaule) return false;
                prData.workStatus = vaule;
            }
            prData.fieldName = field;
            automatedSystemsMasterService.automatedSystem('update').update({id:prData.id}, prData, function(data) {
                if(data.message) myMessage(data.message.text,data.message.class, 3000);
            });
        };
        //$scope.message = {class: 'alert-success', text: 'Updated'};
        var myMessage = function (message, className, time) {
            $scope.message = {class: className, text: message};
            var timeOut = 100;
            if(time) timeOut = time;
            $timeout(function(){
                $scope.message = {};
            }, timeOut);
        };

        var vrChannelId = 's5-p0-as0';
        vrGlobalSocket.on(vrChannelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updated') {
                var obj = _.findWhere($scope.storeSrcData, {
                    id: parseInt(objSocketData.dataSet.id)
                });
                var idx = $scope.storeSrcData.indexOf(obj);
                if(idx != -1){
                    $scope.storeSrcData[idx] = objSocketData.dataSet;
                    $scope.bindForDisplayForApi($scope.storeSrcData);
                }
            } else if(objSocketData.action == 'scriptRunningStatus') {
                var obj = _.findWhere($scope.storeSrcData, {
                        id: parseInt(objSocketData.dataSet.id)
                    });
                var idx = $scope.storeSrcData.indexOf(obj);
                if(idx != -1){
                    var second = 0;
                    var message = objSocketData.dataSet.titleMessage;
                    var nowTime = $filter('date')(new Date(), 'hh:mm:ss a');
                    console.log(nowTime);
                    if(objSocketData.dataSet.sleep){
                        second = objSocketData.dataSet.sleep;

                        var nowTimeStamp = new Date().getTime();
                        var afterTimeStamp = nowTimeStamp + (second * 1000);
                        var afterStartTime = $filter('date')(new Date(afterTimeStamp), 'hh:mm:ss a');
                        message = objSocketData.dataSet.titleMessage + ' next it will be start ' + afterStartTime;
                    }
                    console.info($scope.storeSrcData[idx].systemWork + ' -> ' + message);
                    $scope.storeSrcData[idx].titleMessage = message;
                    $scope.bindForDisplayForApi($scope.storeSrcData);
                }
            }
        });
    }
]);
angular.module('myApp').service("automatedSystemsMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.automatedSystem = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'automatedSystem';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'automatedSystem/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'automatedSystem/:id';
            }
            return $resource(hsRESTUri, {}, {
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
                }
            });
        };
        return factory;
    }
]);