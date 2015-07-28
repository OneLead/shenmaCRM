angular.module('manager-module')
    .controller('managerHeaderController',function($scope,$element,$http){
    })
    .controller('managerCtrl',function($scope,$rootScope,$routeParams,$http,getInfo) {
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
        getInfo($scope);
    })
    .controller('goalsCtrl',function($scope,$rootScope){
        $scope.n = $scope.n || 'visited';
        $scope.c = $scope.c || 'month';
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
        $scope.s = 'knockdowned';
        $rootScope.goto('project','expense');
        $scope.$watch('$parent.projN',function(newVal){
            location.assign('#/project'+newVal+'/expense');
        })
    });