'use strict';
angular.module('myApp').controller("policiesMasterCtrl", ['$scope', '$state', '$stateParams', 'policiesService', '$filter', '$uibModal',
    function($scope, $state, $stateParams, policiesService, $filter, $uibModal)
    {
        /*masterFactory.policies(function(data){
            console.log(data);     
            console.log('12'); 
        });*/
        //console.log($scope.test);
        $scope.nameToShowInBreadcrumb = "Policies";
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        $scope.policyDetailName = 'List';
        $scope.fnPolicyDetailView = function(prName)
        {
            $scope.policyDetailName = prName;
        };
        policiesService.policies('query').query(function(data) 
        { 
            $scope.financeMasterData = [];
            $scope.privacyMasterData = [];
            $scope.treatmentMasterData = [];
            data.data.forEach(function(val, idx) 
            {
                if(val.name == 'Financial policy')
                {
                    $scope.financeMasterData.push(val);
                }
                else if(val.name == 'Privacy policy')
                {
                    $scope.privacyMasterData.push(val);
                }
                else if(val.name == 'Treatment contract')
                {
                    $scope.treatmentMasterData.push(val);
                } 
            })
            $scope.displayFinanceCollection   = [].concat($scope.financeMasterData);
            $scope.displayPrivacyCollection   = [].concat($scope.privacyMasterData);
            $scope.displayTreatmentCollection = [].concat($scope.treatmentMasterData);
        });
        $scope.fnOpenPolicy = function(arData) 
        {
            $scope.policyObj = arData;
            var templateFileName = '';
            if ($scope.policyObj.name == 'Financial policy') 
            {
                templateFileName = 'financialPolicy.html';
            }
            if ($scope.policyObj.name == 'Privacy policy') 
            {
                templateFileName = 'privacyPolicy.html';
            }
            if ($scope.policyObj.name == 'Treatment contract') 
            {
                templateFileName = 'treatmentContract.html';
            }
            var modalInstance = $uibModal.open(
            {
                templateUrl: 'view/policies/' + templateFileName,
                controller: 'policiesModalInstanceCtrl',
                size: 'lg',
                resolve: 
                {
                    policy: function() 
                    {
                        return $scope.policyObj;
                    }
                }
            });
        };
        $scope.fnAddPolicy = function(prName)
        {          
            $scope.lastPolicyData = {};
            if(prName == 'Financial')
            {
                $scope.lastPolicyData = $scope.financeMasterData[$scope.financeMasterData.length -1];
            }
            else if(prName == 'Privacy')
            {
                $scope.lastPolicyData = $scope.privacyMasterData[$scope.privacyMasterData.length -1];
            }
            else if(prName == 'Treatment')
            {
                $scope.lastPolicyData = $scope.treatmentMasterData[$scope.treatmentMasterData.length -1];
            }
            $scope.addPolicy = true;
        };
        $scope.fnSavePolicy = function(arData)
        {
            arData.createdAtDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            policiesService.policies('create').create({}, arData, function(data) 
            {
                if(data.data.name == 'Financial policy')
                {
                    $scope.financeMasterData.push(data.data);
                    $scope.bindPolicyDataInView($scope.financeMasterData, 'Financial'); 
                }
                else if(data.data.name == 'Privacy policy')
                {
                    $scope.privacyMasterData.push(data.data);
                    $scope.bindPolicyDataInView($scope.privacyMasterData, 'Privacy'); 
                }
                else if(data.data.name == 'Treatment contract')
                {
                    $scope.treatmentMasterData.push(data.data);
                    $scope.bindPolicyDataInView($scope.treatmentMasterData, 'Treatment'); 
                }
                $scope.addPolicy = false;
            });
        };
        $scope.fnCancelPolicy = function()
        {
            $scope.addPolicy = false;
        };
        $scope.editorConfig = {
            sanitize: false,
            toolbar: [
            { name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', '-'] },
            { name: 'paragraph', items: ['orderedList', 'unorderedList', '-'] },
            { name: 'doers', items: ['removeFormatting', '-'] },
            { name: 'colors', items: ['fontColor', 'backgroundColor', '-'] },
            { name: 'links', items: ['image', 'link', '-'] },
            { name: 'styling', items: ['font', 'size'] },
            ]
        };
        $scope.bindPolicyDataInView = function(arData, prName)
        {
            if(prName == 'Financial')
            {
                $scope.financeMasterData = [];
                arData.forEach(function(val, idx) 
                {
                    $scope.financeMasterData.push(val);
                });
                $scope.displayFinanceCollection = [].concat($scope.financeMasterData);
            }
            else if(prName == 'Privacy')
            {
                $scope.privacyMasterData = [];
                arData.forEach(function(val, idx) 
                {
                    $scope.privacyMasterData.push(val);
                });
                $scope.displayPrivacyCollection = [].concat($scope.privacyMasterData);
            }
            else if(prName == 'Treatment')
            {
                $scope.treatmentMasterData = [];
                arData.forEach(function(val, idx) 
                {
                    $scope.treatmentMasterData.push(val);
                });
                $scope.displayTreatmentCollection = [].concat($scope.treatmentMasterData);
            }
        };
    }
]);

angular.module('myApp').service("policiesService", ['$resource', '$http',
    function($resource, $http) {
        var factory = {};
        factory.policies = function(queryType) {
            var policyRESTUri = apiResourceUrl + "policiesMaster";
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'delete') {
                policyRESTUri += '/:id';
            }
            return $resource(policyRESTUri, {}, {
                query: {
                    method: 'GET'
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

angular.module('myApp').controller('policiesModalInstanceCtrl', ['$scope', 'policy', '$uibModal', function($scope, policy, $uibModal) {
    $scope.policyobj = policy;
    $scope.ok = function(data) {
        //$modalInstance.close($scope.selected.item);
        if (data.policyName == 'Financial policy') {
            if (data.paymentoption != null && data.signature != null && data.printname != null && data.signdate != null) {
                $scope.$close(data);
            }
        } else {
            if (data.signature != null && data.printname != null && data.signdate != null) {
                $scope.$close(data);
            }
        }
    };
    $scope.clearall = function(data) {
        data.paymentoption = null;
        data.signature = null;
        data.printname = null;
        data.signdate = null;
    };
    $scope.cancel = function(data) {
        $scope.$close(data);
    };
}]);