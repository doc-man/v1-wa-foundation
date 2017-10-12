'use strict';
angular.module('myApp').controller("contactTypesMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'contactTypesMasterService',
    function($scope, $state, $stateParams, $timeout, contactTypesMasterService) 
    {
        $scope.nameToShowInBreadcrumb = "Contact Types";
        $scope.itemsByPage = 25; 
        $scope.paginationInfo = {}; 
        $scope.masterData = {};
        $scope.masterData.messageVal = ''; 
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        $scope.fnLoadMasterContactTypesDataFromServer = function()
        {
            contactTypesMasterService.contactTypes('show').show({id: $scope.loggedInUserId},function(data) 
            {
                if(data.data.length==0)
                { 
                    $scope.masterData.messageVal ='Nothing found!';  
                }
                else
                {
                    $scope.contactTypesDataSet =  data.data;
                    $scope.displayContactTypesListCollection =[].concat($scope.contactTypesDataSet);           
                    /* For Pagignation */
                    $scope.paginationInfo.currentItemCount = data.data.length;
                    $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                    $scope.paginationInfo =  data.data; 
                    $scope.paginationInfo.totalItemCount = data.data.length;
                }
            });
        }
        $scope.fnAddContactType = function() 
        {           
            var dummyInfo = {
                name: null,
                id: null,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.contactTypesDataSet.unshift(dummyInfo);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        };       
        $scope.checkContactTypesName = function(rowObj, data, fieldname) {
            if(data === null) 
            {
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000)
                return "";
            }    
            else if (data === '' || data === 'undefined')
            {
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000)
                return "";
            } 
            else(data !== "")
            { 
                $scope.flgNameMatched = false;
                $scope.contactTypesDataSet.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = data;
                    if(obj.name != null)
                    {
                        $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    }
                    
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if(obj.id != rowObj.id && $scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgNameMatched = true; 
                    };

                });
                if( $scope.flgNameMatched == true ) 
                {               
                    $scope.showPannelMessageBoard('Contact type name already exist.', 'alert-danger', 3000); 
                    return "";        
                }
            } 
            
        };         
        $scope.fnSaveContactType = function(arData)
        {
            if(arData.id == null)
            {
                contactTypesMasterService.contactTypes('create').create({}, arData, function(data) 
                {
                    $scope.showPannelMessageBoard('Added', 'alert-success');
                });
            }
            else
            {
                contactTypesMasterService.contactTypes('update').update(
                {
                    id: arData.id
                }, arData, function()
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                });
            }
            
        };        
        $scope.fnDeleteContactType = function(rowObj) 
        {
            if(rowObj.id===null)
            {
                var obj = _.findWhere($scope.contactTypesDataSet, 
                {
                    uniqueId: rowObj.uniqueId
                });
                var idx = $scope.contactTypesDataSet.indexOf(obj);
                $scope.contactTypesDataSet.splice(idx,1);
                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
            }
            else
            {
               var r = confirm("Do you really want to remove this contact type from database?");
                if (r) 
                {
                    $scope.contactsList = [];
                    contactTypesMasterService.contactTypes('getContacts').getContacts({
                        id: rowObj.id
                    }, function(data) 
                    {
                        $scope.contactsList = data.data;
                        
                        if($scope.contactsList.length > 0)
                        {
                            $scope.showPannelMessageBoard('This contact type holds some contacts. So this contct type can not be deleted.', 'alert-danger', 4000);
                        }
                        else
                        {
                            contactTypesMasterService.contactTypes('remove').remove({
                            id: rowObj.id
                            }, function(data) 
                            {                                
                                $scope.showPannelMessageBoard('Deleted.', 'alert-success');
                            });
                        }
                    });
                } 
            }
                
        };        
        $scope.fnLoadMasterContactTypesDataFromServer();

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'contactTypeRemove') 
            {
                console.info('Contact Type removed by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.contactTypesDataSet, 
                    {
                        id: objSocketData.dataSet
                    });
                    var idx = $scope.contactTypesDataSet.indexOf(obj);
                    $scope.contactTypesDataSet.splice(idx, 1);
                    $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                    if($scope.contactTypesDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
            else if(objSocketData.action == 'contactTypeAdd') 
            {  
                console.info('Contact Type added by socket');
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.contactTypesDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.contactTypesDataSet.indexOf(obj);
                if(idx<0)
                {
                    $scope.contactTypesDataSet.unshift(objSocketData.dataSet);
                    $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    
                }
                else
                {
                    $scope.contactTypesDataSet.splice(idx, 1, objSocketData.dataSet);
                    $scope.bindcontactTypesInView($scope.contactTypesDataSet);
                } 
            }
            else if(objSocketData.action == 'contactTypeUpdate') 
            {
                console.info('Contact Type updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.contactTypesDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.contactTypesDataSet.indexOf(obj);
                    $scope.contactTypesDataSet[idx] = objSocketData.dataSet;
                    $scope.updatedcontactTypesData = $scope.contactTypesDataSet;
                    $scope.bindcontactTypesInView($scope.updatedcontactTypesData);
                });
            }
        });        
        $scope.bindcontactTypesInView = function(arData) 
        {
            $scope.contactTypesDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.contactTypesDataSet.push(obj);
            });
            $scope.displayContactTypesListCollection = [].concat($scope.contactTypesDataSet);
        };
    }
]);

angular.module('myApp').service("contactTypesMasterService", ['$resource',
    function($resource)
    {
        var factory = {};
        factory.contactTypes = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'contactTypes';
            if (queryType == 'show')
            {
                hsRESTUri = apiResourceUrl + 'contactTypes/:id';
            }
            else if (queryType == 'update')
            {
                hsRESTUri = apiResourceUrl + 'contactTypes/:id';
            }
            else if (queryType == 'remove')
            {
                hsRESTUri = apiResourceUrl + 'contactTypes/:id';
            }
            else if (queryType == 'getContacts')
            {
                hsRESTUri = apiResourceUrl + 'getContacts/:id';
            }
            return $resource(hsRESTUri, {},
                {
                    query:
                    {
                        method: 'GET',
                        isArray: true,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    create:
                    {
                        method: 'POST'
                    },
                    show:
                    {
                        method: 'GET',
                        isArray: false,
                        params:
                        {
                            id: '@id'
                        },
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    update:
                    {
                        method: 'PUT',
                        params:
                        {
                            id: '@id'
                        },
                    },
                    remove:
                    {
                        method: 'DELETE',
                        params:
                        {
                            id: '@id'
                        }
                    },
                    getContacts:
                    {
                        method: 'GET',
                        isArray: false,
                        params:
                        {
                            id: '@id'
                        }
                    }
                });
        };
        return factory;
    }
]);