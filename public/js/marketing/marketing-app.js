angular.module('marketing-module',['ngRoute','userInfo','datatablesDirectives','CheckIn'])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'/public/templates/marketing/index.html',
                controller:'indexController'
            })
            .when('/customer',{
                templateUrl:'/public/templates/marketing/customerCat.html',
                controller:'customer'
            })
            .when('/customer/details/:customerID',{
                templateUrl:'/public/templates/service/detail.html',
                controller:'customerDetails'
            })
            .when('/backup',{
                templateUrl:'/public/templates/marketing/backup.html',
                controller:'backup'
            })
            .when('/personal/goals',{
                templateUrl:'/public/templates/marketing/personalGoals.html',
                controller:'pGoals'
            })
            .when('/personal/info',{
                templateUrl:'/public/templates/marketing/personalInfo.html'
            })
            .when('/personal/infojump/:code',{
                templateUrl:'/public/templates/marketing/personalInfojump.html',
                controller:'pInfo'
            })
            .when('/personal/ranking',{
                templateUrl:'public/templates/marketing/personalRanking.html',
                controller:'pRanking'
            });
    }])
    .run(function($rootScope,$document,$http){
        console.log($document);
        //var $collapse = $document.find('.navbar-collapse');
        //console.log($collapse);
        $rootScope.gotoIndex = function(){
            $document.find('.item').removeClass('active');
            $document.find('.navbar-collapse').removeClass('in');
        };
        $rootScope.gotoCustomer = function(){
            $document.find('.item').removeClass('active');
            $document.find('.customer').addClass('active');
            $document.find('.navbar-collapse').removeClass('in');
        };
        $rootScope.gotoBackup = function(){
            $document.find('.item').removeClass('active');
            $document.find('.backup').addClass('active');
            $document.find('.navbar-collapse').removeClass('in');
        };
        $rootScope.gotoPGoals = function(){
            $document.find('.item').removeClass('active');
            $document.find('.goals').addClass('active');
            $document.find('.personal').addClass('active');
            $document.find('.navbar-collapse').removeClass('in');
        };
        $rootScope.gotoPInfo = function(){
            $document.find('.item').removeClass('active');
            $document.find('.info').addClass('active');
            $document.find('.personal').addClass('active');
            $document.find('.navbar-collapse').removeClass('in');
        };
        $rootScope.gotoPRanking = function(){
            $document.find('.item').removeClass('active');
            $document.find('.ranking').addClass('active');
            $document.find('.personal').addClass('active');
            $document.find('.navbar-collapse').removeClass('in');
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