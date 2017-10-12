'use strict';

angular.module('myApp').controller("notifierTemplatesMasterCtrl", ['$scope', 'notifierTemplatesService','helpService',
    function($scope, notifierTemplatesService , helpService) {
        

        $scope.nameToShowInBreadcrumb = "Notifier templates management system";
        $scope.isOpenForFeedbackUser = false;
        $scope.changeOpenStateForFeedbackUser = function (state) {
            $scope.isOpenForFeedbackUser = state;
        };

        $scope.masterSettingToCheckPanelOpen = {
            zocdocAppointmentReminder: false,
            appointmentReminder: false,
            appointmentMissedReminder: false,
            reviewEncouragement: false,
            helpdeskAssignNotification: false,
            helpdeskCloseNotification: false,
            helpdeskCreateNotification: false,
            helpdeskCommentNotification: false,
            helpdeskReopenNotification: false,
            
            creditCardPaymentReceiveConfirmation: false,
            appointmentFeedback: false,
            appointmentConfirmationForPsychiatrist: false,
            appointmentConfirmationForTherapist: false,
            followupAppointmentConfirmationForPsychiatrist: false,
            followupAppointmentConfirmationForTherapist: false,
            matchingDoneConfirmationForPsychiatrist: false,
            matchingDoneConfirmationForTherapist: false,
            seeMeReminder: false,
            seeReminder: false,
            helpdeskPdfNotification: false,
            appointmentCancelReminder: false
        };
        $scope.panelHeaderTitle = {
            zocdocAppointmentReminder: "Click to open",
            appointmentReminder: "Click to open",
            appointmentMissedReminder: "Click to open",
            reviewEncouragement: "Click to open",
            helpdeskAssignNotification: "Click to open",
            helpdeskCloseNotification: "Click to open",
            helpdeskCreateNotification: "Click to open",
            helpdeskCommentNotification: "Click to open",
            helpdeskReopenNotification: "Click to open",
            creditCardPaymentReceiveConfirmation: "Click to open",
            appointmentFeedback: "Click to open",
            appointmentConfirmationForPsychiatrist: "Click to open",
            appointmentConfirmationForTherapist: "Click to open",
            followupAppointmentConfirmationForPsychiatrist: "Click to open",
            followupAppointmentConfirmationForTherapist: "Click to open",
            matchingDoneConfirmationForPsychiatrist: "Click to open",
            matchingDoneConfirmationForTherapist: "Click to open",
            seeMeReminder: "Click to open",
            seeReminder: "Click to open",
            helpdeskPdfNotification: "Click to open",
            appointmentCancelReminder: "Click to open"
        };
        $scope.zocdocAppointmentReminderPlaceholderHidden = true;
        $scope.appointmentReminderPlaceholderHidden = true;
        $scope.appointmentMissedReminderPlaceholderHidden = true;
        $scope.reviewEncouragementPlaceholderHidden = true;
        $scope.helpdeskAssignNotificationPlaceholderHidden = true;
        $scope.helpdeskCloseNotificationPlaceholderHidden = true;
        $scope.helpdeskCreateNotificationPlaceholderHidden = true;
        $scope.helpdeskCommentNotificationPlaceholderHidden = true;
        $scope.helpdeskReopenNotificationPlaceholderHidden = true;
        $scope.creditCardPaymentReceiveConfirmationPlaceholderHidden = true;
        $scope.appointmentFeedbackPlaceholderHidden = true;
        $scope.appointmentConfirmationForPsychiatristPlaceholderHidden = true;
        $scope.appointmentConfirmationForTherapistPlaceholderHidden = true;
        $scope.followupAppointmentConfirmationForPsychiatristPlaceholderHidden = true;
        $scope.followupAppointmentConfirmationForTherapistPlaceholderHidden = true;
        $scope.matchingDoneConfirmationForPsychiatristPlaceholderHidden = true;
        $scope.matchingDoneConfirmationForTherapistPlaceholderHidden = true;
        $scope.seeMeReminderPlaceholderHidden = true;
        $scope.seeReminderPlaceholderHidden = true;
        $scope.helpdeskPdfPlaceholderHidden = true;
        $scope.appointmentCancelReminderPlaceholderHidden = true;

        $scope.toggleCollapse = function(panelName){
            $scope.masterSettingToCheckPanelOpen[panelName] = !$scope.masterSettingToCheckPanelOpen[panelName];
            $scope.panelHeaderTitle[panelName] = $scope.masterSettingToCheckPanelOpen[panelName]==true ? "Click to close" : "Click to open";
        };

        $scope.togglePlaceholderExample = function(section){
            $scope[section] = !$scope[section];
        };


        /**
        * zocdocAppointmentReminderConfObj
        *
        */
        $scope.zocdocAppointmentReminderConfObj = {
            id: 0,
            notifierTypeID: 13,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.zocdocAppointmentReminderTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.zocdocAppointmentReminderConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        }

        /**
         * appointmentReminderEmailConfObj
         * appointmentReminderCallConfObj
         * appointmentReminderSmsConfObj
         */
        $scope.appointmentReminderWrenchObj = {
            UpdateReminders: true
        };
        $scope.appointmentReminderEmailConfObj = {
            id: 0,
            notifierTypeID: 6,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };
        $scope.appointmentReminderCallConfObj = {
            id: 0,
            notifierTypeID: 6,
            secondaryIdentifier: null,
            callTemplate: "",
            channelType: 'call'
        };
        $scope.appointmentReminderSmsConfObj = {
            id: 0,
            notifierTypeID: 6,
            secondaryIdentifier: null,
            smsBodyTemplate: "",
            channelType: 'text'
        };

        $scope.appointmentReminderEmailTemplateUpdate = function(data){
            $scope.appointmentReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentReminderEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };
        $scope.appointmentReminderVoiceCallTemplateUpdate = function(data){
            $scope.appointmentReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentReminderCallConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };
        $scope.appointmentReminderSmsTemplateUpdate = function(data){
            $scope.appointmentReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentReminderSmsConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };
        $scope.appointmentReminderUpdate = function(){
            $scope.appointmentReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('updateReminders').updateReminders({}, function(data)
            {
                if(data.action==0){
                    $scope.appointmentReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data.action);
            });
        };



        $scope.appointmentMissedReminderWrenchObj = {
            UpdateReminders: true
        };
        $scope.appointmentMissedReminderEmailConfObj = {
            id: 0,
            notifierTypeID: 10,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.appointmentMissedReminderEmailTemplateUpdate = function(data){
            $scope.appointmentMissedReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentMissedReminderEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentMissedReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };




        $scope.appointmentCancelReminderWrenchObj = {
            UpdateReminders: true
        };
        $scope.appointmentCancelReminderEmailConfObj = {
            id: 0,
            notifierTypeID: 19,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.appointmentCancelReminderEmailTemplateUpdate = function(data){
            $scope.appointmentCancelReminderWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentCancelReminderEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentCancelReminderWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };




        $scope.appointmentConfirmationForPsychiatristWrenchObj = {
            UpdateReminders: true
        };
        $scope.appointmentConfirmationForTherapistWrenchObj = {
            UpdateReminders: true
        };
        $scope.appointmentConfirmationForPsychiatristEmailConfObj = {
            id: 0,
            notifierTypeID: 9,
            secondaryIdentifier: 'forPsychiatrist',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };
        $scope.appointmentConfirmationForTherapistEmailConfObj = {
            id: 0,
            notifierTypeID: 9,
            secondaryIdentifier: 'forTherapist',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };
        $scope.followupAppointmentConfirmationForPsychiatristWrenchObj = {
            UpdateReminders: true
        };
        $scope.followupAppointmentConfirmationForTherapistWrenchObj = {
            UpdateReminders: true
        };
        $scope.followupAppointmentConfirmationForPsychiatristEmailConfObj = {
            id: 0,
            notifierTypeID: 9,
            secondaryIdentifier: 'forPsychiatristFollowup',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };
        $scope.followupAppointmentConfirmationForTherapistEmailConfObj = {
            id: 0,
            notifierTypeID: 9,
            secondaryIdentifier: 'forTherapistFollowup',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.matchingDoneConfirmationForPsychiatristEmailConfObj = {
            id: 0,
            notifierTypeID: 31,
            secondaryIdentifier: 'forPsychiatristMatching',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.matchingDoneConfirmationForTherapistEmailConfObj = {
            id: 0,
            notifierTypeID: 31,
            secondaryIdentifier: 'forTherapistMatching',
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.matchingDoneConfirmationForPsychiatristWrenchObj = {
            UpdateReminders: true
        };
        $scope.matchingDoneConfirmationForTherapistWrenchObj = {
            UpdateReminders: true
        };

        $scope.appointmentConfirmationForPsychiatristEmailTemplateUpdate = function(data){
            $scope.appointmentConfirmationForPsychiatristWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentConfirmationForPsychiatristEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentConfirmationForPsychiatristWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        $scope.appointmentConfirmationForTherapistEmailTemplateUpdate = function(data){
            $scope.appointmentConfirmationForTherapistWrenchObj.UpdateReminders = false;
            console.log($scope.appointmentConfirmationForTherapistEmailConfObj)
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentConfirmationForTherapistEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.appointmentConfirmationForTherapistWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        $scope.followupAppointmentConfirmationForPsychiatristEmailTemplateUpdate = function(data){
            $scope.followupAppointmentConfirmationForPsychiatristWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.followupAppointmentConfirmationForPsychiatristEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.followupAppointmentConfirmationForPsychiatristWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        $scope.followupAppointmentConfirmationForTherapistEmailTemplateUpdate = function(data){
            $scope.followupAppointmentConfirmationForTherapistWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.followupAppointmentConfirmationForTherapistEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.followupAppointmentConfirmationForTherapistWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        $scope.matchingDoneConfirmationForPsychiatristEmailTemplateUpdate = function(data){
            $scope.matchingDoneConfirmationForPsychiatristWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.matchingDoneConfirmationForPsychiatristEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.matchingDoneConfirmationForPsychiatristWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        $scope.matchingDoneConfirmationForTherapistEmailTemplateUpdate = function(data){
            $scope.matchingDoneConfirmationForTherapistWrenchObj.UpdateReminders = false;
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.matchingDoneConfirmationForTherapistEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.matchingDoneConfirmationForTherapistWrenchObj.UpdateReminders = true;
                }
                //console.log(data);
            });
        };

        /**
         * reviewEncouragementEmailConfObj
         *
         */
        $scope.reviewEncouragementEmailConfObj = {
            id: 0,
            notifierTypeID: 20,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.reviewEncouragementEmailTemplateUpdate = function(){

            notifierTemplatesService.notifierTemplateSettings('create').create($scope.reviewEncouragementEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
                //console.log(data);
            });
        };

        $scope.helpdeskAssignNotificationConfObj = {
            id: 0,
            notifierTypeID: 22,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskAssignNotificationTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskAssignNotificationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.helpdeskCloseNotificationConfObj = {
            id: 0,
            notifierTypeID: 24,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskCloseNotificationTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskCloseNotificationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.helpdeskCreateNotificationConfObj = {
            id: 0,
            notifierTypeID: 23,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskCreateNotificationTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskCreateNotificationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.helpdeskCommentNotificationConfObj = {
            id: 0,
            notifierTypeID: 15,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskCommentNotificationTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskCommentNotificationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.helpdeskReopenNotificationConfObj = {
            id: 0,
            notifierTypeID: 25,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskReopenNotificationTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskReopenNotificationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.creditCardPaymentReceiveConfirmationConfObj = {
            id: 0,
            notifierTypeID: 26,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.creditCardPaymentReceiveConfirmationTemplateUpdate = function(data){
            //console.log(data);
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.creditCardPaymentReceiveConfirmationConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.appointmentFeedbackEmailConfObj = {
            id: 0,
            notifierTypeID: 21,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.appointmentFeedbackEmailTemplateUpdate = function(){

            notifierTemplatesService.notifierTemplateSettings('create').create($scope.appointmentFeedbackEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
                //console.log(data);
            });
        };

        helpService.helpDeskReport('allHelpDoctor').allHelpDoctor(
            {
                id: null
            }, function (data) {
                var arData = data.data;
                $scope.userDataSetDoctor = [];
                arData.forEach(function (obj, idx) {
                    $scope.userDataSetDoctor.push(obj);
                });
                $scope.availableOptions2 = [].concat($scope.userDataSetDoctor);
            });

        $scope.getDefaultUser = function (){
            notifierTemplatesService.notifierTemplateSettings('getDefaultUserForAppointmentFeedback').getDefaultUserForAppointmentFeedback({'reminderId':21},function (data) {
                $scope.feedbackDefaultAppointmentUserName = data.appointmentcoordinator.name;
                $scope.feedbackDefaultAppointmentUserEmail = data.appointmentcoordinator.emailAddress;
            });
        };

        $scope.getDefaultUser();

        $scope.updateDefaultUser = function (arBio, index, newData, fieldVal) {
            if (_.isUndefined(newData)) {
                $scope.showAddressMessagePanel('Field can not be blank', 'alert-warning');
                return false;
            }
            var data = {};
            data = {
                'data': newData,
                'id': fieldVal
            };

        notifierTemplatesService.notifierTemplateSettings('updateDefaultUser').updateDefaultUser(
            data, function (data) {
                $scope.isOpenForFeedbackUser = false;
                $scope.getDefaultUser();
                });
        };

        $scope.seeMeReminderEmailConfObj = {
            id: 0,
            notifierTypeID: 32,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };
        $scope.seeReminderEmailConfObj = {
            id: 0,
            notifierTypeID: 34,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.seeMeReminderEmailTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.seeMeReminderEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };
        $scope.seeReminderEmailTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.seeReminderEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.helpdeskPdfEmailConfObj = {
            id: 0,
            notifierTypeID: 33,
            secondaryIdentifier: null,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            channelType: 'email'
        };

        $scope.helpdeskPdfEmailTemplateUpdate = function(data){
            notifierTemplatesService.notifierTemplateSettings('create').create($scope.helpdeskPdfEmailConfObj, function(data)
            {
                if(data.data!=='error'){
                    $scope.getData();
                }
            });
        };

        $scope.getData = function(){
            notifierTemplatesService.notifierTemplateSettings('query').query( function(data)
            {
                if(data.data.email!=='nothing found'){
                    if(!_.isUndefined(data.data.email[13])) {
                        angular.forEach(data.data.email[13], function(val,key){
                            //console.log(val);
                            $scope.zocdocAppointmentReminderConfObj.id = val.id;
                            $scope.zocdocAppointmentReminderConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.zocdocAppointmentReminderConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.zocdocAppointmentReminderConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[6])) {
                        angular.forEach(data.data.email[6], function(val,key){
                            //console.log(val);
                            $scope.appointmentReminderEmailConfObj.id = val.id;
                            $scope.appointmentReminderEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentReminderEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.appointmentReminderEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[10])) {
                        angular.forEach(data.data.email[10], function(val,key){
                            //console.log(val);
                            $scope.appointmentMissedReminderEmailConfObj.id = val.id;
                            $scope.appointmentMissedReminderEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentMissedReminderEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.appointmentMissedReminderEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }

                    if(!_.isUndefined(data.data.email[19])) {
                        angular.forEach(data.data.email[19], function(val,key){
                            //console.log(val);
                            $scope.appointmentCancelReminderEmailConfObj.id = val.id;
                            $scope.appointmentCancelReminderEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentCancelReminderEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.appointmentCancelReminderEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }

                    if(!_.isUndefined(data.data.email[9])) {
                        angular.forEach(data.data.email[9], function(val,key){
                            //console.log(val);
                            if(val.secondaryIdentifier == 'forPsychiatrist') {
                                $scope.appointmentConfirmationForPsychiatristEmailConfObj.id = val.id;
                                $scope.appointmentConfirmationForPsychiatristEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.appointmentConfirmationForPsychiatristEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.appointmentConfirmationForPsychiatristEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                            if(val.secondaryIdentifier == 'forTherapist') {
                                $scope.appointmentConfirmationForTherapistEmailConfObj.id = val.id;
                                $scope.appointmentConfirmationForTherapistEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.appointmentConfirmationForTherapistEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.appointmentConfirmationForTherapistEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                            if(val.secondaryIdentifier == 'forPsychiatristFollowup') {
                                $scope.followupAppointmentConfirmationForPsychiatristEmailConfObj.id = val.id;
                                $scope.followupAppointmentConfirmationForPsychiatristEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.followupAppointmentConfirmationForPsychiatristEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.followupAppointmentConfirmationForPsychiatristEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                            if(val.secondaryIdentifier == 'forTherapistFollowup') {
                                $scope.followupAppointmentConfirmationForTherapistEmailConfObj.id = val.id;
                                $scope.followupAppointmentConfirmationForTherapistEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.followupAppointmentConfirmationForTherapistEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.followupAppointmentConfirmationForTherapistEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                        });
                    }
                    if(!_.isUndefined(data.data.email[31])) {
                        angular.forEach(data.data.email[31], function(val,key){
                            if(val.secondaryIdentifier == 'forPsychiatristMatching') {
                                $scope.matchingDoneConfirmationForPsychiatristEmailConfObj.id = val.id;
                                $scope.matchingDoneConfirmationForPsychiatristEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.matchingDoneConfirmationForPsychiatristEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.matchingDoneConfirmationForPsychiatristEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                            if(val.secondaryIdentifier == 'forTherapistMatching') {
                                $scope.matchingDoneConfirmationForTherapistEmailConfObj.id = val.id;
                                $scope.matchingDoneConfirmationForTherapistEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                                $scope.matchingDoneConfirmationForTherapistEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                                $scope.matchingDoneConfirmationForTherapistEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                            }
                        });
                    }
                    if(!_.isUndefined(data.data.email[20])) {
                        angular.forEach(data.data.email[20], function(val,key){
                            //console.log(val);
                            $scope.reviewEncouragementEmailConfObj.id = val.id;
                            $scope.reviewEncouragementEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.reviewEncouragementEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.reviewEncouragementEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[22])) {
                        angular.forEach(data.data.email[22], function(val,key){
                            //console.log(val);
                            $scope.helpdeskAssignNotificationConfObj.id = val.id;
                            $scope.helpdeskAssignNotificationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskAssignNotificationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskAssignNotificationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[23])) {
                        angular.forEach(data.data.email[23], function(val,key){
                            //console.log(val);
                            $scope.helpdeskCreateNotificationConfObj.id = val.id;
                            $scope.helpdeskCreateNotificationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskCreateNotificationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskCreateNotificationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[24])) {
                        angular.forEach(data.data.email[24], function(val,key){
                            //console.log(val);
                            $scope.helpdeskCloseNotificationConfObj.id = val.id;
                            $scope.helpdeskCloseNotificationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskCloseNotificationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskCloseNotificationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[15])) {
                        angular.forEach(data.data.email[15], function(val,key){
                            //console.log(val);
                            $scope.helpdeskCommentNotificationConfObj.id = val.id;
                            $scope.helpdeskCommentNotificationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskCommentNotificationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskCommentNotificationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[25])) {
                        angular.forEach(data.data.email[25], function(val,key){
                            //console.log(val);
                            $scope.helpdeskReopenNotificationConfObj.id = val.id;
                            $scope.helpdeskReopenNotificationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskReopenNotificationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskReopenNotificationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[26])) {
                        angular.forEach(data.data.email[26], function(val,key){
                            //console.log(val);
                            $scope.creditCardPaymentReceiveConfirmationConfObj.id = val.id;
                            $scope.creditCardPaymentReceiveConfirmationConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.creditCardPaymentReceiveConfirmationConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.creditCardPaymentReceiveConfirmationConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[21])) {
                        angular.forEach(data.data.email[21], function(val,key){
                            //console.log(val);
                            $scope.appointmentFeedbackEmailConfObj.id = val.id;
                            $scope.appointmentFeedbackEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentFeedbackEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.appointmentFeedbackEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[32])) {
                        angular.forEach(data.data.email[32], function(val,key){
                            //console.log(val);
                            $scope.seeMeReminderEmailConfObj.id = val.id;
                            $scope.seeMeReminderEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.seeMeReminderEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.seeMeReminderEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[34])) {
                        angular.forEach(data.data.email[34], function(val,key){
                            //console.log(val);
                            $scope.seeReminderEmailConfObj.id = val.id;
                            $scope.seeReminderEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.seeReminderEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.seeReminderEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                    if(!_.isUndefined(data.data.email[33])) {
                        angular.forEach(data.data.email[33], function(val,key){
                            //console.log(val);
                            $scope.helpdeskPdfEmailConfObj.id = val.id;
                            $scope.helpdeskPdfEmailConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.helpdeskPdfEmailConfObj.emailSubjectTemplate = val.emailSubjectTemplate;
                            $scope.helpdeskPdfEmailConfObj.emailBodyTemplate = val.emailBodyTemplate;
                        });
                    }
                }
                if(data.data.call!=='nothing found'){
                    if(!_.isUndefined(data.data.call[6])) {
                        angular.forEach(data.data.call[6], function(val,key){
                            //console.log(val);
                            $scope.appointmentReminderCallConfObj.id = val.id;
                            $scope.appointmentReminderCallConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentReminderCallConfObj.callTemplate = val.callTemplate;
                        });
                    }
                }
                if(data.data.sms!=='nothing found'){
                    if(!_.isUndefined(data.data.sms[6])) {
                        angular.forEach(data.data.sms[6], function(val,key){
                            //console.log(val);
                            $scope.appointmentReminderSmsConfObj.id = val.id;
                            $scope.appointmentReminderSmsConfObj.secondaryIdentifier = val.secondaryIdentifier;
                            $scope.appointmentReminderSmsConfObj.smsBodyTemplate = val.smsBodyTemplate;
                        });
                    }
                }
            });
        }


        $scope.getData();

        /*$scope.confObj = {
            sendingScriptIsEnabled: false,
            emailSubjectTemplate: "",
            emailBodyTemplate: "",
            smsBodyTemplate: "",
            settingsId: null,
            emailSubjectPlaceholderSuggestion: {'display':'none','top':'0px','right':'0px'}
        };
        $scope.wrenchObj = {
            UpdateReminders: true
        };
        

        
        $scope.appendIt = function(templateName,placeHolder){
            if(templateName=='subject'){
                $scope.confObj.emailSubjectTemplate = $scope.confObj.emailSubjectTemplate.slice(0,-1);
                $scope.confObj.emailSubjectTemplate = $scope.confObj.emailSubjectTemplate + placeHolder+ ' ';
                //$scope.confObj.emailSubjectPlaceholderSuggestion.display = 'none';
            }
        }
        $scope.getSuggestion = function(event){
            if(event.key!='Shift' && event.key!='%'){
                $scope.confObj.emailSubjectPlaceholderSuggestion.display = 'none';
            }
            else if(event.key=='%'){
                $scope.confObj.emailSubjectPlaceholderSuggestion.display = 'block';
            }
            
        }
        
        $scope.updateReminders = function(){
            $scope.wrenchObj.UpdateReminders = false;
            notifierTemplatesService.remindersMasterSettings('updateReminders').updateReminders({}, function(data)
            {  
                if(data.action==0){
                    $scope.wrenchObj.UpdateReminders = true;
                }
                //console.log(data.action); 
            }); 
        }
        $scope.updateEmailSubject = function(data){
            //console.log('Subject'); 
            //console.log(data); 
            $scope.confObj.emailSubjectTemplate = data;
            $scope.wrenchObj.UpdateReminders = false;
            notifierTemplatesService.remindersMasterSettings('create').create($scope.confObj, function(data)
            {  
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.wrenchObj.UpdateReminders = true;
                }
                //console.log('done'); 
            });
        }
        
        $scope.updateEmailBody = function(data){
            //console.log('Email Body'); 
            //console.log(data); 
            $scope.confObj.emailBodyTemplate = data;
            $scope.wrenchObj.UpdateReminders = false;
            notifierTemplatesService.remindersMasterSettings('create').create($scope.confObj, function(data)
            {  
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.wrenchObj.UpdateReminders = true;
                }
                //console.log('done'); 
            });
        }
        
        $scope.updateSmsBody = function(data){
            //console.log('SMS Body'); 
            //console.log(data); 
            $scope.confObj.smsBodyTemplate = data;
            $scope.wrenchObj.UpdateReminders = false;
            notifierTemplatesService.remindersMasterSettings('create').create($scope.confObj, function(data)
            {  
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.wrenchObj.UpdateReminders = true;
                }
                //console.log('done'); 
            });
        }
        
        $scope.getData = function(){
            notifierTemplatesService.remindersMasterSettings('query').query( function(data)
            {  
                if(data.data!=='nothing found' && data.data[0].isItLatest==1){
                    $scope.confObj.sendingScriptIsEnabled = data.data[0].isSendingScriptEnabled=='Yes';
                    $scope.confObj.emailSubjectTemplate = data.data[0].emailSubjectTemplate;
                    $scope.confObj.emailBodyTemplate = data.data[0].emailBodyTemplate;
                    $scope.confObj.smsBodyTemplate = data.data[0].smsBodyTemplate;
                    $scope.confObj.settingsId = data.data[0].id;
                }
            });
        }
        
        //$scope.getData();*/
    }
]);

angular.module('myApp').service("notifierTemplatesService", ['$resource',
    function($resource) {
        var factory = {};

        factory.notifierTemplateSettings = function(queryType) {
            var notifierTemplateSettingsRESTUri = apiResourceUrl + 'notifierTemplateSettings';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                notifierTemplateSettingsRESTUri += '/:id';
            } else if (queryType == 'updateReminders') {
                notifierTemplateSettingsRESTUri = apiResourceUrl + 'updateScheduledAppointmentReminders';
            }
            else if (queryType == 'getDefaultUserForAppointmentFeedback') {
                notifierTemplateSettingsRESTUri = apiResourceUrl + 'getDefaultUserForAppointmentFeedback';
            }
            else if (queryType == 'updateDefaultUser') {
                notifierTemplateSettingsRESTUri = apiResourceUrl + 'updateDefaultUser';
            }
            return $resource(notifierTemplateSettingsRESTUri, {}, {
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
                updateReminders: {
                    method: 'POST'
                },
                getDefaultUserForAppointmentFeedback: {
                    method: 'POST'
                },
                updateDefaultUser: {
                    method: 'POST'
                },
            });
        };

        return factory;
    }
]);