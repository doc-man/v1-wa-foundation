'use strict';
angular.module('myApp').controller("MDMLevelsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'mdmLevelsMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, mdmLevelsMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "MDM Levels";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadMDMLevelsDataFromServer = function()
        {
            mdmLevelsMasterService.mdmLevels('getMDMLevels').getMDMLevels(function(data)
            {
                if(data.data.length==0) {
                    $scope.masterData.messageVal ='Nothing found!';
                }
                $scope.masterData.mdmLevelsList = data.data;
                $scope.displayMDMLevelsListCollection =[].concat($scope.masterData.mdmLevelsList);
            });
        };
        $scope.fnLoadMDMLevelsDataFromServer();
        $scope.fnSaveMDMLevels = function(arData,prDataType)
        {
            if(arData[prDataType] == null || arData[prDataType] == '') {
                $scope.showPannelMessageBoard(prDataType + ' field can not be blank.', 'alert-danger');
                return false;
            }
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            mdmLevelsMasterService.mdmLevels('saveMDMLevels').saveMDMLevels({id:arData.mdmID}, arData, function()
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
        $scope.bindMDMLevelsInView = function(arData)
        {
            $scope.masterData.mdmLevelsList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.mdmLevelsList.push(obj);
            });
            $scope.displayMDMLevelsListCollection = [].concat($scope.masterData.mdmLevelsList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateMDMLevels') {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.mdmLevelsList,
                        {
                            mdmID: objSocketData.dataSet.mdmID
                        });
                    var idx = $scope.masterData.mdmLevelsList.indexOf(obj);
                    $scope.masterData.mdmLevelsList[idx] = objSocketData.dataSet;
                });
                $scope.bindMDMLevelsInView($scope.masterData.mdmLevelsList);
            }
        });
    }
]);
angular.module('myApp').service("mdmLevelsMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.mdmLevels = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'mdmLevels';
            if (queryType == 'getMDMLevels') {
                hsRESTUri = apiResourceUrl + 'getMDMLevels';
            } else if (queryType == 'saveMDMLevels') {
                hsRESTUri = apiResourceUrl + 'saveMDMLevels/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getMDMLevels:
                    {
                        method: 'GET'
                    },
                    saveMDMLevels:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);