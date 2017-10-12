'use strict';
angular.module('myApp').controller("fileExtensionRelationMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'fileExtensionRelationService',
    function($scope, $state, $stateParams, $timeout, fileExtensionRelationService)
    {
        $scope.nameToShowInBreadcrumb = "File extension relation";
        $scope.fileTypeSet = [];
        $scope.masterData.messageVal = '';
        $scope.extensionTypeSet = [];
        $scope.selectExtension = 1000;

        // Data bind function
        // ==================

        $scope.bindFileExtendionMapping = function (prData) {
            $scope.fileExtensionRelationDataSet = [];

            if (prData.length > 0) {
                prData.forEach(function (item) {
                    $scope.fileExtensionRelationDataSet.push(item);
                });

            }
            $scope.fileExtensionRelationList = [].concat($scope.fileExtensionRelationDataSet);
        }


        // Get File type
        // =======================

        fileExtensionRelationService.fileTypes('getFileTypes').getFileTypes(function (data) {

            $scope.fileTypeSet = data;
        });

        // Get File extension set
        fileExtensionRelationService.extensionType('getExtensionType').getExtensionType(function (data) {
            $scope.extensionTypeSet = data.data;

        });

        // Display file extension relation mapping
        // =======================================

        $scope.fnLoadFileExtensionRelation = function () {
            fileExtensionRelationService.fileExtensionRelationServiceList('fileExtensionRelationShow').fileExtensionRelationShow({}, function (data) {
                $scope.bindFileExtendionMapping(data.data);
            });
        }

        $scope.fnLoadFileExtensionRelation();

        $scope.inputs = [];
        $scope.fnAddFileExtensionRelation = function (index) {
            var dummyInfo = {
                uniqueId: Math.floor((Math.random() * 9000) + 1) + (new Date().getTime()),
                relationId: 0,
                fileTypeId: 0,
                name: null,
                extension: null,
                fileExtensionMasterId: 0,
                noOfTimesUsed: 0,
            }
            $scope.fileExtensionRelationDataSet.unshift(dummyInfo);
            $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
        };


        $scope.fnSaveFileExtensionRelation = function (arData, index) {

            if (arData.fileTypeId == 0 && arData.fileExtensionMasterId == 0) {
                $scope.masterData.messageVal = 'Both type and extension cannot be empty';
                $scope.showPannelMessageBoard('Both type and extension cannot be empty', 'alert-danger');
                return false;
            } else {

                if (arData.relationId == 0) {

                    if (_.isUndefined(arData.name)) {
                        arData.fileTypeId = null;

                    } else if (_.isUndefined(arData.extension)) {
                        arData.fileExtRelation = null;
                    }
                    fileExtensionRelationService.fileExtensionRelationServiceList('addFileExtensionRelation').addFileExtensionRelation({}, arData, function (response) {

                        if (response.msg == 'Created') {
                            $scope.masterData.messageVal = response.msg;
                            $scope.showPannelMessageBoard(response.msg, 'alert-success');
                        } else {
                            $scope.fileExtensionRelationDataSet[index].fileExtensionMasterId = 0;
                            $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
                            $scope.masterData.messageVal = response.msg;
                            $scope.showPannelMessageBoard(response.msg, 'alert-danger');
                            return "";
                        }

                    });

                }
                else {

                    fileExtensionRelationService.fileExtensionRelationServiceList('updateFileExtensionRelation').updateFileExtensionRelation(
                        {}, arData,
                        function (response) {
                            if (response.msg == 'Updated.') {
                                $scope.masterData.messageVal = response.msg;
                                $scope.showPannelMessageBoard(response.msg, 'alert-success', 5000);
                            } else {
                                $scope.fileExtensionRelationDataSet[index].fileExtensionMasterId = response.oldExtensionId;
                                $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
                                $scope.masterData.messageVal = response.msg;
                                $scope.showPannelMessageBoard(response.msg, 'alert-danger', 5000);
                            }

                        });
                }

            }
        };

        $scope.fnDeleteFileExtensionRelation = function (deleteData, index) {
            if (deleteData.fileTypeId == 0 || deleteData.fileExtensionMasterId == 0 || deleteData.relationId == 0) {
                $scope.fileExtensionRelationDataSet.splice(index, 1);
            } else {
                var r = confirm("Do you really want to remove this file extension relation from database? ");
                if (r) {
                    fileExtensionRelationService.fileExtensionRelationServiceList('deleteFileExtensionRelation').deleteFileExtensionRelation(
                        {
                            relationId: deleteData.relationId
                        }, function (response) {

                            if (response.res == 1) {
                                $scope.masterData.messageVal = 'Deleted.';
                                $scope.showPannelMessageBoard('Deleted.', 'alert-success');
                                $scope.fileExtensionRelationDataSet.splice(index, 1);

                            } else {
                                $scope.masterData.messageVal = 'Error.';
                                $scope.showPannelMessageBoard('Error.', 'alert-danger');
                            }
                        });
                }
            }
        }

        // Checking for correct data
        // =========================

        $scope.fnCheckFileExtensionRelation = function (rowObj, data, fieldname) {

            if (data == null) {
                $scope.masterData.messageVal = fieldname + ' must not be blank.';
                $scope.showPannelMessageBoard(fieldname + ' must not be blank.', 'alert-danger', 3000);
            } else if (data == 'undefined' || data == '') {
                $scope.masterData.messageVal = fieldname + ' must not be blank.';
                $scope.showPannelMessageBoard(fieldname + ' must not be blank.', 'alert-danger', 3000);
                return false;
            }
        }


        // socket to reflect changes made in db
        // ====================================

        var channelId = 's5-p0-u0';

        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'addFileExtensionRelation') {

                var obj = _.findWhere($scope.fileExtensionRelationDataSet, {
                    uniqueId: objSocketData.dataSet.uniqueId
                });
                var idx = $scope.fileExtensionRelationDataSet.indexOf(obj);

                if (idx != -1) {

                    $scope.$apply(function () {
                        $scope.fileExtensionRelationDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
                    });
                } else {
                    $scope.fileExtensionRelationDataSet.push(objSocketData.dataSet);
                    $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
                }
            }
            else if (objSocketData.action == 'updateFileExtensionRelation') {
                var obj = _.findWhere($scope.fileExtensionRelationDataSet, {
                    relationId: objSocketData.dataSet.relationId
                });
                var idx = $scope.fileExtensionRelationDataSet.indexOf(obj);
                $scope.$apply(function () {
                    $scope.fileExtensionRelationDataSet[idx] = objSocketData.dataSet;
                    $scope.bindFileExtendionMapping($scope.fileExtensionRelationDataSet);
                });

            }
            else if (objSocketData.action == 'deleteRelation') {
                var obj = _.findWhere($scope.fileExtensionRelationDataSet, {
                    relationId: objSocketData.dataSet.relationId
                });

                var idx = $scope.fileExtensionRelationDataSet.indexOf(obj);

                $scope.$apply(function () {
                    if (idx != -1) {
                        $scope.fileExtensionRelationDataSet.splice(idx, 1);
                    }

                });
            }
        });


    }
]);
angular.module('myApp').service("fileExtensionRelationService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.fileExtensionRelationServiceList = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'fileExtensionRelationList';

            if(queryType == 'fileExtensionRelationShow')
            {
                hsRESTUri = apiResourceUrl + 'fileExtensionRelationShow';
            }else if(queryType == '')
            {
                hsRESTUri = apiResourceUrl + '';
            }else if(queryType == 'updateFileExtensionRelation')
            {
                hsRESTUri =apiResourceUrl + 'updateFileExtensionRelation';
            }else if(queryType == 'addFileExtensionRelation')
            {
                hsRESTUri = apiResourceUrl + 'addFileExtensionRelation';
            }else if(queryType == 'deleteFileExtensionRelation')
            {
                hsRESTUri = apiResourceUrl + 'deleteFileExtensionRelation';
            }

            return $resource(hsRESTUri, {},
                {
                    fileExtensionRelationShow:
                    {
                        method :'GET'

                    },
                    updateFileExtensionRelation:
                    {
                        method: 'PUT'
                    },
                    addFileExtensionRelation:
                    {
                        method: 'POST'
                    },
                    deleteFileExtensionRelation:
                    {
                        method :'DELETE'
                    }
                });
        };


        factory.fileTypes = function(queryType){
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'fileTypes';

            if(queryType == 'getFileTypes')
            {
                hsRESTUri = apiResourceUrl + 'getFileTypes';
            }

            return $resource(hsRESTUri, {},{
                getFileTypes:
                {
                    method: 'GET'
                }
            });

        };

        factory.extensionType = function(queryType){
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'getExtensionType';

            if(queryType == 'getExtensionType')
            {
                hsRESTUri = apiResourceUrl + 'getExtensionType';
            }

            return $resource(hsRESTUri, {},{
                getExtensionType:
                {
                    method: 'GET'
                }
            });

        };
        return factory;
    }

]);


