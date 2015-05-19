angular.module('leader-module')
    .controller('expenseCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('expenseContentCtrl',function($scope,d3Service,getCharts){
        //var dataset = {
        //    total:{
        //        all: [
        //            [
        //                '2014-04',
        //                {expense: 1998, cust: 300}
        //            ],
        //            [
        //                '2014-05',
        //                {expense: 1300, cust: 351}
        //            ],
        //            [
        //                '2014-06',
        //                {expense: 1431, cust: 420}
        //            ]
        //        ],
        //        month:
        //            [
        //                [
        //                    '2015-03-29',
        //                    {expense: 310, cust: 30}
        //                ],
        //                [
        //                    '2015-04-05',
        //                    {expense: 353, cust: 30}
        //                ],
        //                [
        //                    '2015-04-12',
        //                    {expense: 311, cust: 33}
        //                ]
        //            ],
        //        week:
        //            [
        //                [
        //                    '2015-04-01',
        //                    {expense: 52, cust: 10}
        //                ],
        //                [
        //                    '2015-04-02',
        //                    {expense: 66, cust: 9}
        //                ],
        //                [
        //                    '2015-04-03',
        //                    {expense: 82, cust: 7}
        //                ]
        //            ]
        //    },
        //    method:{
        //        all: [
        //            [
        //                '2014-04',
        //                {expense: 910, cust: 50}
        //            ],
        //            [
        //                '2014-05',
        //                {expense: 305, cust: 35}
        //            ],
        //            [
        //                '2014-06',
        //                {expense: 433, cust: 40}
        //            ]
        //        ],
        //        month:
        //            [
        //                [
        //                    '2015-03-29',
        //                    {expense: 202, cust: 15}
        //                ],
        //                [
        //                    '2015-04-05',
        //                    {expense: 158, cust: 20}
        //                ],
        //                [
        //                    '2015-04-12',
        //                    {expense: 117, cust: 13}
        //                ]
        //            ],
        //        week:
        //            [
        //                [
        //                    '2015-04-01',
        //                    {expense: 30, cust: 2}
        //                ],
        //                [
        //                    '2015-04-02',
        //                    {expense: 21, cust: 2}
        //                ],
        //                [
        //                    '2015-04-03',
        //                    {expense: 16, cust: 2}
        //                ]
        //            ]
        //    },
        //    area:{
        //        all: [
        //            [
        //                '2014-04',
        //                {expense: 910, cust: 50}
        //            ],
        //            [
        //                '2014-05',
        //                {expense: 305, cust: 35}
        //            ],
        //            [
        //                '2014-06',
        //                {expense: 433, cust: 40}
        //            ]
        //        ],
        //        month:
        //            [
        //                [
        //                    '2015-03-29',
        //                    {expense: 202, cust: 15}
        //                ],
        //                [
        //                    '2015-04-05',
        //                    {expense: 158, cust: 20}
        //                ],
        //                [
        //                    '2015-04-12',
        //                    {expense: 117, cust: 13}
        //                ]
        //            ],
        //        week:
        //            [
        //                [
        //                    '2015-04-01',
        //                    {expense: 30, cust: 2}
        //                ],
        //                [
        //                    '2015-04-02',
        //                    {expense: 21, cust: 2}
        //                ],
        //                [
        //                    '2015-04-03',
        //                    {expense: 16, cust: 2}
        //                ]
        //            ]
        //    }
        //};
        var data = {};
        $scope.curPage = 0;
        var totalPageNum = 1;
        $scope.newer = function(){
            if($scope.curPage>0)$scope.curPage--;
        };
        $scope.older = function(){
            if($scope.curPage<totalPageNum)$scope.curPage++;
        };
        d3Service.d3().then(function(d3){
            var svg = d3.select("#expenseContent")
                .append('svg')
                .attr('width',240+38*2)
                .attr('height',230);
            var x = d3.scale.ordinal()
                .rangePoints([0, 202]);
            var y = d3.scale.linear()
                .rangeRound([200,0],1);
            var xAxis = d3.svg.axis()
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .orient("left");
            svg.append('g')
                .attr('class','x axis')
                .attr('transform','translate(76,210)')
                .call(xAxis);
            svg.append('g')
                .attr('class','y axis')
                .attr('transform','translate(38,10)')
                .call(yAxis);
            var period = svg.selectAll('.period')
                .data([0,1,2])
                .enter().append('g')
                .attr('class','period');
            period.selectAll('rect')
                .data(['fact','goal'])
                .enter().append('rect')
                .attr({
                    'width':38,
                    'x':function(d,i){return i*38;},
                    'fill':function(d,i){
                        return i?'rgb(0,0,199)':'rgb(0,150,150)';
                    }
                });
            period.selectAll('text')
                .data(['fact','goal'])
                .enter().append('text')
                .attr({
                    'x': function (d, i) {
                        return i * 38;
                    },
                    'stroke':'white',
                    'fill':'white'
                });
            $scope.$watch('[$parent.n,$parent.c,curPage]',function(newVal){
                var ratio;
                switch(newVal[1]){
                    case 'week':ratio=5;break;
                    case 'month':ratio=10;break;
                    case 'all':ratio=70;break;
                }
                //n:total,method,area
                //c:week,month,all
                getCharts(newVal[0],newVal[1],3,1,3,newVal[2]).success(function(data){
                    data = data.data.dataList[0];
                    console.log(data);
                    if(newVal[0]=='total'){
                        angular.element(svg[0][0]).hide(0);
                        $scope.totalExpense=data.budget;
                        $scope.totalSum=data.sum;
                    }//svg.hide(0);
                    else{
                        angular.element(svg[0][0]).show(0);
                        var key = Object.keys(data)[0],
                            value = data[key];
                        xMap = Object.keys(value).slice(0,3).map(function (d) {
                            return d;
                        });
                        yMap = [
                            0,
                            d3.max(
                                Object.keys(value).slice(0,3),
                                function (d) {
                                    return d3.max([+value[d][0].Budget,+value[d][1].Deal]);
                                }
                            )
                        ];
                        console.log(xMap,yMap);
                        x.domain(xMap);
                        y.domain(yMap);
                        xAxis.scale(x);
                        yAxis.scale(y);
                        svg.select('g.x.axis')
                            .call(xAxis);
                        svg.select('g.y.axis')
                            .call(yAxis);
                        period.data(Object.keys(value).slice(0,3))
                            .transition()
                            .attr('transform', function (d) {
                                return "translate(" + (x(d) + 38) + ",10)";
                            });
                        period.selectAll('rect')
                            .data(function (d) {
                                var budget = value[d][0].Budget, deal = value[d][1].Deal;
                                var percust = Math.round(+budget*ratio/+deal);
                                return [budget, percust];
                            })
                            .transition()
                            .attr({
                                'y': function (d) {
                                    var result = y(d);
                                    return result;
                                },
                                'height': function (d) {
                                    var result = 200-y(d);
                                    return result;
                                }
                            });
                        period.selectAll('text')
                            .data(function (d) {
                                var budget = value[d][0].Budget, deal = value[d][1].Deal;
                                var percust = Math.round(+budget/+deal);
                                return [budget, percust];
                            })
                            .transition()
                            .text(function (d) {
                                return d;
                            })
                            .style('font-size','12px')
                            .attr('y', function (d,i) {
                                return y(i==0?d:d*ratio) + 15;
                            });
                    }
                });
            },true);
        });
    });