'use strict';
angular.module('myApp').controller("cptCodesRatesMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'cptCodesRatesService', 'cptCodesMasterService',
    function($scope, $state, $stateParams, $timeout, cptCodesRatesService, cptCodesMasterService) 
    {
        $scope.nameToShowInBreadcrumb = "CPT codes rates";
        $scope.masterData = {};  
        $scope.masterData.messageVal = '';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        cptCodesMasterService.cptCodes('query').query({}, function(data) 
            {
                if(data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';    
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                //$scope.all_cpp_codes = data; 
                $scope.all_cpt_codes = [];
                data.forEach(function(role, idx) {                  
                    var newColumn = {
                        field: role.id,         
                        displayName: role.name,
                        displayDescription: role.description,
                    }
                    $scope.all_cpt_codes.push(newColumn);
                });                                              
            });
        
        if (!$scope.cptCodesRatesDataSet) 
        {
            $scope.cptCodesRatesDataSet = [];
            cptCodesRatesService.cptCodesRates('query').query({}, function(data) 
            {
                if(data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';    
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.cptCodesRatesDataSet = data; 
                $scope.displayCptCodesRatesListCollection =[].concat($scope.cptCodesRatesDataSet);
            });
        } 
        else 
        {
            $scope.displayCptCodesRatesListCollection =[].concat($scope.cptCodesRatesDataSet);
        }       
        $scope.fnSaveCptCodesRates = function(arData,$master,$child) 
        {                                                                                                 
            if(arData.rateid === "")
            {                                                              
                cptCodesRatesService.cptCodesRates('create').create({}, arData, function(data) 
                {                                                            
                    $scope.showPannelMessageBoard('Rate Successfully Updated', 'alert-success');
                      $scope.displayCptCodesRatesListCollection[$master].all_amounts[$child].rateid =  data.data.id;
                    
                });
            }
            else
            {                              
                cptCodesRatesService.cptCodesRates('update').update(
                {
                    id: arData.rateid
                }, arData, function()
                {
                    $scope.showPannelMessageBoard('Rate Successfully Updated', 'alert-success');
                });  
            }
        }
         
        $scope.bindCptCodesRatesInView = function(arData) 
        {        
            $scope.cptCodesRatesDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.cptCodesRatesDataSet.push(obj);
            }); 
            $scope.displayCptCodesRatesListCollection = [].concat($scope.cptCodesRatesDataSet);
            if($scope.cptCodesRatesDataSet.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';    
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
        };
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {                     
            var objSocketData = JSON.parse(data);                  
            if(objSocketData.action == 'updateCptCodesRates') 
            {                                                                    
                console.info('Cpt codes contract rates updated by socket');
                $scope.$apply(function () 
                {                    
                    // var obj = _.findWhere($scope.cptCodesRatesDataSet, 
                    // {
                    //     id: objSocketData.dataSet.rateid
                    // });
                    // var idx = $scope.cptCodesRatesDataSet.indexOf(obj);
                    // $scope.cptCodesRatesDataSet[idx] = objSocketData.dataSet;



                    $scope.cptCodesRatesDataSet.forEach(function(objData, index) 
                    {
                        var obj1 = _.findWhere(objData.all_amounts, 
                        {
                        rateid: parseInt(objSocketData.dataSet.rateid)
                        });
                        if(obj1!=undefined){
                            obj1.amount = parseFloat(objSocketData.dataSet.amount);
                            obj1.avgOfLast10Appts = parseFloat(objSocketData.dataSet.avgOfLast10Appts);
                        }
                    }); 
                });   
                $scope.updatedCptCodesData = $scope.cptCodesRatesDataSet;
                $scope.bindCptCodesRatesInView($scope.updatedCptCodesData);
            } 
        });
    }   
]);
angular.module('myApp').service("cptCodesRatesService", ['$resource',
    function($resource) {
        var factory = {};
        factory.cptCodesRates = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'cptCodesRates';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'cptCodesRates/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'cptCodesRates/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'cptCodesRates/:id';
            }
            return $resource(hsRESTUri, {}, {
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
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        return factory;
    }
]);