'use strict';
angular.module('myApp').controller("apptNoteConfigMasterCtrl", ['$scope', '$state', '$http', '$stateParams', '$timeout','fileReader', 'apptNoteConfigurationService', '$filter', 'FileUploader',
    function($scope, $state, $http, $stateParams, $timeout, fileReader, apptNoteConfigurationService, $filter, FileUploader)
    {
        $scope.nameToShowInBreadcrumb = "Appointment Note Configuration";
        $scope.displayAllProviderListCollection =[];
        $scope.allProviderMasterList = [];
        $scope.displayAllCommonListCollection =[];
        $scope.msgObj = {msg:{}};
        apptNoteConfigurationService.apptNoteConfig('getMasterList').getMasterList({},function(data)
        {
            $scope.allProviderMasterList = data.providerList;
        });


        $scope.fnCreateNewProviderConfig = function(provider) {


            apptNoteConfigurationService.apptNoteConfig('addNew').addNew(provider,function(data)
            {
                if(data.status == 'success') {
                    var pos = $scope.displayAllProviderListCollection.indexOf(provider);
                    var newSavedProviderDetails = provider;
                    newSavedProviderDetails.id = data.providerId;
                    newSavedProviderDetails.isDisabled = 1;
                    newSavedProviderDetails.uploader = $scope.instantiateUploader(data.providerId);
                    $scope.displayAllProviderListCollection.splice(pos,1,newSavedProviderDetails);
                }
                $scope.msgObj.msg = {mclass:'alert-success',text:'New provider added',open:true};
                $timeout(function(){
                    $scope.msgObj.msg.open = false;
                },5000);
            })
        };

        $scope.fnAddNewProviderSpecificDetails = function() {
            $scope.displayAllProviderListCollection.push({id:null,name:null,currentSignatureSrc:null,signature:null,npi:null,isDisabled:0});
        };

        $scope.instantiateUploader = function (id) {
            var createdByUserId = $scope.loggedInUserId;
            var vrTimeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrCurrentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var uploader = new FileUploader({
                url: apiResourceUrl + 'uploadFileToCentral/' + id+'?created=' + createdByUserId + '&timeZone='+vrTimeZoneAbbreviationOfClient+'&dateTime='+vrCurrentDateTimeOfClient
            });
            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {

                uploader.uploadAll();
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);

            };
            uploader.onBeforeUploadItem = function (item) {
                //console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                // console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                //console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {


                if(response.status == 'success') {
                    var signatureDetails = jQuery.grep($scope.displayAllProviderListCollection,function(e){return e.id==id});
                    var pos = $scope.displayAllProviderListCollection.indexOf(signatureDetails[0]);
                    var newImageDetails = signatureDetails[0];
                    newImageDetails.currentSignatureSrc = response.uploadedFilePath;
                    $scope.displayAllProviderListCollection.splice(pos,1,newImageDetails);
                    $scope.msgObj.msg = {mclass:'alert-success',text:'Image uploaded',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                }
                else{
                    $scope.msgObj.msg = {mclass:'danger',text:'Image failed to upload',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                }


                $scope.msgObj.msg = {mclass:'alert-success',text:'Image uploaded',open:true};
                $timeout(function(){
                    $scope.msgObj.msg.open = false;
                },5000);
                //$scope.getCurrentAttachment(fileItem.url, response);
            };
            uploader.onCompleteAll = function () {
                //console.info('onCompleteAll');
            };
            return uploader;
        };

        $scope.instantiateCommonUploader = function () {
            var createdByUserId = $scope.loggedInUserId;
            var vrTimeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
            var vrCurrentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var uploader = new FileUploader({
                url: apiResourceUrl + 'uploadCommonFileToCentral?created=' + createdByUserId + '&timeZone='+vrTimeZoneAbbreviationOfClient+'&dateTime='+vrCurrentDateTimeOfClient
            });
            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {

                uploader.uploadAll();
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);

            };
            uploader.onBeforeUploadItem = function (item) {
                //console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                // console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                //console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {

                if(response.status == 'success') {
                    var logoDetails = jQuery.grep($scope.displayAllCommonListCollection,function(e){return e.name=='logo'});
                    var pos = $scope.displayAllCommonListCollection.indexOf(logoDetails[0]);
                    var newImageDetails = logoDetails[0];
                    newImageDetails.currentLogoSrc = response.uploadedFilePath;
                    newImageDetails.id = response.uploadedID;
                    $scope.displayAllCommonListCollection.splice(pos,1,newImageDetails);
                    $scope.msgObj.msg = {mclass:'alert-success',text:'Image uploaded',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                }
                else{
                    $scope.msgObj.msg = {mclass:'danger',text:'Image failed to upload',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                }
            };
            uploader.onCompleteAll = function () {
                //console.info('onCompleteAll');
            };
            return uploader;
        };



        $scope.fnPopulateListOfProviders = function(){
            apptNoteConfigurationService.apptNoteConfig('getList').getList({},function(data)
            {
                $scope.displayAllProviderListCollection = [];
                $scope.allFooterSectionSettings = data.settings;
                data.allProvider.forEach(function(val,index){
                    val.uploader = $scope.instantiateUploader(val.id);
                    val.isDisabled=1;
                    $scope.displayAllProviderListCollection.push(val);
                });

                $scope.allProviderConfigList = angular.copy($scope.displayAllProviderListCollection);
            });

        };

        $scope.fnSaveNPI = function(provider,type){

            if(provider.npi!=null && provider.npi.length>0) {

                var createdByUserId = $scope.loggedInUserId;
                var vrTimeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrCurrentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var objParams = {providerDetails:{id:provider.id,name:provider.name,npi:provider.npi},created:createdByUserId,dateTime:vrCurrentDateTimeOfClient,timeZone:vrTimeZoneAbbreviationOfClient};
                apptNoteConfigurationService.apptNoteConfig('update').update({id: provider.id,type:type},objParams,function(data)
                {
                    $scope.msgObj.msg = {mclass:'alert-success',text:'NPI Saved',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);

                })
            }
        };

        $scope.fnGetCommonSettings = function() {
            apptNoteConfigurationService.apptNoteConfig('getCommon').getList({},function(data)
            {

                if(data.allCommonSettings.length>0) {
                    data.allCommonSettings.forEach(function(val,index){
                        val.uploader = $scope.instantiateCommonUploader();
                        $scope.displayAllCommonListCollection.push(val);
                    });
                }
                else{
                    var commonUploader = $scope.instantiateCommonUploader();
                    $scope.displayAllCommonListCollection.push({id:null,name:'logo',currentLogoSrc:null,logo:null,uploader:commonUploader});
                }

            });
        };

        $scope.fnDeleteProviderConfig = function(pid,idx) {

            if(confirm("Are you sure to delete the provider?")) {
                apptNoteConfigurationService.apptNoteConfig('remove').remove({id:pid},function(data)
                {
                    if(data.status == 'success') {
                        $scope.msgObj.msg = {mclass:'alert-success',text:'Provider removed',open:true};
                        $timeout(function(){
                            $scope.msgObj.msg.open = false;
                        },5000);
                        //$scope.displayAllProviderListCollection.splice(idx,1);
                        $scope.fnPopulateListOfProviders();
                    }
                })
            }
        };

        $scope.fnSaveSettings = function(settings) {
            apptNoteConfigurationService.apptNoteConfig('updateSettings').updateSettings({id:settings.id},settings,function(data)
            {
                if(data.data.status === "success") {
                    $scope.msgObj.msg = {mclass:'alert-success',text:'Settings saved',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                    //$scope.displayAllProviderListCollection.splice(idx,1);
                    $scope.fnPopulateListOfProviders();
                }
                else {
                    $scope.msgObj.msg = {mclass:'alert-danger',text:'Settings failed to save',open:true};
                    $timeout(function(){
                        $scope.msgObj.msg.open = false;
                    },5000);
                }
            })
        }

        $scope.fnPopulateListOfProviders();
        $scope.fnGetCommonSettings();
    }
]);


angular.module('myApp').service("apptNoteConfigurationService", ['$resource',
    function($resource)
    {
        var factory = {};

        // Code to display all allowed file extensions and Create new file extensions
        // ==========================================================================
        factory.apptNoteConfig = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'apptNoteConfig';
            if (queryType == 'getMasterList') {
                hsRESTUri = apiResourceUrl + 'masterProvidersList';
            } else if (queryType == 'getList') {
                hsRESTUri = apiResourceUrl + 'apptNoteConfig';
            } else if (queryType == 'addNew') {
                hsRESTUri = apiResourceUrl + 'apptNoteConfig';
            }else if(queryType == 'update'){
                hsRESTUri = apiResourceUrl + 'apptNoteConfig/:id/:type';
            }else if(queryType == 'remove'){
                hsRESTUri = apiResourceUrl + 'apptNoteConfig/:id';
            }else if(queryType == 'getCommon'){
                hsRESTUri = apiResourceUrl + 'apptCommonNoteConfig';
            }else if(queryType == 'updateSettings'){
                hsRESTUri = apiResourceUrl + 'apptCommonNoteSettings/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    getMasterList:
                    {
                        method: 'GET',
                        isArray: false,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                    getList:
                    {
                        method: 'GET',
                        isArray: false,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                    getCommon:
                    {
                        method: 'GET',
                        isArray: false,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                    addNew:
                    {
                        method: 'POST'
                    },
                    update:
                    {
                        method: 'PUT',
                        params:{
                            id:'@id',
                            type:'@type'
                        }
                    },
                    remove:
                    {
                        method: 'DELETE',
                        params:{
                            id:'@id'
                        }
                    },
                    updateSettings:
                    {
                        method: 'PUT',
                        params:{
                            id:'@id'
                        }
                    }

                });
        };

        return factory;
    }
]);