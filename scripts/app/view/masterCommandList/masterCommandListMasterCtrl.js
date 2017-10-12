'use strict';
angular.module('myApp').controller("masterCommandListMasterCtrl", ['$scope', '$http', 'masterCommandListService',
    function($scope, $http, masterCommandListService)
    {
        $scope.nameToShowInBreadcrumb = "Master command list";

        $scope.generateList = function(){
            masterCommandListService.masterCommandList('scBrainToCreateMasterSkillListJson').scBrainToCreateMasterSkillListJson({}, function (data) {

                if (data.message == 'success') {
                    $scope.showPannelMessageBoard('Command list generated successfully', 'alert-success');
                } else {
                    $scope.showPannelMessageBoard('Failed please try again later', 'alert-danger');
                }
            });
        };
    }
]);
angular.module('myApp').service("masterCommandListService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.masterCommandList = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = '/v3/api/cl-generate-scbrain-json/public/index.php/api/' + 'scBrainToCreateMasterSkillListJson';

            if(queryType == 'scBrainToCreateMasterCommandListJson') {
                hsRESTUri = '/v3/api/cl-generate-scbrain-json/public/index.php/api/' + 'scBrainToCreateMasterSkillListJson';
            }

            return $resource(hsRESTUri, {},
                {
                    scBrainToCreateMasterSkillListJson:
                    {
                        method:'GET'
                    }

                });
        };
        return factory;
    }
]);