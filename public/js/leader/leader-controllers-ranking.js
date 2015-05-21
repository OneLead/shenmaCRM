angular.module('leader-module')
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
    .controller('rankingContentCtrl',function($scope,d3Service,getCharts){
        $scope.nodata = true;
        $scope.curPage = 1;
        var totalPageNum = 1;
        $scope.lower = function(){
            if($scope.curPage < totalPageNum)
                $scope.curPage++;
        };
        $scope.higher = function(){
            if($scope.curPage > 1)
                $scope.curPage--;
        };
        d3Service.d3().then(function(d3){
            var svg, x, y,color,xAxis,yAxis,rect, g,textg,text;
            (function(){
                svg = d3.select("#rankingContent")
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
                        'stroke':'rgb(55,123,181)',
                        'fill':'rgb(55,123,181)',
                        'transform':function(d,i){return 'translate(0,'+14*i+')';}
                    });
            })();
            $scope.$watch('[$parent.n,$parent.c,$parent.d,curPage]',function(newVal){
                getCharts(newVal[2]=='person'?'ranking':'rankingM',newVal[1],newVal[0],newVal[3],newVal[2]=='person'?6:3)
                    .success(function(d){
                        var dataSlice = d.data.dataList;
                        totalPageNum = d.data.totalPageNum;
                            console.log(d.data);
                            console.log('totalPageNum',totalPageNum);
                        if(dataSlice.length==0)$scope.nodata=true;
                        else {
                            $scope.nodata = false;
                            xMap = dataSlice
                                .map(function (d, i) {
                                    return i + 1;
                                });
                            yMap = [
                                0,
                                d3.max(
                                    dataSlice,
                                    function (d) {
                                        return +d.count;
                                    }
                                )
                            ];
                            colorMap = [
                                d3.min(dataSlice, function (d) {
                                    return d.count;
                                }),
                                d3.max(dataSlice, function (d) {
                                    return d.count;
                                })
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
                            if (newVal[2] !== 'person')
                                dataSlice = dataSlice.concat([{count: 0, date: '', name: ''},
                                    {count: 0, date: '', name: ''},
                                    {count: 0, date: '', name: ''}]);
                            rect.data(dataSlice)
                                .transition()
                                .attr({
                                    'width': newVal[2] == 'person' ? 36 : 76,
                                    'x': function (d, i) {
                                        return newVal[2] == 'person' ? i * 40 : i * 80;
                                    },
                                    'height': function (d) {
                                        return y(d.count);
                                    },
                                    'fill': function (d) {
                                        return 'rgb(0,' + color(d.count) + ',' + color(d.count) + ')';
                                    }
                                });
                            textg.data(dataSlice)
                                .attr({
                                    'transform': function (d, i) {
                                        return 'translate(' + (i * (newVal[2] == 'person' ? 40 : 80) + 1) + ',' + (y(d.count) - 60) + ')';
                                    }
                                });
                            text.data(function (d) {
                                return newVal[2] == 'person' ?
                                    ['工号：', d.userId, '姓名：', d.userName] : ['', d.count, d.date, d.name];
                            })
                                .text(function (d) {
                                    return d;
                                })
                                .style('font-size', newVal[2] == 'person' ?'10px':'14px');
                        }
                    })
                    .error(function(){
                        $scope.nodata = true;
                    });
            },true);
        });
    });