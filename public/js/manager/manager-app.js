angular.module('manager-module',['ngRoute','userInfo','datatablesDirectives'])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'/public/templates/leader/projectGoals.html',
                controller:'goalsCtrl'
            })
            .when('/manager',{
                templateUrl:'/public/templates/manager/Manager.html'
            })
            .when('/managerJump/:code',{
                templateUrl:'/public/templates/manager/ManagerJump.html',
                controller:'managerCtrl'
            })
            .when('/project:N/goals',{
                templateUrl:'/public/templates/leader/projectGoals.html',
                controller:'goalsCtrl'
            })
            .when('/project:N/expense',{
                templateUrl:'/public/templates/leader/projectExpense.html',
                controller:'expenseCtrl'
            })
            .when('/project:N/ranking',{
                templateUrl:'/public/templates/leader/projectRanking.html',
                controller:'rankingCtrl'
            });
    }])
    .run(function($rootScope,$document,$http){
        "use strict";
        var id = sessionStorage.getItem('sessionID');
        $rootScope.projN = 1;
        $rootScope.projs = [];
        $http({
            url:localStorage.getItem('ip')+'retailer/project/getAll?sessionID='+id,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(d){
            console.log(d.data);
            $rootScope.projs = d.data;
        });
        $rootScope.goto = function(name1, name2){
            $document.find('li.item').removeClass('active');
            $document.find('li.'+name1).addClass('active');
            if(name2)$document.find('li.'+name2).addClass('active');
            var $collapse = $document.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $rootScope.exit = function(){
            $http({
                url:localStorage.getItem('ip')+'retailer/user/logoff?sessionID='+id,
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(){
                location.assign('/');
            });
        };
    });