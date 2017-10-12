'use strict';

angular.module('myApp').controller("directoryMasterCtrl", ['$scope', '$rootScope',  '$stateParams', '$window', 'directoryServices', '$timeout', '$filter', 'FileUploader',
    function($scope, $rootScope, $stateParams, $window, directoryServices, $timeout, $filter, FileUploader)
    {
        $scope.nameToShowInBreadcrumb = "Directory service";
        $scope.paginationInfo = {};
        $scope.itemsByPage = 25;
        $scope.loadingDirectoryData = function() {
            //delete $scope.displayScannedDocsDataSet;
            directoryServices.directory('getLoadDataForDirectory').getLoadDataForDirectory({id : $scope.loggedInUserId},function(data){
                //console.log(data);
                $scope.bindForDisplay(data.display);
                $scope.loadDataSuccess = true;
            });
        };
        $scope.loadingDirectoryData();
        $scope.bindForDisplay = function(directoryData){
            $scope.srcDirectoryDataSet = [];
            var countId = 1;
            if(angular.isArray(directoryData)){
                directoryData.forEach(function (item) {
                    item.rowID = countId;
                    $scope.srcDirectoryDataSet.push(item);
                    countId++;
                });
            }
            $scope.displayDirectoryData = [].concat($scope.srcDirectoryDataSet);
        };

        //=======> Show Message <=======\\
        //$scope.messageForDirectory = 'Test';
        $scope.fnMessageForDirectory = function(message, getClass, time){
            var timeOut = 1000;
            if(!_.isUndefined(time)){
                timeOut = time;
            }
            $scope.getMessageClass = getClass;
            $scope.messageForDirectory = message;
            $timeout(function () {
                delete $scope.messageForDirectory;
            }, timeOut);
        };

        $scope.directoryFlag = {};
        $scope.directoryFlag.callRefreshingData = false;
        $scope.fnRefreshDirectoryDataList = function(){
            $scope.directoryFlag.callRefreshingData = true;
            directoryServices.directory('refreshDirectoryData').refreshDirectoryData({id : $scope.loggedInUserId}, function(data){
                //console.log(data);
                //$scope.directoryFlag.callRefreshingData = 'Load Complete';
                $scope.bindForDisplay(data.display);
                $scope.directoryFlag.callRefreshingData = false;
                /*$timeout(function(){
                    $scope.directoryFlag.callRefreshingData = false;
                }, 1250);*/
            });
        };
        // ============> Upload New Directory File <=============== \\
        $scope.currentDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.timeZoneAbbreviation = String(String(new Date()).split("(")[1]).split(")")[0];
        $scope.directoryFlag.uploading = false;
        var fileMsg = '';
        $scope.dataMsgFile = [];
        var uploader = $scope.uploader = new FileUploader( {
            url: apiResourceUrl + 'uploadNewDirectoryFile/' + $scope.loggedInUserId + '/' + $scope.timeZoneAbbreviation + '/' + $scope.currentDateTime
        });
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.directoryFlag.uploading = true;
            if (fileItem.file.size <= 1073741824) {
                uploader.uploadAll();
            } else {
                fileMsg = fileItem.file.name;
                //fileItem.remove();
                $scope.dataMsgFile.push(
                    {
                        name: fileMsg
                    });
            }
        };
        /*uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            //console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', response);
        };*/
        uploader.onCompleteAll = function(response) {
            //$scope.directoryFlag.uploading = false;
            //$scope.fnMessageForDirectory('Successfully uploaded', 'alert-success', 3000);
            //console.info('onCompleteAll ');
        };

        var vrChannelId = 's0-p0-d0';
        vrGlobalSocket.on(vrChannelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.dataSet != '')
            {
                if(objSocketData.action == 'uploaded')
                {
                    $scope.$apply(function ()
                    {
                        $scope.directoryFlag.uploading = false;
                        $scope.fnMessageForDirectory('Successfully uploaded', 'alert-success', 3000);
                        $scope.bindForDisplay(objSocketData.dataSet.display);
                        //$scope.bindToDisplayDataSetOfStageHistory($scope.srcStageHistoryDataSet);
                    });
                }
            }
        });

    }
]);
angular.module('myApp').service("directoryServices", ['$resource',
    function($resource) {
        var factory = {};

        factory.directory = function(queryType) {
            var queryType = arguments[0] || '';
            var claimDetailsRESTUri = apiResourceUrl + 'directory';
            if (queryType == 'getLoadDataForDirectory') {
                claimDetailsRESTUri = apiResourceUrl + 'getLoadDataForDirectory/:id';
            }else if (queryType == 'refreshDirectoryData') {
                claimDetailsRESTUri = apiResourceUrl + 'refreshDirectoryData/:id';
            }
            return $resource(claimDetailsRESTUri, {}, {
                getLoadDataForDirectory: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                },
                refreshDirectoryData: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        };

        return factory;
    }
]);