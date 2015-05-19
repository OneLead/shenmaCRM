angular.module('manager-module')
    .controller('expenseCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('expenseContentCtrl',function($scope,$rootScope,d3Service){
        var dataset = {
            total:{
                all: [
                    [
                        '2014-04',
                        {expense: 1998, cust: 300}
                    ],
                    [
                        '2014-05',
                        {expense: 1300, cust: 351}
                    ],
                    [
                        '2014-06',
                        {expense: 1431, cust: 420}
                    ]
                ],
                month:
                    [
                        [
                            '2015-03-29',
                            {expense: 310, cust: 30}
                        ],
                        [
                            '2015-04-05',
                            {expense: 353, cust: 30}
                        ],
                        [
                            '2015-04-12',
                            {expense: 311, cust: 33}
                        ]
                    ],
                week:
                    [
                        [
                            '2015-04-01',
                            {expense: 52, cust: 10}
                        ],
                        [
                            '2015-04-02',
                            {expense: 66, cust: 9}
                        ],
                        [
                            '2015-04-03',
                            {expense: 82, cust: 7}
                        ]
                    ]
            },
            method:{
                all: [
                    [
                        '2014-04',
                        {expense: 910, cust: 50}
                    ],
                    [
                        '2014-05',
                        {expense: 305, cust: 35}
                    ],
                    [
                        '2014-06',
                        {expense: 433, cust: 40}
                    ]
                ],
                month:
                    [
                        [
                            '2015-03-29',
                            {expense: 202, cust: 15}
                        ],
                        [
                            '2015-04-05',
                            {expense: 158, cust: 20}
                        ],
                        [
                            '2015-04-12',
                            {expense: 117, cust: 13}
                        ]
                    ],
                week:
                    [
                        [
                            '2015-04-01',
                            {expense: 30, cust: 2}
                        ],
                        [
                            '2015-04-02',
                            {expense: 21, cust: 2}
                        ],
                        [
                            '2015-04-03',
                            {expense: 16, cust: 2}
                        ]
                    ]
            },
            area:{
                all: [
                    [
                        '2014-04',
                        {expense: 910, cust: 50}
                    ],
                    [
                        '2014-05',
                        {expense: 305, cust: 35}
                    ],
                    [
                        '2014-06',
                        {expense: 433, cust: 40}
                    ]
                ],
                month:
                    [
                        [
                            '2015-03-29',
                            {expense: 202, cust: 15}
                        ],
                        [
                            '2015-04-05',
                            {expense: 158, cust: 20}
                        ],
                        [
                            '2015-04-12',
                            {expense: 117, cust: 13}
                        ]
                    ],
                week:
                    [
                        [
                            '2015-04-01',
                            {expense: 30, cust: 2}
                        ],
                        [
                            '2015-04-02',
                            {expense: 21, cust: 2}
                        ],
                        [
                            '2015-04-03',
                            {expense: 16, cust: 2}
                        ]
                    ]
            }
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
                        return i * 38 + 5;
                    },
                    'stroke':'white',
                    'fill':'white'
                });
            $scope.$watch('$rootScope.projN',function(newVal){
                //TODO:??projN??????dataset
            });
            $scope.$watch('[$parent.n,$parent.c,dataset]',function(newVal){
                var data = dataset[newVal[0]][newVal[1]];
                xMap = data.map(function (d) {
                    return d[0];
                });
                yMap = [
                    0,
                    d3.max(
                        data,
                        function (d) {
                            return d[1]['expense'];
                        }
                    )
                ];
                x.domain(xMap);
                y.domain(yMap);
                xAxis.scale(x);
                yAxis.scale(y);
                svg.select('g.x.axis')
                    .call(xAxis);
                svg.select('g.y.axis')
                    .call(yAxis);
                period.data(data)
                    .transition()
                    .attr('transform', function (d) {
                        return "translate(" + (x(d[0]) + 38) + ",10)";
                    });
                period.selectAll('rect')
                    .data(function (d) {
                        var percust = Math.round(+d[1]['expense']/+d[1]['cust']);
                        return [d[1]['expense'], percust];
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
                        var percust = Math.round(+d[1]['expense']/+d[1]['cust']);
                        return [d[1]['expense'], percust];
                    })
                    .transition()
                    .text(function (d) {
                        return d;
                    })
                    .attr('y', function (d) {
                        return y(d) + 15;
                    });
            },true);
        });
    });