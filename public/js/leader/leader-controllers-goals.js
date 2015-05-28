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
        $scope.dataset = {
            visited:{
                month: {
                    '2014-04': {fact: 1998, goal: 1505},
                    '2014-05': {fact: 1300, goal: 1355},
                    '2014-06': {fact: 1431, goal: 1420}
                },
                week:
                    [
                        [
                            '2015-03-29',
                            {fact: 310, goal: 300}
                        ],
                        [
                            '2015-04-05',
                            {fact: 353, goal: 300}
                        ],
                        [
                            '2015-04-12',
                            {fact: 311, goal: 330}
                        ]
                    ],
                day:
                    [
                        [
                            '2015-04-01',
                            {fact: 52, goal: 100}
                        ],
                        [
                            '2015-04-02',
                            {fact: 66, goal: 90}
                        ],
                        [
                            '2015-04-03',
                            {fact: 82, goal: 70}
                        ]
                    ]
            },
            knockdowned:{
                month: [
                    [
                        '2014-04',
                        {fact: 910, goal: 500}
                    ],
                    [
                        '2014-05',
                        {fact: 305, goal: 350}
                    ],
                    [
                        '2014-06',
                        {fact: 433, goal: 400}
                    ]
                ],
                week:
                    [
                        [
                            '2015-03-29',
                            {fact: 202, goal: 150}
                        ],
                        [
                            '2015-04-05',
                            {fact: 158, goal: 200}
                        ],
                        [
                            '2015-04-12',
                            {fact: 117, goal: 130}
                        ]
                    ],
                day:
                    [
                        [
                            '2015-04-01',
                            {fact: 30, goal: 25}
                        ],
                        [
                            '2015-04-02',
                            {fact: 21, goal: 20}
                        ],
                        [
                            '2015-04-03',
                            {fact: 16, goal: 20}
                        ]
                    ]
            }
        };
        $scope.dtOptions = {
            "dom":'ptf',
            "lengthChange":3,
            "sAjaxSource": 'http://115.29.151.151:8080/retailer/customer/queryReportNew?aCurPage=1&aPageSize=101&reportType=2&dateType=month&state=1&sessionID='+sID,
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
            console.log(nV);
            console.log($scope.table);
            $scope.table.ajax.url('http://115.29.151.151:8080/retailer/customer/queryReportNew?aCurPage=1&aPageSize=101&reportType=2&dateType='+$scope.$parent.c+'&state='+parseState($scope.$parent.n)+'&sessionID='+sID).load();
        },true);
    });