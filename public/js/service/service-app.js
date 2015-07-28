/**
 * Created by yanyang on 5/3/15.
 */
angular.module('service-module',['ngRoute'])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'/public/templates/service/query.html',
                controller:'queryController'
            })
            .when('/query',{
                templateUrl:'/public/templates/service/query.html',
                controller:'queryController'
            })
            .when('/list',{
                templateUrl:'/public/templates/service/list.html',
                controller:'listController'
            })
            .when('/qresult/:key/:value',{
                templateUrl:'/public/templates/service/qresult.html',
                controller:'qresultController'
            })
            .when('/:cust/detail',{
                templateUrl:'/public/templates/service/detail.html',
                controller:'custDetails'
            })
            .when('/:cust/change',{
                templateUrl:'/public/templates/service/change.html',
                controller:'custChange'
            });
    }])
    .app(function($rootScope,$document,$http){
        $rootScope.goto = function(name){
            $document.find('.item').removeClass('active');
            $document.find('.'+name).addClass('active');
            var $collapse = $document.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $rootScope.exit = function(){
            var id = sessionStorage.getItem('sessionID');
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