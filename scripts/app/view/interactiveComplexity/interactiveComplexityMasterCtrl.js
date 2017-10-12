'use strict';
angular.module('myApp').controller("interactiveComplexityMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'interactiveComplexityMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, interactiveComplexityMasterService, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Interactive complexity";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        var addNullOption = {name : 'none'};
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadInteractiveComplexityDataFromServer = function()
        {
            interactiveComplexityMasterService.interactiveComplexity('getInteractiveComplexity').getInteractiveComplexity(function(data)
            {
                if(data.data.length==0) {
                    $scope.masterData.messageVal ='Nothing found!';
                }
                $scope.masterData.interactiveComplexityList = data.data;
                $scope.masterData.interactiveComplexityList.forEach(function (val, idx) {
                    if (val.code == null) {
                        val.code = 'none';
                    }
                });
                $scope.masterData.cptCodeList = data.cptCodeList;
                $scope.masterData.cptCodeList.splice(0, 1, addNullOption);
                $scope.displayInteractiveComplexityListCollection =[].concat($scope.masterData.interactiveComplexityList);
            });
        };
        $scope.fnLoadInteractiveComplexityDataFromServer();
        $scope.fnSaveInteractiveComplexity = function(arData,prDataType)
        {
            if(arData[prDataType] == null || arData[prDataType] == '') {
                $scope.showPannelMessageBoard(prDataType + ' field can not be blank.', 'alert-danger');
                return false;
            }
            if(arData.code == 'none')
            {
                arData.code = null;
            }
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            interactiveComplexityMasterService.interactiveComplexity('saveInteractiveComplexity').saveInteractiveComplexity({id:arData.interactiveComplexityID}, arData, function()
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
        $scope.bindInteractiveComplexityInView = function(arData)
        {
            $scope.masterData.interactiveComplexityList = [];
            arData.forEach(function(obj, idx)
            {
                $scope.masterData.interactiveComplexityList.push(obj);
            });
            $scope.masterData.interactiveComplexityList.forEach(function (val, idx) {
                if (val.code == null) {
                    val.code = 'none';
                }
            });
            $scope.displayInteractiveComplexityListCollection = [].concat($scope.masterData.interactiveComplexityList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateInteractiveComplexity') {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.interactiveComplexityList,
                        {
                            interactiveComplexityID: objSocketData.dataSet.interactiveComplexityID
                        });
                    var idx = $scope.masterData.interactiveComplexityList.indexOf(obj);
                    $scope.masterData.interactiveComplexityList[idx] = objSocketData.dataSet;
                });
                $scope.bindInteractiveComplexityInView($scope.masterData.interactiveComplexityList);
            }
        });
    }
]);

angular.module('myApp').service("interactiveComplexityMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.interactiveComplexity = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'interactiveComplexity';
            if (queryType == 'getInteractiveComplexity') {
                hsRESTUri = apiResourceUrl + 'getInteractiveComplexity';
            } else if (queryType == 'saveInteractiveComplexity') {
                hsRESTUri = apiResourceUrl + 'saveInteractiveComplexity/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getInteractiveComplexity:
                    {
                        method: 'GET'
                    },
                    saveInteractiveComplexity:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);