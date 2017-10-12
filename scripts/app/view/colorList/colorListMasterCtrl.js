'use strict';
angular.module('myApp').controller("colorListMasterCtrl", ['$scope', 'colorCodeAssociatedWithUsersMasterService','$filter','$timeout',
    function($scope, colorCodeAssociatedWithUsersMasterService, $filter, $timeout)
    {
        $scope.nameToShowInBreadcrumb = "Color list";
        $scope.allUserList = [];
        $scope.allDoctorAssociatedList = [];
        $scope.msgObj = {msg:{open:false,text:"",mclass:""}};
        $scope.textColorCodeWhite = "#ffffff";
        $scope.textColorCodeBlack = "#000000";
        colorCodeAssociatedWithUsersMasterService.colorCodeAssociated().query({}, function(data)
        {
            data.allAvailableUsers.forEach(function(eachRow){
                $scope.allUserList.push({fullNameOfUser:eachRow.fullname,uidOfUser:eachRow.id});
            })
            data.usersWithColorCode.forEach(function(eachRow){
                if(eachRow.calendarEventBackGroundColorCode!=null || eachRow.calendarEventTextColorCode!=null) {
                    $scope.allDoctorAssociatedList.push({selectedUser:{fullNameOfUser:eachRow.fullname,uidOfUser:eachRow.id},colorCode:eachRow.calendarEventBackGroundColorCode,textColorCode:eachRow.calendarEventTextColorCode,isSaved:true});
                }
            });
            $scope.bindToView();

        });

        $scope.addNewRow = function(){
            var nowTime = Date.now() / 1000;
            $scope.allDoctorAssociatedList.push({selectedUser:null,colorCode:"",textColorCode:"",isSaved:false});
            $scope.bindToView();
        }

        $scope.bindToView = function() {
            $scope.displayedRowCollection = angular.copy($scope.allDoctorAssociatedList)
        }

        $scope.saveColorCode = function(row,idx) {
            if(row.selectedUser!=null) {
                colorCodeAssociatedWithUsersMasterService.colorCodeAssociated('update').update({id:row.selectedUser.uidOfUser,colorCode:row.colorCode,textColorCode:row.textColorCode}, function(data)
                {
                    if(data.status == "success") {
                        var newObj = {selectedUser:{fullNameOfUser:row.selectedUser.fullNameOfUser,uidOfUser:row.selectedUser.uidOfUser},colorCode:row.colorCode,textColorCode:row.textColorCode,isSaved:true};
                        $scope.msgObj.msg.text="Saved color code";
                        $scope.msgObj.msg.mclass = "alert-success";
                        $scope.msgObj.msg.open = true;
                        $scope.allDoctorAssociatedList.splice(idx,1,newObj);
                        $scope.bindToView();
                    }
                    else{
                        $scope.msgObj.msg.text=data.message;
                        $scope.msgObj.msg.mclass = "alert-danger";
                        $scope.msgObj.msg.open = true;
                    }

                    $timeout(function(){
                        $scope.msgObj.msg.open=false;
                        $scope.msgObj.msg.text="";
                        $scope.msgObj.msg.mclass = "";
                    },5000);

                })
            }
        }

        $scope.removeColorCode = function(row,idx) {
            if(row.selectedUser!=null) {
                colorCodeAssociatedWithUsersMasterService.colorCodeAssociated('update').update({id:row.selectedUser.uidOfUser,colorCode:null,textColorCode:null}, function(data)
                {
                    $scope.msgObj.msg.text="Removed color code";
                    $scope.msgObj.msg.mclass = "alert-success";
                    $scope.msgObj.msg.open = true;
                    $scope.allDoctorAssociatedList.splice(idx,1);
                    $scope.bindToView();
                    $timeout(function(){
                        $scope.msgObj.msg.open=false;
                        $scope.msgObj.msg.text="";
                        $scope.msgObj.msg.mclass = "";
                    },5000);
                })
            }
        }
    }
]);
angular.module('myApp').service("colorCodeAssociatedWithUsersMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.colorCodeAssociated = function(queryType) {
            var colorCodeAssociatedWithDoctorServiceRESTUri = apiResourceUrl + 'userListWithColorCode';
            var queryType = arguments[0] || '';
            if (queryType == 'update') {
                colorCodeAssociatedWithDoctorServiceRESTUri = apiResourceUrl+'updateUserColorCode/:id';
            }
            return $resource(colorCodeAssociatedWithDoctorServiceRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                }
            });
        };

        return factory;
    }
]);