'use strict';
var serviceUrl = "app/sampledata/";
var apiResourceUrl = "/api/index.php/";
var apiHelpdeskResourceUrl = "/v3/api/helpdesk/public/index.php/api/";
var ioSocketUrl = "";
var vrGlobalSocket = io(ioSocketUrl);
var adProfileurl='/v3/app/a/#!/';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.version',
  'ui.bootstrap',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'satellizer',
  'smart-table',
  'xeditable',
  'ncy-angular-breadcrumb',
  'oi.select',
  'angularFileUpload',
  'ngFileSaver',
  'ui.bootstrap.datetimepicker',
  'ngWYSIWYG',
  'ngAnimate',
  'colorpicker'
]).config(['$stateProvider','$locationProvider','$urlRouterProvider',
  function($stateProvider,$locationProvider,$urlRouterProvider)
  {
    //$locationProvider.hashPrefix('!');
    $stateProvider.state("masterDb", {
      url: "",
      abstract: true,
      templateUrl: 'view/masterDbParent.html',
      controller: "masterDbParentCtrl"
    }).state("masterDb.listing", {
      url: "/",
      templateUrl: 'view/masterDbListingPage.html',
      controller: "masterDbListingCtrl",
      ncyBreadcrumb: {
        label: 'Home'
      }
    }).state("masterDb.sectionPage", {
      url: "/:sectionName",
      templateUrl: function ($stateParams){
        return 'view/' + $stateParams.sectionName + '/' + $stateParams.sectionName + '.html';
      },
      controllerProvider: function($stateParams) {
        var ctrlName = $stateParams.sectionName + "MasterCtrl";
        return ctrlName;
      },
      ncyBreadcrumb: {
        label: '{{nameToShowInBreadcrumb}}',
        parent: 'masterDb.listing'
      }
    }).state("masterDb.unlock", {
      url: "/unlock/:sectionName",
      templateUrl: function ($stateParams){
        return 'view/unlock/' + $stateParams.sectionName + '/' + $stateParams.sectionName + '.html';
      },
      controllerProvider: function($stateParams) {
        var ctrlName = $stateParams.sectionName + "MasterCtrl";
        return ctrlName;
      },
      ncyBreadcrumb: {
        label: '{{nameToShowInBreadcrumb}}',
        parent: 'masterDb.listing'
      }
    }).state("masterDb.screenDetail", {
      url: "/screenDetail/:id",
      templateUrl: 'view/screenDetail/screenDetail.html',
      controller: "screensDetailMasterCtrl",
      ncyBreadcrumb: {
        label: '{{nameToShowInBreadcrumb}}',
        parent: 'masterDb.listing'
      }
    });
    $urlRouterProvider.otherwise('/');
  }
]);
