'use strict';
angular.module('myApp').controller("fileTypeMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'fileTypeService',
    function($scope, $state ,$stateParams, $timeout, fileTypeService)
    {
        $scope.nameToShowInBreadcrumb = "File type master";
        $scope.fileTypeDataSet = [];
        $scope.masterData.messageVal = '';
        $scope.fileTypeList =[];

        // Data bind function
        // ==================

        $scope.bindFileType = function (prData) {
            $scope.fileTypeList = [];
            if (prData.length >= 0) {
                prData.forEach(function (item) {
                    $scope.fileTypeList.push(item);
                });

            }
           $scope.fileTypeDataSet = [].concat($scope.fileTypeList);
        };

        // Adding dummy file type
        // ======================

        $scope.inputs = [];
        $scope.fnAddNewFileType = function ($index) {
            var dummyInfo = {
                id: 0,
                typeName: null,
                countTypeInRelation: 0,
            }
            $scope.fileTypeList.unshift(dummyInfo);
            $scope.bindFileType($scope.fileTypeList);
        }

        // Displaying data from database
        // =============================
        $scope.getFileTypeList = function () {
            fileTypeService.fileTypeCategoryList('fileTypeShow').fileTypeShow({}, function (data) {
                $scope.bindFileType(data.data);

            });
        };
        $scope.getFileTypeList(); // calling  $scope.getFileTypeList function to load data.

        // Update or save new file type to database
        // ========================================

        $scope.fnSaveFileType = function (arData, index) {

            if (arData.id == 0) {
                if (arData.typeName == "" || arData.typeName == null) {
                    $scope.masterData.messageVal = 'File type cannot be empty'
                    $scope.showPannelMessageBoard('File type cannot be empty', 'alert-danger', 3000);
                    return false;
                } else {
                    fileTypeService.fileTypeCategoryList('addFileType').addFileType({}, arData, function (data) {

                        if (data.msg == 'Added') {
                            $scope.masterData.messageVal = data.msg;
                            $scope.showPannelMessageBoard(data.msg, 'alert-success');
                        } else {
                            $scope.masterData.messageVal = data.msg;
                            $scope.showPannelMessageBoard(data.msg, 'alert-danger');
                        }
                    });
                }
            } else {
                if (arData.typeName == "") {
                    $scope.masterData.messageVal = 'File type cannot be empty'
                    $scope.showPannelMessageBoard('File type cannot be empty', 'alert-danger', 3000);
                    return false;
                } else {
                    fileTypeService.fileTypeCategoryList('updateFileType').updateFileType({}, arData, function (data) {
                        if (data.data == 'Updated') {
                            $scope.masterData.messageVal = data.data;
                            $scope.showPannelMessageBoard(data.data, 'alert-success', 3000);
                        }else{
                            $scope.masterData.messageVal = data.data;
                            $scope.showPannelMessageBoard(data.data, 'alert-danger', 3000);
                        }

                    });
                }

            }

        }

        // Delete file type
        // ================
        $scope.detailedErrorMsg = '';
        $scope.showDetailedError = false;
        $scope.fnDeleteFileType = function(arData, index) {

            if(arData.id == 0){
                $scope.fileTypeList.splice(index, 1);
                $scope.bindFileType($scope.fileTypeList);
            }else{
                var r = confirm("Do you really want to remove this file type? ");
                if (r) {
                    fileTypeService.fileTypeCategoryList('deleteFileType').deleteFileType({id: arData.id}, arData, function (data) {
                       if (data.msg == 'Deleted') {
                            $scope.masterData.messageVal = data.msg;
                            $scope.showPannelMessageBoard(data.msg, 'alert-success');
                            $scope.fileTypeList.splice(index, 1);
                        } else {
                            $scope.detailedErrorMsg = data.msg.errorInfo[2];
                            $scope.showDetailedError = true;
                            $scope.masterData.messageVal = 'File type can\'t be deleted';
                            $scope.showPannelMessageBoard('File type can\'t be deleted', 'alert-danger', 5000);
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

        // Checking for correct data
        // =========================

        $scope.fnCheckFileType=function(rowObj, data, fieldname){

            if(data ==null) {
                $scope.masterData.messageVal =fieldname+ ' must not be blank.';
                $scope.showPannelMessageBoard(fieldname+ ' must not be blank.', 'alert-danger',3000);
            }else if (data == 'undefined' || data == '' )
            {
                $scope.masterData.messageVal=fieldname+' must not be blank';
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000);
                return false;
            }else if(data !== '' && data !== 'undefined')
            {
                $scope.flgNameMatched = false;
                $scope.fileTypeList.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.typeName;
                    $scope.modifiedNewName = data;
                    if(obj.typeName != null)
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
                    $scope.masterData.messageVal = 'Enter different file type.';
                    $scope.showPannelMessageBoard('Enter different file type.', 'alert-danger', 3000);
                    return false;
                }
            }
        }


        // socket to reflect changes made in db
        // ====================================

        var channelId = 's5-p0-u0';

        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'addFileType') {

                var obj = _.findWhere($scope.fileTypeDataSet, function(a) {
                    a.id == objSocketData.dataSet.id
                });
                var idx = $scope.fileTypeDataSet.indexOf(obj);
                if (idx != -1) {
                    $scope.$apply(function ()
                    {
                        $scope.fileTypeDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindFileType($scope.fileTypeDataSet);
                    });
                }else{
                    //$scope.fileTypeDataSet.splice(0, 1, objSocketData.dataSet);
                    //$scope.bindFileType($scope.fileTypeDataSet);
                    $scope.fileTypeDataSet.push(objSocketData.dataSet);
                    $scope.bindFileType($scope.fileTypeDataSet);
                }
            }
            else if (objSocketData.action == 'updateFileType') {
                var obj = _.findWhere($scope.fileTypeDataSet, {
                    id: objSocketData.dataSet.id
                });
                var idx = $scope.fileTypeDataSet.indexOf(obj);
                $scope.$apply(function () {
                if(idx != -1)
                {
                    $scope.fileTypeDataSet[idx] = objSocketData.dataSet;
                    $scope.bindFileType($scope.fileTypeDataSet);
                }

               });

            }
            else if (objSocketData.action == 'deleteFileType') {
                var obj = _.findWhere($scope.fileTypeDataSet, {
                    id: objSocketData.dataSet.id
                });
                var idx = $scope.fileTypeDataSet.indexOf(obj);
                $scope.$apply(function () {
                    $scope.fileTypeDataSet.splice(idx, 1);

                });

            }
        });

    }
]);
angular.module('myApp').service("fileTypeService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.fileTypeCategoryList = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'fileTypeShow';

            if(queryType == 'fileTypeShow') {
                hsRESTUri = apiResourceUrl + 'fileTypeShow';
            }else if(queryType == 'updateFileType'){
                hsRESTUri = apiResourceUrl + 'updateFileType';
            }else if(queryType == 'addFileType'){
                hsRESTUri = apiResourceUrl + 'addFileType';
            }else if(queryType == 'deleteFileType'){
                hsRESTUri = apiResourceUrl + 'deleteFileType';
            }

            return $resource(hsRESTUri, {},
                {
                    fileTypeShow:
                    {
                        method:'GET'

                    },
                    updateFileType:
                    {
                        method: 'POST'
                    },
                    addFileType:
                    {
                        method:'POST'
                    },
                    deleteFileType:
                    {
                        method:'DELETE'
                    }

                });
        };
        return factory;
    }
]);