'use strict';
angular.module('myApp').controller("examLevelsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'examLevelsMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, examLevelsMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Exam Levels";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadExamLevelsDataFromServer = function()
        {
            examLevelsMasterService.examLevels('getExamLevels').getExamLevels(function(data)
            {
                if(data.data.length==0) {
                    $scope.masterData.messageVal ='Nothing found!';
                }
                $scope.masterData.examLevelsList = data.data;
                $scope.displayExamLevelsListCollection =[].concat($scope.masterData.examLevelsList);
            });
        };
        $scope.fnLoadExamLevelsDataFromServer();
        $scope.fnSaveExamLevels = function(arData,prDataType)
        {
            if(arData[prDataType] == null || arData[prDataType] == '') {
                $scope.showPannelMessageBoard(prDataType + ' field can not be blank.', 'alert-danger');
                return false;
            }
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            examLevelsMasterService.examLevels('saveExamLevels').saveExamLevels({id:arData.examID}, arData, function()
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
        $scope.bindExamLevelsInView = function(arData)
        {
            $scope.masterData.examLevelsList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.examLevelsList.push(obj);
            });
            $scope.displayExamLevelsListCollection = [].concat($scope.masterData.examLevelsList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateExamLevels') {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.examLevelsList,
                        {
                            examID: objSocketData.dataSet.examID
                        });
                    var idx = $scope.masterData.examLevelsList.indexOf(obj);
                    $scope.masterData.examLevelsList[idx] = objSocketData.dataSet;
                });
                $scope.bindExamLevelsInView($scope.masterData.examLevelsList);
            }
        });
    }
]);

angular.module('myApp').service("examLevelsMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.examLevels = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'examLevels';
            if (queryType == 'getExamLevels') {
                hsRESTUri = apiResourceUrl + 'getExamLevels';
            } else if (queryType == 'saveExamLevels') {
                hsRESTUri = apiResourceUrl + 'saveExamLevels/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getExamLevels:
                    {
                        method: 'GET'
                    },
                    saveExamLevels:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);