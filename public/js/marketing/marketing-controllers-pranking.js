angular.module('marketing-module')
    .controller('prankingCategoryCtrl',['$scope',function($scope){
        $scope.day = function(){
            $scope.$parent.c = 'day';
        };
        $scope.week = function(){
            $scope.$parent.c = 'week';
        };
        $scope.month = function(){
            $scope.$parent.c = 'month';
        };
        $scope.all = function(){
            $scope.$parent.c = 'all';
        };
        $scope.visited = function(){
            $scope.$parent.n = 'visited';
        };
        $scope.knockdowned = function(){
            $scope.$parent.n = 'knockdowned';
        };
    }])
    .controller('prankingContentCtrl',['$scope',function($scope){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns":[
                { "mData": "userId" },
                { "mData": "userName" },
                { "mData": "count" }
            ]
        };
        function parseState(n){
            switch(n){
                case 'visited':return 1;
                case 'knockdowned':return 3;
            }
        }
        $scope.$parent.$watch('[n,c]',function(nV){
            $scope.nodata = true;
            var url = 'http://115.29.151.151:8080/retailer/customer/queryReportNew?dateType='+
                nV[1]+'&state='+parseState(nV[0])+'&date=0&sessionID='+sID+'&reportType=1';
            $scope.table.api().ajax
                .url(url)
                .load(function(d){
                    $scope.nodata = false;
                    $scope.$apply();
                });
        },true);
    }]);