'use strict';

angular.module('myApp').controller("eventRemindersMasterCtrl", ['$scope', 'reminderMasterService',
    function($scope, reminderMasterService) {
        
        /*$scope.confObj = {
            sendingScriptIsEnabled: true,
            emailSubjectTemplate: "System generated reminder for %eType% scheduled on %eStartTime%.",
            emailBodyTemplate: "Hi!\n"+
"This is a system generated %eType% reminder for %salutation% %fullNameOfUser%.\n"+
"The %eType% is scheduled on %eStartTime%.\n",
            smsBodyTemplate: "Hi!\n"+
"This is a system generated %eType% reminder for %salutation% %fullNameOfUser%.\n"+
"The %eType% is scheduled on %eStartTime%.\n"
        };*/
        $scope.nameToShowInBreadcrumb = "Event reminders management";
        $scope.confObj = {
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
        
        /*$scope.changeSendingScriptRunningStatus = function(choice){
            $scope.confObj.sendingScriptIsEnabled = choice=='enable';
            reminderMasterService.remindersMasterSettings('create').create($scope.confObj, function(data) 
            {  
                if(data.data!=='error'){
                    $scope.getData();
                }
                //console.log('done'); 
            });
        }*/
        
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
                /*console.log(event.key); */
            }
            else if(event.key=='%'){
                $scope.confObj.emailSubjectPlaceholderSuggestion.display = 'block';
                /*console.log('fffff');*/ 
            }
            
        }
        
        $scope.updateReminders = function(){
            $scope.wrenchObj.UpdateReminders = false;
            reminderMasterService.remindersMasterSettings('updateReminders').updateReminders({}, function(data) 
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
            reminderMasterService.remindersMasterSettings('create').create($scope.confObj, function(data) 
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
            reminderMasterService.remindersMasterSettings('create').create($scope.confObj, function(data) 
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
            reminderMasterService.remindersMasterSettings('create').create($scope.confObj, function(data) 
            {  
                if(data.data!=='error'){
                    $scope.getData();
                    $scope.wrenchObj.UpdateReminders = true;
                }
                //console.log('done'); 
            });
        }
        
        $scope.getData = function(){
            reminderMasterService.remindersMasterSettings('query').query( function(data) 
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
        
        $scope.getData();
    }
]);

angular.module('myApp').service("reminderMasterService", ['$resource',
    function($resource) {
        var factory = {};

        factory.remindersMasterSettings = function(queryType) {
            var remindersMasterSettingsRESTUri = apiResourceUrl + 'remindersMasterSettings';
            var queryType = arguments[0] || '';
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                remindersMasterSettingsRESTUri += '/:id';
            } else if (queryType == 'getRemindersMasterSettings') {
                remindersMasterSettingsRESTUri = apiResourceUrl + 'getRemindersMasterSettings';
            } else if (queryType == 'updateReminders') {
                remindersMasterSettingsRESTUri = apiResourceUrl + 'updateScheduledReminders';
            }
            return $resource(remindersMasterSettingsRESTUri, {}, {
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
                getRemindersMasterSettings: {
                    method: 'POST'
                },
                updateReminders: {
                    method: 'POST'
                },
            });
        };

        return factory;
    }
]);