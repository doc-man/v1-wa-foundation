'use strict';
angular.module('myApp').controller("userRoleMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'userRoleMasterService', 'userServices', '$filter',
    function($scope, $state, $stateParams, $timeout, userRoleMasterService, userServices, $filter) 
    {
        $scope.nameToShowInBreadcrumb = "User roles";
        $scope.itemsByPage = 25;
        $scope.paginationInfo = {};
        $scope.masterData = [];
        $scope.masterData.messageVal ='';
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        if (!$scope.userRoleDataSet)
        {
            $scope.userRoleDataSet = [];
            userRoleMasterService.userRole('show').show({id: $scope.loggedInUserId }, function(data) 
            {
                if(data.data.length==0)
                {
                    $scope.masterData.messageVal ='Nothing found'; 
                }
                else
                {
                    $scope.masterData.messageVal ='';
                }
                $scope.userRoleDataSet = data.data;
                $scope.displayUserRoleCollection =[].concat($scope.userRoleDataSet);
                /* For Pagignation */
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                //$scope.paginationInfo =  data.data; 
                $scope.paginationInfo.totalItemCount = data.data.length;

                var newContent=$scope.fnViewSiteWideHelpData(data.siteWideHelpData);
                data.siteWideHelpData.context=newContent;
                $scope.siteWideHelpData[data.siteWideHelpData.helpID] = data.siteWideHelpData;

            });
        }
        $scope.fnChangeSecurityLevel = function(userRole, index)
        {
            var newSecurityLevel = userRole.securityLevel;
            var roleId = userRole.id;
            userRoleMasterService.userRole('updateSecurityLevel').updateSecurityLevel({newSecurityLevel: newSecurityLevel, roleId: roleId}, function(data){
                if(data.msg == 'success')
                {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                }
            });
        }

        $scope.fnDeleteUserRole = function(arData) 
        {
            if(arData.newlyAdded===true)
            {
                var obj = _.findWhere($scope.userRoleDataSet, 
                {
                    uniqueId: arData.uniqueId
                });
                var idx = $scope.userRoleDataSet.indexOf(obj);
                $scope.userRoleDataSet.splice(idx,1);
                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
            }
            else
            {
                var r = confirm("Do you really want to remove this User Role from database?");
                if (r) 
                {
                    userRoleMasterService.userRole('remove').remove(
                    {
                        id: arData.id,
                        clientSideName: 'MasterDB',
                        actDateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        actTimeZone: String(String(new Date()).split("(")[1]).split(")")[0],
                        loggedInUserId: $scope.loggedInUserId,
                        usersCount: arData.usersCount
                    }, function(data) 
                    {
                        if(data.data == 'success')
                        {
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else if(data.data == 'failed')
                        {
                            $scope.showPannelMessageBoard('This role can\'t be deleted' , 'alert-danger', 3000);
                        } 
                    });
                }
            }
        };


        //sitewideHelpIcon

        $scope.activityLogIcon = false;

        $scope.fnShowSiteWideHelpData = function(helpID)
        {
            $scope.siteWideHelpData[helpID].isVissible = !$scope.siteWideHelpData[helpID].isVissible;
            $scope.activityLogIcon = !$scope.activityLogIcon;

        };
        $scope.fnEditSiteWideHelpData = function(helpID, prAct)
        {
            if(prAct == 'edit') {
                $scope.siteWideHelpData[helpID].editable = !$scope.siteWideHelpData[helpID].editable;
            } else if(prAct == 'save') {
                $scope.siteWideHelpData[helpID].loggedInUserId = $scope.loggedInUserId;
                $scope.siteWideHelpData[helpID].actDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                userRoleMasterService.userRole('updatedHelp').updatedHelp({
                    id: helpID
                }, $scope.siteWideHelpData[helpID], function(data) {
                    $scope.showPannelMessageBoard('Updated', 'alert-success');
                    $scope.siteWideHelpData[helpID].context = data.siteWideHelpData.context;
                    $scope.siteWideHelpData[helpID].updated_at = data.siteWideHelpData.updated_at;
                    $scope.siteWideHelpData[helpID].firstNameofUser = data.siteWideHelpData.firstNameofUser;
                    $scope.siteWideHelpData[helpID].editable = !$scope.siteWideHelpData[helpID].editable;
                });
            }
        };

        /*
         Q) Why we need this  $scope.$on('isHelpEditorOpen-2',function() function  ?
         A) For 1 reason:
         *  1. To catch the id brodcaste from sectionCtrl.js to change status of isHelpEditorOpen .
         *
         * Added by: Arjunk on 03 feb 2016.
         */

        $scope.$on('isHelpEditorOpen-2',function(){

            var careTeamTabObj = _.findWhere($scope.panelObj.panels,
                {
                    pluginName: "careTeam"
                });

            var idx =  $scope.panelObj.panels.indexOf(careTeamTabObj);

            careTeamTabObj.isHelpEditorOpen = false;
            $scope.panelObj.panels.splice(idx,1,careTeamTabObj);
            // console.info($scope.panelObj.panels);
        });


        //siteWideHelpIcon


        $scope.fnAddUserRole = function() 
        {
            var userRole = 
            {
                id: null,
                name: '',
                loggedInUserId: $scope.loggedInUserId,
                newlyAdded: true,
                usersCount: 0,
                uniqueId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.userRoleDataSet.splice(0,0,userRole);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
            $scope.displayUserRoleCollection =[].concat($scope.userRoleDataSet);
            /*userRoleMasterService.userRole('create').create({}, userRole, function() 
            {
                $scope.showPannelMessageBoard('Added', 'alert-success');
                /*$timeout(
                  function() 
                  {
                    $('#userRole_grid').find('div[ui-grid-row]').eq(0).find('.ui-grid-cell').first().dblclick();
                  },
                   500
                 );*/
            /*});*/
        };

        $scope.fnSaveUserRole = function(arData, prFieldName)
        {
            //console.log(arData);
            if(arData.name != '' && arData.name != null)
            {
                arData.actFieldName = prFieldName;
                arData.clientSideName = 'MasterDB';
                arData.actDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                arData.actTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
                if(arData.newlyAdded===true){
                    // insert
                    userRoleMasterService.userRole('create').create({}, arData, function() 
                    {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });                    
                }
                else{
                    arData.loggedInUserId = $scope.loggedInUserId;
                    userRoleMasterService.userRole('update').update(
                    {
                        id: arData.id
                    }, arData, function()
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }
            
        };

        $scope.fnSaveUserRoleAccess = function(arData, prData)
        {
            if(arData.name != '' && arData.name != null)
            {
                if(arData.newlyAdded===true){

                }
                else{
                    if(arData.isAllowed!=prData) {
                        arData.actFieldName = 'Are users of this role available for booking';
                        arData.clientSideName = 'MasterDB';
                        arData.actDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        arData.actTimeZone = String(String(new Date()).split("(")[1]).split(")")[0];
                        arData.loggedInUserId = $scope.loggedInUserId;
                        arData.isAllowed = prData;
                        userRoleMasterService.userRole('update').update(
                            {
                                id: arData.id
                            }, arData, function()
                            {
                                $scope.showPannelMessageBoard('Updated', 'alert-success');

                            });
                    }

                }
            }

        }

        $scope.bindUserRolesInView = function(arData) 
        {
            $scope.userRoleDataSet = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.userRoleDataSet.push(obj);
            });
            $scope.displayUserRoleCollection = [].concat($scope.userRoleDataSet);
        };

        // ===--==-= Fetch cativity log data =-==--=== \\
        $scope.activityLogStreamToAct = function(index, rowID) {
            delete $scope.displayActivityLogForEvent;
            var objApp = _.findWhere($scope.displayUserRoleCollection, {
                id: rowID
            });
            var idxApp = $scope.displayUserRoleCollection.indexOf(objApp);
            if(idxApp != -1){
                $scope.displayUserRoleCollection.forEach(function(eachData,idx){
                    if(idx != idxApp){
                        $scope.displayUserRoleCollection[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.displayUserRoleCollection[idxApp].activityLogIconForEvent = !$scope.displayUserRoleCollection[idxApp].activityLogIconForEvent;
                $scope.showEventsActivityLogForEvent = $scope.displayUserRoleCollection[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            if($scope.showEventsActivityLogForEvent == false){
                return false;
            }
            userServices.activityLog('getActivityLog').getActivityLog({
                    id: rowID,
                    pluginId: 0,
                    sectionName: 'masterDbPlugin',
                    mbPluginName: 'userRole',
                    isDelete: 0
                },function(data){
                    data.data.forEach(function(eachData){
                        $scope.eventsActivityLogDataForEvent.push(eachData);
                    });
                    $scope.displayActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);
                });
        };
        $scope.enableDeleteActivityLogIcon = false;
        $scope.fnDeleteActivityLog = function()
        {
            $scope.enableDeleteActivityLogIcon = !$scope.enableDeleteActivityLogIcon;
            $scope.deleteActivityLogData = [];
            if($scope.enableDeleteActivityLogIcon == false){
                delete $scope.displayDeleteActivityLogCollection;
                return false;
            }
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'masterDbPlugin',
                    mbPluginName: 'userRole',
                    isDelete: 1
                },
                function (data) {
                    data.data.forEach(function(item, index){
                        $scope.deleteActivityLogData.push(item);
                    });
                    $scope.displayDeleteActivityLogCollection = [].concat($scope.deleteActivityLogData);
                });
        };

        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'userRoleRemove') 
            {
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.userRoleDataSet, 
                    {
                        id: parseInt(objSocketData.dataSet)
                    });
                    var idx = $scope.userRoleDataSet.indexOf(obj);
                    if(idx !=-1){
                        $scope.userRoleDataSet.splice(idx, 1);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                    }
                    if($scope.userRoleDataSet.length < 1 )
                    {
                        $scope.masterData.messageVal ='Nothing found';
                        $scope.showPannelMessageBoard('Nothing found', 'alert-success');
                    }
                });   
            }
            else if(objSocketData.action == 'userRoleAdd') 
            {
                console.info('User role added by socket');
                /*$scope.$apply(function () 
                {
                    $scope.userRoleDataSet.unshift(objSocketData.dataSet);
                });*/
                var uniqueId = objSocketData.dataSet.uniqueId;
                var obj = _.findWhere($scope.userRoleDataSet, 
                    {
                        uniqueId: uniqueId
                    });
                var idx = $scope.userRoleDataSet.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.userRoleDataSet.unshift(objSocketData.dataSet);
                        $scope.bindUserRolesInView($scope.userRoleDataSet);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.userRoleDataSet.splice(idx, 1, objSocketData.dataSet);
                        $scope.bindUserRolesInView($scope.userRoleDataSet);   
                    });
                }   
            }
            else if(objSocketData.action == 'userRoleUpdate') 
            {
                console.info('User role updated by socket');
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.userRoleDataSet, 
                    {
                        id: objSocketData.dataSet.id
                    }); 
                    var idx = $scope.userRoleDataSet.indexOf(obj);
                    $scope.userRoleDataSet[idx] = objSocketData.dataSet;
                });   
                $scope.updatedUserRoleData = $scope.userRoleDataSet;
                $scope.bindUserRolesInView($scope.updatedUserRoleData);
            }
            else if(objSocketData.action == 'updateSecurityLevel')
            {
                console.info('User security level updated by socket');
                console.log(objSocketData);
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.userRoleDataSet,
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.userRoleDataSet.indexOf(obj);
                    $scope.userRoleDataSet[idx] = objSocketData.dataSet;
                });
                $scope.updatedUserRoleData = $scope.userRoleDataSet;
                $scope.bindUserRolesInView($scope.updatedUserRoleData);
            }
        });
    }
]);


angular.module('myApp').service("userRoleMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.userRole = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'userRole';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'userRole/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'userRole/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'userRole/:id';
            } else if (queryType == 'updatedHelp') {
                hsRESTUri = apiResourceUrl + 'updateUserRoleHelpContent/:id';
            }else if (queryType == 'updateSecurityLevel') {
                hsRESTUri = apiResourceUrl + 'updateSecurityLevel';
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
                updatedHelp: {
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
                updateSecurityLevel: {
                    method: 'POST'
                },
            });
        };
        return factory;
    }
]);