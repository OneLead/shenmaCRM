angular.module('leader-module')
    .controller('expenseCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('expenseContentCtrl',function($scope){
        var data = {};
        $scope.curPage = 0;
        var totalPageNum = 1;
        $scope.newer = function(){
            if($scope.curPage>0)$scope.curPage--;
        };
        $scope.older = function(){
            if($scope.curPage<totalPageNum)$scope.curPage++;
        };
        d3Service.d3().then(function(d3){
            $scope.$watch('[$parent.n,$parent.c,curPage]',function(newVal){
                var ratio;
                switch(newVal[1]){
                    case 'week':ratio=5;break;
                    case 'month':ratio=10;break;
                    case 'all':ratio=70;break;
                }
                //n:total,method,area
                //c:week,month,all
            },true);
        });
    });