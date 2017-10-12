/**
 * Created by Hemkanta on 03rd March, 2016.
 */
angular.module('myApp').filter('dateToTimeStamp', function() {
    return function(input) {
        return new Date(input).getTime()
    };
})