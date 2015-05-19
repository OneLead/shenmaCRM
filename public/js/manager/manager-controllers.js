angular.module('manager-module')
    .controller('managerHeaderController',function($scope,$element,$http){
        var id = sessionStorage.getItem('sessionID');
        $scope.projN = 0;
        $scope.projs = [];
        $http({
            url:localStorage.getItem('ip')+'retailer/project/getAll?sessionID='+id,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(d){
            $scope.projs = d.data;
        });
        $scope.goto = function(name1, name2){
            $element.find('li.item').removeClass('active');
            $element.find('li.'+name1).addClass('active');
            if(name2)$element.find('li.'+name2).addClass('active');
        };
        $scope.exit = function(){
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
    })
    .controller('managerCtrl',function($scope,$rootScope,$routeParams,$http) {
        $rootScope.goto('manager');
        $scope.data = {};
        $http({
            url: '/getWechatInfo/' + $routeParams.code,
            method: 'POST'
        })
            .success(function (data) {
                //alert(data.nickname);
                $scope.data = data;
            });
    })
    .controller('goalsCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.goto('project','goals');
    })
    .controller('rankingCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'all';
        $scope.d = 'person';
        $rootScope.goto('project','ranking');
    })
    .controller('expenseCtrl',function($scope,$rootScope){
        $scope.n = 'total';
        $scope.c = 'week';
        $rootScope.goto('project','expense');
    });