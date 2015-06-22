angular.module('leader-module')
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
    .controller('expenseContentCtrl',function($scope,$http){
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
                    "mData": "deal",
                    "mRender":function(data){
                        return data+'人';
                    }
                },
                {
                    "mData": "deal",
                    "mRender":function(data,type,full){
                        return Math.round(full.budget/full.deal)+'元/人';
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
        $scope.$parent.$watch('[n,c,s]',function(nV){
            $scope.nodata = true;
            if(nV[0]!='total'){
                $('.dataTables_wrapper').show();
                var url = 'http://115.29.151.151:8080/retailer/customer/queryReportNew?reportType='+parseState(nV[0])+'&dateType='+nV[1]+'&sessionID='+sID;
                console.log(url);
                $scope.table.api().ajax
                    .url(url)
                    .load(function(d){
                        $scope.nodata = false;
                        $scope.$apply();
                    },false);
            }
            else {
                $http({
                    url:'http://115.29.151.151:8080/retailer/customer/queryReportNew?reportType=4&sessionID='+sID,
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }).success(function(data){
                    var temp = data.data[0];
                    $scope.totalExpense = temp.budget;
                    $scope.totalSum = temp.sum;
                    $scope.nodata = false;
                });
                $('.dataTables_wrapper').hide();
            }
            //n:total,method,area
            //c:week,month,all
        },true);
    });