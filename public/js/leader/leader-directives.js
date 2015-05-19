angular.module('leader-module')
    .directive('leaderHeader',function(){
        return {
            restrict:'E',
            templateUrl:'/public/templates/leader/Header.html',
            controller:'leaderHeaderController'
        };
    })
    .directive('taskCard',function(){
        return {
            restrict:'E',
            templateUrl:'/public/templates/leader/taskCard.html',
            scope:{
                id:'=',
                budget:'=',
                time:'=',
                method:'=',
                names:'=',
                area:'='
            },
            link:function($scope,$element){
                $element.parent().click(function(){
                    location.assign('#/task/update/'+$scope.id);
                });
            }
        };
    });