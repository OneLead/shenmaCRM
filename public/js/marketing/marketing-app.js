angular.module('marketing-module',['ngRoute','d3','userInfo','chartDataService'])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'/public/templates/marketing/customerCat.html',
                controller:'customer'
            })
            .when('/customer',{
                templateUrl:'/public/templates/marketing/customerCat.html',
                controller:'customer'
            })
            //.when('/customer/category',{
            //    templateUrl:'/public/templates/customerCat.html'
            //})
            .when('/customer/details/:customerID',{
                templateUrl:'/public/templates/service/detail.html',
                controller:'customerDetails'
            })
            .when('/backup',{
                templateUrl:'/public/templates/marketing/backupLocation.html',
                controller:'backup'
            })
            .when('/backup/:location/:pt',{
                templateUrl:'/public/templates/marketing/backupInfo.html',
                controller:'backupInfo'
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
    }]);