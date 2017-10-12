'use strict';
angular.module('myApp').controller("cptCodesMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'cptCodesMasterService', '$cookieStore',
    function($scope, $state, $stateParams, $timeout, cptCodesMasterService, $cookieStore) 
    {
        $scope.nameToShowInBreadcrumb = "Cpt Codes";
        $scope.masterData = {};  
        $scope.masterData.messageVal = '';
        $scope.paginationInfo = {};
        //console.log($scope.loginObj); 
        $scope.docList = {};
        $scope.tableColumn = {};
        $scope.loginObj = $cookieStore.get("loginObj");

        if(($cookieStore.get("loginObj")).offset!=null)
        {
          var d = new Date();
          var n = d.getTimezoneOffset();
          $scope.tzOffset = parseInt(($cookieStore.get("loginObj")).offset) + n*60;
        }
        else 
        {
          $scope.tzOffset = null
        }
        
        if (!$scope.cptCodesDataSet) 
        {
            $scope.cptCodesDataSet = [];
            cptCodesMasterService.cptCodes('query').query({companyID: $scope.loginObj.companyID}, function(data) 
            {
                if(data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found';    
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.cptCodesDataSet = data; 
                $scope.displayCptCodesListCollection =[].concat($scope.cptCodesDataSet);
                
                /* For Pagignation */
                $scope.paginationInfo.currentItemCount = data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo =  data; 
                $scope.paginationInfo.totalItemCount = data.length;
            });
        } 
        else 
        {
            $scope.displayCptCodesListCollection =[].concat($scope.cptCodesDataSet);
        }
        $scope.fnDeleteCptCodes = function(arData) 
        {
            
            if(arData.id===null)
            {
                var obj = _.findWhere($scope.cptCodesDataSet, 
                {
                    uniqueId: arData.uniqueId
                });
                var idx = $scope.cptCodesDataSet.indexOf(obj);
                $scope.cptCodesDataSet.splice(idx,1);
                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
            }
            else
            {
                var r = confirm("Do you really want to remove this Cpt Code from database?");
                if (r) 
                {
                    cptCodesMasterService.cptCodes('remove').remove(
                    {
                        id: arData.id
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard('Cpt Code cant\'t be deleted', 'alert-danger', 3000);
                        }
                        else if(data.data == 'failed1')
                        {
                            $scope.showPannelMessageBoard('Cpt Code cant\'t be deleted. It\'s already in use.' , 'alert-danger', 3000);
                        }
                    });
                }
            }
        };
        $scope.fnAddCptCodes = function() 
        {
            var i = 1;
            var useCount = [];
            useCount[0]="--";
            $scope.docList.forEach(function(val,key){
                useCount[i] = "--";
                i++;
            });
            var cptCodes = {
                name: null,
                description: null,
                id: null,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime()),
                isCptCodeLocked: 'No',
                allowUserToLockFromCodingPanel: 'Yes',
                allowCustomCodesForCoding: 'No',
                companyID: $scope.loginObj.companyID,
                useCount: useCount
            }
            $scope.cptCodesDataSet.splice(0,0,cptCodes);
            $scope.displayCptCodesListCollection =[].concat($scope.cptCodesDataSet);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        };
        $scope.fnSaveCptCodes = function(arData, elemPos, field, value) 
        {
            var flag = $scope.checkCptCodes(arData, elemPos);
            if(flag){
                if(arData.id===null){
                    arData.createdBy = $scope.loggedInUserId;
                    cptCodesMasterService.cptCodes('create').create({}, arData, function(data)
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });
                }
                else
                {
                    if(field=='allowUserToLockFromCodingPanel')
                        arData.allowUserToLockFromCodingPanel = value;
                    if(field=='allowCustomCodesForCoding')
                        arData.allowCustomCodesForCoding = value;
                    arData.companyID= $scope.loginObj.companyID;
                    cptCodesMasterService.cptCodes('update').update(
                        {
                            id: arData.id
                        }, arData, function()
                        {
                            $scope.showPannelMessageBoard('Updated', 'alert-success');
                        });
                }
            }
            else{
                return "";
            }
        }
        $scope.fnLockOrUnlockCptCode = function(rowObj,lockStatus){
            cptCodesMasterService.cptCodes('fnSetCptCodeLockStatus').fnSetCptCodeLockStatus(
                {
                    id: rowObj.id,
                    isLocked: lockStatus,
                    companyID: $scope.loginObj.companyID
                }, function(data)
                {
                    if(data.data=='success'){
                        if(data.isCptCodeLocked=='Yes')
                            $scope.showPannelMessageBoard('Locked', 'alert-success');
                        if(data.isCptCodeLocked=='No')
                            $scope.showPannelMessageBoard('Unlocked', 'alert-success');
                    }

                });
        }
        $scope.checkCptCodes = function(rowObj, elemPos) {
            if(rowObj.id==null && (rowObj.name=="" || rowObj.name==null)){
                $scope.showPannelMessageBoard( 'Please add a Cpt Code First.', 'alert-danger', 3000)
                return false;
            }
            if(rowObj.name !== "" && rowObj.name !== null)
            {
                $scope.flgNameMached = false;
                $scope.cptCodesDataSet.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = rowObj.name;
                    if($scope.modifiedOldName === null) $scope.modifiedOldName = ""; 
                    $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if(obj != rowObj && $scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgNameMached = true; 
                    };

                }); 
                if( $scope.flgNameMached == true ) 
                {               
                    $scope.showPannelMessageBoard('Cpt code already exist.', 'alert-danger', 3000); 
                    return false;
                }
                return true;
            }     
            else
            {
                $scope.showPannelMessageBoard( 'Cpt code must not be blank.', 'alert-danger', 3000);
                $timeout(function() {
                   var objPanelBodyDiv = $("tbody");                                                               
                    objPanelBodyDiv.find('tr.ng-scope').eq(elemPos).find('a.editable-click').first().click();                      
                }, 50)
                return false;
            }
        };                
        cptCodesMasterService.cptCodes('getCompanyWiseDoctorList').getCompanyWiseDoctorList(
        {
            companyID: $scope.loginObj.companyID
        }, function(data)
        {
            $scope.docList = data.data; 
            $scope.tableColumn.total =7 + data.data.length;
            $scope.tableColumn.ceilVal = Math.ceil($scope.tableColumn.total/2);
            $scope.tableColumn.floorVal = Math.floor($scope.tableColumn.total/2);
        });
         
        $scope.bindCptCodesInView = function(arData) 
        {
            $scope.cptCodesDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.cptCodesDataSet.push(obj);
            }); 
            $scope.displayCptCodesListCollection = [].concat($scope.cptCodesDataSet);
            if($scope.cptCodesDataSet.length==0)
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
            if(objSocketData.action == 'addCptCodes') 
            {
                console.info('Cpt codes added by socket');
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.cptCodesDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.cptCodesDataSet.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.cptCodesDataSet.unshift(objSocketData.dataSet);
                        $scope.bindCptCodesInView($scope.cptCodesDataSet);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.cptCodesDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindCptCodesInView($scope.cptCodesDataSet);   
                    });
                }
            }
            else if(objSocketData.action == 'updateCptCodes' || objSocketData.action == 'lockCptCodes')
            {
                console.info('Cpt codes updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.cptCodesDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.cptCodesDataSet.indexOf(obj);
                    $scope.cptCodesDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedCptCodesData = $scope.cptCodesDataSet;
                $scope.bindCptCodesInView($scope.updatedCptCodesData);
            }
            else if(objSocketData.action == 'removeCptCodes')
            {
                console.info('Cpt codes removed by socket');
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.cptCodesDataSet,
                    {
                        id: parseInt(objSocketData.dataSet)
                    });
                    var idx = $scope.cptCodesDataSet.indexOf(obj);
                    $scope.cptCodesDataSet.splice(idx, 1);
                    if($scope.cptCodesDataSet.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });
            }
        }); 
    } 
]);

angular.module('myApp').service("cptCodesMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.cptCodes = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'cptCodes';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'cptCodes/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'cptCodes/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'cptCodes/:id';
            } else if (queryType == 'getCompanyWiseDoctorList') {
                hsRESTUri = apiResourceUrl + 'getCompanyWiseDoctorList/:companyID';
            } else if (queryType == 'fnSetCptCodeLockStatus') {
                hsRESTUri = apiResourceUrl + 'fnSetCptCodeLockStatus';
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
                getCompanyWiseDoctorList: {
                    method: 'GET',
                    params: {
                        companyID: '@companyID'
                    }
                },
                fnSetCptCodeLockStatus: {
                    method: 'POST'
                },
            });
        };
        return factory;
    }
]);