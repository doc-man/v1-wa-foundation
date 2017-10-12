'use strict';
angular.module('myApp').controller("miscellaneousNoteTypeMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'miscellaneousNoteTypeService','$cookies','$auth',
    function($scope, $state ,$stateParams, $timeout, miscellaneousNoteTypeService, $cookies, $auth) {
        $scope.nameToShowInBreadcrumb = "Miscellaneous note type";
        $scope.miscellaneousNoteTypeDataSet = [];
        //$scope.masterData.messageVal = '';
        $scope.miscellaneousNoteTypeList = [];

        var token = $cookies.getObject("loginObj").token;
        $scope.isLoggedInObj = $cookies.getObject("loginObj");
//console.log($scope.isLoggedInObj);
        $auth.setToken(token); //satelizer
        $scope.loggedInUserId = $cookies.getObject("loginObj").accesskey;
        // Data bind function
        // ==================

        $scope.bindFileType = function (prData) {
            $scope.miscellaneousNoteTypeList = [];
            if (prData.length >= 0) {
                prData.forEach(function (item) {
                    $scope.miscellaneousNoteTypeList.push(item);
                });

            }
            $scope.miscellaneousNoteTypeDataSet = [].concat($scope.miscellaneousNoteTypeList);
        };

        // Adding dummy file type
        // ======================

        $scope.inputs = [];
        $scope.fnAddNoteType = function ($index) {
            var dummyInfo = {
                id: 0,
                noteType: null
            }
            $scope.miscellaneousNoteTypeList.unshift(dummyInfo);
            $scope.bindFileType($scope.miscellaneousNoteTypeList);
        }

        // Displaying data from database
        // =============================
        $scope.getMiscellaneousNoteTypeList = function () {
            miscellaneousNoteTypeService.miscellaneousTypeCategoryList('noteTypeShow').noteTypeShow({}, function (data) {
                $scope.bindFileType(data.data);

            });
        };
        $scope.getMiscellaneousNoteTypeList(); // calling  $scope.miscellaneousNoteTypeList function to load data.

        // Update or save new note type to database
        // ========================================

        $scope.fnSaveNoteType = function (arData, index) {
            if (arData.id == 0) {
                if (arData.noteType == "" || arData.noteType == null) {
                    $scope.masterData.messageVal = 'Note type cannot be empty'
                    $scope.showPannelMessageBoard('Note type cannot be empty', 'alert-danger', 3000);
                    return false;
                } else {
                    arData.date = new Date();
                    arData.userId = $scope.loggedInUserId;
                    miscellaneousNoteTypeService.miscellaneousTypeCategoryList('addNoteType').addNoteType({}, arData, function (data) {
                        $scope.masterData.messageVal = 'Added';
                        $scope.showPannelMessageBoard(data.msg, 'alert-success');
                    });
                }
            } else {
                if (arData.noteType == "") {
                    $scope.masterData.messageVal = 'File type cannot be empty'
                    $scope.showPannelMessageBoard('File type cannot be empty', 'alert-danger', 3000);
                    return false;
                } else {
                    miscellaneousNoteTypeService.miscellaneousTypeCategoryList('updateNoteType').updateNoteType({}, arData, function (data) {
                        $scope.masterData.messageVal = 'Updated';
                        $scope.showPannelMessageBoard(data.data, 'alert-success', 3000);

                    });
                }
            }
        }

        // socket to reflect changes made in db
        // ====================================

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addMiscellaneousNoteType') {
                var obj = _.findWhere($scope.miscellaneousNoteTypeDataSet, function (a) {
                    a.id == objSocketData.dataSet.id
                });
                var idx = $scope.miscellaneousNoteTypeDataSet.indexOf(obj);
                if (idx != -1) {
                    $scope.$apply(function () {
                        $scope.miscellaneousNoteTypeDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindFileType($scope.miscellaneousNoteTypeDataSet);
                    });
                } else {
                    if(_.isUndefined($scope.fileTypeDataSet)){
                        $scope.fileTypeDataSet = [];
                    }
                    $scope.fileTypeDataSet.push(objSocketData.dataSet);
                    $scope.bindFileType($scope.fileTypeDataSet);
                }
            }
            else if (objSocketData.action == 'updateNoteType') {
                var obj = _.findWhere($scope.miscellaneousNoteTypeDataSet, {
                    id: objSocketData.dataSet.id
                });
                var idx = $scope.miscellaneousNoteTypeDataSet.indexOf(obj);
                $scope.$apply(function () {
                    if (idx != -1) {
                        $scope.miscellaneousNoteTypeDataSet[idx].noteType = objSocketData.dataSet.noteType;
                        $scope.bindFileType($scope.miscellaneousNoteTypeDataSet);
                    }

                });
            }
        });
    }
]);
angular.module('myApp').service("miscellaneousNoteTypeService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.miscellaneousTypeCategoryList = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'noteTypeShow';

            if(queryType == 'noteTypeShow') {
                hsRESTUri = apiResourceUrl + 'noteTypeShow';
            }else if(queryType == 'updateNoteType'){
                hsRESTUri = apiResourceUrl + 'updateNoteType';
            }else if(queryType == 'addNoteType'){
                hsRESTUri = apiResourceUrl + 'addNoteType';
            }
            return $resource(hsRESTUri, {},
                {
                    noteTypeShow:
                    {
                        method:'GET'

                    },
                    updateNoteType:
                    {
                        method: 'POST'
                    },
                    addNoteType:
                    {
                        method:'POST'
                    },
                });
        };
        return factory;
    }
]);