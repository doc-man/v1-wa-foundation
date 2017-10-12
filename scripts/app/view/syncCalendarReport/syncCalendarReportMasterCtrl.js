'use strict';
angular.module('myApp').controller("syncCalendarReportMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'syncCalendarReportService','$filter', 'userServices',
 function($scope, $state, $stateParams, $timeout, syncCalendarReportService, $filter, userServices)
 {
     $scope.nameToShowInBreadcrumb = "Sync calendar report";
     //$scope.messageForShowInSync = "Testing Message";
     //$scope.selectedAttendeesForResource = {};
     $scope.fnMessageForShowInSync = function(message, time, getClass){
         var timeOut = 1000;
         if(!_.isUndefined(time)){
             timeOut = time;
         }
         if(_.isUndefined(getClass))
            var getClass = 'none';
         $scope.getMessageClass = getClass;
         $scope.messageForShowInSync = message;
         $timeout(function () {
             delete $scope.messageForShowInSync;
         }, timeOut);
     };
     $scope.loadAllData = function(){
         syncCalendarReportService.syncCalendar('getAllHostOrAttendee').getAllHostOrAttendee({id:$scope.loggedInUserId}, function(data)
         {
             $scope.allAvailableResources = JSON.parse(JSON.stringify(data.resourceList));
             //$scope.selectedAttendeesForResource = JSON.parse(JSON.stringify(data.allAttendeesAndAssetStateArr));
             //$scope.fnCheckIfDataNeededToBeFetched();
             console.info("Loading Completed");
         });
     };
     $scope.bindForDisplay = function(syncCalendarData){
         $scope.syncCalendarReportDataSet = [];
         var countId = 1;
         syncCalendarData.forEach(function(item){
             item.rowID = countId;
             if(item.scCalendarCheck == true){
                 item.selectForSyncOfScCalendar = true;
             }
             if(item.googleCalendarCheck == true){
                 item.selectForSyncOfGooogleCalendar = true;
             }
             $scope.syncCalendarReportDataSet.push(item);

             $scope.paginationInfo = {};
             $scope.paginationInfo.totalItemCount = $scope.syncCalendarReportDataSet.length;
             countId ++;
         });
         $scope.displaySyncCalendarReportDataSet = [].concat($scope.syncCalendarReportDataSet);
     };
     $scope.fnGetEventListForAttendees = function(selectedData){
         //console.log(selectedData);
         delete $scope.displaySyncCalendarReportDataSet;
         $scope.syncCalendarReportDataSet = [];
         var selectedHostOrAttendeeId = [selectedData.id];
         var selectedHostOrAttendeeDetails = [selectedData];

         if(selectedHostOrAttendeeId.length != 0){
            var objSetForEvent = {
                resourceIds:selectedHostOrAttendeeId,
                resourceDetails:selectedHostOrAttendeeDetails,
                startDateTimeForView:$scope.startDateTimeForView,
                endDateTimeForView:$scope.endDateTimeForView
            };
             syncCalendarReportService.syncCalendar('getAllEventForSelectedHostOrAttendee').getAllEventForSelectedHostOrAttendee(objSetForEvent, function(data) {
                 var resultArray = data.syncCalendarData;
                 $scope.reportCheckDates = data.reportCheckDates;
                 $scope.bindForDisplay(resultArray);
             });
         }
     };
     $scope.nowSelectedSyncForSc = [];
     $scope.checkSelectedDataForSc = function(index, rowData){
         var sameObjFiend = _.findWhere($scope.nowSelectedSyncForSc,{rowID:rowData.rowID});
         var indexFiend = $scope.nowSelectedSyncForSc.indexOf(sameObjFiend);
         if(indexFiend != -1){
             $scope.nowSelectedSyncForSc[indexFiend] = rowData;
         } else {
             $scope.nowSelectedSyncForSc.push(rowData);
         }
         //console.log($scope.nowSelectedSyncForSc);
     };
     $scope.nowSelectedSyncForGoogle = [];
     $scope.checkSelectedDataForGoogle = function(index, rowData){
         var sameObjFiend = _.findWhere($scope.nowSelectedSyncForGoogle,{rowID:rowData.rowID});
         var indexFiend = $scope.nowSelectedSyncForGoogle.indexOf(sameObjFiend);
         if(indexFiend != -1){
             $scope.nowSelectedSyncForGoogle[indexFiend] = rowData;
         } else {
             $scope.nowSelectedSyncForGoogle.push(rowData);
         }
     };
     $scope.fnUpdateSyncForSc = function(){
         var storeDataWhitoutMessage = [];
         $scope.syncCalendarReportDataSet.forEach(function(item){
             if(!_.isUndefined(item.getStoredStatus)) {
                 delete item.getStoredStatus;
                 delete item.getStoredMessage;
             }
             storeDataWhitoutMessage.push(item);
         });
         $scope.syncCalendarReportDataSet = storeDataWhitoutMessage;
         var resultDataSet = [];
         if($scope.nowSelectedSyncForSc.length != 0){
             $scope.nowSelectedSyncForSc.forEach(function(item){
                 var sameObjFiend = _.findWhere($scope.syncCalendarReportDataSet,{rowID:item.rowID});
                 var indexFiend = $scope.syncCalendarReportDataSet.indexOf(sameObjFiend);
                 if(indexFiend != -1){
                     if((!_.isUndefined($scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfScCalendar) && $scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfScCalendar == true) || (_.isUndefined($scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfScCalendar) && item.selectForSyncOfScCalendar == true)){
                         resultDataSet.push(item);
                     }
                 }
             });
         }
         if(resultDataSet.length != 0){
             syncCalendarReportService.syncCalendar('syncWithScCalendarFromMD').syncWithScCalendarFromMD(resultDataSet, function(data) {
                 //console.log($scope.selectedAttendeesForResource);
                 //$scope.fnGetEventListForAttendees($scope.selectedAttendeesForResource);
                 var returnData = data.returnData;
                 //console.log(JSON.parse(message));
                 if(data.status == 'Success'){
                     var erroeCount = 0;
                     returnData.forEach(function(item){
                         var setStoreData = item.storeData;
                         var setStatus = 'Success';
                         var result = true;
                         if(_.isUndefined(setStoreData.message)){
                             setStoreData = JSON.parse(setStoreData);
                             result = false;
                             setStatus = 'Fail';
                             erroeCount ++;
                         }
                         var sameObjFiend = _.findWhere($scope.syncCalendarReportDataSet,{rowID:item.rowID});
                         var indexFiend = $scope.syncCalendarReportDataSet.indexOf(sameObjFiend);
                         if(indexFiend != -1){
                             $scope.syncCalendarReportDataSet[indexFiend].scCalendarCheck = result;
                             $scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfScCalendar = result;
                             $scope.syncCalendarReportDataSet[indexFiend].getStoredMessage = setStoreData.message;
                             $scope.syncCalendarReportDataSet[indexFiend].getStoredStatus = setStatus;
                         }
                     });
                     if(erroeCount == 0){
                         $scope.fnMessageForShowInSync('Successfully! sync with sc calendar.');
                     } else {
                         var vrEvent = 'event';
                         if(erroeCount > 1) vrEvent = 'events';
                         $scope.fnMessageForShowInSync('Not successfully sync with sc calendar. Error occurred in #'+erroeCount+' '+vrEvent+'.',6000,'danger');
                     }
                 }
             });
         } else {
             $scope.fnMessageForShowInSync('Event not selected',3000,'danger');
         }
         console.info(resultDataSet.length);
         $scope.nowSelectedSyncForSc = [];
     };
     $scope.fnUpdateSyncForGoogle = function(){
         var storeDataWhitoutMessage = [];
         $scope.syncCalendarReportDataSet.forEach(function(item){
             if(!_.isUndefined(item.getStoredStatus)) {
                 delete item.getStoredStatus;
                 delete item.getStoredMessage;
             }
             storeDataWhitoutMessage.push(item);
         });
         $scope.syncCalendarReportDataSet = [].concat(storeDataWhitoutMessage);
         var resultDataSet = [];
         if($scope.nowSelectedSyncForGoogle.length != 0){
             $scope.nowSelectedSyncForGoogle.forEach(function(item){
                 var sameObjFiend = _.findWhere($scope.syncCalendarReportDataSet,{rowID:item.rowID});
                 var indexFiend = $scope.syncCalendarReportDataSet.indexOf(sameObjFiend);
                 if(indexFiend != -1){
                     if((!_.isUndefined($scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfGooogleCalendar) && $scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfGooogleCalendar == true) || (_.isUndefined($scope.syncCalendarReportDataSet[indexFiend].selectForSyncOfGooogleCalendar) && item.selectForSyncOfGooogleCalendar == true)){
                         //$scope.displaySyncCalendarReportDataSet[indexFiend].googleCalendarCheck = item.selectForSyncOfGooogleCalendar;
                         resultDataSet.push(item);
                     }
                 }
             });
         }
         if(resultDataSet.length != 0){
             syncCalendarReportService.syncCalendar('syncWithGoogleCalendarFromMD').syncWithGoogleCalendarFromMD(resultDataSet, function(data) {
                 //console.log($scope.selectedAttendeesForResource);
                 //$scope.fnGetEventListForAttendees($scope.selectedAttendeesForResource);
                 if(data.status == 'Success'){
                     resultDataSet.forEach(function(item){
                         var sameObjFiend = _.findWhere($scope.syncCalendarReportDataSet,{rowID:item.rowID});
                         var indexFiend = $scope.syncCalendarReportDataSet.indexOf(sameObjFiend);
                         if(indexFiend != -1){
                             $scope.syncCalendarReportDataSet[indexFiend].googleCalendarCheck = item.selectForSyncOfGooogleCalendar;
                             $scope.syncCalendarReportDataSet[indexFiend].getStoredMessage = 'Added in google calendar';
                             $scope.syncCalendarReportDataSet[indexFiend].getStoredStatus = 'Success';
                         }
                     });
                     $scope.fnMessageForShowInSync('Successfully! sync with google calendar.');
                 }
             });
         } else {
             $scope.fnMessageForShowInSync('Event not selected',3000,'danger');
         }
         $scope.nowSelectedSyncForGoogle = [];
     };
     $scope.loadAllData();
     $scope.startDateTimeForView = new Date();
     $scope.startDateTimeForFilter = $filter('date')($scope.startDateTimeForView, 'yyyy-MM-dd');
     $scope.endDateTimeForView = new Date(new Date().getTime()+(7*24*60*60*1000));
     $scope.fnOnClickDate = function (selectedAttendeesForResource, dateTime, prName) {
         if(prName == 'startDate') {
             $scope.startDateTimeForView = dateTime;
             $scope.endDateTimeForView = new Date(dateTime.getTime()+(6*24*60*60*1000));
         } else {
             $scope.endDateTimeForView = dateTime;
             $scope.startDateTimeForView = new Date(dateTime.getTime()-(6*24*60*60*1000));
         }
         if(!_.isUndefined(selectedAttendeesForResource)) {
             $scope.fnGetEventListForAttendees(selectedAttendeesForResource);
         }
         $scope.startDateTimeForFilter = $filter('date')($scope.startDateTimeForView, 'yyyy-MM-dd');
         $scope.toggleCalenderForDate(prName);
     };
     $scope.toggleCalenderForDate = function (pClass) {
         $('.' + pClass).toggleClass('open');
         $('.' + pClass + ' a').attr('aria-expanded', function (index, attr) {
             return attr === 'true' ? 'false' : 'true';
         });
     };
     $scope.popup1 = {
         opened: false
     };
     $scope.popup2 = {
         opened: false
     };
     $scope.open1 = function() {
         $scope.popup1.opened = true;
     };
     $scope.open2 = function() {
         $scope.popup2.opened = true;
     };
     $scope.fnShowZocDocActivityLog = function() {
         $scope.filterDate = $filter('date')(new Date(), 'yyyy-MM');
         userServices.activityLog('getActivityLog').getActivityLog(
         {
             id: $scope.loggedInUserId,
             pluginId: -1,
             sectionName: 'ZocDoc'
         }, function(data)
         {
             $scope.zocDocActivityLogData = data.data;
             $scope.displayZocDocActivityLogCollection = [].concat($scope.zocDocActivityLogData);
         });
     };
 }]);

angular.module('myApp').service("syncCalendarReportService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.syncCalendar = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'syncCalendarReport';
            if (queryType == 'show')
            {
                hsRESTUri = apiResourceUrl + 'syncCalendarReport/:id';
            } else if (queryType == 'getAllHostOrAttendee') {
                hsRESTUri = apiResourceUrl + 'getAllHostOrAttendee/:id';
            } else if (queryType == 'getAllEventForSelectedHostOrAttendee') {
                hsRESTUri = apiResourceUrl + 'getAllEventForSelectedHostOrAttendee';
            } else if (queryType == 'syncWithScCalendarFromMD') {
                hsRESTUri = apiResourceUrl + 'syncWithScCalendarFromMD';
            } else if (queryType == 'syncWithGoogleCalendarFromMD') {
                hsRESTUri = apiResourceUrl + 'syncWithGoogleCalendarFromMD';
            }
            return $resource(hsRESTUri, {},
                {
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
                        }
                    },
                    update:
                    {
                        method: 'PUT',
                        params:
                        {
                            id: '@id'
                        }
                    },
                    getAllHostOrAttendee: {
                        method: 'GET',
                        params: {
                            id: '@id'
                        }
                    },
                    getAllEventForSelectedHostOrAttendee: {
                        method: 'POST',
                        isArray: false
                    },
                    syncWithScCalendarFromMD: {
                        method: 'POST',
                        isArray: false
                    },
                    syncWithGoogleCalendarFromMD: {
                        method: 'POST',
                        isArray: false
                    },
                    remove:
                    {
                        method: 'DELETE',
                        params:
                        {
                            id: '@id'
                        }
                    }
                });
        };
        return factory;
    }
]);