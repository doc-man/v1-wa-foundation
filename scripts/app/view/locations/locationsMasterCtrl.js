'use strict';
angular.module('myApp').controller("locationsMasterCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'locationsMasterService',
    function($scope, $state, $stateParams, $timeout, locationsMasterService)
    {

        $scope.nameToShowInBreadcrumb = "Savant Care office locations and association with assets";
        $scope.msgObj = {open:false,mclass:'',text:''};
        $scope.savedOfficeLocations = [];
        $scope.displayedOfficeLocations = [];
        $scope.savedAssetsWithLocation = [];
        $scope.displayedAssetsWithLocation = [];

        $scope.fnAddOfficeLocation = function() {
            var objNewLocation = {locationID:null,locationName:null,streetAddress:null,streetAddressLine2:null,city:null,state:null,country:null,zipAddress:null,labelToShowOnRequestAppointmentPage:null};

            $scope.savedOfficeLocations.splice(0,0,objNewLocation);
            $scope.displayedOfficeLocations =[].concat($scope.savedOfficeLocations);
        }

        $scope.fnSaveLocation = function(location,index) {
            if(location.locationID == null) {
                locationsMasterService.locations('create').create(location,function(data)
                {
                    $scope.savedOfficeLocations.splice(index,1,data.data);
                    $scope.displayedOfficeLocations = angular.copy($scope.savedOfficeLocations);
                    $timeout(function(){
                        if(!$scope.msgObj.open) {
                            $scope.msgObj.open = true;
                            $scope.msgObj.mclass = 'alert-success';
                            $scope.msgObj.text = 'Location saved';
                            $timeout(function(){
                                if($scope.msgObj.open) {
                                    $scope.msgObj.open = false;
                                    $scope.msgObj.mclass = '';
                                    $scope.msgObj.text = '';
                                }
                            },5000)
                        }
                    },1000)
                });
            }
            else{
                $scope.fnUpdateLocation(location,'locationName');
            }
        }

        $scope.fnUpdateLocation = function(location,field,index) {
            locationsMasterService.locations('update').update({id:location.locationID,section:field,location:location},function(data)
            {
                $timeout(function(){
                    if(!$scope.msgObj.open) {
                        $scope.msgObj.open = true;
                        $scope.msgObj.mclass = 'alert-success';
                        $scope.msgObj.text = 'Location saved';
                        $timeout(function(){
                            if($scope.msgObj.open) {
                                $scope.msgObj.open = false;
                                $scope.msgObj.mclass = '';
                                $scope.msgObj.text = '';
                            }
                        },5000)
                    }
                },1000)
            });
        }

        $scope.fnDeleteLocation = function(location,index) {
            if(confirm("Are you sure to remove the office location?")) {
                locationsMasterService.locations('remove').remove({id:location.locationID},function(data)
                {

                    $scope.savedOfficeLocations.splice(index,1);
                    $scope.displayedOfficeLocations = angular.copy($scope.savedOfficeLocations);
                    $timeout(function(){
                        if(!$scope.msgObj.open) {
                            $scope.msgObj.open = true;
                            $scope.msgObj.mclass = 'alert-success';
                            $scope.msgObj.text = 'Location removed';
                            $timeout(function(){
                                if($scope.msgObj.open) {
                                    $scope.msgObj.open = false;
                                    $scope.msgObj.mclass = '';
                                    $scope.msgObj.text = '';
                                }
                            },5000)
                        }
                    },1000)
                });
            }
        }

        $scope.showLocationName = function(locationId) {
            if(locationId!=null) {
                var locationDetails = jQuery.grep($scope.savedOfficeLocations,function(e){return e.locationID == locationId});
                return locationDetails[0].locationName;
            }
            else {
                return 'Not set';
            }

        }

        $scope.fnRemoveAssociation
        $scope.fnAssignAssetToLocation = function(asset) {
            locationsMasterService.locations('assignLocation').assignLocation({id:asset.id,location:asset.locationID},function(data)
            {
                $timeout(function(){
                    if(!$scope.msgObj.open) {
                        $scope.msgObj.open = true;
                        $scope.msgObj.mclass = 'alert-success';
                        $scope.msgObj.text = 'Location saved for asset';
                        $timeout(function(){
                            if($scope.msgObj.open) {
                                $scope.msgObj.open = false;
                                $scope.msgObj.mclass = '';
                                $scope.msgObj.text = '';
                            }
                        },5000)
                    }
                },1000)
            });
        }

        $scope.fnRemoveAssociation = function(asset,index) {
            locationsMasterService.locations('assignLocation').assignLocation({id:asset.id,location:null},function(data)
            {
                $timeout(function(){
                    if(!$scope.msgObj.open) {
                        $scope.msgObj.open = true;
                        $scope.msgObj.mclass = 'alert-success';
                        $scope.msgObj.text = 'Location removed for asset';
                        var updatedAsset = asset;
                        updatedAsset.locationID = null;
                        $scope.savedAssetsWithLocation.splice(index,1,updatedAsset);
                        $scope.displayedAssetsWithLocation = [].concat($scope.savedAssetsWithLocation);

                        $timeout(function(){
                            if($scope.msgObj.open) {
                                $scope.msgObj.open = false;
                                $scope.msgObj.mclass = '';
                                $scope.msgObj.text = '';
                            }
                        },5000)
                    }
                },1000)
            });
        }

        locationsMasterService.locations('query').query(function(data)
        {
            if(data.data.length>0) {
                data.data.forEach(function(val){
                    $scope.savedOfficeLocations.push(val);
                })
            }
            $scope.displayedOfficeLocations = [].concat($scope.savedOfficeLocations);

        });

        locationsMasterService.locations('assetList').assetList(function(data)
        {
            if(data.data.length>0) {
                data.data.forEach(function(val){
                    $scope.savedAssetsWithLocation.push(val);
                })
            }
            $scope.displayedAssetsWithLocation = [].concat($scope.savedAssetsWithLocation);

        });
    }
]);
angular.module('myApp').service("locationsMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.locations = function(queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'locations';
            if (queryType == 'create') {
                hsRESTUri = apiResourceUrl + 'locations';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'locations/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'locations/:id';
            } else if (queryType == 'assetList') {
                hsRESTUri = apiResourceUrl + 'assetLocations';
            } else if (queryType == 'assignLocation') {
                hsRESTUri = apiResourceUrl + 'assetLocations/:id';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false
                },
                create: {
                    method: 'POST'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                assignLocation: {
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
                assetList: {
                    method: 'GET',
                    isArray: false
                },
            });
        };
        return factory;
    }
]);