'use strict';
angular.module('myApp').controller("fileTagListMasterCtrl", ['$scope', '$rootScope','$state', '$stateParams', '$timeout', 'fileTagListMasterService','$filter',
	function($scope, $rootScope, $state, $stateParams, $timeout, fileTagListMasterService, $filter)
	{
		$scope.nameToShowInBreadcrumb = "File tag list";
		$scope.masterData = {};
        $scope.masterData.messageVal = '';
        $scope.pannelMessage = null;
		$scope.masterData.listFileTag = [];
        if($scope.masterdbObj.allowedToMasterDB == 'No') {
            $scope.masterdbObj.showNextLevel = false;
        }

		// Bind function
		$scope.bindDataFromServer = function(prData)
		{	$scope.masterData.listFileTag = [];

			if(prData.length > 0)
			{
				prData.forEach(function(item){
					$scope.masterData.listFileTag.push(item) ;
				});

			}
			$scope.displayFileTagList = [].concat($scope.masterData.listFileTag);
		};


        // Displaying all File Tag List from server
        // ========================================
		$scope.fnLoadFileTagListFromServer = function()
        {
            fileTagListMasterService.fileTagList('fileTagListDisplay').fileTagListDisplay(function(data)
            {
				if(data.data.length ==0){
            		$scope.masterData.messageVal='Nothing found';
            	}else{
					$scope.bindDataFromServer(data.data);
					}
            });
        };

        $scope.fnLoadFileTagListFromServer();


		// Add new empty file tag list
		$scope.inputs =[];
		$scope.fnAddFileTagList = function(){
			var dummyInfo = {
				createdOn : null,
				createdOnTimezone : null,
				tagID : null,
			 	tagName: null,
				uidOfCreatedBy: null,
				noOfTimeUsed: 0,
				uniqueId : Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime()),
			}

			$scope.inputs.push({})
			$scope.masterData.listFileTag.unshift(dummyInfo);
		};

		 // Update File Tag List
        // ====================
        $scope.fnSaveFileTagList = function(fileTagData, index)
        {
			if(fileTagData.tagName == "" || fileTagData.tagName == null)
			{
				$scope.masterData.messageVal='Tag name cannot be empty';
				$scope.showPannelMessageBoard('Tag name cannot be empty', 'alert-danger');
				return false;
			}
			else if((fileTagData.tagName != null) && (fileTagData.tagID == null || fileTagData.tagID == ''))
			{
				fileTagListMasterService.fileTagList('fileTagListAdd').fileTagListAdd({

					tagName : fileTagData.tagName,
					createdOn : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
					createdOnTimezone : String(String(new Date()).split("(")[1]).split(")")[0],
					uidOfCreatedBy : $scope.loggedInUserId,
					uniqueId : fileTagData.uniqueId,

				}, function(data){
					if(data.res == 'Added')
					{
						$scope.masterData.messageVal = data.res;
						$scope.showPannelMessageBoard(data.res, 'alert-success',3000);
                        //
						//$scope.masterData.listFileTag[index].tagID = data.tagID;
						//$scope.masterData.listFileTag[index].tagName = data.tagName;
						//$scope.masterData.listFileTag[index].createdOn = data.createdOn;
						//$scope.masterData.listFileTag[index].createdOnTimezone = data.createdOnTimezone;
						//$scope.masterData.listFileTag[index].uidOfCreatedBy = data.uidOfCreatedBy;
						//$scope.bindDataFromServer($scope.masterData.listFileTag);

					}else if(data.res == 'File tag list already exists.') {
						$scope.masterData.messageVal = data.res;
						$scope.showPannelMessageBoard(data.res, 'alert-danger',3000);
						return false;
					}else{
						$scope.masterData.messageVal = 'Some error occured.';
						$scope.showPannelMessageBoard('Some error occured.', 'alert-danger',3000);
						return false;
					}
				});
			}
			else{
				fileTagListMasterService.fileTagList('fileTagListUpdate').fileTagListUpdate({
						id : fileTagData.tagID,
						tagName : fileTagData.tagName,
						createdOn : fileTagData.createdOn,
						createdOnTimezone : fileTagData.createdOnTimezone,
						noOfTimeUsed : fileTagData.noOfTimeUsed,
						uidOfCreatedBy : $scope.loggedInUserId,
					},
					function(data){
						if(data.res=='Updated')
						{
							$scope.masterData.messageVal=data.res;
							$scope.showPannelMessageBoard(data.res, 'alert-success');

						} else if(data.res=='File tag already exist'){
							$scope.masterData.messageVal=data.res;
							$scope.showPannelMessageBoard(data.res, 'alert-danger');
							return false;
						}else{
							$scope.masterData.messageVal=data.res;
							$scope.showPannelMessageBoard(data.res, 'alert-danger');
							}
					});
			}
		};

		// Delete File tag list
		// ====================

		$scope.fnDeleteFileTag = function(idx, index){
			if(idx == null || idx == '')
			{
				$scope.masterData.listFileTag.splice(idx, 1);
			}else{
				var r = confirm("Do you really want to remove this file tag list?");
				if (r){
					fileTagListMasterService.fileTagList('fileTagListDelete').fileTagListDelete({
						id: idx
					}, function(data){
						if(data.res == 'Deleted')
						{
							$scope.masterData.messageVal = data.res;
							$scope.showPannelMessageBoard(data.res, 'alert-success',3000);
							$scope.masterData.listFileTag.splice(index, 1);
						}
						else{
							$scope.masterData.messageVal =data.res;
							$scope.showPannelMessageBoard(data.res, 'alert-danger',3000);
						}
					});
				}
			}

		};


		// Checking for correct data
		// =========================

		$scope.fnCheckFileTagList=function(rowObj, data, fieldname){

			if(data ==null) {
				$scope.masterData.messageVal =fieldname+ ' must not be blank.';
				$scope.showPannelMessageBoard(fieldname+ ' must not be blank.', 'alert-danger',3000);
				return false;
			}else if (data == 'undefined' || data == '' )
			{
				$scope.masterData.messageVal=fieldname+' must not be blank';
				$scope.showPannelMessageBoard( fieldname + ' must not be blank.', 'alert-danger', 3000);
				return false;
			}
			else if(data !== '' && data !== 'undefined')
			{
				$scope.flgNameMatched = false;
				angular.forEach($scope.masterData.listFileTag, function(obj, idx)
				{
					$scope.modifiedOldName = obj.tagName;
					$scope.modifiedNewName = data;
					if(obj.tagName != null)
					{
						$scope.modifiedOldName = $scope.modifiedOldName.trim().toLowerCase();
						$scope.modifiedNewName = $scope.modifiedNewName.trim().toLowerCase();
					}

					if($scope.modifiedOldName ==  $scope.modifiedNewName)
					{
						$scope.flgNameMatched = true;
					};

				});
				if( $scope.flgNameMatched == true )
				{
					$scope.masterData.messageVal = 'Enter different tag name.';
					$scope.showPannelMessageBoard('Enter different tag name.', 'alert-danger', 3000);
					return false;

				}
			}
		}

		// Reflect changes in view using Socket
        // ====================================
        var channelId = 's5-p0-u0';
		vrGlobalSocket.on(channelId, function(data)
        {
			var objSocketData = JSON.parse(data)
			if(objSocketData.action=='fileTagListAdd')
			{
				var uniqueId = objSocketData.dataSet.uniqueId;
					var obj = _.findWhere($scope.masterData.listFileTag,{
						uniqueId: uniqueId
					});

					var idx = $scope.masterData.listFileTag.indexOf(obj);
					if(idx != -1){

						$scope.$apply(function ()
						{
							$scope.masterData.listFileTag.splice(idx, 1, objSocketData.dataSet);
							$scope.bindDataFromServer($scope.masterData.listFileTag);

						});
					}else{
						$scope.masterData.listFileTag.push(objSocketData.dataSet);
						$scope.bindDataFromServer($scope.masterData.listFileTag);
					}

			}
			else if(objSocketData.action=='fileTagListUpdate')
        	{

        		$scope.$apply(function(){
        			var obj = _.findWhere($scope.masterData.listFileTag,{
						tagID : objSocketData.dataSet.tagID
        			});

        			var idx = $scope.masterData.listFileTag.indexOf(obj);
					$scope.masterData.listFileTag[idx].tagName = objSocketData.dataSet.tagName;
        			
        		});
				$scope.updatedListFileTag = $scope.masterData.listFileTag;
				$scope.bindDataFromServer($scope.updatedListFileTag);

        	}
			else if(objSocketData.action =='fileTagListDelete')
			{
				if(objSocketData.dataSet.res==1)
				{
					$scope.$apply(function(){
						var obj = _.findWhere($scope.masterData.listFileTag,{
							id : objSocketData.dataSet
						});
						var idx = $scope.masterData.listFileTag.indexOf(obj);
						if(idx !=-1){
							$scope.masterData.listFileTag.splice(idx, 1);
						}
						if($scope.masterData.listFileTag.length < 1 )
						{
							$scope.masterData.messageVal ='Nothing found';
							$scope.showPannelMessageBoard('Nothing found', 'alert-success');
						}
					});
					$scope.masterData.messageVal ='Removed successfully';
					$scope.showPannelMessageBoard('Removed successfully', 'alert-success', 3000);
				}else{
					$scope.masterData.messageVal ='Can not removed file tag list.';
					$scope.showPannelMessageBoard('Can not removed file tag list.', 'alert-success');
				}
			}
        });
}
]);
angular.module('myApp').service("fileTagListMasterService", ['$resource',
	function($resource)
	{
		var factory = {};
		factory.fileTagList=function(queryType)
		{
			var queryType = arguments[0]||'';
			var hsRESTUri = apiResourceUrl + 'fileTagListDisplay';

			if(queryType == 'fileTagListDisplay')
			{
				hsRESTUri = apiResourceUrl + 'fileTagListDisplay';
			}
			else if(queryType == 'fileTagListUpdate')
			{
				hsRESTUri = apiResourceUrl + 'fileTagListUpdate';
			}
			else if(queryType == 'fileTagListAdd')
			{
				hsRESTUri = apiResourceUrl + 'fileTagListAdd';
			}
			else if(queryType == 'fileTagListDelete')
			{
				hsRESTUri = apiResourceUrl + 'fileTagListDelete';
			}
			return $resource(hsRESTUri, {},{
				fileTagListDisplay:
				{
					method: 'GET'
				},
				fileTagListUpdate:
				{
					method: 'PUT'
				},
				fileTagListAdd:
				{
					method:'POST'
				},
				fileTagListDelete:
				{
					method : 'DELETE'

				}

			});
		};
		return factory;
	}
]);