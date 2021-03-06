angular.module('manager-module')
    .controller('expenseCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
        $scope.state = function(name){
            $scope.$parent.s = name;
        };
    })
    .controller('expenseContentCtrl',function($scope,$rootScope,$http){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns": [
                { "mData": "name" },
                {
                    "mData": "budget",
                    "mRender":function(data){
                        return data+'元';
                    }
                },
                {
                    "mData": "sum",
                    "mRender":function(data){
                        if(!data)return '0人';
                        return data+'人';
                    }
                },
                {
                    "mData": "sum",
                    "mRender":function(data,type,full){
                        if(!full.sum)return '投入资金全无成效!';
                        return Math.round(full.budget/full.sum)+'元/人';
                    }
                }
            ]
        };
        function parseState(n){
            switch(n){
                case 'method':return 5;
                case 'area':return 6;
            }
        }
        $scope.$parent.$watch('[n,c,s,$parent.projN]',function(nV){
            $scope.nodata = true;
            if(nV[0]!='total'){
                $scope.table.api().ajax
                    .url('http://115.29.151.151:8080/retailer/customer/queryReportNew?reportType='+parseState(nV[0])+'&dateType='+nV[1]+'&state='+(nV[2]=='visited'?1:3)+'&sessionID='+sID+'&projectId='+nV[3])
                    .load(function(d){
                        $scope.nodata = false;
                        $scope.$apply();
                        $('.dataTables_wrapper').show();
                    },false);
            }
            else {
                $http({
                    url:'http://115.29.151.151:8080/retailer/customer/queryReportNew?reportType=4&sessionID='+sID+'&state='+(nV[2]=='visited'?1:3)+'&projectId='+nV[3],
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }).success(function(data){
                    if(data.data) {
                        var temp = data.data[0];
                        $scope.totalExpense = temp.budget;
                        $scope.totalSum = temp.sum;
                        $scope.nodata = false;
                    }
                    $('.dataTables_wrapper').hide();
                }).error(function(){
                    $('.dataTables_wrapper').hide();
                });
            }
            //n:total,method,area
            //c:week,month,all
        },true);
    });