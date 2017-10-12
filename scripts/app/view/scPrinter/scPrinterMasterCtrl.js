'use strict';

angular.module('myApp').controller("scPrinterMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'scPrinterService','$filter',
 function($scope, $state, $stateParams, $timeout, scPrinterService, $filter) {
     $scope.nameToShowInBreadcrumb = "Sc printer";
     $scope.displayDetail = {};
     $scope.eligibleApiKeysDataLoading = false;
     $scope.storeSrcData = [];
     $scope.bindForDisplayForScPrinter = function(prData){
         $scope.scPrinterDataSet = [];
         if(prData.length > 0) {
             prData.forEach(function (item) {
                 $scope.scPrinterDataSet.push(item);
             });
         }
         $scope.displayScPrinterDataSet = [].concat($scope.scPrinterDataSet);
     };
     $scope.getLoadDataForScPrinter = function(){
         scPrinterService.scPrinter('getScPrintData').getScPrintData({id:$scope.loggedInUserId}, function(data){
             //console.log(data);
             $scope.bindForDisplayForScPrinter(data.returnData);
             $scope.loadScPrinter = true;
         });
     };
     //$scope.getLoadDataForApiKeys();
     $scope.updateScPrinter = function (prData, fieldName){
         var sendData = prData;
         sendData.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
         sendData.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
         sendData.fieldName = fieldName;
         scPrinterService.scPrinter('updateScPrinter').updateScPrinter({id:$scope.loggedInUserId}, sendData, function(data){
             var getReturnDataSet = data.returnData;
             var messageClass = 'alert-success';
             if(data.status != 'success') messageClass = 'alert-danger';
             var obj = _.findWhere($scope.scPrinterDataSet,
                 {
                     id: getReturnDataSet.id
                 });
             var subIdx = $scope.scPrinterDataSet.indexOf(obj);
             if (subIdx != -1) {
                 $scope.scPrinterDataSet[subIdx] = getReturnDataSet;
                 $scope.bindForDisplayForScPrinter($scope.scPrinterDataSet);
             }
             $scope.scPrinterPanelName = 'Printer Timezone';
             $scope.showPannelMessageBoard(data.message, messageClass, 10000);
         });
     };
 }
]);
angular.module('myApp').service("scPrinterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.scPrinter = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'scPrinter';
            if (queryType == 'getScPrintData') {
                hsRESTUri = apiResourceUrl + 'getScPrintData';
            } else if (queryType == 'updateScPrinter') {
                hsRESTUri = apiResourceUrl + 'updateScPrinter/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getScPrintData:
                    {
                        method: 'GET',
                        isArray: false,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                    updateScPrinter:
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
