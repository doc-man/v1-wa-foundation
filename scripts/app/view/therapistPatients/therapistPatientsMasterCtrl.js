'use strict';
angular.module('myApp').controller("therapistPatientsMasterCtrl", ['$scope', '$rootScope', '$state', 'userServices', '$stateParams', '$filter', '$cookieStore', '$timeout',
    function($scope, $rootScope, $state, userServices, $stateParams, $filter, $cookieStore, $timeout) {
        $scope.nameToShowInBreadcrumb = "Therapist patients";
        $scope.loggedInUser = $cookieStore.get("loginObj");
        $scope.accesskey = $scope.loggedInUser.accesskey;
        // Initial level Users list to chat
        $scope.getInitialAllPatientsDetails = function () {
            $scope.patientDetails = [];
            userServices.therapy('getAllPatients').getAllPatients({
                therapistId : $scope.accesskey
            }, function (data) {
                $scope.noOfPatients = data.AllPatientLists.length;
                $scope.patientDetails = data.AllPatientLists;
                $scope.therapistName = data.therapistName;
            });
        };

        $scope.getInitialAllPatientsDetails();

        /***************************CHAT FUNCTIONALITY START OVER HERE***********************************************/

        $scope.loggedInUser = $cookieStore.get("loginObj");
        $scope.accesskey = $scope.loggedInUser.accesskey;
        $rootScope.activePatientId = '';
        $scope.openChatWindow = false;

        // Save value after post a chat
        $scope.saveChatVal = function (msg) {

            //console.log(msg.rawhtml);

            var emojiMsg, emojiMsgText, fullText;
            if (angular.isUndefined(msg.message) || msg.message == null) {
                emojiMsg = '';
            }
            else {
                emojiMsg = msg.message;
            }
            if (angular.isUndefined(msg.messagetext) || msg.messagetext == null) {
                emojiMsgText = '';
            }
            else {
                emojiMsgText = msg.messagetext;
            }

            fullText = emojiMsg+emojiMsgText;


            //console.log(msg);

            
            if (angular.isUndefined(fullText) || fullText == null || fullText == '') {
                // Not to submit the value
            }
            else {


                userServices.chat('addMsg').addMsg({
                    msg: fullText,
                    senderId: $scope.accesskey,
                    receiverId: $rootScope.activePatientId
                }, function (data) {
                    $scope.emojiMessage={};
                    var ChatText = angular.element( document.querySelector( '#messageDiv' ) );
                    ChatText.empty();
                });
            }

        };

        // Function to execute each time to change count of unread notification
        $scope.getAllPatientsDetails = function (unreadChatMsgCount, pid, requestTo) {
            var obj = _.findWhere($scope.patientDetails,
                {
                    uid: pid
                });
            var idx = $scope.patientDetails.indexOf(obj);

            if (requestTo == 'plus') {
                $scope.patientDetails[idx].unreadMsgCount = $scope.patientDetails[idx].unreadMsgCount + unreadChatMsgCount;
            }
            else {
                $scope.patientDetails[idx].unreadMsgCount = $scope.patientDetails[idx].unreadMsgCount - unreadChatMsgCount;
            }
        };

        $scope.typingStatus = function (senderName) {
            userServices.chat('typingStat').typingStat({
                senderName : senderName,
                receiverId: $rootScope.activePatientId
            });
        };


        // Socket start over here
        $scope.socketFlag = true;
        var vrChannelId = 's-c-u' + $scope.accesskey;
        //$scope.getInstantMsgBySocket = function () {}
        vrGlobalSocket.on(vrChannelId, function (data) {
            $scope.$apply(function () {
                var objSocketData = JSON.parse(data);
                if (objSocketData.action == "typingStat") {
                    $scope.typingStat = objSocketData.senderName+" is typing ...";
                    $timeout(function() { $scope.typingStat = ''; }, 7000);
                }
                else {
                    $scope.typingStat = '';
                    var userChatLastId = [];
                    var unreadChat = {};
                    var unreadChat = {
                        ids: objSocketData.lastInsertedID
                    };
                    userChatLastId.push(unreadChat);
                    var chatMsg = {
                        msg: objSocketData.dataSet.message,
                        msgDt: new Date(), //msgDt: objSocketData.curDate,
                        senderId: objSocketData.dataSet.senderId,
                        receiverId: objSocketData.dataSet.receiverId,
                    };
                    // This if else only works when therapist open a chat box
                    if ($rootScope.activePatientId == objSocketData.dataSet.senderId && $scope.accesskey == objSocketData.dataSet.receiverId) {
                        chatMsg['ownMsg'] = false;
                        $scope.chatList.push(chatMsg);
                    }
                    else if ($rootScope.activePatientId == objSocketData.dataSet.receiverId && $scope.accesskey == objSocketData.dataSet.senderId) {
                        chatMsg['ownMsg'] = true;
                        $scope.chatList.push(chatMsg);
                        $scope.newMsg.message = '';
                    }
                    // This if else handles the unread msg count status value
                    //console.log($rootScope.activePatientId+ " | " +$scope.activeUserTabId + " | " +objSocketData.dataSet.senderId + " | " +objSocketData.dataSet.receiverId + " | " +$scope.currentUserId + " | " + $scope.workspace.id);
                    if (objSocketData.dataSet.senderId == $rootScope.activePatientId) {
                        $scope.changeUnreadChatStatus(userChatLastId, 0, objSocketData.dataSet.senderId, 'plus');
                        $scope.bottomScroolBar();
                    }
                    else if ($rootScope.activePatientId == objSocketData.dataSet.receiverId) {
                        $scope.bottomScroolBar();
                    }
                    else {
                        $scope.getAllPatientsDetails(1, objSocketData.dataSet.senderId, 'plus');
                    }
                }

            });
        });


        // Get chat history
        $scope.gelOldChatList = function (pid, unreadChatMsgCount) {
            userServices.chat('getAllChat').getAllChat({
                    receiverId : pid,
                    senderId : $scope.accesskey,
                },
                function(data) {
                    $scope.unreadChatIds = [];
                    data.allChats.forEach(function(chat)
                    {
                        if (chat.flag == 0) {
                            var unreadChat = {
                                ids : chat.id
                            };
                            $scope.unreadChatIds.push(unreadChat);
                        }
                        //var findDate = $scope.properDateSet(chat.created_at);
                        var dateStr = chat.created_at;
                        var onlyDate = dateStr.substr(0,dateStr.indexOf(' '));
                        var onlyTime = dateStr.substr(dateStr.indexOf(' ')+1);
                        var newDate = onlyDate+'T'+onlyTime+'Z';
                        var chatMsg = {
                            msg: chat.message,
                            msgDt: newDate,
                            senderId: chat.senderId,
                            receiverId: chat.receiverId,
                            ownMsg: ($scope.accesskey == chat.senderId) ? true : false
                        };
                        $scope.chatList.push(chatMsg);
                    });
                    if (unreadChatMsgCount > 0 && unreadChatMsgCount != null) {
                        $scope.changeUnreadChatStatus($scope.unreadChatIds, unreadChatMsgCount, pid, 'minus');
                    }
                });
        };

        // Change unread chat message status
        $scope.changeUnreadChatStatus = function (unreadChatIds, unreadChatMsgCount, pid, toDo) {
            userServices.chat('changeUnreadChatStat').changeUnreadChatStat({
                unreadChatIds : unreadChatIds,
                currentUserId : $scope.accesskey
        }, function (data) {
                $scope.getAllPatientsDetails(unreadChatMsgCount, pid, toDo);
            });
        };

        // Auto Scroll Function
        $scope.bottomScroolBar = function () {
            $timeout(function(){$('#chatUl').animate({scrollTop:$('#chatUl')[0].scrollHeight}, 'slow')}, 1000);
        };


        /*$scope.chatUserInfo = function (newMsg, pid) {
            newMsg.receiverId = pid;
            userServices.chat('userInfo').userInfo(newMsg, function(data)
            {
                //var receverId = $scope.newMsg.receiver.id.split("-")[1];
                data.userInfo.forEach(function(user)
                {
                    if(user.uid==$scope.accesskey) {
                        if(user.imgId) {
                            $scope.newMsg.senderImageUrl = '/api/showOldImages/' + user.imgId + '?uid=' + user.uid;
                        }
                        else {
                            $scope.newMsg.senderImageUrl = 'app/images/profile-photo-blank.png';
                        }
                        $scope.newMsg.senderInfo = user;
                    }
                    else if(user.uid==pid){
                        if(user.imgId) {
                            $scope.newMsg.receiverImageUrl = '/api/showOldImages/' + user.imgId + '?uid=' + user.uid;
                        }
                        else {
                            $scope.newMsg.receiverImageUrl = 'app/images/profile-photo-blank.png';
                        }
                        $scope.newMsg.receiverInfo = user;
                    }
                })

            });
        };*/
        $scope.activeChatWindow = function (pid, unreadChatMsg, pName, therapistName) {
            if (pid) {
                $scope.emojiMessage={};
                var ChatText = angular.element( document.querySelector( '#messageDiv' ) );
                ChatText.empty();
                $scope.receiverName = pName;
                $scope.therapistName = therapistName;
                $scope.bottomScroolBar();
                $scope.chatList = [];
                $scope.newMsg = {
                    showChatBox : false,
                    senderId : $scope.accesskey,
                    message : '',
                };
                $rootScope.activePatientId = pid;
                //$scope.chatUserInfo($scope.newMsg, pid);
                $scope.gelOldChatList(pid, unreadChatMsg);
                $scope.openChatWindow = true;
            }
        };

        /***************************CHAT FUNCTIONALITY END***********************************************/

    }]);

    /*emojiApp.controller('emojiController', ['$scope', function($scope) {

        $scope.emojiMessage={};
    }]);*/