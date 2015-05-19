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
    .controller('rankingContentCtrl',function($scope,$rootScope,d3Service){
        $scope.pageStart = 0;
        var dataset = {
            day:{
                title:['staffID','name','amount'],
                visited: {
                    person: [
                        ['QD112', '王明', 8],
                        ['QD108', '宋小林', 8],
                        ['QD189', '朱勋', 7],
                        ['QD156', '张孟', 6],
                        ['QD143', '孙维', 6],
                        ['QD188', '郭静', 6],
                        ['QD187', '许名', 4]
                    ],
                    method:[
                        ['','地推派单',81],
                        ['','竞品拦截',80],
                        ['','社区拓客',78]
                    ]
                },
                knockdowned:{
                    person:[
                        ['QD189','朱勋',5],
                        ['QD112','王明',4],
                        ['QD156','张孟',4],
                        ['QD188','郭静',4],
                        ['QD143','秦晓斌',3],
                        ['QD108','宋小林',1],
                        ['QD187','张霖',1]
                    ],
                    method:[
                        ['','地推派单',51],
                        ['','竞品拦截',42],
                        ['','社区拓客',40]
                    ]
                }
            },
            week:{
                title:['staffID','name','amount'],
                visited:{
                    person:[
                        ['QD112','王明',49],
                        ['QD108','宋小林',48],
                        ['QD189','朱勋',45],
                        ['QD156','张孟',43],
                        ['QD143','孙维',40],
                        ['QD188','郭静',40],
                        ['QD187','许名',38]
                    ],
                    method:[
                        ['','地推派单',490],
                        ['','竞品拦截',484],
                        ['','社区拓客',456]
                    ]
                },
                knockdowned:{
                    person:[
                        ['QD189','朱勋',30],
                        ['QD112','王明',28],
                        ['QD156','张孟',28],
                        ['QD188','郭静',25],
                        ['QD143','秦晓斌',24],
                        ['QD108','宋小林',23],
                        ['QD187','张霖',19]
                    ],
                    method:[
                        ['','地推派单',303],
                        ['','社区拓客',285],
                        ['','竞品拦截',280]
                    ]
                }
            },
            month:{
                title:['staffID','name','amount'],
                visited:{
                    person:[
                        ['QD112','王明',210],
                        ['QD108','宋小林',209],
                        ['QD189','朱勋',200],
                        ['QD156','张孟',198],
                        ['QD143','孙维',198],
                        ['QD188','郭静',195],
                        ['QD187','许名',180]
                    ],
                    method:[
                        ['','社区拓客',2112],
                        ['','竞品拦截',2090],
                        ['','地推派单',2011]
                    ]
                },
                knockdowned:{
                    person:[
                        ['QD189','朱勋',130],
                        ['QD112','王明',130],
                        ['QD156','张孟',122],
                        ['QD188','郭静',113],
                        ['QD143','秦晓斌',112],
                        ['QD108','宋小林',110],
                        ['QD187','张霖',100]
                    ],
                    method:[
                        ['','社区拓客',1308],
                        ['','竞品拦截',1300],
                        ['','地推派单',1222]
                    ]
                }
            },
            all:{
                title:['staffID','name','amount'],
                visited:{
                    person:[
                        ['QD112','王明',656],
                        ['QD108','宋小林',620],
                        ['QD189','朱勋',600],
                        ['QD156','张孟',597],
                        ['QD143','孙维',590],
                        ['QD188','郭静',590],
                        ['QD187','许名',530]
                    ],
                    method:[
                        ['','社区拓客',6560],
                        ['','竞品拦截',6213],
                        ['','地推派单',6012]
                    ]
                },
                knockdowned:{
                    person:[
                        ['QD189','朱勋',410],
                        ['QD112','王明',403],
                        ['QD156','张孟',400],
                        ['QD188','郭静',399],
                        ['QD143','秦晓斌',396],
                        ['QD108','宋小林',383],
                        ['QD187','张霖',380]
                    ],
                    method:[
                        ['','社区拓客',4160],
                        ['','竞品拦截',4013],
                        ['','地推派单',4012]
                    ]
                }
            }
        };
        $scope.lower = function(){
            if($scope.pageStart + 4 < dataset[$scope.$parent.c][$scope.$parent.n][$scope.$parent.d].length)
                $scope.pageStart++;
        };
        $scope.higher = function(){
            if($scope.pageStart > 0)
                $scope.pageStart--;
        };
        d3Service.d3().then(function(d3){
            var svg = d3.select("#rankingContent")
                .append('svg')
                .attr('width',240+38*2)
                .attr('height',230);
            var x = d3.scale.ordinal()
                .rangePoints([0, 180]);
            var y = d3.scale.linear()
                .rangeRound([0,200],1);
            var color = d3.scale.linear()
                .rangeRound([0,200],1);
            var xAxis = d3.svg.axis()
                .orient("top");
            var yAxis = d3.svg.axis()
                .orient("left");
            svg.append('g')
                .attr('class','x axis')
                .attr('transform','translate(68,20)')
                .call(xAxis);
            svg.append('g')
                .attr('class','y axis')
                .attr('transform','translate(38,20)')
                .call(yAxis);
            var rect = svg.selectAll('rect')
                .data([0,1,2,3])
                .enter().append('rect')
                .attr({
                    'width':56,
                    'x':function(d,i){
                        return i*60;
                    },
                    'y':0,
                    'transform':'translate(38,20)'
                });
            var g = svg.append('g').attr({
                'transform':'translate(38,35)'
            });
            var textg = g.selectAll('g')
                .data(['1','2','3','4']).enter()
                .append('g');
            var text = textg.selectAll('text')
                .data(['id','idt','n','nt']).enter()
                .append('text')
                .attr({
                    'stroke':'white',
                    'fill':'white',
                    'transform':function(d,i){return 'translate(0,'+14*i+')';}
                });
            $scope.$watch('$rootScope.projN',function(newVal){
                //TODO:按照projN编号重新获取dataset
            });
            $scope.$watch('[$parent.n,$parent.c,$parent.d,pageStart,dataset]',function(newVal){
                var data = dataset[newVal[1]][newVal[0]][newVal[2]];
                var dataSlice = data.slice(newVal[3],newVal[3]+4);
                xMap = dataSlice
                    .map(function(d,i){
                        return i+1+newVal[3];
                    });
                yMap = [
                    0,
                    d3.max(
                        data,
                        function(d){
                            return d[2];
                        }
                    )
                ];
                colorMap = [
                    d3.min(data,function(d){return d[2];}),
                    d3.max(data,function(d){return d[2];})
                ];
                //console.log(xMap,yMap);
                x.domain(xMap);
                y.domain(yMap);
                color.domain(colorMap);
                xAxis.scale(x);
                yAxis.scale(y);
                svg.select('g.x.axis')
                    .call(xAxis);
                svg.select('g.y.axis')
                    .call(yAxis);
                rect.data(dataSlice)
                    .transition()
                    .attr({
                        'height':function(d){return y(d[2]);},
                        'fill':function(d){
                            return 'rgb(0,'+color(d[2])+','+color(d[2])+')';
                        }
                    });
                textg.data(dataSlice)
                    .attr({
                        'transform':function(d,i){return 'translate('+(i*60+3)+','+(y(d[2])-60)+')';}
                    });
                text.data(function(d){return ['工号：',d[0],'姓名：',d[1]];})
                    .text(function(d){
                        return d;
                    });
            },true);
        });
    });