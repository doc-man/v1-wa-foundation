'use strict';
angular.module('myApp').controller("helpdeskMasterCtrl", ['$scope', '$rootScope','$state', '$stateParams', 'helpService','$timeout', '$filter', '$cookies',  'FileUploader',
    function($scope, $rootScope,$state, $stateParams, helpService, $timeout, $filter, $cookies , FileUploader)
    {
        $scope.nameToShowInBreadcrumb = "Help desk master";
        $scope.itemsByPage = 25;
        $scope.errorOccurred = false;
        $scope.paginationInfo = {};
        $scope.isLoading = false;
        $scope.rowCollection = [];
        $scope.tableStateInfo = {};
        $scope.previousTableStateInfo = {};
        $scope.CustomTableStatus = false;
        $scope.workspace = $scope.currentWorkspaceDetails;
        $scope.clientTimeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
        $scope.visibleColumns = {
            requestId: true,
            title: true,
            user: true,
            type: true,
            assignedTo: true,
            created: true,
            status: true,
            priority: true,


            totalColspan: 10
        };
        $scope.filterDataSet = {
            requestIdFilterOpen: false,
            titleFilterOpen: false,
            userFilterOpen: false,
            typeFilterOpen: false,
            assignedToFilterOpen: false,
            createdFilterOpen: false,
            statusFilterOpen: false,
            priorityFilterOpen: false,
            filtersOpen:false
        };

        $scope.allSummaryReportFieldList = [
            {name: 'Request Id'},
            {name: 'Title'},
            {name: 'User'},
            {name: 'TypesubmitTypeForm'},
            {name: 'Assigned To'},
            {name: 'Status'},
            {name: 'Created'},
            {name: 'Created (Month)'},
            {name: 'Created (Year)'},
        ];
        $scope.refreshStatus = true;

        $scope.query = {};
        $scope.customSettings = {
            control: 'brightness',
            theme: 'bootstrap',
            position: 'top left'
        };

        $scope.loggedInUser = $cookies.getObject("loginObj");
        $scope.loggedInUserId = $scope.loggedInUser.accesskey;

        $scope.newHelpdesk = {};

        $scope.msgForCreate = '';
        $scope.msgForError = '';

        $scope.allRequestIdList = {};
        $scope.selectedRequestIdList = {};

        $scope.allTitleList = {};
        $scope.selectedTitleList = {};

        $scope.allUserList = {};
        $scope.selectedUserList = {};

        $scope.allTypeList = {};
        $scope.selectedTypeList = {};

        $scope.allAssignedToList = {};
        $scope.selectedAssignedToList = {};

        $scope.allStatusList = {};
        $scope.selectedStatusList = {};

        $scope.allPriorityList = {};
        $scope.selectedPriorityList = {};

        helpService.helpDeskReport('getHelpdeskMasterData').getHelpdeskMasterData({loggedInUserId: $scope.loggedInUserId},function(data) {
            $scope.allRequestIdList = data.requestId;
            $scope.allTitleList = data.title;
            $scope.allUserList = data.user;
            $scope.allTypeList = data.type;
            $scope.allAssignedToList = data.assignedTo;
            $scope.allStatusList = data.status;
            $scope.allPriorityList = data.priority;
        });

        if(!_.isUndefined($scope.promotedCustomReportID)){
            $scope.workspace = {};
            $scope.workspace.id = $scope.promotedCustomReportID;
            $scope.workspace.type = 'helpDeskReport';
            $scope.workspace.searchFlag = true;
        }

        $scope.callServer = function(tableState) {
            if($scope.workspace.type=='helpDeskReport' && $scope.workspace.searchFlag==true && $scope.CustomTableStatus==false)
            {
                $scope.CustomTableStatus = true;

                helpService.helpDeskReport('getCustomReportDetails').getCustomReportDetails(
                    {
                        reportId: $scope.workspace.id
                    },
                    function(data) {
                        tableState.search = _.extend({},data.data.user_custom_state[0].tableStateInfo.search);
                        tableState.sort = _.extend({},data.data.user_custom_state[0].tableStateInfo.sort);
                        tableState.pagination.number = data.data.user_custom_state[0].tableStateInfo.pagination.number;
                        $scope.itemsByPage = data.data.user_custom_state[0].tableStateInfo.pagination.number;
                        $scope.visibleColumns = data.data.user_custom_state[1].visibleColumns;
                        $scope.prevVisibleColumns = $scope.visibleColumns;
                        $scope.filterDataSet = _.extend({},data.data.user_custom_state[2].filterDataSet);
                        $scope.displayAllSearchSelectedValue(tableState.search);
                        $scope.previousTableStateInfo = angular.copy(tableState);
                        $scope.getReportData(tableState);
                    });
                $scope.updateAccessDetails($scope.workspace.id);
            }
            else if($scope.workspace.requestComingFrom=='userNotification' && $scope.CustomTableStatus==false){
                $scope.CustomTableStatus = true;

                $scope.filterDataSet.assignedToFilterOpen =  true;
                $scope.filterDataSet.filtersOpen = true;
                $scope.filterDataSet.statusFilterOpen = true;
                var customPrediacateObject = {
                    "predicateObject": {
                        "assignedTo": [
                            {"name": $scope.loggedInUser.fullname, "id": $scope.loggedInUser.accesskey}
                        ],
                        "status": [
                            {"id": "1", "name": "Open"},
                            {"id": "3", "name": "On hold"},
                            {"id": "4", "name": "Assigned"}
                        ]
                    }
                };
                tableState.search = customPrediacateObject;
                $scope.displayAllSearchSelectedValue(customPrediacateObject);
                $scope.getReportData(tableState);
            }
            else
            {
                if($scope.refreshStatus == true)
                {
                    if(!angular.equals(tableState,$scope.previousTableStateInfo) || $scope.filterDataSet.filtersOpen == false)
                    {
                        $scope.getReportData(tableState);
                    }
                }
                else
                {
                    $scope.refreshStatus = true;
                }
            }
        };
        $scope.gotoDetailPage = function(reportId){
            $state.go("home.helpdeskdetail",{helpdeskTicketId:reportId});
        };
        $scope.getReportData = function(tableState)
        {
            if(!_.isUndefined(tableState.search.predicateObject))
            {
                if(!_.isUndefined(tableState.search.predicateObject.created))
                {
                    if(!_.isUndefined(tableState.search.predicateObject.created.after))
                        tableState.search.predicateObject.created.after = tableState.search.predicateObject.created.after.toString();
                    if(!_.isUndefined(tableState.search.predicateObject.created.before))
                        tableState.search.predicateObject.created.before = tableState.search.predicateObject.created.before.toString();
                }
            }
            $scope.isLoading = true;
            if(_.isUndefined(tableState.pagination.number)) {
                tableState.pagination.number = $scope.itemsByPage || 25;
            };
            var objToPass = {
                tableState : tableState,
                loggedInUserId: $scope.loggedInUserId
            };

            helpService.helpDeskReport('getData').getData(objToPass, function(reportData) {
                $scope.rowCollection = reportData.data;
                $scope.executedSqlQuery = reportData.executedSqlQuery;
                $scope.numberOfPages = reportData.numberOfPages;

                $scope.rowCollection.forEach(function(item, index) {
                    var starttime = item.eventStartTimeStampUnix * 1000;
                    $scope.rowCollection[index].eventStartTimeStampUnix = starttime;
                });

                tableState.pagination.totalItemCount = reportData.totalData;
                tableState.pagination.numberOfPages = reportData.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
                $scope.tableStateInfo = tableState;
                $scope.previousTableStateInfo = angular.copy(tableState);
                $scope.previousTableStateInfo.pagination.currentItemCount = reportData.data.length;
                $scope.paginationInfo = tableState.pagination;
                $scope.paginationInfo.currentItemCount = reportData.data.length;
                $scope.reportLastUpdatedAt = reportData.lastUpdatedAt;

                if($scope.itemsByPage!=25 && $scope.itemsByPage !=50 && $scope.itemsByPage!=100 && $scope.itemsByPage!=200)
                    $scope.itemsByPage = reportData.totalData + 1;
                $scope.getHeaderHeightForScroll();
            });
        }
        $scope.displayAllSearchSelectedValue = function(searchObj)
        {
            angular.forEach(searchObj.predicateObject, function(item, key){
                if(key=='requestId')
                    $scope.selectedRequestIdList= item;
                if(key=='title')
                    $scope.selectedTitleList = item;
                if(key=='user')
                    $scope.selectedUserList = item;
                if(key=='type')
                    $scope.selectedTypeList = item;
                if(key=='assignedTo')
                    $scope.selectedAssignedToList = item;
                if(key=='created')
                {
                    if(!_.isUndefined(item.after))
                        $scope.query.createdAfter = new Date(item.after);
                    if(!_.isUndefined(item.before))
                        $scope.query.createdBefore = new Date(item.before);
                }
                if(key=='status')
                    $scope.selectedStatusList = item;
                if(key=='priority')
                    $scope.selectedPriorityList = item;

            });
        }

        $scope.removeSelectedValueWhenCloseFilter = function(key)
        {
            if(key=='requestId')
                $scope.selectedRequestIdList= [];
            if(key=='title')
                $scope.selectedTitleList = [];
            if(key=='user')
                $scope.selectedUserList = [];
            if(key=='type')
                $scope.selectedTypeList = [];
            if(key=='assignedTo')
                $scope.selectedAssignedToList = [];
            if(key=='created')
            {
                $scope.query.createdAfter = ""
                $scope.query.createdBefore = "";
            }
            if(key=='status')
                $scope.selectedStatusList = [];
        }

        $scope.open = function($event,filterPredicate){
            var filterPredicateName = filterPredicate;
            filterPredicate = filterPredicate + "FilterOpen";
            var flgFilterClosed;
            var iteration = 0;

            flgFilterClosed = !$scope.filterDataSet[filterPredicate];
            $scope.filterDataSet[filterPredicate] = flgFilterClosed;
            if(!($scope.filterDataSet.filtersOpen===true && flgFilterClosed===true)){
                angular.forEach($scope.filterDataSet,function(item,index){
                    if(iteration==0)
                        $scope.filterDataSet.filtersOpen = item ;
                    else
                        $scope.filterDataSet.filtersOpen = $scope.filterDataSet.filtersOpen || item ;

                    iteration++;
                });
            }

            $event.preventDefault();
            $event.stopPropagation();
            var isCallServerCalled = false;
            if(!flgFilterClosed)
            {
                if(!(angular.isUndefined($scope.tableStateInfo.search.predicateObject)))
                {
                    if(!_.isEmpty($scope.tableStateInfo.search.predicateObject[filterPredicateName]))
                    {
                        isCallServerCalled = true;
                    }
                    if(!(angular.isUndefined($scope.tableStateInfo.search.predicateObject)))
                        delete $scope.tableStateInfo.search.predicateObject[filterPredicateName];
                }
                if(isCallServerCalled)
                    $scope.callServer($scope.tableStateInfo);
                if($scope.workspace.type=='helpdeskReport')
                    $scope.removeSelectedValueWhenCloseFilter(filterPredicateName);
            }
            else
            {
                if (filterPredicateName=='requestId' || filterPredicateName=='title' || filterPredicateName=='user' || filterPredicateName=='type' || filterPredicateName=='assignedTo' || filterPredicateName=='status')
                {
                    if(_.isUndefined($scope.tableStateInfo.search.predicateObject))
                        $scope.tableStateInfo.search['predicateObject'] = {};
                    $scope.tableStateInfo.search.predicateObject[filterPredicateName] = [];
                    $scope.previousTableStateInfo = angular.copy($scope.tableStateInfo);
                }
            }
            $scope.getHeaderHeightForScroll();
        }
        $scope.visibleColumnsChanged = function(modelval,modelname){
            if(modelval){
                $scope.visibleColumns.totalColspan +=1;
            }
            else{
                $scope.visibleColumns.totalColspan -=1;
            }
        }



        if(_.isUndefined($scope.workspace)){
            $scope.workspace = {};
        }
        $scope.workspace.promoted = false;
        var allData = {};
        allData.uid = $scope.loggedInUserId;
        allData.reportName = 'Helpdesk Report';
        allData.reportType = 'helpdesk';
        var dbTableType = 'Custom Reports';
        $scope.$on('checkingForPromoteOrDemote',function(){
            $scope.timeOut = function() {
                $timeout(function () {
                    if(!_.isUndefined($scope.returnDataCheck) && $scope.returnDataCheck != null) {
                        $scope.checkingPromoteData = $scope.returnDataCheck.data;
                        if($scope.checkingPromoteData != null){
                            $scope.checkingPromoteData.forEach(function(data){
                                if (data.customReportID == $scope.workspace.id) {
                                    $scope.workspace.promoted = true;
                                } else { $scope.workspace.promote = false; }
                            });
                        } else { $scope.workspace.promote = false; }
                    } else { $scope.timeOut(); }
                }, 100);
            };
            $scope.timeOut();
        });
        $scope.showReportInHomePage(allData, dbTableType, 'checkForPromote');
        $scope.promoteForHome = function(showStatus, customReportID){
            if(showStatus == 'promote'){
                $scope.workspace.promote = !$scope.workspace.promote;
            }else if(showStatus == 'demote'){
                $scope.workspace.promote = !$scope.workspace.promote;
            }
            var allData = {};
            allData.uid = $scope.loggedInUserId;
            allData.customReportID = customReportID;
            allData.reportName = 'Helpdesk report';
            allData.reportType = 'helpdesk';
            var dbTableType = 'Custom Reports';
            $scope.showReportInHomePage(allData, dbTableType, showStatus);
        };









        //----------Modal---------------
        $scope.saveReport = false;
        $scope.updateReport = false;
        $scope.deleteReport = false;
        $scope.saveCurrentFilter = function(){
            $scope.reportNameObject = "";
            $("#helpdeskReportSaveModal_"+$scope.workspace.type+$scope.workspace.id).modal();
        };
        $scope.saveCurrentFilterInDatabase = function(reportName){
            $scope.reportName = reportName.trim();
            if(_.isUndefined(reportName) || reportName.trim()=="")
            {
                return "";
            }
            else
            {
                $("#helpdeskReportSaveModal_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                var objCondFormatSetting = null;
                if(!_.isUndefined($scope.objCondFormatSetting)){
                    objCondFormatSetting = $scope.objCondFormatSetting;
                }
                helpService.helpDeskReport('saveCurrentFilter').saveCurrentFilter(
                    {
                        tableStateInfo: $scope.tableStateInfo,
                        visibleColumns: $scope.visibleColumns,
                        filterDataSet: $scope.filterDataSet,
                        loggedInUserId: $scope.loggedInUserId,
                        newReportName: reportName.trim(),
                        clientTimeZone: $scope.clientTimeZone,
                        clientDateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    function(data) {
                        if(data.returnStatus==0){
                            $("#helpdeskReportSaveError_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportSaveError_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==1){
                            $("#helpdeskReportSaveSuccess_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportSaveSuccess_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==2){
                            $("#helpdeskReportExist_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportExist_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                    });
            }
        };
        $scope.updateCurrentFilter = function(reportName){
            var objCondFormatSetting = null;
            if(!_.isUndefined($scope.objCondFormatSetting)){
                objCondFormatSetting = $scope.objCondFormatSetting;
            }
            helpService.helpDeskReport('updateCurrentFilter').updateCurrentFilter(
                {
                    tableStateInfo: $scope.tableStateInfo,
                    visibleColumns: $scope.visibleColumns,
                    filterDataSet: $scope.filterDataSet,
                    loggedInUserId: $scope.loggedInUserId,
                    customReportId: $scope.workspace.id
                },
                function(data) {
                    $scope.reportName = $scope.workspace.actualName;
                    if(data.returnStatus==0){
                        //$scope.updateReport = false;
                        $("#helpdeskReportUpdateError_"+$scope.workspace.type+$scope.workspace.id).modal();
                        var timer = $timeout(function()
                        {
                            $("#helpdeskReportUpdateError_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                            $scope.reportName = "";
                            $timeout.cancel(timer);
                        }, 2000);
                    }
                    else if(data.returnStatus==1){
                        //$scope.updateReport = false;
                        $("#helpdeskReportUpdateSuccess_"+$scope.workspace.type+$scope.workspace.id).modal();
                        var timer = $timeout(function()
                        {
                            $("#helpdeskReportUpdateSuccess_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                            $scope.reportName = "";
                            $timeout.cancel(timer);
                        }, 2000);
                    }
                });
        };
        $scope.deleteCurrentFilter = function(){
            $scope.reportName = $scope.workspace.actualName;
            $("#helpdeskReportDelete_"+$scope.workspace.type+$scope.workspace.id).modal();
        };
        $scope.deleteCurrentFilterfromDatabase = function(event){
            $("#helpdeskReportDelete_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
            helpService.helpDeskReport('deleteCurrentFilter').deleteCurrentFilter(
                {
                    customReportId: $scope.workspace.id
                },
                function(data) {
                    if(data.returnStatus==0){
                        //$scope.updateReport = false;
                        $("#helpdeskReportDeleteError_"+$scope.workspace.type+$scope.workspace.id).modal();
                        var timer = $timeout(function()
                        {
                            $("#helpdeskReportDeleteError_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                            $timeout.cancel(timer);
                        }, 2000);
                    }
                    else if(data.returnStatus==1){
                        //$scope.updateReport = false;
                        $("#helpdeskReportDeleteSuccess_"+$scope.workspace.type+$scope.workspace.id).modal();
                        var timer = $timeout(function()
                        {
                            $("#helpdeskReportDeleteSuccess_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                            var timer1 = $timeout(function()
                            {

                                $scope.workspaceTabObj.removeWorkSpace(event,$scope.workspace);
                                $timeout.cancel(timer1);
                            }, 400);
                            $timeout.cancel(timer);
                        }, 2000);

                    }
                });
        };
        $scope.renameCurrentCustomReport = function()
        {
            $scope.reportName = $scope.workspace.actualName;
            $scope.reportNameObject = $scope.workspace.actualName;
            //$scope.reportNameObject = "";
            $("#helpdeskReportRename_"+$scope.workspace.type+$scope.workspace.id).modal();
        }
        $scope.renameCurrentCustomReportToDatabase = function(reportName){
            $scope.reportName = reportName.trim();
            if(_.isUndefined(reportName) || reportName.trim()=="")
            {
                return "";
            }
            else
            {
                $("#helpdeskReportRename_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                helpService.helpDeskReport('renameCurrentFilter').renameCurrentFilter(
                    {
                        newReportName: reportName.trim(),
                        sectionId: 3,
                        customReportId: $scope.workspace.id
                    },
                    function(data) {
                        if(data.returnStatus==0){
                            $("#helpdeskReportRenameError_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportRenameError_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==1){
                            $("#helpdeskReportRenameSuccess_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportRenameSuccess_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.workspaceTabObj.workspaces.forEach(function(obj,key){
                                    if(obj.id== $scope.workspace.id && obj.type == "helpdeskReport" && obj.stateName == "home.helpdeskReport")
                                    {
                                        $scope.workspaceTabObj.workspaces[key].name = $scope.reportName+ " ("+$scope.workspace.reportName+")";
                                        $scope.workspaceTabObj.workspaces[key].title = $scope.reportName+ " ("+$scope.workspace.reportName+")";
                                        $scope.workspaceTabObj.workspaces[key].actualName = $scope.reportName;
                                        $rootScope.pageSubTitle = $scope.reportName+ " ("+$scope.workspace.reportName+")";
                                        $rootScope.workspaceTabObj.fnSaveCurrentWorkspace();
                                    }
                                });
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==2){
                            $("#helpdeskReportRenameExist_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#helpdeskReportRenameExist_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                    });
            }
        };
        $scope.developerTools = function()
        {
            $("#developerToolsModal_"+$scope.workspace.type+$scope.workspace.id).modal();
        }


        $scope.createSummaryReport = function()
        {
            $("#summaryRepoprtModal_"+$scope.workspace.type+$scope.workspace.id).modal();
        }
        $scope.saveNewSummaryReport = function(summaryReportName)
        {
            if(_.isUndefined($scope.selectedSummaryReportField) || $scope.selectedSummaryReportField.length < 1 || _.isUndefined(summaryReportName))
            {
                return "";
            }
            else
            {
                $("#summaryRepoprtModal_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                $scope.reportName = summaryReportName.trim();
                helpService.helpDeskReport('saveSummaryReport').saveSummaryReport(
                    {
                        selectedSummaryReportField: $scope.selectedSummaryReportField,
                        summaryReportName: summaryReportName.trim(),
                        customReportId: $scope.workspace.id,
                        loggedInUserId: $scope.loggedInUserId,
                        clientTimeZone: $scope.clientTimeZone,
                        clientDateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    function(data) {
                        if(data.returnStatus==0){
                            $("#summaryRepoprtModalError_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#summaryRepoprtModalError_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $scope.colSummaryReport = "";
                                $scope.rowSummaryReport = "";
                                $scope.cellValue = "";
                                $scope.summaryReportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==1){
                            $("#summaryRepoprtModalSuccess_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#summaryRepoprtModalSuccess_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $scope.colSummaryReport = "";
                                $scope.rowSummaryReport = "";
                                $scope.cellValue = "";
                                $scope.summaryReportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                        else if(data.returnStatus==2){
                            $("#summaryRepoprtModalExist_"+$scope.workspace.type+$scope.workspace.id).modal();
                            var timer = $timeout(function()
                            {
                                $("#summaryRepoprtModalExist_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
                                $scope.reportName = "";
                                $scope.summaryReportName = "";
                                $timeout.cancel(timer);
                            }, 2000);
                        }
                    });
            }
        }
        $scope.displaySummaryReport = function()
        {
            $scope.activitySummaryReportList = [];
            $scope.customReportName = $scope.workspace.actualName;
            helpService.helpDeskReport('getSummaryReportList').getSummaryReportList(
                {
                    customReportId: $scope.workspace.id
                },
                function(data) {
                    $scope.activitySummaryReportList = data.data
                    $("#summaryRepoprtExistingListModal_"+$scope.workspace.type+$scope.workspace.id).modal();
                });
        }
        $scope.displaySelectedSummaryReport = function(name,id)
        {
            $("#summaryRepoprtExistingListModal_"+$scope.workspace.type+$scope.workspace.id).modal('hide');
            var dataObj = {
                id: id,
                type: "activitySummaryReport",
                stateName: "home.activitySummaryReport",
                name: name+" (Activity summary report)",
                actualName: name,
                reportName: "Activity summary report",
                title: name+" (Activity summary report)"
            }
            $scope.$state.go('home.activitySummaryReport');
            $scope.onItemSelect(dataObj);

        }
        $scope.updateAccessDetails = function(reportId)
        {
            helpService.helpDeskReport('saveCustomReportAccessDetails').saveCustomReportAccessDetails(
                {
                    id: reportId,
                    clientTimeZone: $scope.clientTimeZone,
                    clientDateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                },
                function(data) {
                    console.info("Custom Helpdesk Report access details successfully saved.");
                });
        }

        $scope.headerHeight = {
            stop:32,
            offset:32
        }
        $scope.getHeaderHeightForScroll = function(){
            $timeout(function(){
                $scope.headerHeight.offset = $('#filterHeader').height();
            },0);
        };

        $scope.socketFlag = true;
        var vrChannelId = 's22-c-u0';
        vrGlobalSocket.on(vrChannelId, function (data) {
            $scope.$apply(function () {
                $scope.callServer($scope.tableStateInfo);
            });
        });



        var localDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.submitForm = function(newHelpdesk) {
            if ($scope.localTimeZoneName=='Time)' || $scope.localTimeZoneName=='' || $scope.localTimeZoneName==null){
                $scope.localTimeZoneName = '(PST)';
            };


            helpService.helpDeskReport('sendTicket').sendTicket({
                    title : newHelpdesk.title,
                    description : newHelpdesk.description,
                    userId : $scope.loggedInUserId,
                    typeId : newHelpdesk.type,
                    assignedId: 0,
                    statusId: 1,
                    created_at: localDateTime,
                    createdTimeZone: $scope.localTimeZoneName,
                    priority : newHelpdesk.priority


                },
                function(data) {
                    if(data){
                        $("#createTicket").modal('hide');
                        //$scope.userDataSet.unshift(data.ticketData); //unshift push
                        //$scope.bindTable($scope.userDataSet);
                        $scope.callServer($scope.tableStateInfo);
                        $scope.msgForCreate = 'New help request created successfully.';
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);
                    }
                });
        };

        $scope.submitTypeForm = function(newHelptype) {



            helpService.helpDeskReport('sendType').sendType(
                {
                    typeName : angular.lowercase(newHelptype.title),
                },
                function(data) {

                    if(data.data==null){
                        $("#createType").modal('hide');
                        $scope.msgForError = 'The type name already exist.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{
                        $("#createType").modal('hide');
                        $scope.msgForCreate = 'The type is created successfully.';
                        $scope.userDataSetType.unshift(data.data); //unshift push
                        $scope.bindType($scope.userDataSetType);
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);
                    }


                });



        };
        $scope.submitTypeResponseForm = function(newTypeResponse) {



            helpService.helpDeskReport('sendTypeResponse').sendTypeResponse(
                {
                    preTypeText : angular.lowercase(newTypeResponse.typetext),
                    originalText : angular.lowercase(newTypeResponse.originaltext),
                },
                function(data) {

                    if(data.data==null){
                        $("#createTypeResponse").modal('hide');
                        $scope.msgForError = 'The pre-typed text already exist.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{
                        $("#createTypeResponse").modal('hide');
                        $scope.msgForCreate = 'The pre-typed text is created successfully.';
                        $scope.userDataSetPreType.unshift(data.data); //unshift push
                        $scope.bindPreType($scope.userDataSetPreType);
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);
                    }


                });



        };

        $scope.submitStatusForm = function(newHelpstatus) {

            helpService.helpDeskReport('sendStatus').sendStatus(
                {
                    statusName : angular.lowercase(newHelpstatus.title),
                    statusColor : newHelpstatus.color,
                },
                function(data) {

                    if(data.data==null){
                        $("#createStatus").modal('hide');
                        $scope.msgForError = 'The status name already exist.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{
                        $("#createStatus").modal('hide');
                        $scope.msgForCreate = 'The status is created successfully.';
                        $scope.userDataSetStatus.unshift(data.data); //unshift push
                        $scope.bindStatus($scope.userDataSetStatus);

                        helpService.helpDeskReport('allHelpStatus').allHelpStatus(function(data) {

                            var arData = data.data;
                            $scope.bindStatus(arData);

                        });


                        $scope.bindStatus = function(dataSrc) {
                            $scope.userDataSetStatus = [];
                            dataSrc.forEach(function(obj, idx) {
                                $scope.userDataSetStatus.push(obj);
                            });
                            $rootScope.availableOptions1 = [].concat($scope.userDataSetStatus);

                        };

                        $timeout(function(){$scope.msgForCreate = ''}, 3000);

                    }
                });
        };

        $scope.deleteType = function(id){

            helpService.helpDeskReport('deleteType').deleteType(
                {
                    id : id
                },
                function(data) {

                    if(data.result!=1){
                        $scope.msgForError = 'Please try after some time.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{
                        var index= -1;
                        var typeArray = eval($scope.userDataSetType);
                        for( var i = 0; i < typeArray.length; i++ ) {
                            if( typeArray[i].id === id ) {
                                index = i;
                                break;
                            }
                        }
                        if( index === -1 ) {
                            alert( "Something gone wrong" );
                        }
                        $scope.userDataSetType.splice( index, 1 );

                        $scope.msgForCreate = 'Type deleted successfully.';
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);
                    }
                });


        };


        $scope.deletePreTypeText = function(id){

            helpService.helpDeskReport('deletePreTypeText').deletePreTypeText(
                {
                    id : id
                },
                function(data) {

                    if(data.result!=1){
                        $scope.msgForError = 'Please try after some time.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{
                        var index= -1;
                        var typeArray = eval($scope.userDataSetPreType);
                        for( var i = 0; i < typeArray.length; i++ ) {
                            if( typeArray[i].id === id ) {
                                index = i;
                                break;
                            }
                        }
                        if( index === -1 ) {
                            alert( "Something gone wrong" );
                        }
                        $scope.userDataSetPreType.splice( index, 1 );

                        $scope.msgForCreate = 'Pre-type text deleted successfully.';
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);
                    }
                });


        };

        $scope.deleteStatus = function(id){

            helpService.helpDeskReport('deleteStatus').deleteStatus(
                {
                    id : id
                },
                function(data) {

                    if(data.result!=1){
                        $scope.msgForError = 'Please try after some time.';
                        $timeout(function(){$scope.msgForError = ''}, 3000);
                    }
                    else{

                        var index= -1;
                        var statusArray = eval($scope.userDataSetStatus);
                        for( var i = 0; i < statusArray.length; i++ ) {
                            if( statusArray[i].id === id ) {
                                index = i;
                                break;
                            }
                        }
                        if( index === -1 ) {
                            alert( "Something gone wrong" );
                        }
                        $scope.userDataSetStatus.splice( index, 1 );

                        $scope.msgForCreate = 'Type deleted successfully.';
                        $timeout(function(){$scope.msgForCreate = ''}, 3000);


                    }
                });

        };

        $scope.show = function() {
            $scope.newHelpdesk = {};
            helpService.helpDeskReport('truncateHelpdeskTempDoc').truncateHelpdeskTempDoc({
                loggedInUserId: $scope.loggedInUserId
            },function(data) {
                $scope.uploader.clearQueue();
                $("#createTicket").modal();
            });


        };

        $scope.createType = function() {
            $("#createType").modal();
        };

        $scope.createTypeResponse = function() {
            $("#createTypeResponse").modal();
        };
        $scope.createStatus = function() {
            $("#createStatus").modal();
        };

        /*helpService.helpDeskReport('allHelpPriority').allHelpPriority(function(data) {
            var arData= data.data;
            $scope.userDataSetType = [];
            arData.forEach(function(obj, idx)
            {
                $scope.userDataSetType.push(obj);

            });
            $scope.availableOptions3 = [].concat($scope.userDataSetType);


        });*/




        helpService.helpDeskReport('getHelpdeskDefaultUser').getHelpdeskDefaultUser(function (data) {
                $scope.defaultUser = data.defaultUser.name;
                $scope.feedbackDefaultUser = data.coordinator.name;
            });

        $scope.updateDefaultUser = function (arBio, index, newData, fieldVal) {
            if (_.isUndefined(newData)) {
                $scope.showAddressMessagePanel('Field can not be blank', 'alert-warning');
                return false;
            }
            var data = {};
                data = {
                    'data': newData,
                    'type': fieldVal
                }

            helpService.helpDeskReport('updateDefaultUser').updateDefaultUser(
                data, function (data) {
                    $scope.isOpen = false;
                    $scope.isOpenForFeedbackUser = false;
                    //$scope.defaultUser = data.data.name;


                    helpService.helpDeskReport('getHelpdeskDefaultUser').getHelpdeskDefaultUser(function (data) {
                        $scope.defaultUser = data.defaultUser.name;
                        $scope.feedbackDefaultUser = data.coordinator.name;
                    });


                    $scope.msgForCreate1 = 'Updated successfully.';
                    $timeout(function () {
                        $scope.msgForCreate1 = ''
                    }, 3000);
                });
        }

        helpService.helpDeskReport('allHelpDoctor').allHelpDoctor(
            {
                id: $stateParams.helpdeskTicketId
            }, function (data) {


                var arData = data.data;
                $scope.userDataSetDoctor = [];
                arData.forEach(function (obj, idx) {
                    $scope.userDataSetDoctor.push(obj);

                });
                $scope.availableOptions2 = [].concat($scope.userDataSetDoctor);


            });

        helpService.helpDeskReport('allHelpType').allHelpType(function(data) {


            var arData = data.data;
            $scope.bindType(arData);

        });


        $scope.bindType = function(dataSrc) {
            $scope.userDataSetType = [];
            dataSrc.forEach(function(obj, idx) {
                $scope.userDataSetType.push(obj);
            });
            $rootScope.availableOptions = [].concat($scope.userDataSetType);


        };



        helpService.helpDeskReport('allPreType').allPreType(function(data) {


            var arData = data.data;
            $scope.bindPreType(arData);

        });


        $scope.bindPreType = function(dataSrc) {
            $scope.userDataSetPreType = [];
            dataSrc.forEach(function(obj, idx) {
                $scope.userDataSetPreType.push(obj);
            });
            $rootScope.availableOptions4 = [].concat($scope.userDataSetPreType);
        };



        helpService.helpDeskReport('allHelpStatus').allHelpStatus(function(data) {

            var arData = data.data;
            $scope.bindStatus(arData);

        });


        $scope.bindStatus = function(dataSrc) {
            $scope.userDataSetStatus = [];
            dataSrc.forEach(function(obj, idx) {
                $scope.userDataSetStatus.push(obj);
            });
            $rootScope.availableOptions1 = [].concat($scope.userDataSetStatus);

        };

        $scope.isOpen = false;
        $scope.isOpenForFeedbackUser = false;

        $scope.changeOpenState = function (state) {
            $scope.isOpen = state;

        }
        $scope.changeOpenStateForFeedbackUser = function (state) {
            $scope.isOpenForFeedbackUser = state;

        }


    }
])

    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
angular.module('myApp').service("helpService", ['$resource',
    function($resource) {
        var factory = {};

        factory.helpDeskReport = function(queryType) {
            var queryType = arguments[0] || '';
            var helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'helpDeskLogReport';

            if (queryType == 'query') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'helpDeskLogReport';
            } else if (queryType == 'show') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'helpDeskLogReport/:id';
            } else if (queryType == 'update') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'helpDeskLogReport/:id';
            } else if (queryType == 'remove') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'helpDeskLogReport/:id';
            } else if (queryType == 'getData') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'gethelpDeskReport';
            } else if (queryType == 'getHelpdeskMasterData') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getHelpdeskMasterData';
            } else if (queryType == 'saveCurrentFilter') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'saveHelpDeskReportCurrentFilter';
            } else if (queryType == 'getCustomReportDetails') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getCustomHelpDeskReportDetails';
            } else if (queryType == 'updateCurrentFilter') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'updateHelpDeskReportCurrentFilter';
            } else if (queryType == 'deleteCurrentFilter') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'deleteHelpDeskReportCurrentFilter';
            } else if (queryType == 'renameCurrentFilter') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'renameHelpDeskReportCurrentFilter';
            } else if (queryType == 'saveCustomReportAccessDetails') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'saveCustomHelpDeskReportAccessDetails/:id';
            } else if (queryType == 'saveSummaryReport') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'saveHelpDeskSummaryReport';
            } else if (queryType == 'getSummaryReportList') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getHelpDeskSummaryReportList';
            } else if (queryType == 'allHelpTicket') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getallHelpTicket/';
            }
            else if (queryType == 'allHelpType') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getallHelpType/';
            }
            else if (queryType == 'allPreType') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getallPreType/';
            }
            else if (queryType == 'sendTicket') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'postNewTicket/';
            }
            else if (queryType == 'helpDeskDetail') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getHelpDeskDetail/';
            }
            else if (queryType == 'sendType') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'postNewType/';
            }
            else if (queryType == 'sendTypeResponse') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'postNewTypeResponse/';
            }
            else if (queryType == 'sendStatus') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'postNewStatus/';
            }
            else if (queryType == 'allHelpStatus') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getallHelpStatus/';
            }
            else if (queryType == 'allHelpDoctor') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getallHelpDoctor/';
            }
            else if (queryType == 'sendComment') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'postNewComment/';
            }
            else if (queryType == 'create') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'updateTicketData/';
            }
            else if (queryType == 'deleteType') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'deleteType/';
            }
            else if (queryType == 'deletePreTypeText') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'deletePreTypeText/';
            }
            else if (queryType == 'deleteStatus') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'deleteStatus/';
            }
            else if (queryType == 'createSaveComment') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'createSaveComment/';
            }
            else if (queryType == 'allHelpPriority') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'allHelpPriority/';
            }
            else if (queryType == 'truncateHelpdeskTempDoc') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'truncateHelpdeskTempDoc/';
            }
            else if (queryType == 'getHelpdeskDefaultUser') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'getHelpdeskDefaultUser';
            }
            else if (queryType == 'updateDefaultUser') {
                helpDeskReportRESTUri = apiHelpdeskResourceUrl + 'updateDefaultUser/';
            }

            return $resource(helpDeskReportRESTUri, {}, {
                query: {
                    method: 'GET'
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
                refreshReport: {
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
                getData: {
                    method: 'POST',
                },
                createSaveComment: {
                    method: 'POST',
                },
                getHelpdeskMasterData: {
                    method: 'POST',
                },
                allHelpPriority: {
                    method: 'POST',
                },
                saveCurrentFilter: {
                    method: 'POST',
                },
                getCustomReportDetails: {
                    method: 'GET',
                },
                updateCurrentFilter: {
                    method: 'POST',
                },
                deleteCurrentFilter: {
                    method: 'POST',
                },
                truncateHelpdeskTempDoc: {
                    method: 'POST',
                },
                renameCurrentFilter: {
                    method: 'POST',
                },
                saveCustomReportAccessDetails: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                },
                saveSummaryReport: {
                    method: 'POST'
                },
                getSummaryReportList: {
                    method: 'GET'
                },
                allHelpType:{
                    method: 'GET',
                    //isArray: true
                },
                allPreType:{
                    method: 'GET',
                    //isArray: true
                },
                sendTicket:{
                    method: 'POST',
                },
                helpDeskDetail:{
                    method: 'POST',
                },
                sendType:{
                    method: 'POST',
                },
                sendTypeResponse:{
                    method: 'POST',
                },
                sendStatus:{
                    method: 'POST',
                },
                allHelpStatus:{
                    method: 'GET',
                },
                allHelpDoctor:{
                    method: 'POST',
                },
                sendComment:{
                    method: 'POST',
                },
                deleteType:{
                    method: 'POST',
                },
                deletePreTypeText:{
                    method: 'POST',
                },
                deleteStatus:{
                    method: 'POST',
                },
                getHelpdeskDefaultUser:{
                    method: 'GET',
                },
                updateDefaultUser:{
                    method: 'POST',
                }
            });
        };

        return factory;
    }
]);
