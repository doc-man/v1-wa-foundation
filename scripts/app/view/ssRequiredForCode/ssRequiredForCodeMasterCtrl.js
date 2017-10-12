'use strict';
angular.module('myApp').controller("ssRequiredForCodeMasterCtrl", ['$rootScope','$scope', '$http','$cookies', 'ssCodeMasterService', '$timeout', '$interval', '$filter',
    function($rootScope, $scope, $http,$cookies,  ssCodeMasterService, $timeout, $interval, $filter) {
        $scope.nameToShowInBreadcrumb = "Service statements required for a code";
        if (!_.isUndefined($scope.masterdbObj)) {
            if ($scope.masterdbObj.allowedToMasterDB == 'No') {
                $scope.masterdbObj.showNextLevel = false;
            }
        }
        $scope.logedInUserId = $cookies.getObject("loginObj").accesskey;
        $scope.forAddNewUser = false;
        $scope.roleList = [];
        $scope.masterData.messageVal = '';
        $scope.itemsByPage = 25;
        $scope.requireCodeSet = {};
        $scope.masterCodeList = {};
        $scope.fnAddNewRequiredSS = function () {
            var arCode = {
                id: null,
                code: null,
                changedByUserFirstName: null,
                serviceStatement: null,
                uniqueRowId: Math.floor((Math.random() * 9000) + 1) + (new Date().getTime())
            }
            $scope.requireCodeSet.splice(0, 0, arCode);
            $scope.requireCodeSet = [].concat($scope.requireCodeSet);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        };
        $scope.getRequiredSSData = function () {
            $scope.masterData.userRolelistDataSet = [];
            ssCodeMasterService.requireSSData('getRequiredSSData').getRequiredSSData(function (data) {
                if (data.data.length == 0) {
                    $scope.masterData.messageVal = 'Nothing found';
                } else {
                    $scope.masterData.messageVal = '';
                }
                $scope.requireCodeSet = data.data;
                $scope.masterCodeList = data.ctpCodeMasterData;
                $scope.masterSSList = data.ssMasterData;
                $scope.displayRequireCodeSetCollection = [].concat($scope.requireCodeSet);
                /!* For Pagignation *!/
                $scope.paginationInfo = {};
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil($scope.paginationInfo.currentItemCount / $scope.itemsByPage);
                $scope.paginationInfo = data.data;
                $scope.paginationInfo.totalItemCount = data.data.length;
            });
        };
        $scope.getRequiredSSData();
        $scope.bindUsersInView = function (arData) {
            $scope.requireCodeSet = [];
            arData.forEach(function (obj, idx) {
                $scope.requireCodeSet.push(obj);
            });
            $scope.displayRequireCodeSetCollection = [].concat($scope.requireCodeSet);
        };
        $scope.saveChange = function (arChangesData, prRowName) {
            if (arChangesData.code != null || arChangesData.serviceStatement != null) {
                if (arChangesData.code != null && arChangesData.code.name != null) {
                    arChangesData.code = arChangesData.code.name;
                }
                if (prRowName == 'serviceStatement' && arChangesData.id == null) {
                    $scope.showPannelMessageBoard('please choose a code first.', 'alert-danger');
                    arChangesData.serviceStatement = null;
                    return false;
                }
                arChangesData.rowName = prRowName;
                $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
                arChangesData.uidOnActivityDone = vrActiveUserTabid;
                arChangesData.createdByUID = $scope.logedInUserId;
                arChangesData.nameOfSectionOnActivityDone = 'requiredCode';
                arChangesData.createdOnDateTime = $scope.todayDate;
                arChangesData.createdOnTimeZone = $scope.createdTimeZone;
                arChangesData.tblFieldName = prRowName;
                arChangesData.typeOfActivityLog = '';
                //---- Value set completed ----//
                ssCodeMasterService.requireSSData('insertUpdateRequiredSS').insertUpdateRequiredSS({}, arChangesData, function (data) {
                    if (data.status == 'success') {
                        $scope.showPannelMessageBoard(data.message, 'alert-success');
                    } else {
                        $scope.showPannelMessageBoard('Already exist', 'alert-danger');
                    }
                });
            }
        };
        $scope.removeRequireSS = function (arData) {
            //--important data to store in  DB during activitylog and for requiredCode table---------//
            $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;
            arData.uidOnActivityDone = vrActiveUserTabid;
            arData.createdByUID = $scope.logedInUserId;
            arData.nameOfSectionOnActivityDone = 'requiredCode';
            arData.createdOnDateTime = $scope.todayDate;
            arData.createdOnTimeZone = $scope.createdTimeZone;
            arData.typeOfActivityLog = 'delete';
            //--important data to store in  DB during activitylog and for requiredCode table---------//
            if (arData.id === null) {
                var obj = _.findWhere($scope.requireCodeSet,
                    {
                        uniqueRowId: arData.uniqueRowId
                    });
                var idx = $scope.requireCodeSet.indexOf(obj);
                $scope.requireCodeSet.splice(idx, 1);
            } else {
                ssCodeMasterService.requireSSData('removeRequireSS').removeRequireSS({}, arData, function (data) {
                    if (data.status == 'success') {
                        var obj = _.findWhere($scope.requireCodeSet,
                            {
                                id: arData.id
                            });
                        var idx = $scope.requireCodeSet.indexOf(obj);
                        if (idx != -1) {
                            $scope.requireCodeSet.splice(idx, 1);
                        }
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                        $scope.showPannelMessageBoard(data.message, 'alert-success');
                    } else {
                        $scope.showPannelMessageBoard(data.message, 'alert-danger');
                    }
                });
            }
        };
        /*
         Q) Why we need this  function  fnOpenActivityStreamForMasterRequiredCodes(index, code)?
         A) For 1 reason:
         1. To show activity log details for add,edit required codes details.
         Added by: Vivek Deka on 28 Nov 2016.
         */
        $scope.fnOpenActivityStreamForMasterRequiredCodes = function (index, code) {
            $scope.showEventsCodeActivityForEventLogLoading = false;
            var objApp = _.findWhere($scope.requireCodeSet, {
                id: code.id
            });
            var idxApp = $scope.requireCodeSet.indexOf(objApp);
            if (idxApp != -1) {
                $scope.requireCodeSet.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.requireCodeSet[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.requireCodeSet[idxApp].activityLogIconForEvent = !$scope.requireCodeSet[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            ssCodeMasterService.requireSSData('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Required code'
                },
                function (data) {
                    data.data.forEach(function (eachData) {
                        eachData.finalValue = "";
                        if (eachData.typeOfActivity == 'edit' && eachData.idOfEventOnWhichAcitivtyIsDone == code.id) {
                            if (eachData.pluginRowNameWhereActivityIsDone == 'Code' && eachData.oldValue.trim() == "") {
                                eachData.finalValue = eachData.newValue + '(Added)'
                            } else if (eachData.pluginRowNameWhereActivityIsDone == 'Code' && eachData.oldValue.trim() != "") {
                                eachData.finalValue = 'Previous : ' + eachData.oldValue + ', Updated: ' + eachData.newValue;
                            }
                            if (eachData.oldValue.trim() != "" && eachData.newValue.trim() != "" && eachData.pluginRowNameWhereActivityIsDone == 'Required code') {
                                eachData.finalValue = eachData.newValue + ", " + eachData.oldValue;
                            } else if (eachData.newValue.trim() != "" && eachData.oldValue.trim() == "" && eachData.pluginRowNameWhereActivityIsDone == 'Required code') {
                                eachData.finalValue = eachData.newValue + '(Added)';
                            } else if (eachData.oldValue.trim() != "" && eachData.newValue.trim() == "" && eachData.pluginRowNameWhereActivityIsDone == 'Required code') {
                                eachData.finalValue = eachData.oldValue + '(Removed)';
                            }
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        } else if (eachData.typeOfActivity == 'add' && eachData.idOfEventOnWhichAcitivtyIsDone == code.id) {
                            eachData.finalValue = eachData.newValue + '(Added)'
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                    });
                    $scope.showEventsCodeActivityForEventLogLoading = true;
                    $scope.showEventsActivityLogForEvent = $scope.requireCodeSet[idxApp].activityLogIconForEvent;
                    $scope.displayRequiredCodeActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);
                });
        };
        $scope.activityLogIconForRequiredCode = false;
        /*
         Q) Why we need this  function  fnDeletedActivityStream()?
         A) For 1 reason:
         1. To show deleted activitylog details.
         Added by: Vivek Deka on 28 Nov 2016.
         */
        $scope.fnDeletedActivityStream = function () {
            $scope.activityLogIconForRequiredCode = !$scope.activityLogIconForRequiredCode;
            $scope.showEventsCodeActivityLogLoading = false;
            $scope.codesActivityLogDataForEvent = [];
            ssCodeMasterService.requireSSData('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Required code'
                },
                function (data) {
                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'delete') {
                            if (eachData.oldValue.trim() != "") {
                                eachData.oldValue = eachData.oldValue + "(Deleted)";
                            }
                            $scope.codesActivityLogDataForEvent.push(eachData);
                        }
                    });
                    $scope.showEventsCodeActivityLogLoading = true;
                    $scope.showEventsCodeActivityLogForEvent = !$scope.showEventsCodeActivityLogForEvent;
                    $scope.displayCodeActivityLogCollection = [].concat($scope.codesActivityLogDataForEvent);
                });
        };
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'addRequireSSData') {
                var uniqueId = objSocketData.dataSet.uniqueRowId;
                var obj = _.findWhere($scope.requireCodeSet,
                    {
                        uniqueRowId: uniqueId
                    });
                var idx = $scope.requireCodeSet.indexOf(obj);
                if (idx < 0) {
                    $scope.$apply(function () {
                        $scope.requireCodeSet.unshift(objSocketData.dataSet);
                        $scope.bindUsersInView($scope.requireCodeSet);
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.requireCodeSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindUsersInView($scope.requireCodeSet);
                    });
                }
            } else if (objSocketData.action == 'updateRequireSSData') {
                $scope.$apply(function () {
                    $scope.requireCodeSet = objSocketData.dataSet.data;
                    $scope.bindUsersInView($scope.requireCodeSet);
                });
            } else if (objSocketData.action == 'deleteRequireSSData') {
                $scope.$apply(function () {
                    $scope.requireCodeSet = objSocketData.dataSet.data;
                    $scope.bindUsersInView($scope.requireCodeSet);
                });
            }
        });
    }
]).service("ssCodeMasterService", ['$resource', '$http',
    function ($resource, $http) {
        var factory = {};
        factory.requireSSData = function (queryType) {
            if (queryType == 'getRequiredSSData') {
                var scBrainRestRESTUri = apiResourceUrl + 'getRequiredSSData';
            } else if (queryType == 'insertUpdateRequiredSS') {
                var scBrainRestRESTUri = apiResourceUrl + 'insertUpdateRequiredSS';
            } else if (queryType == 'removeRequireSS') {
                var scBrainRestRESTUri = apiResourceUrl + 'removeRequireSS';
            } else if (queryType == 'getActivityLog') {
                var scBrainRestRESTUri = apiResourceUrl + 'getActivityLog/:id/:pluginId';
            }
            return $resource(scBrainRestRESTUri, {},
                {
                    getRequiredSSData: {
                        method: 'GET'
                    },
                    insertUpdateRequiredSS: {
                        method: 'PUT'
                    },
                    removeRequireSS: {
                        method: 'PUT'
                    },
                    getActivityLog: {
                        method: 'GET'
                    }
                });
        };
        return factory;
    }]);