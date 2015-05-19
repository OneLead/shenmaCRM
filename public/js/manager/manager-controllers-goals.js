angular.module('manager-module')
    .controller('goalsCategoryCtrl',function($scope){
        $scope.goto = function(name){
            $scope.$parent.c = name;
        };
        $scope.tab = function(name){
            $scope.$parent.n = name;
        };
    })
    .controller('goalsContentCtrl',function($scope,$rootScope,d3Service){
        var dataset = {
            visited:{
                month: [
                    [
                        '2014-04',
                        {fact: 1998, goal: 1505}
                    ],
                    [
                        '2014-05',
                        {fact: 1300, goal: 1355}
                    ],
                    [
                        '2014-06',
                        {fact: 1431, goal: 1420}
                    ]
                ],
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
        d3Service.d3().then(function(d3){
            var svg = d3.select("#goalsContent")
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
            $scope.$watch('[$parent.c,$parent.n,dataset]',function(newVal){
                var data = dataset[newVal[1]][newVal[0]];
                xMap = data.map(function (d) {
                    return d[0];
                });
                yMap = [
                    0,
                    d3.max(
                        data,
                        function (d) {
                            return d3.max(
                                [d[1]['fact'], d[1]['goal']],
                                function (d) {
                                    return d;
                                }
                            );
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
                        return [d[1]['fact'], d[1]['goal']];
                    })
                    .transition()
                    .attr({
                        'y': function (d) {
                            return y(d);
                        },
                        'height': function (d) {
                            return 200 - y(d);
                        }
                    });
                period.selectAll('text')
                    .data(function (d) {
                        return [d[1]['fact'], d[1]['goal']];
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