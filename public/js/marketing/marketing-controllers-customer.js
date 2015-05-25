//controllers in ‘customer’
angular.module('marketing-module')
.controller('custCategoryCtrl',['$scope',function($scope){
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
}])
.controller('custTableCtrl',['$scope',function($scope){
    $scope.category = ['报备时间','到访时间','认筹时间','成交时间'];
    $scope.catContent = ['createTime','visitTime','confirmTime','dealTime'];
}]);