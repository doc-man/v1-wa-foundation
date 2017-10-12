'use strict';
angular.module('myApp').controller("matchingReportMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'matchingReportMasterService', '$filter',
    function($scope, $state, $stateParams, $timeout, matchingReportMasterService, $filter)
    {

        $scope.nameToShowInBreadcrumb = "Savant Care matching report";

        $scope.savedListOfPatientsInMatching = [];
        $scope.arListOfPatientsInMatching = [];
        $scope.itemsByPage = 25;
        $scope.startFrom = null;
        $scope.endTo = null;
        $scope.showDateFilters = false;

        matchingReportMasterService.report('query').query(function(data)
        {
            if(data.result.length>0) {
                data.result.forEach(function(val){
                    $scope.savedListOfPatientsInMatching.push(val);
                })
            }
            $scope.arListOfPatientsInMatching = [].concat($scope.savedListOfPatientsInMatching);
            $scope.paginationInfo = {};
            $scope.paginationInfo.totalItemCount = data.result.length;
            $scope.numberOfPages = Math.ceil($scope.paginationInfo.currentItemCount / $scope.itemsByPage);
        });

        $scope.onChangeCountUsers = function (searchValue, countByType) {
            if(countByType != 'startDate' && countByType != 'endDate') {
                var searchValue = angular.lowercase(searchValue);
                var countFiles = 0;
                if (countByType == 'fullName') {
                    $scope.paginationInfo.totalItemCount = $filter('filter')($scope.arListOfPatientsInMatching, {fullName: searchValue}).length;
                } else if (countByType == 'selectedProviderFullName') {
                    $scope.paginationInfo.totalItemCount = $filter('filter')($scope.arListOfPatientsInMatching, {selectedProviderFullName: searchValue}).length;
                } else if (countByType == 'matchedProviderFullName') {
                    $scope.paginationInfo.totalItemCount = $filter('filter')($scope.arListOfPatientsInMatching, {matchedProviderFullName: searchValue}).length;
                } else if (countByType == 'status') {
                    $scope.paginationInfo.totalItemCount = $filter('filter')($scope.arListOfPatientsInMatching, {matchedProviderFullName: searchValue}).length;
                } else if (countByType == 'providerAskedForMatching') {
                    $scope.paginationInfo.totalItemCount = $filter('filter')($scope.arListOfPatientsInMatching, {matchedProviderFullName: searchValue}).length;
                }
            }
            else {
                if(countByType == 'startDate') {
                    //console.log(searchValue,$scope.endTo);
                    $scope.startFrom = searchValue;
                    $scope.paginationInfo.totalItemCount = $filter('dateRange')($scope.arListOfPatientsInMatching, searchValue,$scope.endTo).length;
                }
                if(countByType == 'endDate') {
                    //console.log($scope.startFrom,searchValue);
                    $scope.endTo = searchValue;
                    $scope.paginationInfo.totalItemCount = $filter('dateRange')($scope.arListOfPatientsInMatching, $scope.startFrom,searchValue).length;
                }

            }

        }
        $scope.fnShowLastSlideName = function (slideList) {

            var lastElement = null;
            angular.forEach(slideList,function(slide){
                lastElement = slide.displayName;
            })
            return lastElement;
        }
    }
]);
angular.module('myApp').service("matchingReportMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.report = function(queryType) {
            var hsRESTUri = apiResourceUrl + 'matchingReport';

            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false
                },
            });
        };
        return factory;
    }
]);
angular.module('myApp').filter('dateRange', function() {
    return function( items, fromDate, toDate ) {
        var filtered = [];
       // console.log(fromDate, toDate);
        //here you will have your desired input
        if(fromDate!=null && toDate!=null) {
            var from_date = Date.parse(fromDate);
            var to_date = Date.parse(toDate);
            angular.forEach(items, function(item) {
                var arDateTimeParts = item.matchingStarted.split(" ");
                var arDateParts = arDateTimeParts[0].split("-");
                var checkDate = new Date(parseInt(arDateParts[0]),parseInt(arDateParts[1])-1,parseInt(arDateParts[2]),0,0,0,0);
                if(checkDate >= from_date && checkDate <= to_date) {
                    filtered.push(item);
                }
            });
        }
        else if(fromDate!=null) {
            var from_date = Date.parse(fromDate);
            angular.forEach(items, function(item) {
                var arDateTimeParts = item.matchingStarted.split(" ");
                var arDateParts = arDateTimeParts[0].split("-");
                var checkDate = new Date(parseInt(arDateParts[0]),parseInt(arDateParts[1])-1,parseInt(arDateParts[2]),0,0,0,0);
                if(checkDate >= from_date) {
                    filtered.push(item);
                }
            });
        }
        else if(toDate!=null) {
            var to_date = Date.parse(toDate);
            angular.forEach(items, function(item) {
                var arDateTimeParts = item.matchingStarted.split(" ");
                var arDateParts = arDateTimeParts[0].split("-");
                var checkDate = new Date(parseInt(arDateParts[0]),parseInt(arDateParts[1])-1,parseInt(arDateParts[2]),0,0,0,0);
                if(checkDate <= to_date) {
                    filtered.push(item);
                }
            });
        }
        else {
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
        }

        return filtered;
    };
});