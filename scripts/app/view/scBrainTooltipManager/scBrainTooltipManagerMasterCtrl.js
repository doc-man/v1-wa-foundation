'use strict';
angular.module('myApp').controller("scBrainTooltipManagerMasterCtrl", ['$scope', '$http', 'scBrainTooltipManagerService',
    function($scope, $http, masterCommandListService)
    {
        $scope.nameToShowInBreadcrumb = "ScBrain tooltip manager";

        $scope.rowCollection = [
            { identifier:'testCase', position:'scBrain goal delete icon', content:'<span class="help-tip-content">This is the inline help tip! \n<a onclick="event.stopPropagation()" target="_blank" href="https://www.google.co.in">Google</a>\n</span>' }
        ];

        $scope.displayedCollection = [].concat($scope.rowCollection);
    }
]);
angular.module('myApp').service("scBrainTooltipManagerService", ['$resource',
    function($resource)
    {
        var factory = {};

        return factory;
    }
]);