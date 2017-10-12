'use strict';
angular.module('myApp').controller("profileImageManagementMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', '$filter','$window','profileImageManagement',
    function($scope, $state, $stateParams, $timeout, $filter,$window,profileImageManagement) {
        $scope.nameToShowInBreadcrumb = "Optimised Provider/DA profile image management";
        $scope.masterData = {};
        $scope.displayData = {};
        $scope.pannelMessage = null;
        $scope.optimise='userOptimisedProfileImages';
        $scope.profile='userProfileImages';
        $scope.notfoundImage='Not Found';
        if ($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }
        $scope.adprofileUrl=adProfileurl;


        profileImageManagement.getDoctorListImage('getDoctorListWithImage').getDoctorListWithImage({}, function (data) {
            $scope.rowCollection=data.doctorsImage;

            $scope.displayCollection = [].concat($scope.rowCollection);


        });




            $scope.uploadFile = function(filename,doctorId){
                var file = $scope[filename];
                if(file==null || file == '')
                {
                    angular.forEach($scope.rowCollection, function (value, key) {
                        $scope.rowCollection[key].msgStatus='';
                        $scope.rowCollection[key].msg='';
                        if (doctorId == value.doctorId) {
                            $scope.rowCollection[key].msgStatus='fail';
                            $scope.rowCollection[key].msg='Please select an image file';
                            $scope.isCheck = false;

                            $timeout(function () { $scope.isCheck = true; }, 3000);


                        }
                    });

                    //$scope.showPannelMessageBoard('Please select a image file', 'alert-danger', 3000);
                    return false;
                }
                if(file['type'].split('/')[0]!='image')
                {
                    angular.forEach($scope.rowCollection, function (value, key) {
                        $scope.rowCollection[key].msgStatus='';
                        $scope.rowCollection[key].msg='';
                        if (doctorId == value.doctorId) {
                            $scope.rowCollection[key].msgStatus='fail';
                            $scope.rowCollection[key].msg='Only image file will be accepted';
                            $scope.isCheck = false;

                            $timeout(function () { $scope.isCheck = true; }, 3000);


                        }
                    });
                    //$scope.showPannelMessageBoard('Only image file will be accepted', 'alert-danger',3000);
                    return false;
                }
                var timezone=String(String(new Date()).split("(")[1]).split(")")[0];
                var fd = new FormData();
                fd.append('file', file);
                fd.append('doctorId',doctorId);
                fd.append('timezone',timezone);
                profileImageManagement.getDoctorListImage('updateDoctorImage').updateDoctorImage(fd ,function (data) {
                    if(data.status=='success')
                    {


                        angular.forEach($scope.rowCollection, function (value, key) {
                            $scope.rowCollection[key].msgStatus='';
                            $scope.rowCollection[key].msg='';
                            if (doctorId == value.doctorId) {
                                $scope.rowCollection[key].msgStatus='Updated';
                                $scope.rowCollection[key].msg='Updated';
                                $scope.rowCollection[key].optimiseImageName=true;
                                $scope.isCheck = false;

                                $timeout(function () { $scope.isCheck = true; }, 3000);


                            }
                        });

                        //$scope.showPannelMessageBoard('Image Updated', 'alert-success');


                    }
                    if(data.status=='error')
                    {
                        angular.forEach($scope.rowCollection, function (value, key) {
                            $scope.rowCollection[key].msgStatus='';
                            $scope.rowCollection[key].msg='';
                            if (doctorId == value.doctorId) {
                                $scope.rowCollection[key].msgStatus='fail';
                                $scope.rowCollection[key].msg='Please try again';
                                $scope.isCheck = false;

                                $timeout(function () { $scope.isCheck = true; }, 3000);


                            }
                        });
                       // $scope.showPannelMessageBoard('Please try again', 'alert-danger');
                    }
                });
            };




/*-------------------For Image Preview--------------------------*/
        $scope.imagePriviewStatus=false;
        $scope.setFile = function(element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function(event) {
                $scope.image_source = event.target.result
                $scope.imagePriviewStatus=true;
                $scope.$apply()

            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }
/*-------------------For Image Preview end--------------------------*/


    }
]);

angular.module('myApp').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model, modelSetter;

            attrs.$observe('fileModel', function(fileModel){
                model = $parse(attrs.fileModel);
                modelSetter = model.assign;
            });

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope.$parent, element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('myApp').service("profileImageManagement", ['$resource',
    function($resource) {

        var factory = {};

        factory.getDoctorListImage = function(queryType)
        {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl;

            if (queryType == 'getDoctorListWithImage') {
                hsRESTUri = apiResourceUrl + 'getDoctorListWithImage';
            }
            else if(queryType=="updateDoctorImage"){
                hsRESTUri = apiResourceUrl + 'updateDoctorImage/:id';
            }
            return $resource(hsRESTUri, {}, {
                getDoctorListWithImage: {
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                },
                updateDoctorImage: {
                    method: 'POST',
                    //params: {id: '@id'},
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            });
        };
        return factory;
    }
]);










