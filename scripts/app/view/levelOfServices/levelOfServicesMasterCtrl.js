'use strict';
angular.module('myApp').controller("levelOfServicesMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'losMasterService', '$filter', 'userServices',
    function ($scope, $state, $stateParams, $timeout, losMasterService, $filter, userServices) {
        $scope.nameToShowInBreadcrumb = "Level of services";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';

        $scope.pannelMessage = null;

        if ($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.fnDeleteDesignation = function (arData) {
            if (arData.id === null) {
                var obj = _.findWhere($scope.masterData.designationList,
                    {
                        uniqueId: arData.uniqueId
                    });
                var idx = $scope.masterData.designationList.indexOf(obj);
                $scope.masterData.designationList.splice(idx, 1);
            } else {
                var r = confirm("Do you really want to remove this Designation from database?");
                if (r) {
                    losMasterService.los('remove').remove({
                        id: arData.id
                    }, function (data) {
                        if (data.data == 'success') {
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if (data.data == 'failed') {
                            $scope.showPannelMessageBoard('Designation cant\'t be deleted', 'alert-danger', 3000);
                        }
                    });
                }
            }
        };
        $scope.fnAddLos = function () {
            var arData =
                {
                    designationName: '',
                    createdByUID: $scope.loggedInUserId,
                    ID: null,
                    historyID: null,
                    examID: null,
                    MdmID: null,
                    HistoryLevel: "",
                    ExamLevel: "",
                    MDMLevel: "",
                    billingCode: "",
                    countOfPatientWithThisDsignation: 0,
                    notes: null,
                    uniqueId: Math.floor((Math.random() * 9000) + 1) + (new Date().getTime())
                }
            $scope.masterData.designationList.splice(0, 0, arData);
            $scope.displayDesignationListCollection = [].concat($scope.masterData.designationList);
        };
        $scope.fnLoadExamHistMdmDataFromServer = function () {
            losMasterService.los('loadEHMData').loadEHMData({}, function (data) {
                if (data.data.length == 0) {
                    $scope.masterData.messageVal = 'Nothing found!';
                }
                $scope.masterData.designationList = data.data;
                $scope.masterData.cptCodeList = data.cptCodeList;
                $scope.displayDesignationListCollection = [].concat($scope.masterData.designationList);
            });
        };
        $scope.fnSaveExamHistMdmBillingCodeData = function (arData, prDataType) {
            arData.createdByUID = $scope.loggedInUserId;
            arData.clientSideName = 'MasterDB';
            arData.createdOnDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            arData.createdOnTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
            if (arData.ID == null) {
                /*
                * If arDatga.ID == null means this los first time added on clicking of plus signed.
                */
                if (prDataType == "BillingCode") {
                    $scope.showPannelMessageBoard('At first add  history,exam and MDM level.', 'alert-danger', 3000);
                    arData.billingCode = "";
                    return;
                }
                if (arData.HistoryLevel == "" || arData.ExamLevel == "" || arData.MDMLevel == "") {
                    if (prDataType == "Exam") {
                        if (arData.HistoryLevel == "" && arData.ExamLevel == "" && arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add history level, exam level and MDM level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.HistoryLevel == "" && arData.ExamLevel != "" && arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add history level,and MDM level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.HistoryLevel == "") {
                            $scope.showPannelMessageBoard('Add history level', 'alert-danger', 3000);
                            return;
                        } else if (arData.ExamLevel == "") {
                            $scope.showPannelMessageBoard('Add exam level', 'alert-danger', 3000);
                            return;
                        } else {
                            $scope.showPannelMessageBoard('Add MDM level.', 'alert-danger', 3000);
                            return;
                        }
                    } else if (prDataType == "History") {
                        if (arData.HistoryLevel == "" && arData.ExamLevel == "" && arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add history level, exam level and MDM level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.HistoryLevel != "" && arData.ExamLevel == "" && arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add exam level,and MDM level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.ExamLevel == "") {
                            $scope.showPannelMessageBoard('Add exam level', 'alert-danger', 3000);
                            return;
                        } else if (arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add MDM level', 'alert-danger', 3000);
                            return;
                        } else {
                            $scope.showPannelMessageBoard('Add history level.', 'alert-danger', 3000);
                            return;
                        }
                    } else if (prDataType == "MDM") {
                        if (arData.HistoryLevel == "" && arData.ExamLevel == "" && arData.MDMLevel == "") {
                            $scope.showPannelMessageBoard('Add history level, exam level and MDM level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.HistoryLevel == "" && arData.ExamLevel == "" && arData.MDMLevel != "") {
                            $scope.showPannelMessageBoard('Add history level and exam level.', 'alert-danger', 3000);
                            return;
                        } else if (arData.ExamLevel == "") {
                            $scope.showPannelMessageBoard('Add exam level', 'alert-danger', 3000);
                            return;
                        } else if (arData.HistoryLevel == "") {
                            $scope.showPannelMessageBoard('Add history level', 'alert-danger', 3000);
                            return;
                        } else {
                            $scope.showPannelMessageBoard('Add MDM level.', 'alert-danger', 3000);
                            return;
                        }
                    }
                } else {
                    /*all history,lexam,MDM data filled.*/
                    var arMasterLosData = angular.copy($scope.masterData.designationList);
                    arMasterLosData.splice(0, 1); // removing new added data at index 0 to check is the enetered data is already present in masterLos dataset.
                    var objOfLos = _.findWhere(arMasterLosData,
                        {
                            ExamLevel: arData.ExamLevel,
                            HistoryLevel: arData.HistoryLevel,
                            MDMLevel: arData.MDMLevel
                        });
                    var idx = arMasterLosData.indexOf(objOfLos);
                    if (idx != -1) {
                        //alert("this level presents.");
                        /*this level presents.*/
                        $scope.showPannelMessageBoard('These History,exam and MDM level already present.', 'alert-danger', 3000);
                        arData.HistoryLevel = ""; // assigining blanked data.
                        arData.ExamLevel = "";   // assigining blanked data.
                        arData.MDMLevel = "";   // assigining blanked data.
                        return;
                    } else {
                        /*level not presents so insert it.*/
                        // insert
                        losMasterService.los('create').create({}, arData, function (data) {
                            if (data.status == "inserted") {
                                $scope.showPannelMessageBoard('Added', 'alert-success');
                            } else {
                                $scope.showPannelMessageBoard('Wrong entry, please check it.', 'alert-danger', 5000);
                                arData.HistoryLevel = ""; // assigining blanked data.
                                arData.ExamLevel = "";   // assigining blanked data.
                                arData.MDMLevel = "";   // assigining blanked data.
                            }
                        });
                    }
                }
            } else {
                if (arData.HistoryLevel == "" && prDataType == "History") {
                    $scope.showPannelMessageBoard('History level can not be blanked.', 'alert-danger', 3000);
                    return;
                } else if (arData.ExamLevel == "" && prDataType == "Exam") {
                    $scope.showPannelMessageBoard('Exam level can not be blanked.', 'alert-danger', 3000);
                    return;
                } else if (arData.MDMLevel == "" && prDataType == "MDM") {
                    $scope.showPannelMessageBoard('MDM level can not be blanked.', 'alert-danger', 3000);
                    return;
                } else if (prDataType == "Notes" && (arData.notes == "" || arData.notes == null)) {
                    $scope.showPannelMessageBoard('Notes can not be blanked.', 'alert-danger', 3000);
                    return;
                } else if (arData.billingCodeForNewAppointment == "" || arData.billingCodeForNewAppointment == null && prDataType == "billingCodeForNewAppointment") {
                    $scope.showPannelMessageBoard('Billing code can not be blanked.', 'alert-danger', 3000);
                    return;
                } else if (arData.billingCodeForFollowUpAppointment == "" || arData.billingCodeForFollowUpAppointment == null && prDataType == "billingCodeForFollowUpAppointment") {
                    $scope.showPannelMessageBoard('Billing code can not be blanked.', 'alert-danger', 3000);
                    return;
                }
                if (prDataType != "billingCodeForNewAppointment" && prDataType != "billingCodeForFollowUpAppointment" && prDataType != "Notes") {
                    /* update for all except BillingCode, since we are checking is the updated level present in master data.*/
                    var objOfLos = _.findWhere($scope.masterData.designationList,
                        {
                            ExamLevel: arData.ExamLevel,
                            HistoryLevel: arData.HistoryLevel,
                            MDMLevel: arData.MDMLevel
                        });
                    var idx = $scope.masterData.designationList.indexOf(objOfLos);
                    if (idx != -1) {
                        /*this level presents.*/
                        $scope.showPannelMessageBoard('These History,exam and MDM level already present.', 'alert-danger', 3000);
                        return;
                    } else {
                        var vrSectionUpdate = prDataType;
                        arData.UpdatedSection = vrSectionUpdate;
                        losMasterService.los('update').update(
                            {
                                id: arData.ID
                            }, arData, function () {
                                $scope.showPannelMessageBoard('Updated', 'alert-success');
                            });
                    }
                } else {
                    /* update for only BillingCode*/
                    var vrSectionUpdate = prDataType;
                    arData.UpdatedSection = vrSectionUpdate;

                    losMasterService.los('update').update(
                        {
                            id: arData.ID
                        }, arData, function () {
                            $scope.showPannelMessageBoard('Updated', 'alert-success');
                        });
                }
            }
        };
        $scope.showPannelMessageBoard = function (message, classname, time) {
            if (_.isUndefined(time)) {
                time = 1000;
            }
            $scope.msgObj = {};
            if (!$scope.msgObj.msg) $scope.msgObj.msg = {};
            $scope.msgObj.msg.text = message;
            $scope.msgObj.msg.mclass = classname;
            $scope.msgObj.msg.open = true;
            var timer = $timeout(function () {
                $scope.msgObj.msg.open = false;
                $timeout.cancel(timer);
            }, time);
        };
        $scope.fnSaveDesignation = function (arData) {
            if (arData.designationName != null) {
                if (arData.id === null) {
                    // insert
                    losMasterService.los('create').create({}, arData, function (data) {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });
                } else {
                    losMasterService.los('update').update({
                        id: arData.id
                    }, arData, function () {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
        };
        // ===--==-= Fetch cativity log data =-==--=== \\
        $scope.openActivityStreamForDesignation = function(index, losID) {
            delete $scope.displayActivityLogForEvent;
            var objApp = _.findWhere($scope.displayDesignationListCollection, {
                ID: losID
            });
            var idxApp = $scope.displayDesignationListCollection.indexOf(objApp);
            if(idxApp != -1){
                $scope.displayDesignationListCollection.forEach(function(eachData,idx){
                    if(idx != idxApp){
                        $scope.displayDesignationListCollection[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.displayDesignationListCollection[idxApp].activityLogIconForEvent = !$scope.displayDesignationListCollection[idxApp].activityLogIconForEvent;
                $scope.showEventsActivityLogForEvent = $scope.displayDesignationListCollection[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            if($scope.showEventsActivityLogForEvent == false){
                return false;
            }
            userServices.activityLog('getActivityLog').getActivityLog({
                    id: losID,
                    pluginId: 0,
                    sectionName: 'levelOfServiseMasterDbPerRow'
                },function(data){
                    data.data.forEach(function(eachData){
                        $scope.eventsActivityLogDataForEvent.push(eachData);
                    });
                    $scope.displayActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);
                });
        };
        $scope.bindDesignationsInView = function (arData) {
            $scope.masterData.designationList = [];
            arData.forEach(function (obj, idx) {
                $scope.masterData.designationList.push(obj);
            });
            $scope.displayDesignationListCollection = [].concat($scope.masterData.designationList);
        };
        /* $scope.fnLoadMasterDesignationDataFromServer();*/
        $scope.fnLoadExamHistMdmDataFromServer();
        var channelId = 's6-p6-um' + $scope.loggedInUserId;
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'add') {
                /*$scope.$apply(function ()
                {
                $scope.masterData.designationList.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.masterData.designationList,
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.masterData.designationList.indexOf(obj);
                if (idx < 0) {
                    // not found
                    $scope.$apply(function () {
                        $scope.masterData.designationList.unshift(objSocketData.dataSet);
                        $scope.bindDesignationsInView($scope.masterData.designationList);
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.masterData.designationList.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindDesignationsInView($scope.masterData.designationList);
                    });
                }
            } else if (objSocketData.action == 'update') {
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.masterData.designationList,
                        {
                            ID: objSocketData.dataSet.ID
                        });
                    var idx = $scope.masterData.designationList.indexOf(obj);
                    $scope.masterData.designationList[idx] = objSocketData.dataSet;
                });
                $scope.updatedDesignationData = $scope.masterData.designationList;
                $scope.bindDesignationsInView($scope.updatedDesignationData);
            } else if (objSocketData.action == 'removeDesignation') {
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.masterData.designationList,
                        {
                            id: objSocketData.dataSet
                        });
                    var idx = $scope.masterData.designationList.indexOf(obj);
                    $scope.masterData.designationList.splice(idx, 1);
                    if ($scope.masterData.designationList.length == 0) {
                        $scope.masterData.messageVal = 'Nothing found!';
                    }
                });
            }
        });
    }
]);


angular.module('myApp').service("losMasterService", ['$resource',
    function ($resource) {
        var factory = {};
        factory.los = function (queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'designation';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'designation/:id';
            }
            else if (queryType == 'loadEHMData') {
                hsRESTUri = apiResourceUrl + 'examHistMdmData';
            }
            else if (queryType == 'create') {
                hsRESTUri = apiResourceUrl + 'los';
            }
            else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'losUpdate/:id';
            }
            else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'designation/:id';
            }
            else if (queryType == 'getTypes') {
                hsRESTUri = apiResourceUrl + 'getTypesOfAssets';
            }
            return $resource(hsRESTUri, {},
                {
                    query:
                    {
                        method: 'GET',
                        isArray: true,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    create:
                    {
                        method: 'POST'
                    },
                    show:
                    {
                        method: 'GET',
                        isArray: false,
                        params:
                        {
                            id: '@id'
                        },
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    loadEHMData:
                    {
                        method: 'GET',
                    },
                    getTypes:
                    {
                        method: 'GET',
                        isArray: false,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    update:
                    {
                        method: 'PUT',
                        params:
                        {
                            id: '@id'
                        },
                    },
                    remove:
                    {
                        method: 'DELETE',
                        params:
                        {
                            id: '@id'
                        }
                    },
                });
        };
        return factory;
    }
]);