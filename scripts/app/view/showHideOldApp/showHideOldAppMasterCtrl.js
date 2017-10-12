'use strict';
angular.module('myApp').controller("showHideOldAppMasterCtrl", ['$rootScope','$scope', '$http','$cookies', 'showHideMasterService', '$timeout', '$interval', '$filter',
    function($rootScope, $scope, $http,$cookies,  showHideMasterService, $timeout, $interval, $filter)
    {
        $scope.nameToShowInBreadcrumb = "Show hide old app";
        //$scope = $scope.$parent;
        if(!_.isUndefined($scope.masterdbObj))
        {
            if($scope.masterdbObj.allowedToMasterDB == 'No')
            {
                $scope.masterdbObj.showNextLevel = false;
            }
        }

        $scope.logedInUserId = $cookies.getObject("loginObj").accesskey;
        $scope.forAddNewUser = false;
        $scope.roleList = [];
        $scope.masterData.messageVal ='';
        $scope.itemsByPage = 25;
        $scope.showHideDataSet = {};
        //$scope.paginationInfo = {};
        $scope.getShowHideOldAppData = function()
        {
            $scope.masterData.userRolelistDataSet = [];
            showHideMasterService.showHideData('getShowHideOldData').getShowHideOldData( function(data)
            {
                if(data.data.length==0)
                {
                  $scope.masterData.messageVal ='Nothing found';
                }
                else
                {
                  $scope.masterData.messageVal ='';
                }

                $scope.showHideDataSet = data.data;

                $scope.displayShowHideCollection =[].concat($scope.showHideDataSet);
                /!* For Pagignation *!/
                $scope.paginationInfo = {};
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo =  data.data;
                $scope.paginationInfo.totalItemCount = data.data.length;
            });
        }

        $scope.getShowHideOldAppData();

        $scope.fnShowHideApp = function(oldAppData, prData)
        {
            $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.createdTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];

            oldAppData.changedBy = $scope.logedInUserId;
            oldAppData.changedOn = $scope.todayDate;
            oldAppData.timeZone = $scope.createdTimeZone;
             showHideMasterService.showHideData('showOrHideApp').showOrHideApp({ oldAppData, changedOpt : prData}, function(data)
            {
                if(data.status == 'success')
                {
                    $scope.showPannelMessageBoard(data.message, 'alert-success');
                }
                else
                {
                    $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
                }
            });

         };

        $scope.bindUsersInView = function(arData)
        {
            $scope.showHideDataSet = [];
            arData.forEach(function(obj, idx)
            {
                $scope.showHideDataSet.push(obj);
            });
            $scope.displayShowHideCollection = [].concat($scope.showHideDataSet);
        };

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) 
        { 
            var objSocketData = JSON.parse(data); 
            if(objSocketData.action == 'updateShowHideOLdAppData') 
            { 
                $scope.$apply(function () 
                { 
                    var obj = _.findWhere($scope.showHideDataSet, 
                        { 
                            id: objSocketData.dataSet[0].id 
                        }); 
                    var idx = $scope.showHideDataSet.indexOf(obj); 
                    if(idx != -1) { 
                        $scope.showHideDataSet[idx] = objSocketData.dataSet[0]; 
                    } 
                }); 
                $scope.bindUsersInView($scope.showHideDataSet); 
            } 
        });

    }
]).service("showHideMasterService", ['$resource', '$http',
    function ($resource, $http) {
        var factory = {};
        factory.showHideData = function (queryType) {
            if (queryType == 'getShowHideOldData') {
                var scBrainRestRESTUri = apiResourceUrl + 'getShowHideOldData';
            }else if(queryType == 'showOrHideApp'){
                var scBrainRestRESTUri = apiResourceUrl + 'showOrHideApp';
            }
            return $resource(scBrainRestRESTUri, {},
                {
                    getShowHideOldData: {
                        method: 'GET'
                    },
                    showOrHideApp: {
                        method: 'PUT'
                    }
                });
        };
        return factory;
    }]);