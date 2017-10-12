'use strict';
angular.module('myApp').controller("resetPinMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'resetPinService', '$filter',
    function($scope, $state, $stateParams, $timeout, resetPinService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Reset Pin";
        $scope.masterData = {};
        $scope.displayData = {};
        $scope.pannelMessage = null;
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        if(_.isEmpty($scope.masterData)) {
            resetPinService.pin('query').query(function(data) {
                $scope.masterData = data.data;
                $scope.displayData = JSON.parse(JSON.stringify($scope.masterData));
            });
        }
        $scope.fnUpdatePin = function(arData)
        {
            if(arData.pin!=$scope.masterData.pin){
                if (arData.pin!="" && isNaN(Number(arData.pin))){
                    $scope.showPannelMessageBoard('Pin not correct. Accepts only number', 'alert-danger', 3000);
                    $scope.displayData = JSON.parse(JSON.stringify($scope.masterData));
                    return false;
                }
                else if(arData.pin==null || arData.pin=="" || arData.pin.length!=4){
                    $scope.showPannelMessageBoard('Pin not correct. Pin Code length must be 4', 'alert-danger', 3000);
                    $scope.displayData = JSON.parse(JSON.stringify($scope.masterData));
                    return false;
                }
                else {
                    arData.updatedByUID = $scope.loggedInUserId;
                    arData.updatedOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    arData.updatedOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
                    resetPinService.pin('create').create(arData, function()
                    {
                        $scope.showPannelMessageBoard('Pin successfully updated', 'alert-success', 5000);
                    });
                }
            }
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

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'pinUpdated') {
                $scope.$apply(function ()
                {
                    $scope.masterData = objSocketData.dataSet;
                    $scope.displayData = JSON.parse(JSON.stringify($scope.masterData));
                });
            }
        });
    }
]);

angular.module('myApp').service("resetPinService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.pin = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'pin';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'pin';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    //isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                }
            });
        };
        return factory;
    }
]);