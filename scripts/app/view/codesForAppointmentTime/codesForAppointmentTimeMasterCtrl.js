'use strict';
angular.module('myApp').controller("codesForAppointmentTimeMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'codesForAppointmentTimeMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, codesForAppointmentTimeMasterService, $filter) {
        $scope.nameToShowInBreadcrumb = "Codes for appointment time";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        if ($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnLoadCodesForAppointmentTimeDataFromServer = function () {
            codesForAppointmentTimeMasterService.codesForAppointmentTimeMasterService('getCodesForAppointmentTime').getCodesForAppointmentTime(function (data) {
                if (data.data.length == 0) {
                    $scope.masterData.messageVal = 'Nothing found!';
                }
                $scope.masterData.codesForAppointmentTime = data.data;
                $scope.masterData.cptCodeList = data.cptCodeList;
                var appointmentTypeList = [{'name': 'first appointment'},{'name': 'follow up appointment'}];
                $scope.masterData.appointmentTypeList = appointmentTypeList;
                $scope.displayCodesForAppointmentTimeCollection = [].concat($scope.masterData.codesForAppointmentTime);
            });
        };
        $scope.fnAddNewCodesForAppointmentTime = function () {
            var arCode = {
                id: null,
                code: null,
                fullName: null,
                appointmentTime: null,
                appointmentType: null,
                uniqueRowId: Math.floor((Math.random() * 9000) + 1) + (new Date().getTime())
            }
            $scope.masterData.codesForAppointmentTime.unshift(arCode);
            $scope.bindCodesForAppointmentTimeInView($scope.masterData.codesForAppointmentTime);
        };
        $scope.fnLoadCodesForAppointmentTimeDataFromServer();
        $scope.fnSaveCodesForAppointmentTime = function (arData, prDataType) {
            arData.fieldType = prDataType;
            arData.createdByUID = $scope.loggedInUserId;
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            codesForAppointmentTimeMasterService.codesForAppointmentTimeMasterService('saveCodesForAppointmentTime').saveCodesForAppointmentTime({}, arData, function (data) {
                $scope.showPannelMessageBoard(data.message, 'alert-success', 5000);
            });
        };
        $scope.showPannelMessageBoard = function (message, classname, time) {
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
            var timer = $timeout(function () {
                $scope.msgObj.msg.open = false;
                $timeout.cancel(timer);
            }, time);
        };
        $scope.bindCodesForAppointmentTimeInView = function (arData) {
            $scope.masterData.codesForAppointmentTime = [];
            arData.forEach(function (obj, idx) {
                $scope.masterData.codesForAppointmentTime.push(obj);
            });
            $scope.displayCodesForAppointmentTimeCollection = [].concat($scope.masterData.codesForAppointmentTime);
        };
        $scope.removeCodesForAppointmentTimeList = function (arData) {
            $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrActiveUserTabid = $scope.activeUserTabId;
            arData.uidOnActivityDone = vrActiveUserTabid;
            arData.createdByUID = $scope.logedInUserId;
            arData.nameOfSectionOnActivityDone = 'codesForAppointmentTime';
            arData.createdOnDateTime = $scope.todayDate;
            arData.createdOnTimeZone = $scope.createdTimeZone;
            arData.typeOfActivityLog = 'delete';
            if (arData.id === null) {
                var obj = _.findWhere($scope.masterData.codesForAppointmentTime,
                    {
                        uniqueRowId: arData.uniqueRowId
                    });
                var idx = $scope.masterData.codesForAppointmentTime.indexOf(obj);
                $scope.masterData.codesForAppointmentTime.splice(idx, 1);
            } else {
                codesForAppointmentTimeMasterService.codesForAppointmentTimeMasterService('removeCodesForAppointmentTime').removeCodesForAppointmentTime({}, arData, function (data) {
                    $scope.showPannelMessageBoard('Deleted', 'alert-success', 5000);
                });
            }
        };
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'addCodesForAppointment') {
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.masterData.codesForAppointmentTime,
                        {
                            uniqueRowId: objSocketData.dataSet.uniqueRowId
                        });
                    var idx = $scope.masterData.codesForAppointmentTime.indexOf(obj);
                    if(idx != -1) {
                        $scope.masterData.codesForAppointmentTime[idx] = objSocketData.dataSet;
                    } else {
                        $scope.masterData.codesForAppointmentTime.push(objSocketData.dataSet);
                    }
                });
                $scope.bindCodesForAppointmentTimeInView($scope.masterData.codesForAppointmentTime);
            } else if (objSocketData.action == 'addCodesForAppointment') {
                $scope.masterData.codesForAppointmentTime = objSocketData.dataSet.data;
                $scope.bindCodesForAppointmentTimeInView($scope.masterData.codesForAppointmentTime)
            } else if (objSocketData.action == 'removeCodesForAppointment') {
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.masterData.codesForAppointmentTime,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.masterData.codesForAppointmentTime.indexOf(obj);
                    if(idx != -1) {
                        $scope.masterData.codesForAppointmentTime.splice(idx, 1);
                    }
                });
                $scope.bindCodesForAppointmentTimeInView($scope.masterData.codesForAppointmentTime);
            }
        });
    }
]);
angular.module('myApp').service("codesForAppointmentTimeMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.codesForAppointmentTimeMasterService = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'codesForAppointmentTime';
            if (queryType == 'getCodesForAppointmentTime') {
                hsRESTUri = apiResourceUrl + 'getCodesForAppointmentTime';
            } else if (queryType == 'saveCodesForAppointmentTime') {
                hsRESTUri = apiResourceUrl + 'saveCodesForAppointmentTime/:id';
            } else if (queryType == 'removeCodesForAppointmentTime') {
                hsRESTUri = apiResourceUrl + 'removeCodesForAppointmentTime';
            }
            return $resource(hsRESTUri, {},
                {
                    getCodesForAppointmentTime:
                    {
                        method: 'GET'
                    },
                    saveCodesForAppointmentTime:
                    {
                        method: 'POST'
                    },
                    removeCodesForAppointmentTime:
                    {
                        method: 'POST'
                    }
                });
        };
        return factory;
    }
]);