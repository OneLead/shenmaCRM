angular.module('manager-module')
    .controller('managerHeaderController',function($scope,$element,$http){
        var id = sessionStorage.getItem('sessionID');
        $scope.projN = 1;
        $scope.projs = [];
        $http({
            url:localStorage.getItem('ip')+'retailer/project/getAll?sessionID='+id,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(d){
            console.log(d.data);
            $scope.projs = d.data;
        });
        $scope.goto = function(name1, name2){
            $element.find('li.item').removeClass('active');
            $element.find('li.'+name1).addClass('active');
            if(name2)$element.find('li.'+name2).addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
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
        $http({
            url:localStorage.getItem('ip')+'retailer/user/getUserInfo?sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            $scope.userinfo = data;
        });
    })
    .controller('goalsCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.goto('project','goals');
        $scope.$watch('$parent.projN',function(newVal){
            location.assign('#/project'+newVal+'/goals');
        })
    })
    .controller('rankingCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'all';
        $scope.d = 'person';
        $rootScope.goto('project','ranking');
        $scope.$watch('$parent.projN',function(newVal){
            location.assign('#/project'+newVal+'/ranking');
        })
    })
    .controller('expenseCtrl',function($scope,$rootScope){
        $scope.n = 'total';
        $scope.c = 'week';
        $rootScope.goto('project','expense');
        $scope.$watch('$parent.projN',function(newVal){
            location.assign('#/project'+newVal+'/expense');
        })
    });