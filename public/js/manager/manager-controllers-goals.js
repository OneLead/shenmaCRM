angular.module('manager-module')
    .controller('goalsCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('goalsContentCtrl',function($scope,$rootScope){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns": [
                { "mData": "date" },
                {
                    "mData": "fact",
                    "mRender":function(data){
                        return data+'人';
                    }
                },
                {
                    "mData": "goal",
                    "mRender":function(data){
                        return data+'人';
                    }
                },
                {
                    "mData": "goal",
                    "mRender":function(data,type,full){
                        return Math.round(full.fact*100/full.goal)+'%';
                    }
                }
            ]
        };
        function parseState(n){
            switch(n){
                case 'visited':return 1;
                case 'knockdowned':return 3;
            }
        }

        $scope.$parent.$watch('[c,n,$parent.projN]',function(nV){
            $scope.nodata = true;
            $scope.table.ajax
                .url('http://115.29.151.151:8080/retailer/customer/queryReportNew?aCurPage=1&aPageSize=101&reportType=2&dateType='+nV[0]+'&state='+parseState(nV[1])+'&projectId='+nV[2]+'&sessionID='+sID)
                .load(function(d){
                    $scope.nodata = false;
                    $scope.$apply();
                },false);

        },true);
    });