'use strict';
angular.module('myApp').controller("historyLevelsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'historyLevelsMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, historyLevelsMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "History levels";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadHistoryLevelsDataFromServer = function()
        {
            historyLevelsMasterService.historyLevels('getHistoryLevels').getHistoryLevels(function(data)
            {
                if(data.data.length === 0) {
                    $scope.masterData.messageVal ='Nothing found!';
                }
                $scope.masterData.historyLevelsList = data.data;
                $scope.displayHistoryLevelsListCollection =[].concat($scope.masterData.historyLevelsList);
            });
        };
        $scope.fnLoadHistoryLevelsDataFromServer();
        $scope.fnSaveHistoryLevels = function(arData,prDataType)
        {
            if(arData[prDataType] === null || arData[prDataType] === '') {
                $scope.showPannelMessageBoard(prDataType + ' field can not be blank.', 'alert-danger');
                return false;
            }
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            historyLevelsMasterService.historyLevels('saveHistoryLevels').saveHistoryLevels({id:arData.historyID}, arData, function()
            {
                $scope.showPannelMessageBoard('Updated', 'alert-success', 5000);
            });
        };
        $scope.showPannelMessageBoard = function(message, classname, time) {
            if (_.isUndefined(time)) {
                time = 1000;
            }
            $scope.msgObj = {};
            if (!$scope.msgObj.msg) {
                $scope.msgObj.msg = {};
            }
            $scope.msgObj.msg.text = message;
            $scope.msgObj.msg.mclass = classname;
            $scope.msgObj.msg.open = true;
            var timer = $timeout(function() {
                $scope.msgObj.msg.open = false;
                $timeout.cancel(timer);
            }, time);
        };
        $scope.bindHistoryLevelsInView = function(arData)
        {
            $scope.masterData.historyLevelsList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.historyLevelsList.push(obj);
            });
            $scope.displayHistoryLevelsListCollection = [].concat($scope.masterData.historyLevelsList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateHistoryLevels') {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.historyLevelsList,
                        {
                            historyID: objSocketData.dataSet.historyID
                        });
                    var idx = $scope.masterData.historyLevelsList.indexOf(obj);
                    $scope.masterData.historyLevelsList[idx] = objSocketData.dataSet;
                });
                $scope.bindHistoryLevelsInView($scope.masterData.historyLevelsList);
            }
        });
    }
]);

angular.module('myApp').service("historyLevelsMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.historyLevels = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'historyLevels';
            if (queryType == 'getHistoryLevels') {
                hsRESTUri = apiResourceUrl + 'getHistoryLevels';
            } else if (queryType == 'saveHistoryLevels') {
                hsRESTUri = apiResourceUrl + 'saveHistoryLevels/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getHistoryLevels:
                    {
                        method: 'GET'
                    },
                    saveHistoryLevels:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);