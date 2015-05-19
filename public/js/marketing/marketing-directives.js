angular.module('marketing-module')
.directive('marketingHeader',function(){
        return{
            restrict:'E',
            templateUrl:'/public/templates/marketing/Header.html',
            controller:'marketingHeaderController'
        };
    });