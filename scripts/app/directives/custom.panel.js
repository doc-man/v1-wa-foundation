"use strict";
angular.module('emr').directive('custompanel', function() {
    return {
        restrict: 'A',
        templateUrl: "directives/custom.panel.html",
        scope: {
            id: '=',
            title: '=',
            minimized : '=',
            panelcolor : "=",
            tabweight : "=",
            changeWeightFunction : "&",
            changeStateFunction : "&",
            groupAssignToggle : "&",
            fullscreen : "=",
            isgrouped : "=",
            istab : "=",
            msg : "=",
            pluginBreadcrumb : "=",
            pluginBreadcrumbAllLink: "&",
            addScreening: "&",
            removeGroup: "&",
			      uploadDocumentPt:"&",
            panelmessage : "=",
            closeMessage : "&"
        },
        transclude: true,
        link: function(scope, element, attrs) {
            if(scope.minimized == 'true' || scope.minimized == 'TRUE')
            scope.minimized = true;
            if(scope.fullscreen == 'true' || scope.fullscreen == 'TRUE')
            scope.fullscreen = true;
            if(!scope.panelcolor) scope.panelcolor = 'default';

        }
    };
})
.directive('skDraggable', function() {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {
      var options = scope.$eval(attrs.andyDraggable); //allow options to be passed in
      elm.draggable(options).resizable();
    }
  };
})
.factory('focus', function($timeout) {
    return function(id) {
      var timer = $timeout(function() {
        var element = document.getElementById(id);
        if(element)
          element.focus();
         $timeout.cancel(timer);
      },100);
    };
})
.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) { console.log("called");
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });
      
      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        //element.off(attr.eventFocus);
      });
    };
})
.directive('editableBootstrapDatepicker', ['editableDirectiveFactory',   function(editableDirectiveFactory) {
     return editableDirectiveFactory({
       directiveName: 'editableBsdateNew',
       inputTpl: '<span ng-datepicker ng-options="datepickerOptions"></span>'
});   } ]);