angular.module('marketing-module')
    .controller('prankingCategoryCtrl',['$scope',function($scope){
        $scope.day = function(){
            $scope.$parent.c = 'day';
        };
        $scope.week = function(){
            $scope.$parent.c = 'week';
        };
        $scope.month = function(){
            $scope.$parent.c = 'month';
        };
        $scope.all = function(){
            $scope.$parent.c = 'all';
        };
        $scope.visited = function(){
            $scope.$parent.n = 'visited';
        };
        $scope.knockdowned = function(){
            $scope.$parent.n = 'knockdowned';
        };
    }])
    .controller('prankingContentCtrl',['d3Service','$scope','getCharts',function(d3Service,$scope,getCharts){
        $scope.pageNum = 1;
        var totalPageNum = 1;//dataset = {
        //    day:{
        //        title:['staffID','name','amount'],
        //        visited:[
        //            ['QD112','王明',8],
        //            ['QD108','宋小林',8],
        //            ['QD189','朱勋',7],
        //            ['QD156','张孟',6],
        //            ['QD143','孙维',6],
        //            ['QD188','郭静',6],
        //            ['QD187','许名',4]
        //        ],
        //        knockdowned:[
        //            ['QD189','朱勋',5],
        //            ['QD112','王明',4],
        //            ['QD156','张孟',4],
        //            ['QD188','郭静',4],
        //            ['QD143','秦晓斌',3],
        //            ['QD108','宋小林',1],
        //            ['QD187','张霖',1]
        //        ]
        //    },
        //    week:{
        //        title:['staffID','name','amount'],
        //        visited:[
        //            ['QD112','王明',49],
        //            ['QD108','宋小林',48],
        //            ['QD189','朱勋',45],
        //            ['QD156','张孟',43],
        //            ['QD143','孙维',40],
        //            ['QD188','郭静',40],
        //            ['QD187','许名',38]
        //        ],
        //        knockdowned:[
        //            ['QD189','朱勋',30],
        //            ['QD112','王明',28],
        //            ['QD156','张孟',28],
        //            ['QD188','郭静',25],
        //            ['QD143','秦晓斌',24],
        //            ['QD108','宋小林',23],
        //            ['QD187','张霖',19]
        //        ]
        //    },
        //    month:{
        //        title:['staffID','name','amount'],
        //        visited:[
        //            ['QD112','王明',210],
        //            ['QD108','宋小林',209],
        //            ['QD189','朱勋',200],
        //            ['QD156','张孟',198],
        //            ['QD143','孙维',198],
        //            ['QD188','郭静',195],
        //            ['QD187','许名',180]
        //        ],
        //        knockdowned:[
        //            ['QD189','朱勋',130],
        //            ['QD112','王明',130],
        //            ['QD156','张孟',122],
        //            ['QD188','郭静',113],
        //            ['QD143','秦晓斌',112],
        //            ['QD108','宋小林',110],
        //            ['QD187','张霖',100]
        //        ]
        //    },
        //    all:{
        //        title:['staffID','name','amount'],
        //        visited:[
        //            ['QD112','王明',656],
        //            ['QD108','宋小林',620],
        //            ['QD189','朱勋',600],
        //            ['QD156','张孟',597],
        //            ['QD143','孙维',590],
        //            ['QD188','郭静',590],
        //            ['QD187','许名',530]
        //        ],
        //        knockdowned:[
        //            ['QD189','朱勋',410],
        //            ['QD112','王明',403],
        //            ['QD156','张孟',400],
        //            ['QD188','郭静',399],
        //            ['QD143','秦晓斌',396],
        //            ['QD108','宋小林',383],
        //            ['QD187','张霖',380]
        //        ]
        //    }
        //};
        $scope.lower = function(){
            if($scope.pageNum < totalPageNum)
                $scope.pageNum++;
        };
        $scope.higher = function(){
            if($scope.pageNum > 1)
                $scope.pageNum--;
        };
        $scope.data = [];
        d3Service.d3().then(function(d3){
            var svg, x, y,color,xAxis,yAxis,rect, g,textg,text;
            (function(){
                svg = d3.select("#prankingContent")
                    .append('svg')
                    .attr('width',240+38*2)
                    .attr('height',230);
                x = d3.scale.ordinal()
                    .rangePoints([0, 180]);
                y = d3.scale.linear()
                    .rangeRound([0,200],1);
                color = d3.scale.linear()
                    .rangeRound([0,200],1);
                xAxis = d3.svg.axis()
                    .orient("top");
                yAxis = d3.svg.axis()
                    .orient("left");
                svg.append('g')
                    .attr('class','x axis')
                    .attr('transform','translate(68,20)')
                    .call(xAxis);
                svg.append('g')
                    .attr('class','y axis')
                    .attr('transform','translate(38,20)')
                    .call(yAxis);
                rect = svg.selectAll('rect')
                    .data([0,1,2,3,4,5])
                    .enter().append('rect')
                    .attr({
                        'width':36,
                        'x':function(d,i){
                            return i*40;
                        },
                        'y':0,
                        'transform':'translate(38,20)'
                    });
                g = svg.append('g').attr({
                    'transform':'translate(38,35)'
                });
                textg = g.selectAll('g')
                    .data(['1','2','3','4','5','6']).enter()
                    .append('g');
                text = textg.selectAll('text')
                    .data(['id','idt','n','nt']).enter()
                    .append('text')
                    .attr({
                        'stroke':'white',
                        'fill':'white',
                        'transform':function(d,i){return 'translate(0,'+14*i+')';}
                    })
                    .style('font-size','10px');
            })();
            $scope.$watch('[$parent.n,$parent.c,pageNum]',function(newVal){
                getCharts('ranking',newVal[1],newVal[0],newVal[2]).success(function(data){
                    console.log(data);//dataset[newVal[1]][newVal[0]];
                    $scope.data = data.data.dataList;
                });
            },true);
            $scope.$watch('data',function(newVal){
                xMap = newVal.map(function(d,i){
                        return i+1+6*($scope.pageNum-1);
                    });
                yMap = [
                    0,
                    d3.max(
                        newVal,
                        function(d){
                            return d.count;
                        }
                    )
                ];
                colorMap = [
                    d3.min(newVal,function(d){return d.count;}),
                    d3.max(newVal,function(d){return d.count;})
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
                rect.data(newVal)
                    .transition()
                    .attr({
                        'height':function(d){return y(d.count);},
                        'fill':function(d){
                            return 'rgb(0,'+color(d.count)+','+color(d.count)+')';
                        }
                    });
                textg.data(newVal)
                    .attr({
                        'transform':function(d,i){return 'translate('+(i*40+1)+','+(y(d.count)-60)+')';}
                    });
                text.data(function(d){return ['工号：', d.userId,'姓名：', d.userName];})
                    .text(function(d){
                        return d;
                    });
            })
        });
    }]);