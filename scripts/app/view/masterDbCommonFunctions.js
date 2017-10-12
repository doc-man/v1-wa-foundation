'use strict';

angular.module('myApp').controller("masterDbParentCtrl", ['$scope', '$state','$cookies','$auth','$timeout','userServices',
    function($scope, $state, $cookies, $auth, $timeout, userServices)
    {
        $scope.masterData = {};
        $scope.masterdbObj = {};
        /**
         * Why we need token?
         * A) Token is a variable mixed with some content and login object cookies. Which pass through the api for secure connection.
         * $auth is the provider which convert the login object cookies into token.
         * if we not use this api callback will not work properly.
         * @type {*|string|options.token|{type, shorthand}}
         */
        if (_.isUndefined($cookies.getObject("loginObj")))
        {
            //console.log('token not found');
            $scope.loginObj = false;
        }
        else
        {
            var token = $cookies.getObject("loginObj").token;
            $scope.loginObj = $cookies.getObject("loginObj");
            $auth.setToken(token); //satelizer
            $scope.loggedInUserId = $scope.loginObj.accesskey;
            //console.log($scope.loginObj);
        }
        //var token = $cookies.getObject("loginObj").token;
        //$auth.setToken(token);
        /**
         *
         * @param message
         * @param classname
         * @param time
         */
        $scope.showPannelMessageBoard = function(message, classname, time)
        {
            if (_.isUndefined(time))
            {
                time = 1000;
            }
            $scope.msgObj = {};
            if (!$scope.msgObj.msg) $scope.msgObj.msg = {};
            $scope.msgObj.msg.text = message;
            $scope.msgObj.msg.mclass = classname;
            $scope.msgObj.msg.open = true;
            var timer = $timeout(function()
            {
                $scope.msgObj.msg.open = false;
                $timeout.cancel(timer);
            }, time);
        };
        $scope.siteWideHelpData = {};
        $scope.fnViewSiteWideHelpData = function(arData)
        {
            var patternToFindVideoInContent = /((https?:\/\/)?(www.)?youtube.com\/(\S+)=(\S+))/g;
            var result = arData.context.match(patternToFindVideoInContent);
            if(result != null)
            {
                var newContent =arData.context;
                angular.forEach(result, function(value, key) {
                    var youtubeTempIdWithGarbageArr = value.split("<");
                    var youtubeIdArr = youtubeTempIdWithGarbageArr[0].split("&");
                    var youtubeIdArr = youtubeIdArr[0].split("=");
                    var youtubeId = youtubeIdArr[1];
                    var youtubeEmbedUrl = "https://www.youtube.com/embed/"+youtubeId;
                    var boldQuestionInContent= '<iframe width="500" style="margin-left: 18px;" height="300" src="'+youtubeEmbedUrl+'" frameborder="0" allowfullscreen></iframe>';
                    //console.info(value);

                    newContent = newContent.replace(youtubeTempIdWithGarbageArr[0], boldQuestionInContent);
                });


            }
            else{
                var newContent = arData.context;
            }
            var patternToFindQuestionInContent = /((Q\))(.)+(\?))/gm;
            var newResult = newContent.match(patternToFindQuestionInContent);
            if(newResult != null)
            {
                angular.forEach(newResult, function(value, key)
                {
                    var boldQuestionInContent= '<b>' +value+ '</b>';
                    newContent = newContent.replace(value, boldQuestionInContent);
                });
            }
            return newContent;
        };
        $scope.showReportInHomePage = function(allData, dbTableType, showStatus){
            $scope.returnDataCheck = null;
            allData.dbTableType = dbTableType;
            if(showStatus == 'promote'){
                userServices.reportForHomePage('create').create(allData, function(data)
                {
                    $scope.returnDataCheck = data;
                });
            } else if(showStatus == 'demote'){
                userServices.reportForHomePage('removeReport').removeReport(allData, function(data)
                {
                    $scope.returnDataCheck = data;
                });
            } else if(showStatus == 'checkForPromote'){
                userServices.reportForHomePage('getReportData').getReportData(allData, function (data)
                {
                    $scope.returnDataCheck = data;
                });
            }
            $scope.$broadcast('checkingForPromoteOrDemote');
        };
    }
]);
angular.module('myApp').controller("masterDbListingCtrl", ['$scope', '$state',
    function($scope, $state)
    {
        $scope.msg = "Hi! I am in Listing ctrl.";

    }]
);
angular.module('myApp').filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
angular.module('myApp').filter('dateFormat',
    function()
    {
        return function(input)
        {
            if (!input)
            {
                return '';
            }
            else
            {
                var dateVal = new Date(input);
                return dateVal.toDateString();
            }
        };
    }
);
angular.module('myApp').directive('ensureUnique', ['$http', 'usersMasterService',
    function($http, usersMasterService)
    {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel)
            {
                element.bind('blur', function(e)
                {
                    if (!ngModel || !element.val()) return;
                    var emailData =
                    {
                        email: element.val(),
                        uniqueTyepe: attrs.ensureUnique
                    };
                    usersMasterService.emailUnique().create({}, emailData, function(data)
                    {
                        ngModel.$setValidity('unique', data.isUnique);
                    });
                });
            }
        }
    }
]);
angular.module('myApp').service("usersMasterService", ['$resource',
    function($resource) {
        var factory = {};
        factory.user = function(queryType) {
            var userRESTUri = apiResourceUrl + "masterUsers";
            var queryType = arguments[0] || ''; //serviceUrl +"userlist.json" OR  apiResourceUrl+'/users'
            if (queryType == 'show' || queryType == 'update' || queryType == 'delete')
            {
                userRESTUri += '/:id';
            }
            else if (queryType == 'getDBStatusReport') {
                var userRESTUri = apiResourceUrl + "getDBStatusReport";
            }
            return $resource(userRESTUri, {}, {
                query: {
                    method: 'GET',
                    params: {
                        companyID: '@companyID'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                getDBStatusReport: {
                    method: 'GET',
                    isArray: true,
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
        factory.emailUnique = function() {
            return $resource(apiResourceUrl + "checkEmailUnique", {}, {
                create: {
                    method: 'POST',
                }
            });
        };

        return factory;
    }
]);
angular.module('myApp').service("userServices", ['$resource',
    function($resource) {
        var factory = {};
        factory.activityLog = function (queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'saveActivityLog';
            if (queryType == 'getActivityLog') {
                hsRESTUri = apiResourceUrl + 'getActivityLog/:id/:pluginId';
            }
            else if (queryType == 'getActivityLogForScreensQuestions') {
                hsRESTUri = apiResourceUrl + 'getActivityLogForScreensQuestions/:id/:pluginId/:questionId';
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
                getActivityLog: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        pluginId: '@pluginId'
                    }
                },
                getActivityLogForScreensQuestions: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        pluginId: '@pluginId',
                        questionId: '@questionId'
                    }
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