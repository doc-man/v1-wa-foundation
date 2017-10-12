'use strict';
angular.module('myApp').controller('googleCalenderSettingMasterCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'googleCalenderSettingMasterService', '$uibModal',
    function($scope, $state, $stateParams, $timeout, googleCalenderSettingMasterService, $uibModal)
    {
        $scope.nameToShowInBreadcrumb = "Google Calender Setting";
        $scope.action = false;
        //$scope.objLoad = {};
        $scope.bindForDisplayForApi = function(prData){
            $scope.googleCalenderSettingDataSet = [];
            if(prData.length > 0) {
                prData.forEach(function (item) {
                    item.disabledWatchBtn = (item.disabledWatchBtn)?item.disabledWatchBtn:false;
                    $scope.googleCalenderSettingDataSet.push(item);
                });
            }
            $scope.displayGoogleCalenderSettingListCollection = [].concat($scope.googleCalenderSettingDataSet);
        };
        $scope.fetchDataFromDb = function(){
            googleCalenderSettingMasterService.googleCalenderSetting('query').query({}, function(data) {
                $scope.bindForDisplayForApi(data.data);
                $scope.refreshData = false;
            });
        };
        $scope.fetchDataFromDb();
        $scope.fnRefreshDataList = function(){
            $scope.refreshData = true;
            $scope.fetchDataFromDb();
        };
        $scope.fnSaveGoogleCalenderSetting = function(arData, prField)
        {
            $scope.action = true;
            if(prField == 'sentDataToGoogleCalender') {
                arData.sentDataToGoogleCalender = (arData.sentDataToGoogleCalender == 'yes') ? 'no' : 'yes';
            } else if(prField == 'recieveDataFromGoogleCalender') {
                arData.recieveDataFromGoogleCalender = (arData.recieveDataFromGoogleCalender == 'yes') ? 'no' : 'yes';
            }
            googleCalenderSettingMasterService.googleCalenderSetting('update').update(
                    {
                        id: arData.doctorId
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success',3000);
                    });
            }
        $scope.actWatch = function (prRowData, index) {
            //console.log(index);
            if(prRowData.googleCalendarID == '' || prRowData.googleCalendarID == null) {$scope.showPannelMessageBoard('First set \'Google Calendar Id\' and then click '+ prRowData.watchBtnText, 'alert-danger',3000); return false;}
            $scope.displayGoogleCalenderSettingListCollection[index].disabledWatchBtn = true;
            googleCalenderSettingMasterService.googleCalenderSetting('actWatch').actWatch({calendareID: prRowData.googleCalendarID}, prRowData, function(data){
                //console.log(data);
                $scope.showPannelMessageBoard(data.message, 'alert-'+data.status, 3000);
            });
        };
        $scope.fiendGoogleCalendarIdHelp = false;
        $scope.googleCalendarIdFiend = function(popupStatus) {
            if(popupStatus == 'open'){
                $scope.$modalInstance = $uibModal.open({
                    scope: $scope,
                    templateUrl: 'view/googleCalenderSetting/popupCalendarIdFiend.html',
                    size: "size-90",
                });
            } else if(popupStatus == 'close'){
                $scope.$modalInstance.close();
            }
        }
        $scope.loadingMessageBySoket = function(){
            $scope.lodingMessageBysocket = !$scope.action;
            $timeout(function(){
                    $scope.lodingMessageBysocket = false;
                    $scope.action = false;
            }, 500);
        }
        var channelId = "s5-p0-u0-gc";
        vrGlobalSocket.on(channelId, function (data)
        {
            $scope.loadingMessageBySoket();
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'updateGoogleCalenderSettingDataInMs')
            {
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.googleCalenderSettingDataSet, {
                   doctorId:parseInt(uniqueId)
                });
                var idx = $scope.googleCalenderSettingDataSet.indexOf(obj);
                        $scope.$apply(function () {
                        if(idx != -1)
                        {
                            $scope.googleCalenderSettingDataSet[idx].googleCalendarID= objSocketData.dataSet.googleCalendarID;
                            $scope.googleCalenderSettingDataSet[idx].recieveDataFromGoogleCalender= objSocketData.dataSet.recieveDataFromGoogleCalender;
                            $scope.googleCalenderSettingDataSet[idx].sentDataToGoogleCalender= objSocketData.dataSet.sentDataToGoogleCalender;
                            $scope.bindForDisplayForApi($scope.googleCalenderSettingDataSet);
                        }
                    });
            } else if(objSocketData.action == 'actWatch') {
                console.log(objSocketData);
                $scope.showPannelMessageBoard(objSocketData.message, 'alert-success', 2000);
                var userId = objSocketData.dataSet.userId;
                var obj = _.findWhere($scope.googleCalenderSettingDataSet, {
                    doctorId:parseInt(userId)
                });
                var idx = $scope.googleCalenderSettingDataSet.indexOf(obj);
                console.log('update idx', idx);
                $scope.$apply(function () {
                    if(idx != -1) {
                        $scope.googleCalenderSettingDataSet[idx].resourceId = objSocketData.dataSet.resourceId;
                        $scope.googleCalenderSettingDataSet[idx].disabledWatchBtn = false;
                        $scope.googleCalenderSettingDataSet[idx].watchSetOn= objSocketData.dataSet.watchSetDateTime+' ('+objSocketData.dataSet.watchSetTimeZone+')';
                        $scope.googleCalenderSettingDataSet[idx].watchExpiringOn = objSocketData.dataSet.watchExpirationDateTime+' ('+objSocketData.dataSet.watchExpirationTimeZone+')';
                        $scope.bindForDisplayForApi($scope.googleCalenderSettingDataSet);
                    }
                });
                //$scope.fetchDataFromDb();
            } else if(objSocketData.action == 'watchNotification') {
                //console.log(objSocketData);
                //$scope.fetchDataFromDb();
            }
        });

        // Data bind function
        // ==================
    }


]);


angular.module('myApp').service("googleCalenderSettingMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.googleCalenderSetting=function(queryType) {
            var queryType = arguments[0] || '';

            var hsRESTUri = apiResourceUrl + 'googleCalenderSetting';
            if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'googleCalenderSetting/:id';
            } else if (queryType == 'actWatch') {
                hsRESTUri = apiResourceUrl + 'actWatchWithGoogleCalender/:calendareID';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET'
                },
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
                },
                actWatch: {
                    method: 'PUT',
                    params: {
                        calendareID: '@calendareID'
                    },
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },

            });
        };
        return factory;
    }
]);