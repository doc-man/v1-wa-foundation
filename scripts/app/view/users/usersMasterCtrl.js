'use strict';
angular.module('myApp').controller("usersMasterCtrl", ['$scope', '$http', 'usersMasterService','userServices', '$timeout', '$interval', '$filter',
    function($scope, $http, usersMasterService, userServices, $timeout, $interval, $filter) {
        $scope.nameToShowInBreadcrumb = "Users";
        //$scope = $scope.$parent;
        if (!_.isUndefined($scope.masterdbObj)) {
            if ($scope.masterdbObj.allowedToMasterDB == 'No') {
                $scope.masterdbObj.showNextLevel = false;
            }
        }
        $scope.forAddNewUser = false;
        $scope.roleList = [];
        $scope.masterData.messageVal = '';
        $scope.itemsByPage = 25;
        //$scope.paginationInfo = {};
        if (!$scope.userDataSet) {
            $scope.userDataSet = [];
            $scope.masterData.userRolelistDataSet = [];
            usersMasterService.user('query').query({id: $scope.loginObj.companyID}, function (data) {
                if (data.data.length == 0) {
                    $scope.masterData.messageVal = 'Nothing found';
                }
                else {
                    $scope.masterData.messageVal = '';
                }
                $scope.userDataSet = data.data;

                var newContent = $scope.fnViewSiteWideHelpData(data.siteWideHelpData);
                data.siteWideHelpData.context = newContent;
                $scope.siteWideHelpData[data.siteWideHelpData.helpID] = data.siteWideHelpData;


                $scope.masterData.userRolelistDataSet = data.roleTypes;
                $scope.displayUsersCollection = [].concat($scope.userRoleDataSet);
                /* For Pagignation */
                $scope.paginationInfo = {};
                $scope.paginationInfo.totalItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil($scope.paginationInfo.currentItemCount / $scope.itemsByPage);
            });
        }

        //sitewideHelpIcon

        $scope.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];

        $scope.activityLogIcon = false;

        $scope.fnShowSiteWideHelpData = function (helpID) {
            $scope.siteWideHelpData[helpID].isVissible = !$scope.siteWideHelpData[helpID].isVissible;
            $scope.activityLogIcon = !$scope.activityLogIcon;

        };
        $scope.fnEditSiteWideHelpData = function (helpID) {
            $scope.siteWideHelpData[helpID].editable = !$scope.siteWideHelpData[helpID].editable;

            /*
             Q) Why we need this  var careTeamTabObj = _.findWhere($scope.panelObj.panels,  ?
             A) For 1 reason:
             *  1. To get individual panel from userCtrl.js and assigning isHelpEditorOpen a flag .
             *
             * Added by: Arjunk on 20Jan 2016.
             */

            var careTeamTabObj = _.findWhere($scope.panelObj.panels,
                {
                    pluginName: "careTeam"
                });

            var idx = $scope.panelObj.panels.indexOf(careTeamTabObj);

            careTeamTabObj.isHelpEditorOpen = true;
            $scope.panelObj.panels.splice(idx, 1, careTeamTabObj);

        };

        /*
         Q) Why we need this  $scope.$on('isHelpEditorOpen-2',function() function  ?
         A) For 1 reason:
         *  1. To catch the id brodcaste from sectionCtrl.js to change status of isHelpEditorOpen .
         *
         * Added by: Arjunk on 20Jan 2016.
         */

        $scope.$on('isHelpEditorOpen-2', function () {

            var careTeamTabObj = _.findWhere($scope.panelObj.panels,
                {
                    pluginName: "careTeam"
                });

            var idx = $scope.panelObj.panels.indexOf(careTeamTabObj);

            careTeamTabObj.isHelpEditorOpen = false;
            $scope.panelObj.panels.splice(idx, 1, careTeamTabObj);
            // console.info($scope.panelObj.panels);
        });


        //siteWideHelpIcon

        $scope.status = {};
        $scope.status.isOpen = false;
        $scope.opencal = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            if (!$scope.status.isOpen) {
                $scope.status.isOpen = true;
            }
            else {
                $scope.status.isOpen = false;
            }
        };
        $scope.fnDeleteUser = function (rowObj) {
            var r = confirm("Do you really want to remove user '" + rowObj.fullName + "' from database?");
            if (r) {
                var currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                usersMasterService.user('delete').remove(
                    {
                        id: rowObj.id,
                        deletedByUID: $scope.loggedInUserId, //Needed value for store data in DB
                        deletedUID: rowObj.id, //Needed value for store data in DB
                        createdAt: currentDateTimeOfClient,
                        createdAtTimezone: timeZoneAbbreviationOfClient,
                        nameOfClient: 'MasterDB' //Needed value for store data in DB (use for activity log)
                    }, function (data) {
                        if (data.data == 'success') {
                            $scope.errorMessageShow = '';
                            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                            $scope.showPannelMessageBoard('Deleted', 'alert-success');
                        }
                        else {
                            $scope.showPannelMessageBoard('User cant\'t be deleted', 'alert-danger', 5000);
                            $scope.errorMessage = data.data.errorInfo[2];
                            $scope.errorMessageShow = 'failed';
                        }
                    });
            }
        };
        $scope.fnShowHideErrorDetail = function () {
            if ($scope.showErrorMessage) {
                $scope.showErrorMessage = false;
            }
            else {
                $scope.showErrorMessage = true;
            }
        };

        $scope.initDate = new Date(); //'2016-15-20'
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy/MM/dd'];
        $scope.format = $scope.formats[4];

        $scope.pageTitle = 'Add new user';
        //$scope.masterdbObj.levelType = "addedUserDetail";
        $scope.userObj = {};
        //$scope.loginObj = $cookieStore.get("loginObj");
        $scope.fnSaveUser = function (userData, prName, prData) {
            //console.log(userData); 
            if (prName == 'nameSuffix' && userData.nameSuffix == '') {
                $scope.showPannelMessageBoard('Suffix can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            if (prName == 'firstName' && userData.firstName == '') {
                $scope.showPannelMessageBoard('First name can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            if (prName == 'middleName' && userData.middleName == '') {
                $scope.showPannelMessageBoard('Middle name can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            if (prName == 'lastName' && userData.lastName == '') {
                $scope.showPannelMessageBoard('Last name can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            else if (prName == 'email' && userData.emailAddress == '') {
                $scope.showPannelMessageBoard('Email id can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            else if (prName == 'dob' && userData.dateOfBirth == '') {
                $scope.showPannelMessageBoard('Date of birth can\'t be blank', 'alert-danger', 3000);
                return '';
            }
            else if (prName == 'dob') {
                var d = new Date(prData);
                var dd = d.getDate();
                var mm = d.getMonth() + 1; //January is 0!
                var yyyy = d.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }

                if (_.isUndefined(dd) && _.isUndefined(mm) && _.isUndefined(yyyy)) {
                    return;
                }
                else {
                    userData.dateOfBirth = yyyy + '-' + mm + '-' + dd;
                }

            }
            else if (prName == 'allowedToLogin') {
                if (prData == 'Yes' && (userData.emailAddress == '' || userData.emailAddress == null)) {
                    $scope.showPannelMessageBoard('Please add a valid email id first.', 'alert-danger', 3000);
                    return '';
                }
                userData.allowedToLogin = prData;
            }
            else if (prName == 'allowedToMasterDB') {
                userData.allowedToMasterDB = prData;
            }
            else if (prName == 'isUserVisibleOnBookingSystem') {
                userData.isUserVisibleOnBookingSystem = prData;
            }
            else if (prName == 'temporaryDisableTFACurrentStatus') {
                userData.temporaryDisableTFACurrentStatus = prData;
            }
            else if (prName == 'emailValidate') {
                userData.emailValidate = prData;
            }
            else if (prName == 'newPassword') {
                if (userData.newPassword == '') {
                    $scope.showPannelMessageBoard('Password can\'t be blank', 'alert-danger', 3000);
                }
            }
            userData.fieldName = prName;
            userData.createdByUserId = $scope.loggedInUserId;
            userData.currentDateTimeOfClient = $scope.currentDateTimeOfClient;
            userData.timeZoneAbbreviationOfClient = $scope.timeZoneAbbreviationOfClient;
            userData.nameOfClient = 'MasterDB';
            usersMasterService.user('update').update(
                {
                    id: userData.id,
                }, userData, function (data) {
                    if (data.data == 'success') {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    }
                    else {
                        $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
                    }
                });
        };
        $scope.storeUser = function (userData) {
            $scope.status.disableAddUserButton = true;
            userData.companyID = $scope.loginObj.companyID;
            //userData.loggedInUserId = $scope.loginObj.accesskey;
            userData.loggedInUserId = $scope.loggedInUserId;
            userData.dateTimeForCreate = new Date();
            userData.timezoneAbbreviationForCreate = String(String(userData.dateTimeForCreate).split("(")[1]).split(")")[0];
            if (userData.dob) {
                $scope.fnValidateDate(userData.dob);
            }
            if (!userData.id) {
                usersMasterService.user('create').create({}, userData, function (data) {
                    $scope.masterData.newUserData = data.requestData;
                    $timeout(
                        function () {
                            if (data.data.flag == true) {
                                $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                                if (!_.isUndefined($scope.masterdbObj))
                                    $scope.masterdbObj.levelType = "addedUserDetail";

                                $scope.showPannelMessageBoard(data.data.msg, 'alert-success', 10000);
                                $scope.status.disableAddUserButton = false;
                            }
                            else if (data.data.flag == false) {
                                $scope.showPannelMessageBoard(data.data.msg, 'alert-danger', 3000);
                                $scope.status.disableAddUserButton = false;
                            }
                        },
                        1000
                    );
                    $scope.sameUser = false;
                });
            }
        };

        $scope.usersfullName = '';
        $scope.emailAddress = '';
        $scope.roleName = '';
        $scope.onChangeCountUsers = function (searchValue, countByType) {
            var searchValue = angular.lowercase(searchValue);
            var countFiles = 0;
            if (countByType == 'nameSuffix') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {nameSuffix: searchValue}).length;
            } else if (countByType == 'firstName') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {firstName: searchValue}).length;
            } else if (countByType == 'middleName') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {middleName: searchValue}).length;
            } else if (countByType == 'lastName') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {lastName: searchValue}).length;
            } else if (countByType == 'emailAddress') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {emailAddress: searchValue}).length;
            } else if (countByType == 'roleName') {
                $scope.paginationInfo.totalItemCount = $filter('filter')($scope.userDataSet, {roleName: searchValue}).length;
            }
        }


        $scope.adduser = function () {
            $scope.forAddNewUser = true;
            if (!_.isUndefined($scope.masterdbObj))
                $scope.masterdbObj.levelType = 'adduser';
        };
        $scope.userListing = function () {
            if (!_.isUndefined($scope.masterdbObj))
                $scope.masterdbObj.levelType = 'users';
        };
        $scope.bsDateToggle = function (dt) {
            if (dt.open) {
                dt.open = false;
            }
            else {
                dt.open = true;
            }
            ;
        };
        $scope.bindUsersInView = function (arData) {
            $scope.userDataSet = [];
            arData.forEach(function (obj, idx) {
                $scope.userDataSet.push(obj);
            });
            $scope.displayUsersCollection = [].concat($scope.userDataSet);
        };
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data) {
            var objSocketData = JSON.parse(data);
            if (objSocketData.action == 'userRemove') {
                console.info('User removed by socket');
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.userDataSet,
                        {
                            id: objSocketData.dataSet
                        });
                    var idx = $scope.userDataSet.indexOf(obj);
                    $scope.userDataSet.splice(idx, 1);
                    if ($scope.userDataSet.length == 0) {
                        $scope.masterData.messageVal = 'Nothing found!';
                    }
                });
            }
            else if (objSocketData.action == 'userAdd') {
                console.info('User added by socket');
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.userDataSet,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.userDataSet.indexOf(obj);
                    if (idx == -1) {
                        $scope.userDataSet.unshift(objSocketData.dataSet);
                    }
                });
            }
            else if (objSocketData.action == 'userUpdate') {
                console.info('User updated by socket');
                $scope.$apply(function () {
                    var obj = _.findWhere($scope.userDataSet,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.userDataSet.indexOf(obj);
                    $scope.userDataSet[idx] = objSocketData.dataSet;
                });
                $scope.updatedUserData = $scope.userDataSet;
                $scope.bindUsersInView($scope.updatedUserData);
            }
        });
        $scope.fnValidateDate = function (dob) {
            var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
            if (dob.match(dateformat)) {
                var pdate = dob.split('-');
                var dd = parseInt(pdate[0]);
                var mm = parseInt(pdate[1]);
                var yy = parseInt(pdate[2]);
                var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (mm == 1 || mm > 2) {
                    if (dd > ListofDays[mm - 1]) {
                        alert('Day is not valid, please correct it!');
                        $scope.status.disableAddUserButton = false;
                        return false;
                    }
                }
                if (mm == 2) {
                    var lyear = false;
                    if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                        lyear = true;
                    }
                    if ((lyear == false) && (dd >= 29)) {
                        alert('Day is not valid, please correct it!');
                        $scope.status.disableAddUserButton = false;
                        return false;
                    }
                    if ((lyear == true) && (dd > 29)) {
                        alert('Day is not valid, please correct it!');
                        $scope.status.disableAddUserButton = false;
                        return false;
                    }
                }
            }
            else {
                alert("Invalid date, please correct it!!");
                $scope.status.disableAddUserButton = false;
                return false;
            }
        };
        if (_.isUndefined($scope.masterdbObj)) {
            $scope.showPannelMessageBoard = function (message, classname, time) {
                if (_.isUndefined(time)) {
                    time = 1000;
                }
                $scope.msgObj = {};
                if (!$scope.msgObj.msg) $scope.msgObj.msg = {};
                $scope.msgObj.msg.text = message;
                $scope.msgObj.msg.mclass = classname;
                $scope.msgObj.msg.open = true;
                var timer = $timeout(function () {
                    $scope.msgObj.msg.open = false;
                    $timeout.cancel(timer);
                }, time);
            };
        }

        /**
         * Q) Why we need this function?
         * A) To show the activity log in a row
         * comment added by kiran
         * **/
        $scope.fnOpenActivityStreamForUsers = function (index, prUserId) {
            /** fina the obj through eventId from redFalgsData set **/
            var objApp = _.findWhere($scope.userDataSet, {
                id: prUserId
            });
            var idxApp = $scope.userDataSet.indexOf(objApp);
            if (idxApp != -1) {
                $scope.userDataSet.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.userDataSet[idx].activityLogIconForUsers = false;
                    }
                });
                $scope.userDataSet[idxApp].activityLogIconForUsers = !$scope.userDataSet[idxApp].activityLogIconForUsers;
                $scope.showUsersActivityLog = $scope.userDataSet[idxApp].activityLogIconForUsers;
            }
            if ($scope.showUsersActivityLog == false) {
                return false;
            }
            $scope.usersActivityLogData = []; //array()
            /** this userservice is used to get the data from activity log table **/
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: prUserId,
                    pluginId: '1',
                    typeOfSection: 'MasterDB',
                    sectionName: 'pluginPerRowMasterDb'
                },
                function (data) {
                    data.data.forEach(function (eachData) {
                        $scope.usersActivityLogData.push(eachData);
                    });
                    $scope.displayUsersActivityLog = [].concat($scope.usersActivityLogData);
                });
        };
    }
]);