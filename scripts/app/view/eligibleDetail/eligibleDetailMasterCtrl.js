'use strict';

angular.module('myApp').controller("eligibleDetailMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'eligibleDetailService','$filter',
 function($scope, $state, $stateParams, $timeout, eligibleDetailService, $filter)
 {
     $scope.nameToShowInBreadcrumb = "Elegible Details";
     $scope.listingDetail = [
         {view: 'Api Keys', value:'apiKeys', active: false},
         {view: 'Payer Details', value:'payerDetails', active: false},
     ];
     $scope.displayDetail = {};
     $scope.eligibleApiKeysDataLoading = false;
     $scope.storeSrcData = [];
     $scope.bindForDisplayForApi = function(prData){
         $scope.eligibleApiKeysDataSet = [];
         $scope.storeSrcData = [];
         var countId = 1;
         if(prData.length > 0) {
             prData.forEach(function (item) {
                 item.rowID = countId;
                 $scope.eligibleApiKeysDataSet.push(item);
                 $scope.storeSrcData.push(item);
                 countId++;
             });
         }
         $scope.displayEligibleApiKeysDataSet = [].concat($scope.syncCalendarReportDataSet);
     };
     $scope.getLoadDataForApiKeys = function(){
         eligibleDetailService.eligible('getEligibleApiDataFromSc').getEligibleApiDataFromSc({id:$scope.loggedInUserId}, function(data){
             //console.log(data);
             $scope.bindForDisplayForApi(data.returnData);
             $scope.eligibleApiKeysDataLoading = true;
         });
     };
     //$scope.getLoadDataForApiKeys();
     $scope.updateApiKey = function (prData, fieldName){
         var sendData = prData;
         sendData.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
         sendData.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
         sendData.fieldName = fieldName;
         eligibleDetailService.eligible('updateEligibleApiDataInSc').updateEligibleApiDataInSc({id:$scope.loggedInUserId}, sendData, function(data){
             var getReturnDataSet = data.returnData;
             var messageClass = 'alert-success';
             if(data.status != 'success') messageClass = 'alert-danger';
             var obj = _.findWhere($scope.storeSrcData,
                 {
                     rowID: getReturnDataSet.rowID
                 });
             var subIdx = $scope.storeSrcData.indexOf(obj);
             if (subIdx != -1) {
                 $scope.storeSrcData[subIdx] = getReturnDataSet;
                 $scope.bindForDisplayForApi($scope.storeSrcData);
             }
             $scope.eligiblePanelName = 'Eligible Api Keys';
             $scope.showPannelMessageBoard(data.message, messageClass, 10000);
         });
     };
     $scope.eligiblePayerIDDataLoading = false;
     $scope.storeSrcDataForPayer = [];
     $scope.bindForDisplayOfPayerId = function(prData){
         $scope.eligiblePayerIdDataSet = [];
         $scope.storeSrcDataForPayer = [];
         var countId = 1;
         if(prData.length > 0) {
             prData.forEach(function (item) {
                 item.rowID = countId;
                 $scope.eligiblePayerIdDataSet.push(item);
                 $scope.storeSrcDataForPayer.push(item);
                 countId++;
             });
         }
         $scope.displayEligiblePayerIdDataSet = [].concat($scope.eligiblePayerIdDataSet);
     };
     $scope.getLoadDataForPayerID = function () {
         eligibleDetailService.eligible('getEligiblePayerIdDataFromSc').getEligiblePayerIdDataFromSc({id:$scope.loggedInUserId}, function(data){
             //console.log(data);
             $scope.bindForDisplayOfPayerId(data.returnData);
             $scope.eligiblePayerIDDataLoading = true;
         });
     };
     $scope.updatePayer = function (prData, fieldName){
         var sendData = prData;
         sendData.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
         sendData.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
         sendData.fieldName = fieldName;
         eligibleDetailService.eligible('updateEligiblePayerIdDataFromSc').updateEligiblePayerIdDataFromSc({id:$scope.loggedInUserId}, sendData, function(data){
             var getReturnDataSet = data.returnData;
             var messageClass = 'alert-success';
             if(data.status != 'success') messageClass = 'alert-danger';
             var obj = _.findWhere($scope.storeSrcDataForPayer,
                 {
                     rowID: getReturnDataSet.rowID
                 });
             var subIdx = $scope.storeSrcDataForPayer.indexOf(obj);
             if (subIdx != -1) {
                 $scope.storeSrcDataForPayer[subIdx] = getReturnDataSet;
                 $scope.bindForDisplayOfPayerId($scope.storeSrcDataForPayer);
             }
             $scope.eligiblePanelName = 'Eligible Payer Details';
             $scope.showPannelMessageBoard(data.message, messageClass, 3000);
         });
     };
     // This function call for display data in page
     $scope.fnCallToOpenPanel = function(prData){
         var obj = _.findWhere($scope.listingDetail,
             {
                 value: prData.value
             });
         var subIdx = $scope.listingDetail.indexOf(obj);
         if (subIdx != -1) {
             $scope.listingDetail[subIdx].active = !prData.active;
         }
         $scope.displayDetail.checkDiv = prData.value;
     };
 }
]);

angular.module('myApp').service("eligibleDetailService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.eligible = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'eligibleDetail';
            if (queryType == 'getEligibleApiDataFromSc') {
                hsRESTUri = apiResourceUrl + 'getEligibleApiDataFromSc/:id';
            } else if (queryType == 'updateEligibleApiDataInSc') {
                hsRESTUri = apiResourceUrl + 'updateEligibleApiDataInSc/:id';
            } else if (queryType == 'getEligiblePayerIdDataFromSc') {
                hsRESTUri = apiResourceUrl + 'getEligiblePayerIdDataFromSc/:id';
            } else if (queryType == 'updateEligiblePayerIdDataFromSc') {
                hsRESTUri = apiResourceUrl + 'updateEligiblePayerIdDataFromSc/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getEligibleApiDataFromSc:
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
                    updateEligibleApiDataInSc:
                    {
                        method: 'POST',
                        params:
                        {
                            id: '@id'
                        }
                    },
                    getEligiblePayerIdDataFromSc:
                    {
                        method: 'GET',
                        isArray: false,
                        params:
                        {
                            id: '@id'
                        }
                    },
                    updateEligiblePayerIdDataFromSc:
                    {
                        method: 'POST',
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