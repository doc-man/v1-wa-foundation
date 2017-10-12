/**
 * Created by Hemkanta on 03rd March, 2016.
 */
angular.module('myApp').directive('stNumberRange', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                min: '=',
                max: '='
            },
            templateUrl: 'directives/st-table/stNumberRange.html',
            link: function (scope, element, attr, table) {
                var inputs = element.find('input');
                var inputLower = angular.element(inputs[0]);
                var inputHigher = angular.element(inputs[1]);
                var predicateName = attr.predicate;

                [inputLower, inputHigher].forEach(function (input, index) {

                    input.bind('blur', function () {
                        var query = {};

                        if (scope.min) {
                            query.min = scope.min;
                        }

                        if (scope.max) {
                            query.max = scope.max;
                        }

                        scope.$apply(function () {
                            table.search(query, predicateName)
                        });
                    });
                });
            }
        };
    }])
    .directive('stConditionalFormatting',['$timeout',function ($timeout){
        return {
            restrict: 'E',
            require: '^stTable',
            template: '<div class="cond" dropdown dropdown-toggle title="Conditional formatting">'+
                            '<ul class="dropdown-menu" role="menu" style="left:25%">'+
                                '<li data-ng-repeat="item in options track by $index">'+
                                    '<div>'+
                                        '<input type="color" value="" ng-model="item.bgColr" class="clrTmpltBasic" data-ng-click="$event.stopPropagation();" data-ng-change="applyBgcolor(item)" title="Select color"> {{item.name}}'+
                                    '</div>'+
                                '</li>'+
                            '</ul>'+
                        '</div>',
            replace: true,
            scope:{
                collection: '=',
                watching: '@',
                predicate: '@'
            },
            link: function(scope, element, attr, table){
                initialize(scope.collection);

                scope.applyBgcolor = function(item){
                    var objSettingForThisPredicateValue = _.findWhere(scope.$parent.objCondFormatSetting[scope.predicate], {
                        name: item.name
                    });
                    objSettingForThisPredicateValue.bgColr = item.bgColr;
                    objSettingForThisPredicateValue.foreColor = fontColorBlackOrWhite(item.bgColr);
                    objSettingForThisPredicateValue.watching = scope.watching;
                    scope.$parent.applyCondFormat(scope.$parent.rowCollection);
                }
                function initialize(collection) {
                    var predicate = scope.predicate;
                    var modifiedCollection = [];
                    angular.forEach(collection, function(item) {
                        var value = item[predicate];
                        modifiedCollection.push({
                            name: value,
                            bgColr: '#ffffff'
                        });
                    });
                    scope.options = modifiedCollection;
                    if(_.isUndefined(scope.$parent.objCondFormatSetting)){
                        scope.$parent.objCondFormatSetting = {};
                    }
                    scope.$parent.objCondFormatSetting[predicate] = modifiedCollection;
                }

                function fontColorBlackOrWhite(bgColor) {
                    var R,G,B,calculatedValue;
                    R = hexToR(bgColor);
                    G = hexToG(bgColor);
                    B = hexToB(bgColor);
                    calculatedValue = (R*0.299) + (G*0.587) + (B*0.114);
                    return calculatedValue < 186 ? '#ffffff':'#000000';
                }
                function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
                function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
                function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
                function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
            }
        }
    }])
    .directive('stTextSearch', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                model: '='
            },
            template: '<input type="text" class="form-control" ng-model="model"/>',

            link: function (scope, element, attr, table) {

                var inputs = element.find('input');
                inputs.bind('blur',function(){
                    scope.$apply(function () {
                        table.search(scope.model, attr.predicate);
                    })
                });
            }
        }
    }])
    .directive('stGroupRadioBtn',['$timeout',function ($timeout){
        return {
            restrict: 'A',
            require: '^stTable',
            link: function(scope, element, attr, table){
                scope.checked = function($event){
                    scope.tableStateInfo.sort = {};
                    scope.tableStateInfo.search = {};
                    scope.tableStateInfo.groupByPredicate = attr.predicate;

                    if(scope.groupByPredicate!=null && scope.groupByPredicate==attr.predicate){
                        scope.groupByPredicate = null;
                        delete scope.tableStateInfo.groupByPredicate ;
                    }
                    scope.callServer(scope.tableStateInfo);
                };
                element.bind('click',scope.checked);
            }
        }
    }]).directive('stDateRange', ['$timeout', '$filter', function ($timeout,$filter) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                before: '=',
                after: '='
            },
            templateUrl: 'directives/st-table/stDateRange.html',

            link: function (scope, element, attr, table) {
                var inputs = element.find('input');
                var inputBefore = angular.element(inputs[0]);
                var inputAfter = angular.element(inputs[1]);
                var predicateName = attr.predicate;

                [inputBefore, inputAfter].forEach(function (input) {

                    input.bind('blur', function () {


                        var query = {};

                        if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                            if (scope.after) {
                                //query.after = scope.after;
                                query.after = $filter('date')(scope.after, 'yyyy-MM-dd HH:mm:ss');
                            }
                            if (scope.before) {
                                //query.before = scope.before;
                                query.before = $filter('date')(scope.before, 'yyyy-MM-dd HH:mm:ss');
                            }
                            scope.$apply(function () {
                                table.search(query, predicateName);
                            })
                        }
                    });
                });

                function open(before) {
                    return function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        if (before) {
                            scope.isBeforeOpen = true;
                        } else {
                            scope.isAfterOpen = true;
                        }
                    }
                }

                scope.openBefore = open(true);
                scope.openAfter = open();
            }
        }
    }])
    .directive('stTimeRange', ['$timeout','$filter','$cookieStore', function ($timeout,$filter,$cookieStore) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                afterTime: '=',
                beforeTime: '='
            },
            templateUrl: 'directives/st-table/stTimeRange.html',

            link: function (scope, element, attr, table) {

                var predicateName = attr.predicate;

                if(_.isUndefined(scope.afterTime) || scope.afterTime=="" || scope.afterTime==null)
                    scope.afterTime = new Date();
                if(_.isUndefined(scope.beforeTime) || scope.beforeTime=="" || scope.beforeTime==null)
                    scope.beforeTime = new Date();
                scope.hstep = 1;
                scope.mstep = 1;

                scope.ismeridian = true;
                scope.toggleMode = function() {
                    scope.ismeridian = ! scope.ismeridian;
                };

                scope.changedTimeForm = function (afterTime) {
                    if (scope.afterTime && scope.beforeTime && (scope.afterTime < scope.beforeTime))
                    {
                        scope.callTableSearch();
                    }
                };
                scope.changedTimeTo = function (beforeTime) {
                    if (scope.afterTime && scope.beforeTime && (scope.afterTime < scope.beforeTime))
                    {
                        scope.callTableSearch();
                    }
                };
                scope.callTableSearch = function()
                {
                    var query = {};
                    query.after = $filter('date')(scope.afterTime, 'yyyy-MM-dd HH:mm:ss');
                    query.before = $filter('date')(scope.beforeTime, 'yyyy-MM-dd HH:mm:ss');
                    table.search(query, predicateName);
                }
            }
        }
    }])
    .directive('stOiMultiselect', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                options: '=',
                model: '=',
            },
            template: '<oi-select data-oi-options="item.name for item in options track by item.id" data-ng-model="model" multiple ></oi-select>',

            link: function (scope, element, attr, table) {

                var multisearch = element.find('oi-select');
                var predicateName = attr.predicate;

                multisearch.bind('blur',function(){
                    scope.$apply(function () {
                        table.search(scope.model, predicateName);
                    })
                });
            }
        }
    }])
    .directive('stMulNameSearch', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '^stTable',
            //replace: true,
            scope: {
                options: '=',
                model: '=',
            },
            template: '<oi-select data-oi-options="item.name for item in options | limitTo: 30" autofocus data-ng-model="model" multiple oi-select-options="{newItem: \'prompt\', newItemModel: {id: $query, name: $query}}" data-ng-change="save()"></oi-select>',

            link: function (scope, element, attr, table) {

                var multisearch = element.find('oi-select');
                var predicateName = attr.predicate;

                scope.save = function(){
                    table.search(scope.model, predicateName);
                };
            }

        }
    }])
    .directive('stSingleSearch', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '^stTable',
            //replace: true,
            scope: {
                options: '=',
                model: '=',
            },
            template: '<oi-select oi-options="item.value for item in options | limitTo: 25" data-ng-model="model" autofocus placeholder="Select" data-ng-change="save()"></oi-select>',

            link: function (scope, element, attr, table) {

                var Search = element.find('oi-select');
                var predicateName = attr.predicate;

                scope.save = function(){
                    table.search(scope.model, predicateName);
                };
            }

        }
    }])
    .directive('stSelectMultiple', [function() {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                collection: '=',
                predicate: '@',
                predicateExpression: '=',
                grouping: '='
            },
            templateUrl: 'directives/st-table/stSelectMultiple.html',
            link: function(scope, element, attr, table) {
                scope.dropdownLabel = '';
                scope.filterChanged = filterChanged;
                scope.allSelected = true;
                scope.allDeselected = false;
                initialize();

                scope.$watch('collection', function() {
                    initialize();
                });

                function initialize() {
                    bindCollection(scope.collection);
                }

                function getPredicate() {
                    var predicate = scope.predicate;
                    if (!predicate && scope.predicateExpression) {
                        predicate = scope.predicateExpression;
                    }
                    return predicate;
                }
                function getDropdownLabel() {
                    var allItems = _.filter(scope.distinctItems, function(item){ return !(item.hasOwnProperty('header') && item.header); });

                    var allCount = allItems.length;

                    var selected = getSelectedOptions();
                    if (allCount === selected.length) {
                        return 'All';
                    }
                    if (selected.length === 0) {
                        return 'No filter';
                    }

                    if (selected.length === 1) {
                        return selected[0];
                    }

                    return selected.length + ' items';
                }

                function getSelectedOptions() {
                    var selectedOptions = [];

                    angular.forEach(scope.distinctItems, function(item) {
                        if (item.selected) {
                            selectedOptions.push(item.value);
                        }
                    });
                    return selectedOptions;
                }

                function bindCollection(collection) {
                    var predicate = getPredicate();
                    var predicateHeader = predicate+'Header';
                    var distinctItems = [];
                    var groupingIsEnabled = scope.grouping == true;

                    angular.forEach(collection, function(item) {
                        var isSelected = !_.isUndefined(item['selected']) && item['selected']==0 ? false:true;
                        if(item.hasOwnProperty(predicate)){
                            var value = item[predicate];
                            fillItems(value,isSelected, distinctItems,groupingIsEnabled,false);
                        }
                        if(item.hasOwnProperty(predicateHeader)){
                            var value = item[predicateHeader];
                            fillItems(value,isSelected, distinctItems,groupingIsEnabled,true);
                        }
                    });

                    if(!groupingIsEnabled)
                        distinctItems.sort(function(obj, other) {
                            if (obj.value > other.value) {
                                return 1;
                            } else if (obj.value < other.value) {
                                return -1;
                            }
                            return 0;
                        });

                    scope.distinctItems = distinctItems;
                    filterChanged();
                    scope.allSelected = true;
                    scope.allDeselected = false;
                }

                function fillItems(value,isSelected, distinctItems,groupingIsEnabled, valueIsHeader) {
                    if(!groupingIsEnabled){
                        fillDistinctItems(value,isSelected, distinctItems);
                    }
                    else{
                        fillItemsAsItIs(value,isSelected, distinctItems,valueIsHeader);
                    }
                }

                function fillItemsAsItIs(value,isSelected, distinctItems, valueIsHeader){
                    if (value && value.trim().length > 0 && !valueIsHeader) {
                        distinctItems.push({
                            value: value,
                            //selected: true
                            selected: isSelected
                        });
                    }
                    if (value && value.trim().length > 0 && valueIsHeader) {
                        distinctItems.push({
                            value: value,
                            //selected: false,
                            //header: true
                            header: isSelected
                        });
                    }
                }

                function fillDistinctItems(value,isSelected, distinctItems) {
                    if (value && value.trim().length > 0 && !findItemWithValue(distinctItems, value)) {
                        distinctItems.push({
                            value: value,
                            //selected: true
                            selected: isSelected
                        });
                    }
                }

                function findItemWithValue(collection, value) {
                    var found = _.find(collection, function(item) {
                        return item.value === value;
                    });

                    return found;
                }

                function filterChanged() {
                    scope.dropdownLabel = getDropdownLabel();

                    scope.allSelected = false;
                    scope.allDeselected = false;
                }
                $('.dropdown').on('hidden.bs.dropdown',function () {
                        scope.callSearch();
                });
                scope.callSearch = function(){
                    var predicate = getPredicate();

                     var query = {
                     matchAny: {}
                     };

                     query.matchAny.items = getSelectedOptions();
                     var numberOfItems = query.matchAny.items.length;
                     if (numberOfItems === 0 || numberOfItems === scope.distinctItems.length) {
                     query.matchAny.all = true;
                     } else {
                     query.matchAny.all = false;
                     }
                    table.search(query, predicate);
                }
                scope.prevent = function(event){
                    //event.preventDefault();
                    event.stopPropagation();
                }
                scope.deselectAll = function(event) {
                    if(scope.allDeselected) return false;
                    angular.forEach(scope.distinctItems, function(item) {
                        if(!item.header)
                            item.selected=false;
                    });
                    filterChanged();
                    scope.allSelected = false;
                    scope.allDeselected = true;
                    scope.prevent(event);
                };

                scope.selectAll = function(event) {
                    if(scope.allSelected) return false;
                    angular.forEach(scope.distinctItems, function(item) {
                        if(!item.header)
                            item.selected=true;
                    });
                    filterChanged();
                    scope.allSelected = true;
                    scope.allDeselected = false;
                    scope.prevent(event);
                };
            }
        }
    }])
    .directive('checkboxBtnGroup', [function() {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                collection: '=',
                predicate: '@',
                //predicateExpression: '='
            },
            template: '<pre>Model: {{modifiedCollection}}</pre>'+
                            '<div class="btn-group">'+
                                '<label data-ng-repeat="item in modifiedCollection" class="btn btn-default" data-ng-model="item.selected" btn-checkbox data-ng-click="filterChanged()">{{item.value}}</label>'+
                            '</div>',
            link: function(scope, element, attr, table) {
                scope.filterChanged = filterChanged;

                initialize();

                function initialize() {
                    bindCollection(scope.collection);
                }
                function bindCollection(collection) {
                    var predicate = scope.predicate;
                    var modifiedCollection = [];

                    angular.forEach(collection, function(item) {
                        var value = item[predicate];
                        var selected = true;
                        modifiedCollection.push({
                            value: value,
                            selected: selected
                        });
                    });

                    scope.modifiedCollection = modifiedCollection;
                    filterChanged();
                }
                function filterChanged(){
                    var predicate = scope.predicate;

                    var query = {
                        matchAny: {}
                    };

                    query.matchAny.items = getSelectedOptions();
                    var numberOfItems = query.matchAny.items.length;
                    if (numberOfItems === 0 || numberOfItems === scope.modifiedCollection.length) {
                        query.matchAny.all = true;
                    } else {
                        query.matchAny.all = false;
                    }

                    table.search(query, predicate);
                }
                function getSelectedOptions(){
                    var selectedOptions = [];

                    angular.forEach(scope.modifiedCollection, function(item) {
                        if (item.selected) {
                            selectedOptions.push(item.value);
                        }
                    });

                    return selectedOptions;
                }
            }
        }
    }])
    .directive('pageSelect', function() {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function(scope, element, attrs) {
                scope.$watch('currentPage', function(c) {
                    scope.inputPage = c;
                });
            }
        }
    })