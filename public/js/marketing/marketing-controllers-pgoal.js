//controllers in 'pGoals'
angular.module('marketing-module')
.controller('pgoalCategoryCtrl',['$scope',function($scope){
    $scope.goto = function(name){
        $scope.$parent.n = name;
    };
    $scope.cate = function(name){
        $scope.$parent.c = name;
    };
}])
    .controller('pgoalContentCtrl',['$scope','$http','$sce',function($scope,$http,$sce){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns": [
                { "mData": "date" },
                { "mData": "fact" },
                { "mData": "goal" }
            ]
        };
        var ways = {
            compete:'竞品拦截',
            leaflet:'地推派单',
            community:'社区拓客'
            };
        function parseState(n){
            switch(n){
                case 'visited':return 1;
                case 'knockdowned':return 3;
            }
        }
        //$scope.prev = function(){
        //    if($scope.curPage<currentPageNum)$scope.curPage++;
        //};
        //$scope.next = function(){
        //    if($scope.curPage>1)$scope.curPage--;
        //};
        console.log($scope);
        $scope.$watch('[$parent.c,$parent.n]',function(nV){
            $scope.nodata = true;
            if(nV[1]!='today'){
                $scope.table.ajax
                    .url('http://115.29.151.151:8080/retailer/customer/queryReportNew?aCurPage=1&aPageSize=101&reportType=2&dateType='+nV[0]+'&state='+parseState(nV[1])+'&sessionID='+sID)
                    .load(function(d){
                        console.log(d);
                        $scope.nodata=false;
                        $scope.$apply();
                    },false);
            }
            else if(nV[1]=='today'){
                $http({
                    url:localStorage.getItem('ip')+'retailer/user/todayTarget?sessionID='+sID,
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }).success(function(data){
                    if(data.length==0)
                    {
                        $scope.todayHtml = $sce.trustAsHtml('今日暂无任务');
                    }
                    else{
                        var d = data[0];
                        $scope.todayHtml = $sce.trustAsHtml(
                            '行销渠道：' + d.salesMode.name + '<br>' +
                            '到访目标：' + d.quotaVisit + '<br>' +
                            '成交目标：' + d.quotaDeal + '<br>' +
                            '预算：' + d.budget + '<br>' +
                            '行销区域：' + d.area.split(',').slice(3).join(','));
                    }
                    $scope.nodata = false;
                });
            }
        },true);
    }]);
