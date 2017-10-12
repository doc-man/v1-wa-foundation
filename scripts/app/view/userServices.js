'use strict';
angular.module('myApp').service("userServices", ['$resource', '$http',
    function($resource, $http) {
        var factory = {};
        factory.Users = function (queryType) {
            var userRESTUri = apiResourceUrl + "users";
            if (queryType == 'show' || queryType == 'update' || queryType == 'delete') {
                userRESTUri += '/:id';
            }
            return $resource(userRESTUri, {},
                {
                    show: {
                        method: 'GET',
                        params: {
                            id: '@id'
                        },
                    }
                });
        };
        factory.User = function (queryType) {
            var userRESTUri = apiResourceUrl + "userlist";
            var queryType = arguments[0] || ''; //serviceUrl +"billing.json" OR  apiResourceUrl+'/bills'
            if (queryType == 'show' || queryType == 'update' || queryType == 'delete') {
                userRESTUri += '/:id';
            }
            else if (queryType == 'checkUserAllowedToView') {
                userRESTUri = apiResourceUrl + 'checkUserAllowedToView/:id/:loggedInUID';
            }
            else if (queryType == 'getTabColorFlag') {
                userRESTUri = apiResourceUrl + 'getTabColorFlag/:id';
            }
            return $resource(userRESTUri, {}, {
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
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                deleterec: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                showdetail: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        type: '@type'
                    }
                },
                checkUserAllowedToView: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        loggedInUID: '@loggedInUID'
                    }
                },
                getTabColorFlag: {
                    method: 'GET',
                    params: {
                        id: '@id',
                    }
                }
            });
        };
        factory.scBrain = function (queryType) {
            var queryType = arguments[0] || '';
            if (queryType == 'getScBrainMasterData') {
                var userRESTUri = apiResourceUrl + 'getScBrainMasterData';
            }
            return $resource(userRESTUri, {}, {
                getScBrainMasterData: {
                    method: 'GET'
                }
            });
        };
        factory.PatientList = function () {
            return $resource(apiResourceUrl + "userlist", {}, {
                query: {
                    method: 'POST', // we will change it to post later
                }
            });
        };
        factory.Search = function () {
            return $resource(apiResourceUrl + "search", {}, {
                query: {
                    method: 'POST', // we will change it to post later
                }
            });
        };
        factory.uploadFileToUrl = function (queryType, file, uid, createdByUserId, nameOfClient, currentDateTime, timeZone) {
            var imageRESTUri = apiResourceUrl + 'imageUpload/' + uid + '?nameOfClient=' + nameOfClient + '&createdByUserId=' + createdByUserId + '&timeZoneAbbreviationOfClient=' + timeZone + '&currentDateTimeOfClient=' + currentDateTime;
            var fd = new FormData();
            fd.append('file', file);
            $http.post(imageRESTUri, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function () {
            }).error(function () {
            });
            return $resource(imageRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                uploadFileToUrl: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
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
        factory.chat = function (queryType) {
            var unlockRESTUri = apiResourceUrl;
            var queryType = arguments[0] || '';
            if (queryType == 'addMsg') {
                unlockRESTUri += 'chat';
            }
            else if (queryType == 'userList') {
                unlockRESTUri += 'chatUsers/:id';
            }
            else if (queryType == 'userInfo') {
                unlockRESTUri += 'userInfo';
            }
            else if (queryType == 'getReceiver') {
                unlockRESTUri += 'getReceiver';
            }
            else if (queryType == 'getAllChat') {
                unlockRESTUri += 'getAllChat';
            }
            else if (queryType == 'chatPossibility') {
                unlockRESTUri += 'chatPossibility';
            }
            else if (queryType == 'changeUnreadChatStat') {
                unlockRESTUri += 'changeUnreadChatStat';
            }
            else if (queryType == 'typingStat') {
                unlockRESTUri += 'typingStat';
            }

            return $resource(unlockRESTUri, {}, {
                query: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                addMsg: {
                    method: 'POST'
                },
                userList: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                userInfo: {
                    method: 'POST'
                },
                getReceiver: {
                    method: 'POST'
                },
                getAllChat: {
                    method: 'POST'
                },
                chatPossibility: {
                    method: 'POST'
                },
                changeUnreadChatStat: {
                    method: 'POST'
                },
                typingStat: {
                    method: 'POST'
                },

            });
        };
        factory.therapy = function (queryType) {
            var unlockRESTUri = apiResourceUrl;
            var queryType = arguments[0] || '';
            if (queryType == 'getAllPatients') {
                unlockRESTUri += 'getAllPatients';
            }
            return $resource(unlockRESTUri, {}, {
                query: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getAllPatients: {
                    method: 'POST'
                },

            });
        }
        factory.careTeam = function (queryType) {
            var careTeamRESTUri = apiResourceUrl + 'careteam';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                careTeamRESTUri += '/:id';
            } else if (queryType == 'getMasterDesignationData') {
                careTeamRESTUri = apiResourceUrl + 'getMasterDesignationData/:id';
            } else if (queryType == 'getUserData') {
                careTeamRESTUri = apiResourceUrl + 'getUserData/:id';
            }
            return $resource(careTeamRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
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
                getMasterDesignationData: {
                    method: 'GET'
                },
                getUserData: {
                    method: 'GET'
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
        factory.goal = function (queryType) {
            var goalRESTUri = apiResourceUrl + 'goal';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                goalRESTUri += '/:id';
            } else if (queryType == 'showPastGoals') {
                goalRESTUri = apiResourceUrl + 'showPastGoals/:id';
            } else if (queryType == 'showAllGoals') {
                goalRESTUri = apiResourceUrl + 'showAllGoals/:id';
            } else if (queryType == 'updateNewGoal') {
                goalRESTUri = apiResourceUrl + 'updateNewGoal/:id';
            } else if (queryType == 'deleteNewGoal') {
                goalRESTUri = apiResourceUrl + 'deleteNewGoal/:id';
            } else if (queryType == 'showPastRating') {
                goalRESTUri = apiResourceUrl + 'showPastRating/:id';
            } else if (queryType == 'ratingGraphData') {
                goalRESTUri = apiResourceUrl + 'ratingGraphData/:id';
            } else if (queryType == 'setCurrentGoal') {
                goalRESTUri = apiResourceUrl + 'setCurrentGoal/:id';
            } else if (queryType == 'saveReview') {
                goalRESTUri = apiResourceUrl + 'saveReview';
            } else if (queryType == 'updateReview') {
                goalRESTUri = apiResourceUrl + 'updateReview/:id';
            } else if (queryType == 'updateLock') {
                goalRESTUri = apiResourceUrl + 'updateGoalLock/:id';
            } else if (queryType == 'updateType') {
                goalRESTUri = apiResourceUrl + 'goalTypeUpdate/:id';
            } else if (queryType == 'showGraphOnCommonScreen') {
                goalRESTUri = apiResourceUrl + 'showGraphOnCommonScreen/:id';
            }
            return $resource(goalRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST'
                },
                saveReview: {
                    method: 'POST'
                },
                show: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                showPastGoals: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                showAllGoals: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                updateNewGoal: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                },
                deleteNewGoal: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                },
                showPastRating: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                ratingGraphData: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                setCurrentGoal: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updateReview: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updateType: {
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
                updateLock: {
                    method: 'PUT',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                },
                showGraphOnCommonScreen: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.socialHistory = function (queryType) {
            var shRESTUri = apiResourceUrl + 'socialHistory';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                shRESTUri += '/:id';
            } else if (queryType == 'removeRecord') {
                shRESTUri = apiResourceUrl + 'removeHistoryRecord/:id';
            } else if (queryType == 'updateLock') {
                shRESTUri = apiResourceUrl + 'updateLock/:type/:id/:userId';
            }
            return $resource(shRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    isArray: false,
                },
                updateLock: {
                    method: 'PUT',
                    params: {
                        type: '@type',
                        id: '@id',
                        userId: '@userId'
                    }
                },
                show: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                },
                removeRecord: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                update: {
                    method: 'PUT',

                    params: {
                        id: '@id'
                    }
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.screening = function (queryType) {
            var shRESTUri = apiResourceUrl + 'screening';
            var queryType = arguments[0] || ''; //serviceUrl +"billing.json" OR  apiResourceUrl+'bills'
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                shRESTUri += '/:id';
            } else if (queryType == 'removeRecord') {
                shRESTUri = apiResourceUrl + 'removescreeningRecord/:id';
            } else if (queryType == 'saveScreensForPatient') {
                shRESTUri = apiResourceUrl + 'saveScreensForPatient/:uidOfPersonAssigningTheScreen/:uidOfPatientScreenIsAssignedTo';
            } else if (queryType == 'screenRemove') {
                shRESTUri = apiResourceUrl + 'screenRemove/:uidOfPersonAssigningTheScreen/:uidOfPatientScreenIsAssignedTo/:id';
            } else if (queryType == 'submitScreenData') {
                shRESTUri = apiResourceUrl + 'submitScreenData';
            } else if (queryType == 'getGraphDataForScreen') {
                shRESTUri = apiResourceUrl + 'getGraphDataForScreen';
            }
            return $resource(shRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    isArray: false,
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
                submitScreenData: {
                    method: 'PUT',

                }, removeRecord: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                saveScreensForPatient: {
                    method: 'PUT',
                    params: {
                        uidOfPersonAssigningTheScreen: '@uidOfPersonAssigningTheScreen',
                        uidOfPatientScreenIsAssignedTo: '@uidOfPatientScreenIsAssignedTo'
                    },
                },
                screenRemove: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        uidOfPersonAssigningTheScreen: '@uidOfPersonAssigningTheScreen',
                        uidOfPatientScreenIsAssignedTo: '@uidOfPatientScreenIsAssignedTo'
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
                getGraphDataForScreen: {
                    method: 'POST'
                }
            });
        };
        factory.userBio = function (queryType) {
            var queryType = arguments[0] || '';
            var shRESTUri;
            if (queryType == 'query') {
                shRESTUri = apiResourceUrl + 'user';
            } else if (queryType == 'show') {
                shRESTUri = apiResourceUrl + 'getUserBiodata/:id';
            } else if (queryType == 'getUserImages') {
                shRESTUri = apiResourceUrl + 'getUserImages/:id';
            } else if (queryType == 'update') {
                shRESTUri = apiResourceUrl + 'setUserBiodata/:id';
            } else if (queryType == 'remove') {
                shRESTUri = apiResourceUrl + 'user/:id';
            } else if (queryType == 'changeImageCapturedDateTime') {
                shRESTUri = apiResourceUrl + 'changeImageCapturedDateTime/:id';
            } else if (queryType == 'removeAddress') {
                shRESTUri = apiResourceUrl + 'removeAddress/:id';
            } else if (queryType == 'savePassword') {
                shRESTUri = apiResourceUrl + 'savePassword';
            } else if (queryType == 'updateProfilePicture') {
                shRESTUri = apiResourceUrl + 'updateProfilePicture';
            } else if (queryType == 'userAssignTicketCount') {
                shRESTUri = apiResourceUrl + 'userAssignTicketCount';
            }else if (queryType == 'getUserSession') {
                shRESTUri = apiResourceUrl + 'getUserSession/:ip';
            }else if (queryType == 'setUserSession') {
                shRESTUri = apiResourceUrl + 'setUserSession';
            }
            return $resource(shRESTUri, {}, {
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
                userAssignTicketCount: {
                    method: 'POST'
                },
                getUserSession: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        ip: '@ip'
                    },
                },
                setUserSession: {
                    method: 'POST'
                },
                savePassword: {
                    method: 'POST'
                },
                show: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getUserImages: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    isArray: true,
                    params: {
                        id: '@id'
                    },
                },
                changeImageCapturedDateTime: {
                    method: 'PUT',
                    isArray: true,
                    params: {
                        id: '@id'
                    },
                },
                updateProfilePicture: {
                    method: 'PUT',
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                removeAddress: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.appointmentReminders = function (queryType) {
            var queryType = arguments[0] || '',
                arRESTUri;
            if (queryType == 'query') {
                arRESTUri = apiResourceUrl + 'apporeminder';
            } else if (queryType == 'show') {
                arRESTUri = apiResourceUrl + 'apporeminder/:id';
            } else if (queryType == 'create') {
                arRESTUri = apiResourceUrl + 'apporeminder';
            } else if (queryType == 'update') {
                arRESTUri = apiResourceUrl + 'apporeminder/:id';
            } else if (queryType == 'remove') {
                arRESTUri = apiResourceUrl + 'apporeminder/:id';
            } else if (queryType == 'receiveroptions') {
                arRESTUri = apiResourceUrl + 'receiveroptions/:id';
            } else if (queryType == 'emailremove') {
                arRESTUri = apiResourceUrl + 'emailremove/:id';
            } else if (queryType == 'phoneremove') {
                arRESTUri = apiResourceUrl + 'phoneremove/:id';
            } else if (queryType == 'saveapporeminder') {
                arRESTUri = apiResourceUrl + 'saveapporeminder';
            }
            return $resource(arRESTUri, {}, {
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
                receiveroptions: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                emailremove: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                phoneremove: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                saveapporeminder: {
                    method: 'POST'
                }
            });
        };
        factory.userPlugin = function (queryType) {
            var queryType = arguments[0] || '',
                shRESTUri;
            if (queryType == 'query') {
                shRESTUri = apiResourceUrl + 'pluginlist';
            }
            if (queryType == 'elementList') {
                shRESTUri = apiResourceUrl + 'elementlist';
            } else if (queryType == 'show') {
                shRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'update') {
                shRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'remove') {
                shRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'getPluginData') {
                shRESTUri = apiResourceUrl + 'getPluginData/:loggedInUid/:activeTabUid';
            } else if (queryType == 'saveQuickTabMenuPluginData') {
                shRESTUri = apiResourceUrl + 'saveQuickTabMenuPluginData';
            } else if (queryType == 'savePluginWeightSetting') {
                shRESTUri = apiResourceUrl + 'savePluginWeightSetting';
            } else if (queryType == 'savePluginCastSetting') {
                shRESTUri = apiResourceUrl + 'savePluginCastSetting';
            } else if (queryType == 'getQuickDetailsForPatientBirdEye') {
                shRESTUri = apiResourceUrl + 'getQuickDetailsForPatientBirdEye';
            } else if (queryType == 'getQuickDetailsForPatientRedFlag') {
                shRESTUri = apiResourceUrl + 'getQuickDetailsForPatientRedFlag';
            }
            return $resource(shRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                elementList: {
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
                getPluginData: {
                    method: 'GET',
                },
                saveQuickTabMenuPluginData: {
                    method: 'POST',
                },
                savePluginWeightSetting: {
                    method: 'POST',
                },
                savePluginCastSetting: {
                    method: 'POST',
                },
                getQuickDetailsForPatientBirdEye: {
                    method: 'GET',
                },
                getQuickDetailsForPatientRedFlag: {
                    method: 'GET',
                }
            });
        };
        factory.allergies = function (queryType) {
            var algRESTUri = apiResourceUrl + 'allergies';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                algRESTUri = apiResourceUrl + 'allergies';
            } else if (queryType == 'show') {
                algRESTUri = apiResourceUrl + 'allergies/:id';
            } else if (queryType == 'update') {
                algRESTUri = apiResourceUrl + 'allergies/:id';
            } else if (queryType == 'create') {
                algRESTUri = apiResourceUrl + 'allergies/:id';
            } else if (queryType == 'remove') {
                algRESTUri = apiResourceUrl + 'allergies/:id';
            } else if (queryType == 'updateLock') {
                algRESTUri = apiResourceUrl + 'updateAllergiesLock/:id';
            }
            return $resource(algRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
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
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                },
                updateLock: {
                    method: 'PUT',
                    isArray: false,
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
        factory.contacts = function (queryType) {
            var queryType = arguments[0] || '';
            var shRESTUri = apiResourceUrl + 'contacts';
            if (queryType == 'show') {
                shRESTUri = apiResourceUrl + 'contacts/:id';
            } else if (queryType == 'update') {
                shRESTUri = apiResourceUrl + 'contacts/:id';
            } else if (queryType == 'removeContact') {
                shRESTUri = apiResourceUrl + 'removeContact/:id/:type/:uid';
            } else if (queryType == 'remove') {
                shRESTUri = apiResourceUrl + 'contacts/:id';
            } else if (queryType == 'gettypes') {
                shRESTUri = apiResourceUrl + 'contacts';
            } else if (queryType == 'updateLock') {
                shRESTUri = apiResourceUrl + 'updateContactsLock/:id';
            }
            return $resource(shRESTUri, {}, {
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
                gettypes: {
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
                },
                updateLock: {
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
                removeContact: {
                    method: 'DELETE',
                    params: {
                        id: '@id',
                        type: '@type',
                        uid: '@uid'
                    }
                }
            });
        };
        factory.appointments = function (queryType) {
            var queryType = arguments[0] || '';
            var shRESTUri = apiResourceUrl + 'appointments';
            if (queryType == 'show') {
                shRESTUri = apiResourceUrl + 'appointments/:id';
            } else if (queryType == 'previousSuccessfulAppointmentNote') {
                shRESTUri = apiResourceUrl + 'previousSuccessfulAppointmentNote/:loggedInUserUID/:activeUserTabUID/:eventId';
            } else if (queryType == 'update') {
                shRESTUri = apiResourceUrl + 'appointments/:id';
            } else if (queryType == 'updateNote') {
                shRESTUri = apiResourceUrl + 'updateNote/:id';
            } else if (queryType == 'createNote') {
                shRESTUri = apiResourceUrl + 'createNote';
            } else if (queryType == 'autosaveNote') {
                shRESTUri = apiResourceUrl + 'autosaveNote';
            } else if (queryType == 'getNote') {
                shRESTUri = apiResourceUrl + 'getNote';
            } else if (queryType == 'remove') {
                shRESTUri = apiResourceUrl + 'forceDeleteEvent/:id';
            } else if (queryType == 'gettypes') {
                shRESTUri = apiResourceUrl + 'appointmentTypes/:id';
            } else if (queryType == 'appointmentrelated') {
                shRESTUri = apiResourceUrl + 'appointmentrelated';
            } else if (queryType == 'noteContainerSizeFlag') {
                shRESTUri = apiResourceUrl + 'noteContainerSizeFlagUpdate';
            } else if (queryType == 'pdfnote') {
                shRESTUri = apiResourceUrl + 'pdfnote/:id';
            } else if (queryType == 'loadAppointmentMasterData') {
                shRESTUri = apiResourceUrl + 'loadAppointmentMasterData/:id';
            } else if (queryType == 'loadAppointmentData') {
                shRESTUri = apiResourceUrl + 'loadAppointmentData/:id';
            } else if (queryType == 'removeVoice') {
                shRESTUri = apiResourceUrl + 'removeVoice/:id';
            } else if (queryType == 'checkPRSMSECreation') {
                shRESTUri = apiResourceUrl + 'checkPRSMSECreation/:eid';
            } else if (queryType == 'saveReasonForVisit') {
                shRESTUri = apiResourceUrl + 'saveReasonForVisit/:id';
            }
            return $resource(shRESTUri, {}, {
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
                createNote: {
                    method: 'POST'
                },
                autosaveNote: {
                    method: 'POST'
                },
                getNote: {
                    method: 'POST'
                },
                noteContainerSizeFlag: {
                    method: 'POST'
                },
                appointmentrelated: {
                    method: 'POST',
                },
                removeVoice: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                },
                loadAppointmentData: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                pdfnote: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                },
                previousSuccessfulAppointmentNote: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        loggedInUserUID: '@loggedInUserUID',
                        activeUserTabUID: '@activeUserTabUID',
                        eventId: '@eventId'
                    },
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
                gettypes: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                },
                loadAppointmentMasterData: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updateNote: {
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
                checkPRSMSECreation: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        eid: '@eid'
                    },
                },
                saveReasonForVisit: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
            });
        };
        factory.subscription = function (queryType) {
            var shRESTUri = apiResourceUrl + 'subscription';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                shRESTUri += '/:id';
            } else if (queryType == 'getMedicalFileData') {
                shRESTUri = apiResourceUrl + 'getSubscriptionMedicalFileData/:id';
            } else if (queryType == 'getSubscriptionData') {
                shRESTUri = apiResourceUrl + 'getSubscriptionData/:id';
            } else if (queryType == 'saveSubscriptionData') {
                shRESTUri = apiResourceUrl + 'saveSubscriptionData/:id';
            }
            return $resource(shRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    isArray: false,
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
                getMedicalFileData: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                getSubscriptionData: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                saveSubscriptionData: {
                    method: 'POST',
                    params: {
                        id: '@id'
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
        factory.defaultSettings = function (queryType) {
            var queryType = arguments[0] || '';
            var defaultSettingsRESTUri = apiResourceUrl + 'defaultSettings';
            if (queryType == 'show') {
                defaultSettingsRESTUri = apiResourceUrl + 'defaultSettings/:id';
            } else if (queryType == 'save') {
                defaultSettingsRESTUri = apiResourceUrl + 'defaultSettings/:id';
            } else if (queryType == 'timezones') {
                defaultSettingsRESTUri = apiResourceUrl + 'timezones';
            } else if (queryType == 'saveTimezone') {
                defaultSettingsRESTUri = apiResourceUrl + 'savetimezone/:id';
            } else if (queryType == 'savedtimezone') {
                defaultSettingsRESTUri = apiResourceUrl + 'getsavedtimezone/:id';
            }
            return $resource(defaultSettingsRESTUri, {}, {
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
                save: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                savetimezone: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                timezones: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                savedtimezone: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                }
            });
        };
        factory.hospitalization = function (queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'hospitalization';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'hospitalization/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'hospitalization/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'hospitalization/:id';
            } else if (queryType == 'updateLock') {
                hsRESTUri = apiResourceUrl + 'updateHospitalizationLock/:id';
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
                updateLock: {
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
        factory.referral = function (queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'referral';
            if (queryType == 'show') {
                hsRESTUri = apiResourceUrl + 'referral/:id';
            } else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'referral/:id';
            } else if (queryType == 'remove') {
                hsRESTUri = apiResourceUrl + 'referral/:id';
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
            });
        };
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
        factory.reportForHomePage = function (queryType) {
            var queryType = arguments[0] || '';
            var hsRESTUri = apiResourceUrl + 'statusForReportInHome';
            if (queryType == 'getPromoteReportToHome') {
                hsRESTUri = apiResourceUrl + 'getPromoteReportToHome/:uid';
            }
            else if (queryType == 'getReportData') {
                hsRESTUri = apiResourceUrl + 'getReportData';
            }
            else if (queryType == 'removeReport') {
                hsRESTUri = apiResourceUrl + 'removeReport';
            }
            else if (queryType == 'update') {
                hsRESTUri = apiResourceUrl + 'statusForReportInHome/:uid';
            }
            else if (queryType == 'getAllReportDataForHome') {
                hsRESTUri = apiResourceUrl + 'getAllReportDataForHome/:uid/:name';
            }
            else if (queryType == 'getSummaryReportStateDataForHome') {
                hsRESTUri = apiResourceUrl + 'getSummaryReportStateDataForHome/:name/:uid/:summaryReportID';
            }
            else if (queryType == 'getPromotedSummaryReportsState') {
                hsRESTUri = apiResourceUrl + 'getPromotedSummaryReportsState/:stateId/:reportType';
            }
            return $resource(hsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                },
                getReportData: {
                    method: 'POST'
                },
                create: {
                    method: 'POST'
                },
                getPromoteReportToHome: {
                    method: 'GET',
                    params: {
                        uid: '@uid'
                    }
                },
                getAllReportDataForHome: {
                    method: 'GET',
                    params: {
                        uid: '@uid',
                        name: '@name'
                    }
                },
                getSummaryReportStateDataForHome: {
                    method: 'GET',
                    params: {
                        name: '@name',
                        uid: '@uid',
                        summaryReportID: '@summaryReportID'
                    }
                },
                update: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    }
                },
                removeReport: {
                    method: 'DELETE'
                },
                getPromotedSummaryReportsState: {
                    method: 'POST',
                    params: {
                        stateId: '@stateId',
                        reportType: '@reportType'
                    }
                }
            });
        };
        factory.policies = function (queryType) {
            var policyRESTUri = apiResourceUrl + 'policies';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                policyRESTUri = apiResourceUrl + 'policies';
            } else if (queryType == 'show') {
                policyRESTUri = apiResourceUrl + 'policies/:id';
            } else if (queryType == 'update') {
                policyRESTUri = apiResourceUrl + 'policies/:id';
            } else if (queryType == 'remove') {
                policyRESTUri = apiResourceUrl + 'policies/:id';
            } else if (queryType == 'tempupload') {
                policyRESTUri = apiResourceUrl + 'policies/tempupload/:id';
            }
            return $resource(policyRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                tempupload: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                }
            });
        };
        factory.roi = function (queryType) {
            var policyRESTUri = apiResourceUrl + 'roi';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                policyRESTUri = apiResourceUrl + 'roi';
            } else if (queryType == 'show') {
                policyRESTUri = apiResourceUrl + 'roi/:id';
            } else if (queryType == 'update') {
                policyRESTUri = apiResourceUrl + 'roi/:id';
            } else if (queryType == 'remove') {
                policyRESTUri = apiResourceUrl + 'roi/:id';
            } else if (queryType == 'download') {
                policyRESTUri = apiResourceUrl + 'downloadRoi/:id';
            }
            return $resource(policyRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                download: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                }
            });
        };
        factory.userPRS = function (queryType) {
            var prsRESTUri = apiResourceUrl + 'prs';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                prsRESTUri = apiResourceUrl + 'prs';
            }
            else if (queryType == 'show') {
                prsRESTUri = apiResourceUrl + 'prs/:id/:masterData';
            } else if (queryType == 'update') {
                prsRESTUri = apiResourceUrl + 'prs/:id';
            } else if (queryType == 'remove') {
                prsRESTUri = apiResourceUrl + 'prs/:id';
            } else if (queryType == 'getPrsCategoryHistory') {
                prsRESTUri = apiResourceUrl + 'getPrsCategoryHistory/:id';
            } else if (queryType == 'getPrsMasterHistory') {
                prsRESTUri = apiResourceUrl + 'getPrsMasterHistory/:id';
            } else if (queryType == 'savePrsData') {
                prsRESTUri = apiResourceUrl + 'savePrsData/:uid';
            } else if (queryType == 'saveFinalizeReportOfROS') {
                prsRESTUri = apiResourceUrl + 'saveFinalizeReportOfROS/:uid';
            } else if (queryType == 'savePertinentNegative') {
                prsRESTUri = apiResourceUrl + 'savePertinentNegative/:uid';
            }
            return $resource(prsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                },
                show: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        masterData: '@pluginID'
                    }
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                savePrsData: {
                    method: 'POST',
                    params: {
                        uid: '@uid'
                    },
                },
                saveFinalizeReportOfROS: {
                    method: 'POST',
                    params: {
                        uid: '@uid'
                    },
                },
                savePertinentNegative: {
                    method: 'POST',
                    params: {
                        uid: '@uid'
                    },
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                getPrsCategoryHistory: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                getPrsMasterHistory: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                }
            });
        };
        factory.userMSE = function (queryType) {
            var mseRESTUri = apiResourceUrl + 'mse';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                mseRESTUri = apiResourceUrl + 'mse';
            } else if (queryType == 'show') {
                mseRESTUri = apiResourceUrl + 'mse/:id';
            } else if (queryType == 'update') {
                mseRESTUri = apiResourceUrl + 'mse/:id';
            } else if (queryType == 'remove') {
                mseRESTUri = apiResourceUrl + 'mse/:id';
            } else if (queryType == 'mseHistory') {
                mseRESTUri = apiResourceUrl + 'getMseHistory/:id';
            }
            return $resource(mseRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                mseHistory: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
            });
        };
        factory.userWeight = function (queryType) {
            var weightRESTUri = apiResourceUrl + 'weight';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                weightRESTUri = apiResourceUrl + 'weight';
            } else if (queryType == 'show') {
                weightRESTUri = apiResourceUrl + 'weight/:id';
            } else if (queryType == 'update') {
                weightRESTUri = apiResourceUrl + 'weight/:id';
            } else if (queryType == 'remove') {
                weightRESTUri = apiResourceUrl + 'weight/:id';
            } else if (queryType == 'weightLock') {
                weightRESTUri = apiResourceUrl + 'weightLock/:id/:pId';
            } else if (queryType == 'getUserWeightLastUnit') {
                weightRESTUri = apiResourceUrl + 'getUserWeightLastUnit/:uId';
            }
            return $resource(weightRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                weightLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
                getUserWeightLastUnit: {
                    method: 'PUT',
                    params: {
                        uId: '@uId',
                    },
                },
            });
        };
        factory.userBMI = function (queryType) {
            var bmiRESTUri = apiResourceUrl + 'bmi';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                bmiRESTUri = apiResourceUrl + 'bmi';
            } else if (queryType == 'show') {
                bmiRESTUri = apiResourceUrl + 'bmi/:id';
            } else if (queryType == 'update') {
                bmiRESTUri = apiResourceUrl + 'bmi/:id';
            } else if (queryType == 'remove') {
                bmiRESTUri = apiResourceUrl + 'bmi/:id';
            } else if (queryType == 'bmiLock') {
                bmiRESTUri = apiResourceUrl + 'bmiLock/:id/:pId';
            }
            return $resource(bmiRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                bmiLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
            });
        };
        factory.userWaist = function (queryType) {
            var waistRESTUri = apiResourceUrl + 'waist';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                waistRESTUri = apiResourceUrl + 'waist';
            } else if (queryType == 'show') {
                waistRESTUri = apiResourceUrl + 'waist/:id';
            } else if (queryType == 'update') {
                waistRESTUri = apiResourceUrl + 'waist/:id';
            } else if (queryType == 'remove') {
                waistRESTUri = apiResourceUrl + 'waist/:id';
            } else if (queryType == 'waistLock') {
                waistRESTUri = apiResourceUrl + 'waistLock/:id/:pId';
            } else if (queryType == 'getUserWaistCircumferenceLastUnit') {
                waistRESTUri = apiResourceUrl + 'getUserWaistCircumferenceLastUnit/:uId';
            }
            return $resource(waistRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                waistLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
                getUserWaistCircumferenceLastUnit: {
                    method: 'PUT',
                    params: {
                        uId: '@uId',
                    },
                },
            });
        };
        factory.userBloodSugar = function (queryType) {
            var bloodSugarRESTUri = apiResourceUrl + 'sugar';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                bloodSugarRESTUri = apiResourceUrl + 'sugar';
            } else if (queryType == 'show') {
                bloodSugarRESTUri = apiResourceUrl + 'sugar/:id';
            } else if (queryType == 'update') {
                bloodSugarRESTUri = apiResourceUrl + 'sugar/:id';
            } else if (queryType == 'remove') {
                bloodSugarRESTUri = apiResourceUrl + 'sugar/:id';
            } else if (queryType == 'bloodSugarLock') {
                bloodSugarRESTUri = apiResourceUrl + 'bloodSugarLock/:id/:pId';
            }
            return $resource(bloodSugarRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                bloodSugarLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
            });
        };
        factory.bodyMeasurementHeight = function (queryType) {
            var heightRESTUri = apiResourceUrl + 'height';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                heightRESTUri = apiResourceUrl + 'height';
            } else if (queryType == 'show') {
                heightRESTUri = apiResourceUrl + 'height/:id';
            } else if (queryType == 'update') {
                heightRESTUri = apiResourceUrl + 'height/:id';
            } else if (queryType == 'remove') {
                heightRESTUri = apiResourceUrl + 'height/:id';
            } else if (queryType == 'getHistory') {
                heightRESTUri = apiResourceUrl + 'getHeightHistory/:uid';
            }
            return $resource(heightRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getHistory: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    }
                }
            });
        };
        factory.bodyMeasurementBP = function (queryType) {
            var bpRESTUri = apiResourceUrl + 'bloodPressure';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                bpRESTUri = apiResourceUrl + 'bloodPressure';
            } else if (queryType == 'show') {
                bpRESTUri = apiResourceUrl + 'bloodPressure/:id';
            } else if (queryType == 'update') {
                bpRESTUri = apiResourceUrl + 'bloodPressure/:id';
            } else if (queryType == 'remove') {
                bpRESTUri = apiResourceUrl + 'bloodPressure/:id';
            } else if (queryType == 'getHistory') {
                bpRESTUri = apiResourceUrl + 'getBPHistory/:uid';
            }
            return $resource(bpRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getHistory: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    }
                }
            });
        };
        factory.bodyMeasurementSaO2 = function (queryType) {
            var sao2RESTUri = apiResourceUrl + 'oxygenSaturation';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                sao2RESTUri = apiResourceUrl + 'oxygenSaturation';
            } else if (queryType == 'show') {
                sao2RESTUri = apiResourceUrl + 'oxygenSaturation/:id';
            } else if (queryType == 'update') {
                sao2RESTUri = apiResourceUrl + 'oxygenSaturation/:id';
            } else if (queryType == 'remove') {
                sao2RESTUri = apiResourceUrl + 'oxygenSaturation/:id';
            } else if (queryType == 'getHistory') {
                sao2RESTUri = apiResourceUrl + 'getSaO2History/:uid';
            }
            return $resource(sao2RESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getHistory: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    }
                }
            });
        };
        factory.bodyMeasurementPulse = function (queryType) {
            var pulseRESTUri = apiResourceUrl + 'pulse';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                pulseRESTUri = apiResourceUrl + 'pulse';
            } else if (queryType == 'show') {
                pulseRESTUri = apiResourceUrl + 'pulse/:id';
            } else if (queryType == 'update') {
                pulseRESTUri = apiResourceUrl + 'pulse/:id';
            } else if (queryType == 'remove') {
                pulseRESTUri = apiResourceUrl + 'pulse/:id';
            } else if (queryType == 'getHistory') {
                pulseRESTUri = apiResourceUrl + 'getPulseHistory/:uid';
            }
            return $resource(pulseRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getHistory: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    }
                }
            });
        };
        factory.pharmacy = function (queryType) {
            var pharmacyRESTUri = apiResourceUrl + 'pharmacy';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacy';
            } else if (queryType == 'show') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacy/:id';
            } else if (queryType == 'update') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacy/:id';
            } else if (queryType == 'updateType') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacyTypeUpdate/:oldId/:newId';
            } else if (queryType == 'create') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacy/:id';
            } else if (queryType == 'remove') {
                pharmacyRESTUri = apiResourceUrl + 'pharmacy/:id';
            }
            return $resource(pharmacyRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
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
                    }
                },
                updateType: {
                    method: 'PUT',
                    params: {
                        oldId: '@oldId',
                        newId: '@newId'
                    }
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.emails = function (queryType) {
            var emailsRESTUri = apiResourceUrl + 'emails';
            if (queryType == 'query') {
                emailsRESTUri = apiResourceUrl + 'emails';
            } else if (queryType == 'show') {
                emailsRESTUri = apiResourceUrl + 'emails/:senderId/:recieverId';
            } else if (queryType == 'update') {
                emailsRESTUri = apiResourceUrl + 'emails/:id';
            } else if (queryType == 'create') {
                emailsRESTUri = apiResourceUrl + 'emails';
            } else if (queryType == 'remove') {
                emailsRESTUri = apiResourceUrl + 'emails/:id';
            }
            return $resource(emailsRESTUri, {}, {
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
                        senderId: '@senderId',
                        recieverId: '@recieverId'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                updateType: {
                    method: 'PUT',
                    params: {
                        oldId: '@oldId',
                        newId: '@newId'
                    }
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.pluginWeights = function (queryType) {
            var queryType = arguments[0] || '';
            var swRESTUri = apiResourceUrl + 'pluginlist';
            if (queryType == 'enabledplugins') {
                swRESTUri = apiResourceUrl + 'enabled_pluginlist/:id';
            } else if (queryType == 'show') {
                swRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'update') {
                swRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'stateupdate') {
                swRESTUri = apiResourceUrl + 'statesave/:id';
            } else if (queryType == 'remove') {
                swRESTUri = apiResourceUrl + 'pluginlist/:id';
            } else if (queryType == 'updateall') {
                swRESTUri = apiResourceUrl + 'saveallplugin/:id';
            } else if (queryType == 'updatestates') {
                swRESTUri = apiResourceUrl + 'savepluginstates/:id';
            } else if (queryType == 'savetabs') {
                swRESTUri = apiResourceUrl + 'savetabs/:id';
            } else if (queryType == 'gettabs') {
                swRESTUri = apiResourceUrl + 'gettabs/:id';
            } else if (queryType == 'checkTabRequest') {
                swRESTUri = apiResourceUrl + 'checkTabRequest/:id';
            } else if (queryType == 'saveSiteWideHelpData') {
                swRESTUri = apiResourceUrl + 'saveSiteWideHelpData/:id';
            } else if (queryType == 'loadCommonScreens') {
                swRESTUri = apiResourceUrl + 'loadCommonScreens/:id/:pid';
            } else if (queryType == 'updateCommonScreens') {
                swRESTUri = apiResourceUrl + 'updateCommonScreens';
            }
            return $resource(swRESTUri, {}, {
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
                enabledplugins: {
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
                saveSiteWideHelpData: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                stateupdate: {
                    method: 'PUT',
                    ignoreLoadingBar: true,
                    params: {
                        id: '@id'
                    },
                },
                updateall: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                updatestates: {
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
                savetabs: {
                    method: 'PUT',
                    ignoreLoadingBar: true,
                    params: {
                        id: '@id'
                    },
                },
                gettabs: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                checkTabRequest: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                loadCommonScreens: {
                    method: 'GET',
                    params: {
                        id: '@id',
                        pid: '@pid'
                    },
                },
                updateCommonScreens: {
                    method: 'POST'
                },
            });
        };
        factory.correlate = function (queryType) {
            var prsRESTUri = apiResourceUrl + 'getmeasurement';
            var queryType = arguments[0] || '';
            if (queryType == 'show') {
                prsRESTUri = apiResourceUrl + 'getmeasurement/:id';
            } else if (queryType == 'getoptions') {
                prsRESTUri = apiResourceUrl + 'getmeasurementtypes/:type';
            } else if (queryType == 'getcharttypes') {
                prsRESTUri = apiResourceUrl + 'getcharttypes';
            } else if (queryType == 'getAllChartListTree') {
                prsRESTUri = apiResourceUrl + 'getAllChartListTree';
            } else if (queryType == 'getChartSavedStatus') {
                prsRESTUri = apiResourceUrl + 'getChartSavedStatus';
            } else if (queryType == 'saveCurrentStatus') {
                prsRESTUri = apiResourceUrl + 'saveCurrentStatus/:id';
            } else if (queryType == 'getCorrelateStatus') {
                prsRESTUri = apiResourceUrl + 'getchartstatus/:id';
            } else if (queryType == 'allPluginList') {
                prsRESTUri = apiResourceUrl + 'allPluginList/:id';
            }
            return $resource(prsRESTUri, {}, {
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
                getoptions: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        type: '@type'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getcharttypes: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        type: '@type'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getAllChartListTree: {
                    method: 'GET',
                    isArray: false,
                    ignoreLoadingBar: true,
                    params: {
                        type: '@type'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getChartSavedStatus: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        type: '@type'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                saveCurrentStatus: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                getCorrelateStatus: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                allPluginList: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                }
            });
        };
        factory.medications = function (queryType) {
            var medicationsRESTUri = apiResourceUrl + 'userMedication';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                medicationsRESTUri = apiResourceUrl + 'userMedication';
            }
            else if (queryType == 'show') {
                medicationsRESTUri = apiResourceUrl + 'userMedication/:id';
            }
            else if (queryType == 'create') {
                medicationsRESTUri = apiResourceUrl + 'userMedication';
            }
            else if (queryType == 'update') {
                medicationsRESTUri = apiResourceUrl + 'userMedication/:id';
            }
            else if (queryType == 'addNewStrength') {
                medicationsRESTUri = apiResourceUrl + 'userMedicationAddNewStrength/:id';
            }
            else if (queryType == 'addNewForm') {
                medicationsRESTUri = apiResourceUrl + 'userMedicationAddNewForm/:id';
            }
            else if (queryType == 'getPastRefillData') {
                medicationsRESTUri = apiResourceUrl + 'userMedicationPastRefillData/:id';
            }
            else if (queryType == 'remove') {
                medicationsRESTUri = apiResourceUrl + 'userMedication/:id';
            }
            else if (queryType == 'createQuantityAndRefill') {
                medicationsRESTUri = apiResourceUrl + 'userMedicationAddQuantityAndRefill';
            }
            else if (queryType == 'lockRefillDataRow') {
                medicationsRESTUri = apiResourceUrl + 'userMedicationLockRefillDataRow';
            }
            return $resource(medicationsRESTUri, {},
                {
                    query: {
                        method: 'GET',
                        isArray: true,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                    },
                    create: {
                        method: 'POST',
                    },
                    createQuantityAndRefill: {
                        method: 'POST',
                    },
                    lockRefillDataRow: {
                        method: 'POST',
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
                    getPastRefillData: {
                        method: 'POST',
                        params: {
                            id: '@id'
                        },
                    },
                    update: {
                        method: 'PUT',
                        params: {
                            id: '@id'
                        },
                    },
                    addNewStrength: {
                        method: 'POST',
                        params: {
                            id: '@id'
                        },
                    },
                    addNewForm: {
                        method: 'POST',
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
        factory.billingMaster = function (queryType) {
            var billingMasterRESTUri = apiResourceUrl + 'billingMaster';
            var queryType = arguments[0] || '';
            if (queryType == 'show') {
                billingMasterRESTUri = apiResourceUrl + 'billingMaster';
            } else if (queryType == 'getBillingMasterData') {
                billingMasterRESTUri = apiResourceUrl + 'billingMaster';
            } else if (queryType == 'generateBillingCode') {
                billingMasterRESTUri = apiResourceUrl + 'billingMaster';
            } else if (queryType == 'updateBillingCode') {
                billingMasterRESTUri = apiResourceUrl + 'updateBillingCode';
            } else if (queryType == 'generateBillingCodeForTimeInPsytx') {
                billingMasterRESTUri = apiResourceUrl + 'generateBillingCodeForTimeInPsytx';
            } else if (queryType == 'generateBillingCodeForTimeInInteractive') {
                billingMasterRESTUri = apiResourceUrl + 'generateBillingCodeForTimeInInteractive';
            } else if (queryType == 'getBillingMasterData') {
                billingMasterRESTUri = apiResourceUrl + 'getBillingMasterData';
            }
            return $resource(billingMasterRESTUri, {},
                {
                    show: {
                        method: 'GET',
                        isArray: false,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                    generateBillingCode: {
                        method: 'POST'
                    },
                    updateBillingCode: {
                        method: 'POST'
                    },
                    getBillingMasterData: {
                        method: 'GET'
                    },
                    generateBillingCodeForTimeInPsytx: {
                        method: 'POST'
                    },
                    generateBillingCodeForTimeInInteractive: {
                        method: 'POST'
                    }
                });
        };
        factory.diagnosis = function (queryType) {
            var diagnosisRESTUri = apiResourceUrl + 'diagnosis';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis';
            } else if (queryType == 'show') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis/:id';
            } else if (queryType == 'showIcd10codes') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis';
            } else if (queryType == 'update') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis/:id/:pId';
            } else if (queryType == 'create') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis/:pId';
            } else if (queryType == 'remove') {
                diagnosisRESTUri = apiResourceUrl + 'diagnosis/:id';
            } else if (queryType == 'updateLock') {
                diagnosisRESTUri = apiResourceUrl + 'updateDiagnosisLock/:id/:pId';
            }
            return $resource(diagnosisRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    params: {
                        pId: '@pId'
                    },
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
                        id: '@id',
                        pId: '@pId'
                    },
                },
                updateLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
                showIcd10codes: {
                    method: 'GET',
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.masterServiceStatementsList = function (queryType) {
            var serviceStatementsRESTUri = apiResourceUrl + 'serviceStatements';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                serviceStatementsRESTUri = apiResourceUrl + 'serviceStatements';
            }
            return $resource(serviceStatementsRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
            });
        };
        factory.substanceAbuse = function (queryType) {
            var abuseRESTUri = apiResourceUrl + 'diagnosis';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                abuseRESTUri = apiResourceUrl + 'substanceAbuse';
            } else if (queryType == 'show') {
                abuseRESTUri = apiResourceUrl + 'substanceAbuse/:id';
            } else if (queryType == 'update') {
                abuseRESTUri = apiResourceUrl + 'substanceAbuse/:id';
            } else if (queryType == 'create') {
                abuseRESTUri = apiResourceUrl + 'substanceAbuse';
            } else if (queryType == 'remove') {
                abuseRESTUri = apiResourceUrl + 'substanceAbuse/:id';
            } else if (queryType == 'changeEndDate') {
                abuseRESTUri = apiResourceUrl + 'changeEndDate';
            } else if (queryType == 'changeEndDatedisContinue') {
                abuseRESTUri = apiResourceUrl + 'changeEndDatedisContinue';
            } else if (queryType == 'updateLock') {
                abuseRESTUri = apiResourceUrl + 'updateAbuseLock/:id/:pId';
            }
            return $resource(abuseRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                showIcd10codes: {
                    method: 'GET',
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                changeEndDate: {
                    method: 'post'
                },
                changeEndDatedisContinue: {
                    method: 'post'
                },
                updateLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
            });
        };
        factory.payers = function (queryType) {
            var payersRESTUri = apiResourceUrl + 'payer';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                payersRESTUri = apiResourceUrl + 'payer';
            } else if (queryType == 'show') {
                payersRESTUri = apiResourceUrl + 'payer/:id';
            } else if (queryType == 'update') {
                payersRESTUri = apiResourceUrl + 'payer/:id';
            } else if (queryType == 'remove') {
                payersRESTUri = apiResourceUrl + 'payer/:id';
            } else if (queryType == 'deletefile') {
                payersRESTUri = apiResourceUrl + 'payer/deleteDoc/:id';
            } else if (queryType == 'savePaymentEntity') {
                payersRESTUri = apiResourceUrl + 'savePaymentEntity';
            } else if (queryType == 'updateLock') {
                payersRESTUri = apiResourceUrl + 'updatePayerLock/:id/:pId';
            }
            return $resource(payersRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                },
                savePaymentEntity: {
                    method: 'POST',
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
                updateLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                deletefile: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.substanceSymptom = function (queryType) {
            var substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom';
            } else if (queryType == 'show') {
                substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom/:Pid';
            } else if (queryType == 'update') {
                substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom/:id/:pId';
            } else if (queryType == 'create') {
                substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom/:pId';
            } else if (queryType == 'remove') {
                substanceSymptomRESTUri = apiResourceUrl + 'substanceSymptom/:id';
            } else if (queryType == 'updateLock') {
                substanceSymptomRESTUri = apiResourceUrl + 'updateSymptomsLock/:id/:pId';
            }
            return $resource(substanceSymptomRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    params: {
                        pId: '@pId'
                    },
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
                        id: '@id',
                        pId: '@pId'
                    },
                },
                updateLock: {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        pId: '@pId'
                    },
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                deletefile: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.docList = function (queryType, id) {
            var userRESTUri = apiResourceUrl + "create";
            userRESTUri = apiResourceUrl + 'documentList/' + id;
            return $resource(userRESTUri, {}, {
                query: {
                    method: 'GET', // we will change it to post later
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                },
                documentList: {
                    method: 'GET'
                }
            });
        };
        factory.upDocument = function (queryType) {
            var userRESTUri = apiResourceUrl + "documents";
            var queryType = arguments[0] || ''; //serviceUrl +"userlist.json" OR  apiResourceUrl+'/users'
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                userRESTUri = apiResourceUrl + 'documents/:id';
            } else if (queryType == 'addcomment') {
                userRESTUri = apiResourceUrl + 'addcomment';
            } else if (queryType == 'deleteDoc') {
                userRESTUri = apiResourceUrl + 'deleteDoc/:id';
            } else if (queryType == 'lockDoc') {
                userRESTUri = apiResourceUrl + 'lockDoc/:id';
            } else if (queryType == 'sendFax') {
                userRESTUri = apiResourceUrl + 'sendFax';
            }
            return $resource(userRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                store: {
                    method: 'POST'
                },
                addcomment: {
                    method: 'POST'
                },
                show: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    },
                },
                lockDoc: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                },
                sendFax: {
                    method: 'POST'
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
                deleteDoc: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.phoneEncounters = function (queryType) {
            var phoneEncountersUrl = apiResourceUrl + 'phoneEncounters';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                phoneEncountersUrl = apiResourceUrl + 'phoneEncounters';
            } else if (queryType == 'show') {
                phoneEncountersUrl = apiResourceUrl + 'phoneEncounters/:id';
            } else if (queryType == 'update') {
                phoneEncountersUrl = apiResourceUrl + 'phoneEncounters/:id';
            } else if (queryType == 'remove') {
                phoneEncountersUrl = apiResourceUrl + 'phoneEncounters/:id';
            }
            return $resource(phoneEncountersUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                }
            });
        };
        factory.task = function (queryType) {
            var taskUrl = apiResourceUrl + 'task';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                taskUrl = apiResourceUrl + 'task';
            } else if (queryType == 'show') {
                taskUrl = apiResourceUrl + 'task/:id';
            } else if (queryType == 'update') {
                taskUrl = apiResourceUrl + 'task/:id';
            } else if (queryType == 'remove') {
                taskUrl = apiResourceUrl + 'task/:id';
            }
            return $resource(taskUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                }
            });
        };
        factory.officialLetters = function (queryType) {
            var officialLettersUrl = apiResourceUrl + 'officialLetters';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                officialLettersUrl = apiResourceUrl + 'officialLetters';
            } else if (queryType == 'show') {
                officialLettersUrl = apiResourceUrl + 'officialLetters/:id';
            } else if (queryType == 'update') {
                officialLettersUrl = apiResourceUrl + 'officialLetters/:id';
            } else if (queryType == 'remove') {
                officialLettersUrl = apiResourceUrl + 'officialLetters/:id';
            } else if (queryType == 'deletefile') {
                officialLettersUrl = apiResourceUrl + 'officialLetters/deletefile/:id';
            }
            return $resource(officialLettersUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                deletefile: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        factory.prescriptionRefill = function (queryType) {
            var prescriptionRefillUrl = apiResourceUrl + 'prescriptionRefill';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                prescriptionRefillUrl = apiResourceUrl + 'prescriptionRefill';
            } else if (queryType == 'show') {
                prescriptionRefillUrl = apiResourceUrl + 'prescriptionRefill/:id';
            } else if (queryType == 'update') {
                prescriptionRefillUrl = apiResourceUrl + 'prescriptionRefill/:id';
            } else if (queryType == 'remove') {
                prescriptionRefillUrl = apiResourceUrl + 'prescriptionRefill/:id';
            }
            return $resource(prescriptionRefillUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                }
            });
        };
        factory.redFlags = function (queryType) {
            var redFlagsUrl = apiResourceUrl + 'redFlags';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                redFlagsUrl = apiResourceUrl + 'redFlags';
            } else if (queryType == 'show') {
                redFlagsUrl = apiResourceUrl + 'redFlags/:id';
            } else if (queryType == 'update') {
                redFlagsUrl = apiResourceUrl + 'redFlags/:id';
            } else if (queryType == 'updateLock') {
                redFlagsUrl = apiResourceUrl + 'updateRedFlagsisLock/:id';
            } else if (queryType == 'remove') {
                redFlagsUrl = apiResourceUrl + 'redFlags/:id';
            } else if (queryType == 'checkRedFlag') {
                redFlagsUrl = apiResourceUrl + 'checkRedFlag/:id';
            }
            return $resource(redFlagsUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                updateLock: {
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
                checkRedFlag: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                }
            });
        };
        factory.smartTableTest2 = function (queryType) {
            var smrtTblTst = apiResourceUrl + 'smrtTblTst';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                smrtTblTst = apiResourceUrl + 'smrtTblTst';
            } else if (queryType == 'show') {
                smrtTblTst = apiResourceUrl + 'smrtTblTst/:id';
            } else if (queryType == 'update') {
                smrtTblTst = apiResourceUrl + 'smrtTblTst/:id';
            } else if (queryType == 'remove') {
                smrtTblTst = apiResourceUrl + 'smrtTblTst/:id';
            } else if (queryType == 'getPage') {
                smrtTblTst = apiResourceUrl + 'getPage/:id';
            }
            return $resource(smrtTblTst, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getPage: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
            });
        };
        factory.userBilling = function (queryType) {
            var userBillingUrl = apiResourceUrl + 'userBilling';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                userBillingUrl = apiResourceUrl + 'userBilling';
            } else if (queryType == 'show') {
                userBillingUrl = apiResourceUrl + 'userBilling/:id';
            } else if (queryType == 'update') {
                userBillingUrl = apiResourceUrl + 'userBilling/:id';
            } else if (queryType == 'remove') {
                userBillingUrl = apiResourceUrl + 'userBilling/:id';
            } else if (queryType == 'paymentDefaulter') {
                userBillingUrl = apiResourceUrl + 'paymentDefaulter/:id';
            } else if (queryType == 'paymentDefaulterReason') {
                userBillingUrl = apiResourceUrl + 'paymentDefaulterReason/:id';
            }
            return $resource(userBillingUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
            });
        };
        factory.careerHighlights = function (queryType) {
            var careerHighlightsUrl = apiResourceUrl + 'careerHighlights';
            if (queryType == 'query') {
                careerHighlightsUrl = apiResourceUrl + 'careerHighlights';
            } else if (queryType == 'show') {
                careerHighlightsUrl = apiResourceUrl + 'careerHighlights/:id';
            } else if (queryType == 'update') {
                careerHighlightsUrl = apiResourceUrl + 'careerHighlights/:id';
            } else if (queryType == 'remove') {
                careerHighlightsUrl = apiResourceUrl + 'careerHighlights/:id';
            } else if (queryType == 'honoraryDetailUpdate') {
                careerHighlightsUrl = apiResourceUrl + 'honoraryDetailUpdate/:id';
            }
            return $resource(careerHighlightsUrl, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                honoraryDetailUpdate: {
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
        factory.loginSuccess = function () {
            return $resource(apiResourceUrl + "updateLoginSuccess/:uid", {}, {
                query: {
                    method: 'POST',
                    params: {
                        id: '@uid'
                    },
                }
            });
        };
        factory.selfHarm = function (queryType) {
            var diagnosisRESTUri = apiResourceUrl + 'selfHarm';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                diagnosisRESTUri = apiResourceUrl + 'selfHarm';
            } else if (queryType == 'show') {
                diagnosisRESTUri = apiResourceUrl + 'selfHarm/:id';
            } else if (queryType == 'update') {
                diagnosisRESTUri = apiResourceUrl + 'selfHarm/:id';
            } else if (queryType == 'create') {
                diagnosisRESTUri = apiResourceUrl + 'selfHarm';
            } else if (queryType == 'remove') {
                diagnosisRESTUri = apiResourceUrl + 'selfHarm/:id';
            }
            return $resource(diagnosisRESTUri, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
                    params: {
                        pId: '@pId'
                    },
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
                        id: '@id',
                        pId: '@pId'
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
        factory.scBrainCall = function (queryType) {
            var medRESTUri = apiResourceUrl;
            if (queryType == 'medAdd') {
                medRESTUri = apiResourceUrl + 'scBrainToAddMedication';
            }
            return $resource(medRESTUri, {}, {
                medAdd: {
                    method: 'PUT'
                }
            });
        };
        factory.twoFactorAuthentication = function (queryType) {
            var smrtTblTst = apiResourceUrl + 'twoFactorAuthentication';
            var queryType = arguments[0] || '';
            if (queryType == 'query') {
                smrtTblTst = apiResourceUrl + 'twoFactorAuthentication';
            } else if (queryType == 'show') {
                smrtTblTst = apiResourceUrl + 'twoFactorAuthentication/:id';
            } else if (queryType == 'update') {
                smrtTblTst = apiResourceUrl + 'twoFactorAuthentication/:id';
            } else if (queryType == 'remove') {
                smrtTblTst = apiResourceUrl + 'twoFactorAuthentication/:id';
            } else if (queryType == 'getQRDetailsForUpdate') {
                smrtTblTst = apiResourceUrl + 'getQRDetailsForUpdate/:id';
            } else if (queryType == 'removeTwoFactorAuthenticationDetails') {
                smrtTblTst = apiResourceUrl + 'removeTwoFactorAuthenticationDetails/:id';
            } else if (queryType == 'sendOtpSms') {
                smrtTblTst = apiResourceUrl + 'sendOtpSms';
            }
            return $resource(smrtTblTst, {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                create: {
                    method: 'POST',
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
                getPage: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                getQRDetailsForUpdate: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                removeTwoFactorAuthenticationDetails: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                sendOtpSms: {
                    method: "POST"
                }
            });
        };
        factory.healthInsuranceCoverage = function (queryType) {
            var smrtTblTst = apiResourceUrl + 'coverage';
            var queryType = arguments[0] || '';
            if (queryType == 'setHealthInsuranceCoverage') {
                smrtTblTst = apiResourceUrl + 'setHealthInsuranceCoverage/:id';
            } else if (queryType == 'loadDataForHealthInsuranceCoverage') {
                smrtTblTst = apiResourceUrl + 'loadDataForHealthInsuranceCoverage/:id';
            } else if (queryType == 'getCoverageDataByDate') {
                smrtTblTst = apiResourceUrl + 'getCoverageDataByDate/:id';
            } else if (queryType == 'updateCoverageIncMasterData') {
                smrtTblTst = apiResourceUrl + 'updateCoverageIncMasterData/:id';
            }
            return $resource(smrtTblTst, {}, {
                setHealthInsuranceCoverage: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    },
                },
                loadDataForHealthInsuranceCoverage: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getCoverageDataByDate: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                },
                updateCoverageIncMasterData: {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                }
            });
        };
        factory.medicationCoverage = function (queryType) {
            var smrtTblTst = apiResourceUrl + 'MedicationCoverage';
            var queryType = arguments[0] || '';
            if (queryType == 'lodData') {
                smrtTblTst = apiResourceUrl + 'loadMedicationCoverageData/:id';
            } else if (queryType == 'getRefetchFormData') {
                smrtTblTst = apiResourceUrl + 'getRefetchFormDataForMedicationCoverage/:id';
            } else if (queryType == 'getMedCoverageDataByDate') {
                smrtTblTst = apiResourceUrl + 'getMedCoverageDataByDate/:id';
            } else if (queryType == 'submitRefetchForm') {
                smrtTblTst = apiResourceUrl + 'refetchFormSubmitFromMedicationCoverage/:id';
            }
            return $resource(smrtTblTst, {}, {
                lodData: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                getRefetchFormData: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id'
                    }
                },
                submitRefetchForm: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                getMedCoverageDataByDate: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        };
        factory.serviceStatements = function (queryType) {
            var smrtTblTst = apiResourceUrl + 'ServiceStatementsController';
            var queryType = arguments[0] || '';
            if (queryType == 'loadData') {
                smrtTblTst = apiResourceUrl + 'getLoadPanelDataOfSsPanel/:id/:acUid';
            } else if (queryType == 'deleteSs') {
                smrtTblTst = apiResourceUrl + 'deleteRowOfSsPanel/:id/:uid';
            }
            return $resource(smrtTblTst, {}, {
                loadData: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        id: '@id',
                        acUid: '@acUid'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                deleteSs: {
                    method: 'DELETE',
                    params: {
                        id: '@id',
                        uid: '@uid'
                    }
                },
            });
        };
        factory.processNote = function (queryType) {
            var algRESTUri = apiResourceUrl + 'processNote';
            var queryType = arguments[0] || '';
            if (queryType == 'show') {
                algRESTUri = apiResourceUrl + 'processNote/:uid';
            } else if (queryType == 'update') {
                algRESTUri = apiResourceUrl + 'processNote/:id';
            } else if (queryType == 'create') {
                algRESTUri = apiResourceUrl + 'processNoteCreate/:uid';
            } else if (queryType == 'remove') {
                algRESTUri = apiResourceUrl + 'processNote/:id';
            } else if (queryType == 'lock') {
                algRESTUri = apiResourceUrl + 'processNoteLock/:id';
            }
            return $resource(algRESTUri, {}, {
                create: {
                    method: 'PUT',
                    params: {
                        uid: '@uid'
                    },
                },
                show: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        uid: '@uid'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                },
                update: {
                    method: 'PUT',
                    isArray: false,
                    params: {
                        id: '@id'
                    },
                },
                lock: {
                    method: 'PUT',
                    isArray: false,
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