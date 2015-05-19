angular.module('manager-module').directive('managerHeader',function(){
    return {
        restrict:'E',
        templateUrl:'/public/templates/manager/Header.html',
        controller:'managerHeaderController'
    };
});