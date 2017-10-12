'use strict';
angular.module('myApp').controller("allowedFileExtensionMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout','allowedFileExtensionService',  '$filter',
    function($scope, $state, $stateParams, $timeout, allowedFileExtensionService,  $filter)
    {
        $scope.nameToShowInBreadcrumb = "Allowed file extensions";
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
        $scope.masterData.allowedFileExtensionList =[];
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }

        //bind function
        $scope.bindForDisplayForApi = function(prData){
            $scope.masterData.allowedFileExtensionList = [];
            if(prData.length > 0) {
                prData.forEach(function (item) {
                    $scope.masterData.allowedFileExtensionList.push(item);
                });
            }
            $scope.displayAllowedFileExtensionListCollection = [].concat($scope.masterData.allowedFileExtensionList);
        };


        // delete allowed file extension
        $scope.showDetailedError = false;
        $scope.detailedErrorMsg='';
        $scope.fnDeleteAllowedFile = function(id, index) {
            if (id == 0) {
                $scope.masterData.allowedFileExtensionList.splice(index, 1);
            } else {
                var r = confirm("Do you really want to remove this file extension?");
                if (r) {
                    allowedFileExtensionService.allowedFile('deleteAllowedFileExtensions').deleteAllowedFileExtensions({
                            id: id
                        },
                        function (data) {
                            if (data.res == 1) {
                                $scope.showDetailedError = false;
                                $scope.masterData.messageVal = 'Deleted';
                                $scope.showPannelMessageBoard('Deleted', 'alert-success');
                                $scope.masterData.allowedFileExtensionList.splice(index, 1);
                            }else{
                                $scope.showDetailedError = true;
                                $scope.errMsg = 'File extension Can\'t be deleted, foreign relation exist';
                                $scope.detailedErrorMsg = data.msg.errorInfo[2]
                                $scope.masterData.messageVal =  $scope.errMsg;
                                $scope.showPannelMessageBoard( $scope.errMsg, 'alert-danger', 10000);
                            }
                        });
                }
            }
        }

        // Display detailed error message
        // ==============================
        $scope.showErrorMessage=false;
        $scope.fnShowHideErrorDetail = function()
        {
            if($scope.showErrorMessage)
            {
                $scope.showErrorMessage = false;
            }
            else
            {
                $scope.showErrorMessage = true;
            }
        }


        // Displaying all allowed file extension
        // =====================================
        $scope.fnLoadAllowedFileExtensionFromServer=function(){
            allowedFileExtensionService.allowedFile('allowedFileExtensions').allowedFileExtensions({},function(data)
            {
                if(data.data.length < 1)
                {
                    $scope.masterData.messageVal = 'Nothing found';
                    $scope.showPannelMessageBoard('Nothing found', 'alert-danger');
                }else{
                    $scope.bindForDisplayForApi(data.data);
                }
            });
        };

        $scope.fnLoadAllowedFileExtensionFromServer();

        //function to allow or not allow file extension
        $scope.fnSaveAllowedOrNot = function(data, allowStatus, index){
            allowedFileExtensionService.allowedFile('updateAllowOrNot').updateAllowOrNot({
                id: data.id,
                allowedOrNot : allowStatus
            },  function(data){
                if(data.res == 1)
                {
                    $scope.masterData.messageVal = 'Updated';
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    $scope.masterData.allowedFileExtensionList[index].allowedOrNot = data.allowedOrNot;
                    $scope.bindForDisplayForApi($scope.masterData.allowedFileExtensionList);
                }else{
                    $scope.showPannelMessageBoard('Some error occured', 'alert-success');
                }

            });
        };

        // Adding Input text box on clicking the add new button
        // ====================================================
        $scope.inputs =[];
        $scope.fnAddFileExtension=function(){
            var dummyInfo = {
                uniqueId : Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime()),
                id : 0,
                fileExtensionName: null,
                noOfTimeUsed:0,
            }
            //$scope.inputs.push({});
            $scope.masterData.allowedFileExtensionList.unshift(dummyInfo);
            $scope.bindForDisplayForApi($scope.masterData.allowedFileExtensionList);

        };


        // Saving or Updating file extension to database.
        // ==================================
        $scope.fnSaveFileExtension=function(data, index){
            $scope.arData=[];
            if(data.fileExtensionName===null)
            {

                $scope.arData.fileExtension = data;
                allowedFileExtensionService.allowedFile('saveFileExtensionName').saveFileExtensionName( {}, data ,function(response)
                {
                    if(response.res=='0')
                    {   $scope.masterData.messageVal = 'File extension already exists.';
                        $scope.showPannelMessageBoard('File extension already exists', 'alert-danger', 3000);
                        return false;
                    }else if(response.res=='1'){

                        $scope.masterData.messageVal='New file extension created';
                        $scope.showPannelMessageBoard('New file extension created', 'alert-success');

                    }

                    //$scope.showPannelMessageBoard('Updated', 'alert-success', 5000);
                });
            }else
            {
                allowedFileExtensionService.allowedFile('updateFileExtensionName').updateFileExtensionName( {

                }, data, function(response){

                    if(response[0]=='1')
                    {
                        $scope.masterData.messageVal='File extension updated.';
                        $scope.showPannelMessageBoard('File extension updated.', 'alert-success');
                    }else if(response[0]=='2'){
                        $scope.masterData.messageVal='File extension already exists.';
                        $scope.showPannelMessageBoard('File extension already exists.', 'alert-danger');
                    }
                });
            }
        } ;


        // Validating file extension before insert and update.
        // ==================================================
        $scope.fnCheckFileExtension=function(rowObj, data, fieldname){

            if(data ==null)
            {
                $scope.masterData.messageVal=fieldname+' must not be blank';
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000);
                return false;
            }
            else if (data == 'undefined' || data == '' )
            {
                $scope.masterData.messageVal=fieldname+' must not be blank';
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000);
                return false;
            }
            else if(data !== '' && data !== 'undefined')
            {
                $scope.flgNameMatched = false;
                $scope.masterData.allowedFileExtensionList.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.fileExtensionType;
                    $scope.modifiedNewName = data;
                    if(obj.fileExtensionType != null)
                    {
                        $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                        $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    }

                    if($scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgNameMatched = true;
                    };

                });
                if( $scope.flgNameMatched == true )
                {
                    $scope.masterData.messageVal = 'Enter different file extension type.';
                    $scope.showPannelMessageBoard('Enter different file extension type.', 'alert-danger', 3000);
                    return false;
                }
            }

        };

        // Using socket to reflect changes in ui
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {

            var objSocketData = JSON.parse(data);

            if(objSocketData.action == 'saveFileExtension')
            {
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.masterData.allowedFileExtensionList,
                    {
                        uniqueId: uniqueId
                    });

                var idx = $scope.masterData.allowedFileExtensionList.indexOf(obj);
                if(idx != -1)
                {
                    $scope.$apply(function ()
                    {
                        $scope.masterData.allowedFileExtensionList.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindForDisplayForApi($scope.masterData.allowedFileExtensionList);
                    });
                }else{
                    $scope.masterData.allowedFileExtensionList.push(objSocketData.dataSet);
                    $scope.bindForDisplayForApi($scope.masterData.allowedFileExtensionList);
                }

            }else if(objSocketData.action=='updateFileExtensionName')
            {
                var id = objSocketData.dataSet.id;
                $scope.$apply(function(){
                    var obj= _.findWhere($scope.masterData.allowedFileExtensionList,{
                        id : objSocketData.dataSet.id
                    }) ;
                    var idx = $scope.masterData.allowedFileExtensionList.indexOf(obj);
                    $scope.masterData.allowedFileExtensionList[idx] = objSocketData.dataSet;
                });
                $scope.updatedFileExtension = $scope.masterData.allowedFileExtensionList;
                $scope.bindForDisplayForApi($scope.updatedFileExtension);

            }else if(objSocketData.action == 'updateAllowedOrNot')
            {
                var id = objSocketData.dataSet.id;

                $scope.$apply(function(){
                    var obj= _.findWhere($scope.masterData.allowedFileExtensionList,{
                        id : objSocketData.dataSet.id
                    });
                    var idx = $scope.masterData.allowedFileExtensionList.indexOf(obj);
                    $scope.masterData.allowedFileExtensionList[idx] = objSocketData.dataSet;

                });
                $scope.updatedFileExtension = $scope.masterData.allowedFileExtensionList;
                $scope.bindForDisplayForApi($scope.updatedFileExtension);

            }else if(objSocketData.action == 'deleteFileExtension') {
                if (objSocketData.dataSet.res == 1) {
                    $scope.$apply(function () {
                        var obj = _.findWhere($scope.masterData.allowedFileExtensionList, {
                            id: objSocketData.dataSet
                        });

                        var idx = $scope.masterData.allowedFileExtensionList.indexOf(obj);

                        if (idx != -1) {
                            $scope.masterData.allowedFileExtensionList.splice(idx, 1);
                        }

                        if ($scope.masterData.allowedFileExtensionList.length < 1) {
                            $scope.masterData.messageVal = 'Nothing found';
                            $scope.showPannelMessageBoard('Nothing found', 'alert-success');
                        }
                    });

                } else {
                    $scope.masterData.messageVal = 'Can not removed allowed file extension.';
                    $scope.showPannelMessageBoard('Can not removed allowed file extension.', 'alert-success');
                }
            }

        });


    }

]);
angular.module('myApp').service("allowedFileExtensionService", ['$resource',
    function($resource)
    {
        var factory = {};

        // Code to display all allowed file extensions and Create new file extensions
        // ==========================================================================
        factory.allowedFile = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'allowedFileExtensions';
            if (queryType == 'allowedFileExtensions') {
                hsRESTUri = apiResourceUrl + 'allowedFileExtensions';
            } else if (queryType == 'saveFileExtensionName') {
                hsRESTUri = apiResourceUrl + 'saveFileExtensionName/:extensionType';
            }else if(queryType == 'updateFileExtensionName'){
                hsRESTUri = apiResourceUrl + 'updateFileExtensionName';
            }else if(queryType == 'updateAllowOrNot'){
                hsRESTUri = apiResourceUrl + 'updateAllowOrNot';
            }else if(queryType == 'deleteAllowedFileExtensions')
            {
                hsRESTUri = apiResourceUrl + 'deleteAllowedFileExtensions';
            }
            return $resource(hsRESTUri, {},
                {
                    allowedFileExtensions:
                    {
                        method: 'GET'
                    },
                    saveFileExtensionName:
                    {
                        method: 'POST'
                    },
                    updateFileExtensionName:
                    {
                        method: 'PUT'
                    },
                    updateAllowOrNot:
                    {
                        method: 'PUT'
                    },
                    deleteAllowedFileExtensions:
                    {
                        method: 'DELETE'
                    }

                });
        };
        return factory;
    }
]);