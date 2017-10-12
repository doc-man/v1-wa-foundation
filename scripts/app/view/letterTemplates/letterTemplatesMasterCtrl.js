'use strict';
angular.module('myApp').controller("letterTemplatesMasterCtrl", ['$scope', '$state', '$stateParams', 'letterService',
    function($scope, $state, $stateParams, letterService) 
    {
        $scope.nameToShowInBreadcrumb = "Letter templates";
        $scope.faqs = {};
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        letterService.letterTemplates('query').query(function(data) 
        {
           
            if(data.length==0){
                    
                    $scope.masterData.messageVal ='Nothing found';
                    
                }else{
                    $scope.masterData.messageVal ='';
                }
            $scope.letters = data;
            //console.log($scope.letters);
        });
        $scope.addnewletter = function(letternew, $index) 
        {
            $scope.letters.push(letternew);
            var dataArray = 
            {
                "template": letternew.templateName,
                "content": letternew.content
            };
            letterService.letterTemplates('create').create({}, dataArray, function(data) 
            {
                $scope.Success = true;
            });
            /*letterService.saveLetter($params);*/
            $scope.letters = {};
            letterService.letterTemplates('query').query(function(data) 
            {
                $scope.letters = data;
                //console.log($scope.faqs);
            });
        };
        $scope.letterDetailView = function(letterId, letterContent, templateName) 
        {
            $state.go('home.masterdb.letterDetail',{
                id : letterId
            });
            $scope.$parent.letterObj.letterDetail = true;
            $scope.letterObj.letterContent = letterContent;
            $scope.letterObj.templateName = templateName;
        }
        $scope.removeLetter = function(letterObj, $index) 
        {
            if (confirm("Are you sure to delete the letter template?")) 
            {
                letterService.letterTemplates('delete').deleterec(
                {
                    id: letterObj.id
                }, function(data) 
                {
                    $scope.letters.splice($scope.letters.indexOf(letterObj), 1);
                    //console.log(rowObj);
                });
            }
        };
    }
]);

angular.module('myApp').service("letterService", ['$resource', '$http',
    function($resource, $http) {
        var factory = {};
        factory.letterTemplates = function(queryType) {
            var letterRESTUri = apiResourceUrl + "letterTemplates";
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'delete') {
                letterRESTUri += '/:id';
            }
            return $resource(letterRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                deleterec: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                showdetail: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        type: '@type'
                    }
                },
            });
        };
        return factory;
    }
]);