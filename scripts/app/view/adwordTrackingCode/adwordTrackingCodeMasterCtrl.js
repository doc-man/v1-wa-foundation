'use strict';

angular.module('myApp').controller("adwordTrackingCodeMasterCtrl", ['$scope','$window','doctorsAliasNameService','$filter',
function($scope,$window,doctorsAliasNameService,filter){
    $scope.nameToShowInBreadcrumb = "Adword tracking code Management";

    $scope.confirmEdit=function(textBtnForm,status)
    {
        if(status==null || status=='') {
        var msg='Are you sure want to add?';
        }
        else {
            var msg='Are you sure want to edit?';
        }
        if($window.confirm(msg)) {
          return  textBtnForm.$show();
        } else {
            return false;
        }


    }



    doctorsAliasNameService.getAdwordCode('getDoctorAdwordCode').getDoctorAdwordCode({}, function (data) {

        $scope.rowCollection=data.Doctors;

       $scope.displayCollection = [].concat($scope.rowCollection);


    });



    $scope.fnUpdateAdwordCode = function(prData) {
       // console.log(prData);
       /* if(prData.alias == '' || prData.alias == null){
            $scope.showPannelMessageBoard('Please enter the alias name', 'alert-danger', 3000);
            return '';
        }*/
 //console.log($scope.loggedInUserId);
        var timezone=String(String(new Date()).split("(")[1]).split(")")[0];
        prData.timezone=timezone;
        prData.loggedInUserId=$scope.loggedInUserId;

        doctorsAliasNameService.getAdwordCode('updateDoctorAdwordCode').updateDoctorAdwordCode({id: prData.id},prData ,function (data) {

            if (data.data == 'success') {
                $scope.showPannelMessageBoard('Updated', 'alert-success');
            }
            else {
                $scope.showPannelMessageBoard(data.message, 'alert-danger', 3000);
            }
        });
    }




}
]);




