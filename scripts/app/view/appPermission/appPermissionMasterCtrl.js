'use strict';
angular.module('myApp').controller("appPermissionMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', '$filter', 'appPermissionMasterService',
    function($scope, $state, $stateParams, $timeout, $filter, appPermissionMasterService)
    {
        $scope.nameToShowInBreadcrumb = "Page permission";
        $scope.apiUrl = apiResourceUrl;

        $scope.showPageAccessStatus = function(id) {
            var selected = $filter('filter')($scope.pageAccessPointList, {groupID: id});
            return (id && selected.length) ? selected[0].group_name : 'Not set';
        };

        $scope.fnAddAppPermission = function()
        {
            var arData =
            {
                id: null,
                uid:$scope.loggedInUserId,
                groupID: 0,
                group_name: '',
                pageUrl: ''
            };
            $scope.allPagesList.splice(0,0,arData);
            $scope.displayPagesCollection =[].concat($scope.allPagesList);
        };

        $scope.loadAllPagesList = function () {
            appPermissionMasterService.pageService('getAppPermissionList').getAppPermissionList({ }, function (data) {
                $scope.allPagesList  = data.pagesList;
                $scope.pageAccessPointList  = data.accessList;
            });
        };

        $scope.updatePageAccessData = function (row, data, index) {
            //row.groupID = data;            //console.log(row); console.log(data);

            if(row.groupID == 0 && row.pageUrl == '') {
                $scope.showPannelMessageBoard('please enter proper page url or group name', 'alert-warning');
            }
            else {
                appPermissionMasterService.pageService('updatePageAccess').updatePageAccess(row, function (data) {
                    if(data.msgFlag== 'error') {
                        $scope.showPannelMessageBoard('please enter proper page url', 'alert-warning');
                    }
                    else {
                        $scope.showPannelMessageBoard('updated page access', 'alert-success');
                    }
                    $scope.allPagesList  = data.pagesList;
                });
            }
        };

        $scope.loadAllPagesList();
    }
]);

angular.module('myApp').service("appPermissionMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.pageService = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'getDoctorList';

            if (queryType == 'getAppPermissionList')
            {
                hsRESTUri = apiResourceUrl + 'getAppPermissionList';
            }
            else if (queryType == 'updatePageAccess')
            {
                hsRESTUri = apiResourceUrl + 'updatePageAccess';
            }

            return $resource(hsRESTUri, {},
            {
                getAppPermissionList:
                {
                    method: 'GET',
                    isArray: false,
                },
                updatePageAccess:
                {
                    method: 'POST',
                    //isArray: false,
                }
            });
        };
        return factory;
    }
]);