angular.module('manager-module')
    .controller('rankingCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.dimension = function(name){
            $scope.$parent.d = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('rankingContentCtrl',function($scope){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns":[
                { "mData": "userId" },
                { "mData": "userName" },
                { "mData": "count" }
            ]
        };
        function parseType(d){
            switch(d){
                case 'person':return 1;
                case 'method':return 3;
            }
        }
        function parseState(n){
            switch(n){
                case 'visited':return 1;
                case 'knockdowned':return 3;
            }
        }
        $scope.$parent.$watch('[n,c,d,$parent.projN]',function(nV){
            var settings = $scope.table.fnSettings(),
                url = 'http://115.29.151.151:8080/retailer/customer/queryReportNew?reportType='+parseType(nV[2])+
                    '&dateType='+nV[1]+'&state='+parseState(nV[0])+'&date=0&projectId='+nV[3]+'&sessionID='+sID;
            $scope.nodata = true;
            settings.sAjaxSource = url;
            delete settings.ajax;
            $scope.table.api().destroy();
            if(nV[2]=='person'){
                settings.aoColumns[0].mData="userId";
                settings.aoColumns[1].mData="userName";
                $('thead').html('<tr> <th>工号</th><th>姓名</th><th>工作成绩(人数)</th> </tr>');
            }
            else if(nV[2]=='method'){
                settings.aoColumns[0].mData="code";
                settings.aoColumns[1].mData="name";
                $('thead').html('<tr> <th>编号</th><th>渠道名</th><th>工作成绩(人数)</th> </tr>');
            }
            $scope.table = angular.element("table[datatable]").dataTable(settings);
            $scope.nodata = false;
        },true);
    });