'use strict';
angular.module('myApp')
.directive('skDraggable',
    function()
    {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var options = scope.$eval(attrs.andyDraggable); //allow options to be passed in
                elm.draggable(options).resizable({handles: "n, e, s, w, se", minHeight: 150, minWidth: 200});
            }
        };
    })
.directive('skResize',
    function()
    {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) 
            {
                elm.resizable({handles: "s", minHeight: '150px'});
            }
        };
    })
.directive('bootstrapEditor', ['$timeout', function($timeout)
    {
        return {
            restrict: 'AE',
            templateUrl: 'app/directives/bootstrap-wysiwyg-tpl.html',
            scope: {
              clearFormat: '&',
              title: '='
            },
            link: function($scope, element, attrs) {
                
                var eBox = angular.element(element[0].querySelector('#bEditorBox_'+$scope.title));
                //var eBox = angular.element(element[0].querySelector('#bEditorBox'));
                //console.info(attrs.title); console.info($scope.title); console.info($scope); console.info(element); console.info(eBox); 
                eBox.wysiwyg();//element.wysiwyg();
  
                $scope.clearFormat = function() {
                  eBox.html(eBox.text());
                };
            },
            compile: function($scope, element, attrs) {
                
                
                
                return {
                    pre : function($scope, element, attrs) {
                        console.info('pre compile'); 
                        
                        console.info($scope.title); console.info(element); console.info(attrs); 
                        var eBox = angular.element(element[0].querySelector('#bEditorBox_'+$scope.title));
                        console.info(eBox); 
                        
                        
                    },
                    post : function($scope, element, attrs) {
                        console.info('post compile'); 
                        var eBox = angular.element(element[0].querySelector('#bEditorBox_'+$scope.title));
                        console.info(eBox);
                    }
                    
                    
                }
            
            }
        };
    }])
.directive('stStickyHeader', ['$window', 
    function ($window) 
    {
    return {
      require: '^?stTable',
      link: function (scope, element, attr, ctrl) {
        var stickyHeader = lrStickyHeader(element[0]);
        scope.$on('$destroy', function () {
          stickyHeader.clean();
        });

        scope.$watch(function () {
          return ctrl.tableState();
        }, function () {
          $window.scrollTo(0, lrStickyHeader.treshold);
        }, true)
      }
    }
  }])   
.directive('eventFocus',
    function(focus)
    {
        return function(scope, elem, attr)
        {
            elem.on(attr.eventFocus, function()
            {
                focus(attr.eventFocusId);
            });
            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function()
            {
                //element.off(attr.eventFocus);
            });
        };
    })
.directive('editableBootstrapDatepicker', ['editableDirectiveFactory',
    function(editableDirectiveFactory)
    {
        return editableDirectiveFactory({
            directiveName: 'editableBsdateNew',
            inputTpl: '<span ng-datepicker ng-options="datepickerOptions"></span>'
        });
    }])
.directive("my:sortable",
    function(expression, compiledElement)
    {
        return function(linkElement) {
            var scope = this;
            linkElement.sortable({
                placeholder: "ui-state-highlight",
                opacity: 0.8,
                update: function(event, ui) {
                    var model = scope.$tryEval(expression);
                    var newModel = [];
                    var items = [];
                    linkElement.children().each(function() {
                        var item = $(this);
                        // get old item index
                        var oldIndex = item.attr("ng:repeat-index");
                        if (oldIndex) {
                            // new model in new order
                            newModel.push(model[oldIndex]);
                            // items in original order
                            items[oldIndex] = item;
                            // and remove
                            item.detach();
                        }
                    });
                    // restore original dom order, so angular does not get confused
                    linkElement.append.apply(linkElement, items);
                    // clear old list
                    model.length = 0;
                    // add elements in new order
                    model.push.apply(model, newModel);
                    // presto
                    scope.$eval();
                    // Notify event handler
                    var onSortExpression = linkElement.attr("my:onsort");
                    if (onSortExpression) {
                        scope.$tryEval(onSortExpression, linkElement);
                    }
                }
            });
        };
    })
.directive('sortableTab',
    function($timeout, $document)
    {
        return {
            link: function(scope, element, attrs, controller) {
                // Attempt to integrate with ngRepeat
                // https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
                var match = attrs.ngRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                var tabs;
                scope.$watch(match[2], function(newTabs) {
                    tabs = newTabs;
                });
                var index = scope.$index;
                scope.$watch('$index', function(newIndex) {
                    index = newIndex;
                });
                attrs.$set('draggable', true);
                // Wrapped in $apply so Angular reacts to changes
                var wrappedListeners = {
                    // On item being dragged
                    dragstart: function(e) {
                        e.originalEvent.dataTransfer.effectAllowed = 'move';
                        e.originalEvent.dataTransfer.dropEffect = 'move';
                        e.originalEvent.dataTransfer.setData('application/json', index);
                        element.addClass('dragging');
                    },
                    dragend: function(e) {
                        //e.stopPropagation();
                        element.removeClass('dragging');
                    },
                    // On item being dragged over / dropped onto
                    dragenter: function(e) {},
                    dragleave: function(e) {
                        element.removeClass('hover');
                    },
                    drop: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var sourceIndex = e.originalEvent.dataTransfer.getData('application/json');
                        move(sourceIndex, index);
                        element.removeClass('hover');
                    }
                };
                // For performance purposes, do not
                // call $apply for these
                var unwrappedListeners = {
                    dragover: function(e) {
                        e.preventDefault();
                        element.addClass('hover');
                    },
                    // Use .hover instead of :hover. :hover doesn't play well with
                    //   moving DOM from under mouse when hovered
                    mouseenter: function() {
                        element.addClass('hover');
                    },
                    mouseleave: function() {
                        element.removeClass('hover');
                    }
                };
                angular.forEach(wrappedListeners, function(listener, event) {
                    element.on(event, wrap(listener));
                });
                angular.forEach(unwrappedListeners, function(listener, event) {
                    element.on(event, listener);
                });

                function wrap(fn) {
                    return function(e) {
                        scope.$apply(function() {
                            fn(e);
                        });
                    };
                }

                function move(fromIndex, toIndex) {
                    // http://stackoverflow.com/a/7180095/1319998
                    tabs.splice(toIndex, 0, tabs.splice(fromIndex, 1)[0]);
                };
            }
        }
    })
.directive('stCustomPageSelect',
    function()
    {
        return {
            restrict: 'E',
            require: '^stTable',
            template: '<input type="text" class="st-custome-page-select select-page" ng-model="inputPage" ng-change="selectPage(inputPage)" data-abc="{{inputPagetest}}">',
            link: function(scope, element, attrs) {
                scope.$watch('currentPage', function(c) {
                        scope.inputPage = c;
                });
                scope.$watch('tableState.pagination.start', function(c) {
                        scope.inputPagetest = c;
                });
            }
        }
    })
.directive("drawing",
    function()
    {
  return {
    restrict: "AE",
    template: '<div class="m-signature-pad">'+
    '<canvas widht"300px" height="150px"></canvas>'+
    '<input type="button" class="sigClear" name="clear" value="clear"/>'+
    '<input type="button" class="sigSubmit" name="clear" value="Submit"/>'+
    '<input  type="text" id="sigImgdata" class="sigImgdata" />'+
    '</div>',
    link: function(scope, element) {
        var canvas = angular.element(element[0].querySelector('canvas'));
        var sigClear = angular.element(element[0].querySelector('.sigClear'));
        var sigSubmit = angular.element(element[0].querySelector('.sigSubmit'));
        var sigImg = angular.element(element[0].querySelector('.sigImgdata'));

        var signaturePad = new SignaturePad(canvas[0]);
        //console.info(element);         console.info(canvas[0]); console.info(clearBtn[0]);  console.info(sigImg);         console.info(sigImg[0]); 
        sigClear.bind('click', function(event) {
            signaturePad.clear();
        });
        sigSubmit.bind('click', function(event) {
            //console.info(signaturePad.toDataURL()); 
        });
        canvas.bind('click', function(event) {
            sigImg.attr("value", signaturePad.toDataURL());
        });
    }
  };
})
.directive('onKeyup', function() {
  return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var searchFunction = $parse(attr.searchFunction);
            var setValueFunc = $parse(attr.ngModel).assign;
            var autocompleteclass = attr.autoCompleteClass;
            scope.$watch(attr.autoCompleteData, function () {
                element.autocomplete('option', {
                    source: scope.$eval(attr.autoCompleteData)
                });
            });

            element.autocomplete({
                source: scope.$eval(attr.autoCompleteData),
                select: function(event, ui) {
                    setValueFunc(scope, ui.item.value);
                    var originalEvent = event.originalEvent;
                    while (originalEvent.originalEvent !== void 0) {
                        originalEvent = originalEvent.originalEvent;
                    }
                    if (originalEvent.type === constants.CLICK_EVENT) {
                        searchFunction(scope,{selectedText: scope.$eval(attr.autoCompleteModel)});
                    }
                },
                focus: function(event) {
                    event.preventDefault();
                }
            }).autocomplete('widget').addClass('dropdown-menu').addClass(autocompleteclass);

            element.keyup(function(event) {
                if (event.which === constants.ENTER_KEY_CODE) {
                    element.autocomplete('close');
                    searchFunction(scope,{selectedText:  scope.$eval(attr.autoCompleteModel)});
                    scope.$apply();
                }
            });

        }
    };
})
.directive('watchersToggler', ['$parse', '$timeout', function($parse, $timeout) {
    // this directive is to minimise watch count if some part of application are inactive 
    // e.g: emr tab switching
  return {
    restrict: 'EA',
    scope: {
      toggler: '&watchersToggler',
      refreshSuspensionOn: '=refreshHideOn'
    },
    link: function($scope, element, attrs) {
      var watchers = {
        suspended: false
      };

      $scope.$watch(function() { return $scope.toggler() }, function(newToggler, oldToggler) {
        if(typeof newToggler == 'boolean') {
          if(newToggler) {
            //element.hide(); - with jquery dependency
            //element.css('display', 'none');
            $timeout(function() 
            {
                suspendFromRoot();
            }, 100);
          } else {
            //element.show(); - with jquery dependency
            //element.css('display', 'block');
            resumeFromRoot();
          }
        }
      });

      $scope.$watch('refreshSuspensionOn', function(newVal, oldVal) {
        if(newVal !== oldVal) refreshSuspensionFromRoot()
      }, true);


      function suspendFromRoot() {
        if(!watchers.suspended) {
          $timeout(function() {
            suspendWatchers();
            watchers.suspended = true;
          })
        }
      }

      function refreshSuspensionFromRoot() {
        if(watchers.suspended) {
          $timeout(function() {
            suspendWatchers();
          })
        }
      }

      function resumeFromRoot() {
        if(watchers.suspended) {
          $timeout(function() {
            resumeWatchers();
            watchers.suspended = false;
          })
        }
      }

      function suspendWatchers() {
        iterateSiblings($scope, suspendScopeWatchers);
        iterateChildren($scope, suspendScopeWatchers);
      };

      function resumeWatchers() {
        iterateSiblings($scope, resumeScopeWatchers);
        iterateChildren($scope, resumeScopeWatchers);
      };

      var mockScopeWatch = function(scopeId) {
        return function(watchExp, listener, objectEquality, prettyPrintExpression) {
          watchers[scopeId].unshift({
            fn: angular.isFunction(listener) ? listener : angular.noop,
            last: void 0,
            get: $parse(watchExp),
            exp: prettyPrintExpression || watchExp,
            eq: !!objectEquality
          })
        }
      }

      function suspendScopeWatchers(scope) {
        if(!watchers[scope.$id]) {
          watchers[scope.$id] = scope.$$watchers || [];
          scope.$$watchers = [];
          scope.$watch = mockScopeWatch(scope.$id)
        }
      }

      function resumeScopeWatchers(scope) {
        if(watchers[scope.$id]) {
          scope.$$watchers = watchers[scope.$id];
          if(scope.hasOwnProperty('$watch')) delete scope.$watch;
          watchers[scope.$id] = false
        }
      }

      function iterateSiblings(scope, operationOnScope) {
        while (!!(scope = scope.$$nextSibling)) {
          operationOnScope(scope);
          iterateChildren(scope, operationOnScope);
        }
      }

      function iterateChildren(scope, operationOnScope) {
        while (!!(scope = scope.$$childHead)) {
          operationOnScope(scope);
          iterateSiblings(scope, operationOnScope);
        }
      }
    }
  }
}])
    .directive("timeFormat", function($filter) {
        return {
            restrict : 'A',
            require : 'ngModel',
            scope : {
                showMeridian : '=',
            },
            link : function(scope, element, attrs, ngModel) {
                var parseTime = function(viewValue) {

                    if (!viewValue) {
                        ngModel.$setValidity('time', true);
                        return null;
                    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                        ngModel.$setValidity('time', true);
                        return viewValue;
                    } else if (angular.isString(viewValue)) {
                        var timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i;
                        if (!scope.showMeridian) {
                            timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                        }
                        if (!timeRegex.test(viewValue)) {
                            ngModel.$setValidity('time', false);
                            return undefined;
                        } else {
                            ngModel.$setValidity('time', true);
                            var date = new Date();
                            var sp = viewValue.split(":");
                            var apm = sp[1].match(/[a|p]m/i);
                            if (apm) {
                                sp[1] = sp[1].replace(/[a|p]m/i, '');
                                if (apm[0].toLowerCase() == 'pm') {
                                    sp[0] = parseInt(sp[0], 10) + 12;
                                }
                            }
                            date.setHours(sp[0], sp[1]);
                            return date;
                        };
                    } else {
                        ngModel.$setValidity('time', false);
                        return undefined;
                    };
                };

                ngModel.$parsers.push(parseTime);

                var showTime = function(data) {
                    parseTime(data);
                    var timeFormat = (!scope.showMeridian) ? "HH:mm" : "hh:mm a";
                    return $filter('date')(data, timeFormat);
                };
                ngModel.$formatters.push(showTime);
                scope.$watch('showMeridian', function(value) {
                    var myTime = ngModel.$modelValue;
                    if (myTime) {
                        element.val(showTime(myTime));
                    }

                });
            }
        };
    })
    .directive('timepickerPop', function($document, timepickerState, $rootScope) {
        return {
            restrict : 'E',
            transclude : false,
            scope : {
                inputTime : "=",
                showMeridian : "=",
                disabled : "=",
                isUnsaved : "=",
                inputOnUpdate:'&',
                noIcon : "=",
                pickerState : "=",
            },
            controller : function($scope, $element) {
                //$scope.isOpen = true;

                $scope.disabledInt = angular.isUndefined($scope.disabled)? false : $scope.disabled;
                $scope.isUnsavedInt = angular.isUndefined($scope.isUnsaved)? false : $scope.isUnsaved;
                $scope.noIcon = angular.isUndefined($scope.noIcon)? false : $scope.noIcon;
                $scope.isOpen = angular.isUndefined($scope.pickerState)? false : $scope.pickerState;
                $scope.toggle = function() {
                    if ($scope.isOpen) {
                        $scope.close();
                    } else {
                        $scope.open();
                    }
                };
            },
            link : function(scope, element, attrs) {
                var picker = {
                    open : function () {
                        timepickerState.closeAll();
                        scope.isOpen = true;
                        $rootScope.$broadcast('timepickeropen');
                    },
                    close: function () {
                        scope.isOpen = false;
                        scope.inputOnUpdate(element);
                    }

                }
                timepickerState.addPicker(picker);

                scope.open = picker.open;
                scope.close = picker.close;
                scope.inputOnUpdate();
                scope.callUpdate = function(e){
                    var target = e.target;
                    if(e.keyCode == 13) {
                        scope.inputOnUpdate(element);
                        scope.isOpen = false;
                        target.blur();
                    }
                };
                scope.$watch("disabled", function(value) {
                    scope.disabledInt = angular.isUndefined(scope.disabled)? false : scope.disabled;
                });

                scope.$watch("inputTime", function(value) {
                    if (!scope.inputTime) {
                        element.addClass('has-error');
                    } else {
                        element.removeClass('has-error');
                    }

                });

                element.bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });

                $document.bind('click', function(event) {
                    scope.$apply(function() {
                        if(scope.isOpen) {
                            scope.isOpen = false;
                            scope.inputOnUpdate(element);
                            $rootScope.$broadcast('timepickerclosed');
                        }

                    });
                });

            },
            template : "<input id='inputBox' type='text' class='form-control' ng-model='inputTime' ng-disabled='disabledInt' time-format show-meridian='showMeridian' ng-focus='open()' ng-class='{editable:!isUnsavedInt}' data-ng-keyup='callUpdate($event)'/>"
            + "  <div class='input-group-btn' ng-class='{open:isOpen}' style='position: absolute;right: 33px;'> "
            + "    <button ng-if='!noIcon' type='button' ng-disabled='disabledInt' class='btn btn-default ' ng-class=\"{'btn-primary':isOpen}\" data-toggle='dropdown' ng-click='toggle()'> "
            + "        <i class='glyphicon glyphicon-time'></i></button> "
            + "          <div class='dropdown-menu pull-right'> "
            + "            <uib-timepicker ng-model='inputTime' show-meridian='showMeridian'></uib-timepicker> "
            + "           </div> " + "  </div>"
        };
    })
    .directive('togTimepicker', function($document, timepickerState, $rootScope) {
        return {
            restrict : 'E',
            transclude : false,
            scope : {
                inputTime : "=",
                showMeridian : "=",
                disabled : "=",
                isUnsaved : "=",
                inputOnUpdate:'&',
                pickerState : "=",
            },
            controller : function($scope, $element) {
                //$scope.isOpen = true;

                $scope.disabledInt = angular.isUndefined($scope.disabled)? false : $scope.disabled;
                $scope.isUnsavedInt = angular.isUndefined($scope.isUnsaved)? false : $scope.isUnsaved;
                $scope.isOpen = angular.isUndefined($scope.pickerState)? false : $scope.pickerState;
                $scope.toggle = function() {
                    $scope.open();
                    //if ($scope.isOpen) {
                    //    $scope.close();
                    //} else {
                    //    $scope.open();
                    //}
                };
                $scope.cancel = function() {
                    $scope.close();
                };
            },
            link : function(scope, element, attrs) {
                var picker = {
                    open : function () {
                        timepickerState.closeAll();
                        scope.isOpen = true;
                        $rootScope.$broadcast('timepickeropen');
                    },
                    close: function () {
                        scope.isOpen = false;
                    }

                };
                scope.save = function(){
                    scope.inputOnUpdate(element);
                    scope.isOpen = false;
                };
                timepickerState.addPicker(picker);

                scope.open = picker.open;
                scope.close = picker.close;
                scope.$watch("disabled", function(value) {
                    scope.disabledInt = angular.isUndefined(scope.disabled)? false : scope.disabled;
                });

                scope.$watch("inputTime", function(value) {
                    if (!scope.inputTime) {
                        element.addClass('has-error');
                    } else {
                        element.removeClass('has-error');
                    }

                });

                element.bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });

                $document.bind('click', function(event) {
                    scope.$apply(function() {
                        if(scope.isOpen) {
                            scope.isOpen = false;
                            scope.inputOnUpdate(element);
                            $rootScope.$broadcast('timepickerclosed');
                        }

                    });
                });

            },
            template : "<a class='cPointer backgroundFocusNone' ng-model='inputTime' ng-disabled='disabledInt' time-format show-meridian='showMeridian' ng-focus='open()' ng-class='{editable:!isUnsavedInt}' data-toggle='dropdown' ng-click='toggle()'>{{(inputTime|date:'hh:mm a')||'Not set'}}</a>"
            + "  <div class='input-group-btn' ng-class='{open:isOpen}' style='position: absolute; left: 158px;'> "
            + "          <div class='dropdown-menu pull-right'> "
            + "            <uib-timepicker ng-model='inputTime' show-meridian='showMeridian'></uib-timepicker> "
            + "            <div class='form-inline' style='margin-bottom: -1px; margin-top: -6px;'> "
            + "                <button class='btn btn-info btn-xs pull-left' ng-click='cancel()'>Cancel</button> "
            + "                <button class='btn btn-success btn-xs pull-right' ng-click='save()'>Save</button> "
            + "                </div> "
            + "           </div> " + "  </div>"
        };
    });