//controllers in ‘customer’
angular.module('marketing-module')
.controller('custCategoryCtrl',function($scope){
    $scope.knockdowns = function(){
        $scope.$parent.n = 3;
    };
    $scope.chips = function(){
        $scope.$parent.n = 2;
    };
    $scope.visits = function(){
        $scope.$parent.n = 1;
    };
    $scope.pendings = function(){
        $scope.$parent.n = 0;
    };
})
.controller('custTableCtrl',function($scope){
    $scope.category = ['手机号','到访时间','认筹时间','成交时间'];
    $scope.catContent = ['mobile','visitTime','confirmTime','dealTime'];
});