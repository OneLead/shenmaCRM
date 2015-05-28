angular.module('leader-module')
    .controller('goalsCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('goalsContentCtrl',function($scope){
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "aoColumns": [
                { "mData": "date" },
                { "mData": "fact" },
                { "mData": "goal" }
            ]
        };
        //$scope.dtOptions = {
        //    "bProcessing": true,
        //    "bServerSide": true,
        //    iDisplayLength: 5,
        //    sAjaxSource: 'http://115.29.151.151:8080/retailer/customer/queryReport?sessionID='+ sID,
        //    sAjaxDataProp: 'aaData',
        //
        //    sPaginationType: "full_numbers",
        //    "aoColumns":
        //        [
        //            { "mData": "#" },
        //            { "mData": "时间段",
        //                "sClass": "center",
        //                "mRender": function(data,type,full) {
        //                    return '<a class="emplyeeInfoLink" href="javascript:;">阿司法所</a>';
        //                }
        //            },
        //            { "mData": "目标人数" },
        //            { "mData": "实际成交" }
        //        ],
        //    /*"aoColumnDefs":[
        //     {
        //     "aTargets":[4],
        //     "mData": null
        //     }
        //     ],*/
        //    "fnServerData": function( sUrl, aoData, fnCallback, oSettings ) {
        //        oSettings.jqXHR = $.ajax({
        //            "url": sUrl,
        //            beforeSend: function(xhr) {
        //                xhr.withCredentials = true;
        //            },
        //            "data": aoData,
        //            "type": 'get',
        //            "success": fnCallback,
        //            "cache": false
        //        });
        //    }
        //}
        function parseState(n){
            switch(n){
                case 'visited':return 1;
                case 'knockdowned':return 3;
            }
        }
        $scope.$parent.$watch('[c,n]',function(nV){
            $scope.nodata = true;
            $scope.table.ajax
                .url('http://115.29.151.151:8080/retailer/customer/queryReportNew?aCurPage=1&aPageSize=101&reportType=2&dateType='+nV[0]+'&state='+parseState(nV[1])+'&sessionID='+sID)
                .load(function(d){
                    $scope.nodata = false;
                    $scope.$apply();
                },false);
        },true);
    });