'use strict';
angular.module('myApp').controller("medicationsMasterCtrl", ['$scope', '$timeout', 'medicationService','userServices','$uibModal','$filter',
    function($scope, $timeout, medicationService, userServices, $uibModal,$filter) {
        var actionButtons = '<button class="btn btn-warning btn-xs" ng-click="grid.appScope.removethis(row.entity)">Remove</button>';
        $scope.nameToShowInBreadcrumb = "Medications";
        $scope.itemsByPage = 25;
        $scope.paginationInfo = {};
        $scope.masterData = {};
        $scope.masterData.messageVal = '';
        //$rootScope.pageSubTitle = "Medication";
        if($scope.masterdbObj.allowedToMasterDB == 'No')
        {
            $scope.masterdbObj.showNextLevel = false;  
        }
        if (!$scope.masterData.medicationList) {
            medicationService.masterMedicationList().query(function(data) {
                $scope.masterData.medicationList = [];
                 if(data.data.length==0){
                    
                    $scope.masterData.messageVal ='Nothing found';
                    
                }else{
                    $scope.masterData.messageVal ='';
                } 
                $scope.masterData.medicationList = data.data;
                $scope.displayMedicationList = [].concat($scope.masterData.medicationList);

                $scope.oldMedicationData = [];
                $scope.oldMedicationData = angular.copy($scope.displayMedicationList);
                
                /* For Pagignation */
                $scope.paginationInfo.currentItemCount = data.data.length;
                $scope.numberOfPages = Math.ceil( $scope.paginationInfo.currentItemCount/$scope.itemsByPage);
                $scope.paginationInfo =  data.data; 
                $scope.paginationInfo.totalItemCount = data.data.length;
            });
        }        
        if(!$scope.masterData.medicationStrengthDataSet) {
          $scope.masterData.medicationStrengthDataSet = [];
            medicationService.masterMedication('strengthlist').strengthlist(function(data) {
                data.data.forEach(function(val, idx) {
                    $scope.masterData.medicationStrengthDataSet.push({
                        id: val.id,
                        name: val.strength
                    })
                });
            });
        }
        if(!$scope.masterData.medicationFormDataSet) {
          $scope.masterData.medicationFormDataSet = [];
            medicationService.masterMedication('formlist').formlist(function(data) {
                data.data.forEach(function(val, idx) {
                    $scope.masterData.medicationFormDataSet.push({
                        id: val.id,
                        name: val.form
                    })
                });
            });
        }
        $scope.medicineType = [{
            id: 1,
            brandOrGeneric: "Brand"
        },{
            id: 2,
            brandOrGeneric: "Generic"
        }]; 
        $scope.msSettings = {
            enableSearch: true,
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function(itemText, originalItem) {
                return originalItem.id;
            }
        };
        $scope.msg = {};
        $scope.mediObj = {};
        $scope.formName = "";
        $scope.strengthName = "";

        /*
         Q) Why we need this  function  fnAddMedication()?
         A) For 1 reason:
         1. To add new row for adding new medicine details when clicked on '+' sign of master medication panel.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnAddMedication = function() 
        {
            var medication = {                
                id: null,                   
                name: null,
                brandOrGeneric: null,
                uniqueRowId: Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            }
            $scope.masterData.medicationList.splice(0,0,medication);
            $scope.displayMedicationList =[].concat($scope.masterData.medicationList);
            $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
        };

        /*
         Q) Why we need this  function  addNewMedicationForm(prFormName)?
         A) For 1 reason:
         1. To add new form for medicine if form is not exist.
         Added by: Arjun on 27 June 2016.
         */
        $scope.addNewMedicationForm = function(prFormName)
        {
            if(prFormName === '' || prFormName === 'undefined')
            {
                /*
                 Q) Why we need to check  if(prFormName === '' || prFormName === 'undefined')?
                 A) For 1 reason:
                 1. If form textbox will be empty then show a message to form name must not be blank.
                 */

                $scope.showPannelMessageBoard('Medication form name must not be blank.', 'alert-danger', 3000);
            }
            else
            {               
                $scope.flgFormNameMatched = false;
                $scope.masterData.medicationFormDataSet.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = prFormName;
                    if(obj.name != null)
                    {
                        $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    }
                    
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if($scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgFormNameMatched = true; 
                    };

                }); 

                if( $scope.flgFormNameMatched == true ) 
                {               
                    $scope.showPannelMessageBoard('Medication Form Name already exist.', 'alert-danger', 3000); 
                    return "";        
                }
                else
                {
                    var arData = {};
                    arData.prFormName = prFormName;
                    medicationService.masterMedication('createform').createform({}, arData, function(data) {
                        $scope.hideAddForm();
                        //$scope.masterData.medicationFormDataSet.push(data.data);
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                        $scope.prFormName = "";
                    }); 
                }
            }
        };

        /*
         Q) Why we need this  function  addNewMedicationStrength(prStrengthName)?
         A) For 1 reason:
         1. To add new strength for medicine if strength is not exist.
         Added by: Arjun on 27 June 2016.
         */
        $scope.addNewMedicationStrength = function(prStrengthName)
        {
            if(prStrengthName === '' || prStrengthName === 'undefined')
            {
                $scope.showPannelMessageBoard('Medication strength name must not be blank.', 'alert-danger', 3000);
                
            }
            else
            {                
                $scope.flgStrengthNameMatched = false;
                $scope.masterData.medicationStrengthDataSet.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = prStrengthName;
                    if(obj.name != null)
                    {
                        $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    }
                    
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if($scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgStrengthNameMatched = true; 
                    };

                });
                if( $scope.flgStrengthNameMatched == true ) 
                {               
                    $scope.showPannelMessageBoard('Medication Strength Name already exist.', 'alert-danger', 3000); 
                    return "";        
                }
                else
                {
                    var arData = {};
                    arData.prStrengthName = prStrengthName;
                    medicationService.masterMedication('createstrength').createstrength({}, arData, function(data) {
                        $scope.hideAddStrength();
                        //$scope.masterData.medicationStrengthDataSet.push(data.data);
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                        $scope.prStrengthName = "";
                    });
                }
                
            }
        };


        /*
         Q) Why we need this  function  checkMedicationName(rowObj, data, fieldname)?
         A) For 1 reason:
         1. To check medicine name is not blanked and medicine is already present or not in master database.
         Added by: Arjun on 27 June 2016.
         */
        $scope.checkMedicationName = function(rowObj, data, fieldname) {
            if(data !== "")
            {
                $scope.flgNameMatched = false;
                $scope.masterData.medicationList.forEach(function(obj, idx)
                {
                    $scope.modifiedOldName = obj.name;
                    $scope.modifiedNewName = data;
                    if(obj.name != null)
                    {
                        $scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
                    }
                    
                    $scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
                    if(obj.id != rowObj.id && $scope.modifiedOldName === $scope.modifiedNewName)
                    {
                        $scope.flgNameMatched = true; 
                    };

                });
                if( $scope.flgNameMatched == true ) 
                {               
                    $scope.showPannelMessageBoard('Medication Name already exist.', 'alert-danger', 3000); 
                    return "";        
                }
            }     
            if (data === '' || data === 'undefined') {
                //return fieldname + " must not be blank.";
                $scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000)
                return "";
            }
            
        };

        /*
         Q) Why we need this  function  addNewStrength(query,id,rowEntity)?
         A) For 1 reason:
         1. To store strength in master database of strength.
         */
        $scope.addNewStrength = function(query,id,rowEntity)
        {

            var obj = _.findWhere($scope.masterData.medicationStrengthDataSet,
                {
                    name: query
                });
            var idx = $scope.masterData.medicationStrengthDataSet.indexOf(obj);
            if(idx != -1)
            {
                return "";
            }
            else
            {
                var arData = {};
                arData.strengthName = query;
                medicationService.masterMedication('addstrength').addstrength({}, arData, function(data) {

                    $scope.masterData.medicationStrengthDataSet.push(data.data);
                    var obj = _.findWhere($scope.displayMedicationList,
                        {
                            id: id
                        });
                    var idx = $scope.displayMedicationList.indexOf(obj);
                    if(idx != -1)
                    {
                        if($scope.displayMedicationList[idx].strengths)
                        {
                            $scope.displayMedicationList[idx].strengths.push(data.data);
                            $scope.fnSaveMedication(rowEntity,'strengths');

                        }
                        else{
                            $scope.displayMedicationList[idx].strengths =[];
                            $scope.displayMedicationList[idx].strengths.push(data.data);
                            $scope.fnSaveMedication(rowEntity,'strengths');
                        }

                    }
                    /*return {
                        id: data.data.id,
                        name: query
                    };*/

                });
            }

        }

        /*
         Q) Why we need this  function  fnSaveMedication(rowEntity,fieldName)?
         A) For 1 reason:
         1. To store medicine name, brand, strength, form when adding from master medication panel.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnSaveMedication = function(rowEntity,fieldName)
        {
            var field = fieldName;

            if((rowEntity.name === "" || rowEntity.name === null) && rowEntity.brandOrGeneric !== "")
            {
                $scope.showPannelMessageBoard('Please insert Medication Name first.', 'alert-danger', 3000);
            } 
            else if(rowEntity.strengths)
            {
                if((rowEntity.name === "" || rowEntity.name === null) && rowEntity.strengths.length > 0)
                {
                     $scope.showPannelMessageBoard('Please insert Medication Name first.', 'alert-danger', 3000);
                }
            }
            else if(rowEntity.forms)
            {
                if((rowEntity.name === "" || rowEntity.name === null) && rowEntity.forms.length > 0)
                {
                     $scope.showPannelMessageBoard('Please insert Medication Name first.', 'alert-danger', 3000);
                }
            }
            if(rowEntity.name === "" || rowEntity.name === null)
            {
                 $scope.showPannelMessageBoard('Please add Medication Name first.', 'alert-danger', 3000);
            }
            else
            { 
                if(rowEntity.id===null)
                {
                    /*
                     * Q) Why we are checking rowEntity.id === null?
                     * A) For 1 reasons.
                     * If rowEntity.id is null that means it's a new medication and therefore a modal will open to
                     * confirm add or cancel.
                     */
                    $scope.$modalInstance = $uibModal.open(
                        {
                            scope: $scope,
                            templateUrl: 'view/medications/popupConfirm.html',
                            size: "500",
                        });
                    $scope.medicineData = rowEntity;
                    $scope.addNewMedicine = true;
                    return;
                }
                else
                {
                    if(!_.isUndefined(rowEntity.strengths))
                    {
                        /* to insert new strengths.*/
                        var last_element = rowEntity.strengths[rowEntity.strengths.length - 1];
                        if(!last_element)
                        {
                            //removing extra blank data.
                            rowEntity.strengths.pop();
                            /* removing last elements which was inserting blank data.*/
                        }
                    }

                    //--important data to store in  DB during activitylog---------//
                    rowEntity.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    rowEntity.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                    var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ?  $scope.activeUserTabId: $scope.loggedInUserId;
                    rowEntity.uidOnActivityDone = vrActiveUserTabid;
                    rowEntity.createdByUserId = $scope.loggedInUserId;
                    rowEntity.nameOfSectionOnActivityDone = 'medicationMaster';
                    rowEntity.typeOfActivityLog = 'edit';
                    rowEntity.tblFieldName = fieldName;
                    //---- Value set completed ----//

                    
                    medicationService.masterMedication('update').update({
                        id: rowEntity.id,
                        uidOnActivityDone: vrActiveUserTabid,
                        medicineDetails: rowEntity,
                        createdByUserId: $scope.loggedInUserId, //Needed value for store data in DB
                        nameOfSectionOnActivityDone : 'medicationMaster' //Needed value for store data in DB (use for activity log)
                    }, rowEntity, function(data)
                    {
                        $scope.showPannelMessageBoard('Updated', 'alert-success');
                    });
                }
            }             
        };

        /*
         Q) Why we need this  function  removeMedicine(rowObj)?
         A) For 1 reason:
         1. To delete medicine details when click on delete buttons.
         Added by: Arjun on 27 June 2016.
         */
        $scope.removeMedicine = function(rowObj) {

            if(rowObj.id != null)
            {
                $scope.prescribeMedicineArrList = [];
                // Checking Medication Prescribed or not
                medicationService.masterMedication('show').show({
                    id: rowObj.id
                }, rowObj, function(data) {
                    $scope.prescribeMedicineArrList = data.data;

                    if ($scope.prescribeMedicineArrList.length > 0)
                    {
                        /**
                         * If medicine is assigned to any patient then open a modal and show this medicine is assign to
                         * N numbers of patients, So you can't delete this medicine.
                         */
                        $scope.$modalInstance = $uibModal.open(
                            {
                                scope: $scope,
                                templateUrl: 'view/medications/popupConfirm.html',
                                size: "500",
                            });
                        $scope.assignMedicineData = $scope.prescribeMedicineArrList;
                        $scope.assignToNumberOfPatient = data.npTakingMedication;
                        $scope.patientName = data.patientName;
                        $scope.isMedicineAssign = true;
                        $scope.isMedicineNotAssign = false;
                    }
                    else{

                        /**
                         * If medicine is not assign to
                         * any patients,then open a modal to confirm delete.
                         */
                        $scope.$modalInstance = $uibModal.open(
                            {
                                scope: $scope,
                                templateUrl: 'view/medications/popupConfirm.html',
                                size: "500",
                            });
                        $scope.medicineData = rowObj;
                        $scope.isMedicineNotAssign = true;
                        $scope.isMedicineAssign = false;
                    }
                });
            }
            else {
                /**
                 * If medicine id is not available example for an empty
                 * medication open a modal to confirm delete.
                 */
                $scope.$modalInstance = $uibModal.open(
                    {
                        scope: $scope,
                        templateUrl: 'view/medications/popupConfirm.html',
                        size: "500",
                    });
                $scope.medicineData = rowObj;
                $scope.isMedicineNotAssign = true;
                $scope.isMedicineAssign = false;
            }

        };

        /*
         Q) Why we need this  function  cancelDelete()?
         A) For 1 reason:
         1. To cancel delete medicine details when click on cancel button of popup.
         Added by: Arjun on 27 June 2016.
         */
        $scope.cancelDelete = function()
        {
            $scope.isMedicineNotAssign = false;
            $scope.isMedicineAssign = false;
            // changing status of isMedicineAssign,addNewMedicine,isMedicineNotAssign = false, since it is assign during open modal.
            $scope.$modalInstance.close();
        };

        /*
         Q) Why we need this  function  fnConfirmAddNewMedication(arMedicineData)?
         A) For 1 reason:
         1. To add new medicine when click on confirm button of popup.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnConfirmAddNewMedication = function(arMedicineData) {
            if (arMedicineData.name != null) {
                //----Set some important data to store DB during activitylog---------//
                arMedicineData.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                arMedicineData.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;

                arMedicineData.uidOnActivityDone = vrActiveUserTabid;
                arMedicineData.createdByUserId = $scope.loggedInUserId;
                arMedicineData.nameOfSectionOnActivityDone = 'medicationMaster';
                //---- Value set completed ----//

                medicationService.masterMedication('create').create(arMedicineData,
                    function (data) {
                        $scope.showPannelMessageBoard('Added', 'alert-success');
                    });
            }
            $scope.addNewMedicine = false;
            // changing status of addNewMedicine=false, since it is assign during open modal.
            $scope.$modalInstance.close();
        }

        /*
         Q) Why we need this  function  cancelAdd(medicineData)?
         A) For 1 reason:
         1. To cancel adding new medicine when click on cancel button of popup.
         Added by: Arjun on 27 June 2016.
         */
        $scope.cancelAdd = function(medicineData)
        {
            medicineData.name = null;
            $scope.addNewMedicine = false;
            // changing status of addNewMedicine=false, since it is assign during open modal.
            $scope.$modalInstance.close();
        };

        $scope.confirmTrue=function(rowObj)
        {
            if(rowObj.id===null)
            {
                var obj = _.findWhere($scope.masterData.medicationList,
                    {
                        uniqueRowId: rowObj.uniqueRowId
                    });
                var idx = $scope.masterData.medicationList.indexOf(obj);
                $scope.masterData.medicationList.splice(idx,1);
            }
            else
            {
                $scope.prescribeMedicineArrList = [];
                // Checking Medication Prescribed or not
                medicationService.masterMedication('show').show({
                    id: rowObj.id
                }, rowObj, function(data)
                {
                    $scope.prescribeMedicineArrList = data.data;
                    if($scope.prescribeMedicineArrList.length > 0)
                    {
                        //$scope.showPannelMessageBoard('Sorry you can not delete prescribed medication.', 'alert-danger', 3000);
                        return;
                    }
                    else
                    {
                        //----Set some important data to store DB during activitylog---------//
                        rowObj.currentDateTimeOfClient = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        rowObj.timeZoneAbbreviationOfClient = String(String(new Date()).split("(")[1]).split(")")[0];
                        var vrActiveUserTabid = !_.isUndefined($scope.activeUserTabId) ? $scope.activeUserTabId : $scope.loggedInUserId;

                        rowObj.uidOnActivityDone = vrActiveUserTabid;
                        rowObj.createdByUserId = $scope.loggedInUserId;
                        rowObj.nameOfSectionOnActivityDone = 'medicationMaster';
                        //---- Value set completed ----//

                        medicationService.masterMedication('remove').remove({
                            id: rowObj.id,
                            medicationData: rowObj,
                        }, function(data) {

                            if(data.data == 'success')
                            {
                                var obj = _.findWhere($scope.masterData.medicationList,
                                 {
                                 id: rowObj.id
                                 });

                                 var idx = $scope.masterData.medicationList.indexOf(obj);
                                 if(idx != -1)
                                 {
                                 $scope.masterData.medicationList.splice(idx, 1);
                                 }

                                 $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount - 1;
                                 $scope.showPannelMessageBoard('Deleted', 'alert-success');
                            }
                            else if(data.data == 'failed')
                            {
                                $scope.showPannelMessageBoard('Medication cant\'t be deleted', 'alert-danger', 3000);
                            }
                            //$scope.showPannelMessageBoard('Deleted', 'alert-success');
                        });
                    }
                });
            }
            $scope.isMedicineNotAssign = false;
            $scope.isMedicineAssign = false;
            // changing status of isMedicineNotAssign,isMedicineAssign = false, since it is assign during open modal.
            $scope.$modalInstance.close();
        };

        /*
         Q) Why we need this  function  showPannelMessageBoard(message, classname, time)?
         A) For 1 reason:
         1. To show add,update,delete message notification on master medication panel..
         Added by: Arjun on 27 June 2016.
         */
        $scope.showPannelMessageBoard = function(message, classname, time) {
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
        $scope.addmedication = function(){
            $scope.masterdbObj.levelType = 'addmedication';
        } ;
              
        $scope.addFormOpen = false;
        $scope.showAddForm = function(){
            $scope.addFormOpen = true;
        };
        $scope.hideAddForm = function(){
            $scope.addFormOpen = false;
        };
        
        $scope.addStrengthOpen = false;
        $scope.showAddStrength = function(){
            $scope.addStrengthOpen = true;
        };
        $scope.hideAddStrength = function(){
            $scope.addStrengthOpen = false;
        };

        /*
         Q) Why we need this  function  fnBindMedicationListInView(arData)?
         A) For 1 reason:
         1. To update st table medicine list data when any updation done by socket.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnBindMedicationListInView = function(arData)
        {
            $scope.masterData.medicationList = [];
            arData.forEach(function(obj, idx) 
            {
                $scope.masterData.medicationList.push(obj);
            }); 
            $scope.displayMedicationList = [].concat($scope.masterData.medicationList);
            if($scope.masterData.medicationList.length==0)
            {
                $scope.masterData.messageVal ='Nothing found';    
            }
            else
            {
                $scope.masterData.messageVal ='';
            }
        };

        /*
         * start of socket block to update meidicne details by socket.
         */
        var channelId = 's5-p0-u0';
        vrGlobalSocket.on(channelId, function (data)
        {
            var objSocketData = JSON.parse(data);
            if(objSocketData.action == 'addMedications') 
            {
                /*
                 * when addition of new medicine done then socket automatic update medicine details table.
                 */
                /*$scope.$apply(function () 
                {
                    $scope.masterData.medicationList.unshift(objSocketData.dataSet);
                });*/
                var uniqueRowId = objSocketData.dataSet.uniqueRowId;
                var obj = _.findWhere($scope.masterData.medicationList, 
                    {
                        uniqueRowId: uniqueRowId
                    });
                var idx = $scope.masterData.medicationList.indexOf(obj);
                if(idx<0){
                    // not found 
                    $scope.$apply(function () 
                    {
                        $scope.masterData.medicationList.unshift(objSocketData.dataSet);
                        $scope.fnBindMedicationListInView($scope.masterData.medicationList);
                        $scope.paginationInfo.totalItemCount = $scope.paginationInfo.totalItemCount + 1;
                    });
                }
                else{
                    $scope.$apply(function () 
                    {
                        $scope.masterData.medicationList.splice(idx, 1, objSocketData.dataSet);
                        $scope.fnBindMedicationListInView($scope.masterData.medicationList);
                    });
                }
            }
            else if(objSocketData.action == 'updateMedications') 
            {
                /*
                 * socket for updating  medicine details.
                 */
                $scope.$apply(function () 
                {
                    var obj = _.findWhere($scope.masterData.medicationList, 
                    {
                        id: objSocketData.dataSet.id
                    });
                    var idx = $scope.masterData.medicationList.indexOf(obj);
                    $scope.masterData.medicationList[idx] = objSocketData.dataSet;
                });   
                $scope.updatedMedicationData = $scope.masterData.medicationList;
                $scope.fnBindMedicationListInView($scope.updatedMedicationData);

            }
            else if(objSocketData.action == 'removeMedications') 
            {
                /*
                 * socket for remove medicine details.
                 */
                $scope.$apply(function () 
                {
                   /* var obj = _.findWhere($scope.masterData.medicationList,
                    {
                        id: objSocketData.dataSet
                    });

                    var idx = $scope.masterData.medicationList.indexOf(obj);
                    if(idx != -1)
                    {
                    }
                    $scope.masterData.medicationList.splice(idx, 1);*/
                    if($scope.masterData.medicationList.length==0)
                    {
                        $scope.masterData.messageVal ='Nothing found!';
                    }
                });   
            }
            else if(objSocketData.action == 'addMedicationForm') 
            {
                /*
                 * socket for adding new medicine form.
                 */
                $scope.$apply(function () 
                {   
                    $scope.masterData.medicationFormDataSet.push(objSocketData.data);
                });   
            }
            else if(objSocketData.action == 'addMedicationStrength') 
            {
                /*
                 * socket for adding new medicine strength.
                 */
                $scope.$apply(function () 
                {                                                                   
                    $scope.masterData.medicationStrengthDataSet.push(objSocketData.data);
                });
            }
            else if(objSocketData.action == 'addStrengthFromUserMedication')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.medicationList,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.masterData.medicationList.indexOf(obj);
                    $scope.masterData.medicationList[idx] = objSocketData.dataSet;
                });
                $scope.updatedMedicationData = $scope.masterData.medicationList;
                $scope.fnBindMedicationListInView($scope.updatedMedicationData);
            }
            else if(objSocketData.action == 'addFormFromUserMedication')
            {
                $scope.$apply(function ()
                {
                    var obj = _.findWhere($scope.masterData.medicationList,
                        {
                            id: objSocketData.dataSet.id
                        });
                    var idx = $scope.masterData.medicationList.indexOf(obj);
                    $scope.masterData.medicationList[idx] = objSocketData.dataSet;
                });
                $scope.updatedMedicationData = $scope.masterData.medicationList;
                $scope.fnBindMedicationListInView($scope.updatedMedicationData);
            }

        });


        /*
         Q) Why we need this  function  fnOpenActivityStreamForMasterMedication(index, medication)?
         A) For 1 reason:
         1. To show activity log details for add,edit medicine details.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnOpenActivityStreamForMasterMedication = function (index, medication) {
            var objApp = _.findWhere($scope.displayMedicationList, {
                id: medication.id
            });
            var idxApp = $scope.displayMedicationList.indexOf(objApp);
            if (idxApp != -1) {
                $scope.displayMedicationList.forEach(function (eachData, idx) {
                    if (idx != idxApp) {
                        $scope.displayMedicationList[idx].activityLogIconForEvent = false;
                    }
                });
                $scope.displayMedicationList[idxApp].activityLogIconForEvent = !$scope.displayMedicationList[idxApp].activityLogIconForEvent;
                $scope.showEventsActivityLogForEvent = $scope.displayMedicationList[idxApp].activityLogIconForEvent;
            }
            $scope.eventsActivityLogDataForEvent = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Medication master'
                },
                function (data) {

                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'edit' && eachData.idOfEventOnWhichAcitivtyIsDone == medication.id) {
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                        else if (eachData.typeOfActivity == 'add' && eachData.idOfEventOnWhichAcitivtyIsDone == medication.id) {
                            $scope.eventsActivityLogDataForEvent.push(eachData);
                        }
                    });
                    $scope.displayMedicationActivityLogForEvent = [].concat($scope.eventsActivityLogDataForEvent);

                });
        };

        $scope.activityLogIconForMedication=false;

        /*
         Q) Why we need this  function  fnDeletedActivityStream()?
         A) For 1 reason:
         1. To show deleted activitylog details.
         Added by: Arjun on 27 June 2016.
         */
        $scope.fnDeletedActivityStream = function () {

            $scope.activityLogIconForMedication = !$scope.activityLogIconForMedication;
            $scope.showMasterMedicationActivityLog=!$scope.showMasterMedicationActivityLog;
            $scope.medicationActivityLogData = [];
            userServices.activityLog('getActivityLog').getActivityLog(
                {
                    id: $scope.loggedInUserId,
                    pluginId: 0,
                    sectionName: 'Medication master'
                },
                function (data) {

                    data.data.forEach(function (eachData) {
                        if (eachData.typeOfActivity == 'delete') {
                            $scope.medicationActivityLogData.push(eachData);
                        }
                    });
                    $scope.displayMedicationActivityLogCollection = [].concat($scope.medicationActivityLogData);

                });
        };
    }
]);

angular.module('myApp').service("medicationService", ['$resource',
    function($resource) {
        var factory = {};
        factory.masterMedicationList = function() {
            //return $resource(serviceUrl + "medicationlist.json", {}, {
            return $resource(apiResourceUrl + "masterMedication", {}, {
                query: {
                    method: 'GET', // we will change it to post later
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }
            });
        };
        factory.masterMedication = function(queryType) {
            var queryType = arguments[0] || '';
            //var userRESTUri = serviceUrl+"medication";
            var userRESTUri = apiResourceUrl + "masterMedication";
            if (queryType == 'show' || queryType == 'update' || queryType == 'remove') {
                userRESTUri += '/:id';
            }
            if (queryType == 'formlist') {
                var userRESTUri = apiResourceUrl + "masterMedicationForms";
            }
            if (queryType == 'strengthlist') {
                var userRESTUri = apiResourceUrl + "masterMedicationStrengths";
            }
            if (queryType == 'createform') {
                var userRESTUri = apiResourceUrl + "masterMedicationNewForm";
            }
            if (queryType == 'createstrength') {
                var userRESTUri = apiResourceUrl + "masterMedicationNewStrength";
            }
            if (queryType == 'addstrength') {
                var userRESTUri = apiResourceUrl + "masterMedicationAddStrength";
            }
            return $resource(userRESTUri, {}, {
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
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                },
                formlist: {
                    method: 'GET',
                },
                strengthlist: {
                    method: 'GET',
                },
                createform: {
                    method: 'POST',
                },
                createstrength: {
                    method: 'POST',
                },
                addstrength: {
                    method: 'POST',
                },
                remove: {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                },
            });
        };
        /*factory.activityLog = function (queryType) {
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
        };*/
        return factory;
    }
]);