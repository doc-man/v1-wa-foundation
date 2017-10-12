'use strict';
angular.module('myApp').controller("timeInPsytxMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'timeInPsytxMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, timeInPsytxMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Time spent in psychotherapy";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadTimeInPsytxDataFromServer = function()
        {
            timeInPsytxMasterService.timeInPsytx('getTimeInPsytx').getTimeInPsytx(function(data)
            {
                if(data.data.length==0) {
                    $scope.masterData.messageVal ='Nothing found!';
                }
                $scope.masterData.timeInPsytxList = data.data;
                $scope.masterData.cptCodeList = data.cptCodeList;
                $scope.displayTimeInPsytxListCollection =[].concat($scope.masterData.timeInPsytxList);
            });
        };
        $scope.fnLoadTimeInPsytxDataFromServer();
        $scope.fnSaveTimeInPsytx = function(arData,prDataType)
        {
            if(arData[prDataType] == null || arData[prDataType] == '') {
                $scope.showPannelMessageBoard(prDataType + ' field can not be blank.', 'alert-danger');
                return false;
            }
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            timeInPsytxMasterService.timeInPsytx('saveTimeInPsytx').saveTimeInPsytx({id:arData.timeInPsytxID}, arData, function()
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
        $scope.bindTimeInPsytxInView = function(arData)
        {
            $scope.masterData.timeInPsytxList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.timeInPsytxList.push(obj);
            });
            $scope.displayTimeInPsytxListCollection = [].concat($scope.masterData.timeInPsytxList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateTimeInPsytx') {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.timeInPsytxList,
                    {
                        timeInPsytxID: objSocketData.dataSet.timeInPsytxID
                    });
                    var idx = $scope.masterData.timeInPsytxList.indexOf(obj);
                    $scope.masterData.timeInPsytxList[idx] = objSocketData.dataSet;
                });
                $scope.bindTimeInPsytxInView($scope.masterData.timeInPsytxList);
            }
        });
    }
]);

angular.module('myApp').service("timeInPsytxMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.timeInPsytx = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'timeInPsytx';
            if (queryType == 'getTimeInPsytx') {
                hsRESTUri = apiResourceUrl + 'getTimeInPsytx';
            } else if (queryType == 'saveTimeInPsytx') {
                hsRESTUri = apiResourceUrl + 'saveTimeInPsytx/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getTimeInPsytx:
                    {
                        method: 'GET'
                    },
                    saveTimeInPsytx:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);