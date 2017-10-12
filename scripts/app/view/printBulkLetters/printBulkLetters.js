'use strict';

angular.module('myApp').controller("printBulkLettersMasterCtrl", ['$scope', 'bulkLetterTemplatesService',
    function($scope, bulkLetterTemplatesService) {
        

        $scope.nameToShowInBreadcrumb = "Print Bulk Letters";
        $scope.addBulkLetterTempDiv=true;
        $scope.bulkLetterPlaceholderHidden = true;
        $scope.bulkLetterPlaceholderContentHidden = true;
        $scope.addBulkLetterTempDiv=true;

        $scope.bulkLetterTemplate={
           templateName:'',
           templateSubject:'',
           templateBody:'',
           templateSignature:'',
           templateLetterHead:'',
           templateFieldArray:['id','name','letterHead','body','subject','body','signature']
          };
        $scope.addBulkLetterTemp = function()
        {
            $scope.bulkLetterTemplate.templateId=Math.floor((Math.random() * 9000) + 1)+ (new Date().getTime())
            $scope.addBulkLetterTempDiv=false;
        };
        $scope.togglePlaceholderExample = function(section){
          $scope[section] = !$scope[section];
          $scope.bulkLetterPlaceholderHidden=!$scope.bulkLetterPlaceholderHidden;
          $scope.bulkLetterPlaceholderContentHidden=!$scope.bulkLetterPlaceholderContentHidden;
        };
        $scope.bulkLetterTemplateTemplateUpdate=function(data,templateField){
            console.log(data);
            if(data=='')
            {
                var arrBulkLetterTemplate=$scope.bulkLetterTemplate;
            }else {
                var arrBulkLetterTemplate=data;
            }
            arrBulkLetterTemplate.templateField=templateField;
            console.log(arrBulkLetterTemplate);
            bulkLetterTemplatesService.bulkLetterTemplateSettings('storeBulkLetterTemplates').storeBulkLetterTemplates(arrBulkLetterTemplate, function(data)
            {

                //console.log(data);
            });

        };
        $scope.masterTemplateData=[];
        $scope.allUserList = [];
        $scope.getBulkLetterTemplates=function()
        {
            bulkLetterTemplatesService.bulkLetterTemplateSettings('getBulkLetterTemplates').getBulkLetterTemplates(function(data)
            {
               $scope.masterTemplateData=[];
                data.data.forEach(function(obj, idx)
                {
                    obj.masterSettingToCheckPanelOpen=false;
                    $scope.masterTemplateData.push(obj);
                });

                $scope.allUserList = [].concat(data.allUsers);
                /*data.allUsers.forEach(function(obj, idx)
                {
                    $scope.allUserList.push(obj);
                });*/
                $scope.displayTemplateList = [].concat($scope.masterTemplateData);
              });
        };
        $scope.getBulkLetterTemplates();

        $scope.toggleCollapse = function(panelIndex){
            $scope.displayTemplateList[panelIndex].masterSettingToCheckPanelOpen = !$scope.displayTemplateList[panelIndex].masterSettingToCheckPanelOpen;

        };

        $scope.fnCreateBulkLetters = function(data) {

            var arUserIds = [];
            data.selectedUser.forEach(function(obj,idx){
                arUserIds.push(obj.id);
            });

            var serialized = arUserIds.join(",");
            var compressed = window.btoa(serialized);

            window.location.href = apiResourceUrl + 'bulkLettersZipped/'+data.templateId+'/'+compressed;
        }

    }
]);

angular.module('myApp').service("bulkLetterTemplatesService", ['$resource',
    function($resource) {
        var factory = {};

        factory.bulkLetterTemplateSettings = function(queryType) {
            var notifierTemplateSettingsRESTUri = apiResourceUrl + 'notifierTemplateSettings';
             if (queryType == 'storeBulkLetterTemplates') {
                notifierTemplateSettingsRESTUri = apiResourceUrl + 'storeBulkLetterTemplates';
            }else if(queryType == 'getBulkLetterTemplates')
             {
                 notifierTemplateSettingsRESTUri = apiResourceUrl + 'getBulkLetterTemplates';
             }
            return $resource(notifierTemplateSettingsRESTUri, {}, {
                storeBulkLetterTemplates: {
                    method: 'POST'
                },
                getBulkLetterTemplates: {
                    method: 'GET'
                }
            });
        };
        return factory;
    }
]);