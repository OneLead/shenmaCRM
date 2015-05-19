angular.module('admin-module').directive('adminHeader',function(){
    return {
        restrict:'E',
        templateUrl:'/public/templates/admin/Header.html',
        controller:'adminHeaderController'
    };
});
