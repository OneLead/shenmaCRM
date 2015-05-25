//controllers in 'pGoals'
angular.module('marketing-module')
.controller('pgoalCategoryCtrl',['$scope',function($scope){
    $scope.goto = function(name){
        $scope.$parent.n = name;
    };
    $scope.cate = function(name){
        $scope.$parent.c = name;
    };
}])
    .controller('pgoalContentCtrl',['d3Service','$scope','getCharts','$http',function(d3Service,$scope,getCharts,$http){
        var ways = {
            compete:'竞品拦截',
            leaflet:'地推派单',
            community:'社区拓客'
            },
            pageSize = 3,
            currentPageNum = 1;
        $scope.curPage = 1;
        $scope.nodata = true;
        $scope.prev = function(){
            if($scope.curPage<currentPageNum)$scope.curPage++;
        };
        $scope.next = function(){
            if($scope.curPage>1)$scope.curPage--;
        };
        d3Service.d3().then(function(d3){
            var svg, x, y, xAxis, yAxis, period, todaysvg;
            (function(){
                svg = d3.select("#pgoalContent")
                    .append('svg')
                    .attr('width',240+38*2)
                    .attr('height',230);
                x = d3.scale.ordinal()
                    .rangePoints([0, 202]);
                y = d3.scale.linear()
                    .rangeRound([200,0],1);
                xAxis = d3.svg.axis()
                    .orient("bottom");
                yAxis = d3.svg.axis()
                    .orient("left");
                svg.append('g')
                    .attr('class','x axis')
                    .attr('transform','translate(76,210)')
                    .call(xAxis);
                svg.append('g')
                    .attr('class','y axis')
                    .attr('transform','translate(38,10)')
                    .call(yAxis);
                period = svg.selectAll('.period')
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
                todaysvg = d3.select("#pgoalContent")
                    .append('svg')
                    .attr('class','todaysvg');
            })();
            $scope.$watch('[$parent.c,$parent.n]',function(){
                $scope.curPage = 1;
            });
            $scope.$watch('[$parent.c,$parent.n,curPage]',function(newVal){
                var data = {};
                if(newVal[1]!='today')
                getCharts('goals',newVal[0],newVal[1],newVal[2],pageSize)
                    .success(function(d){
                        if(d.result=='1'){
                            $scope.nodata = false;
                            var dataset = d.data;
                            currentPageNum = dataset.totalPageNum;
                            console.log(d);
                            data = dataset.dataList;
                            svg.style('display','block');
                            todaysvg.style('display','none');
                            xMap = data.map(function (d) {
                                return Object.keys(d)[0];
                            });
                            yMap = [
                                0,
                                d3.max(
                                    data,
                                    function (d) {
                                        var obj = d[Object.keys(d)[0]];
                                        var values = [+obj['fact'],+obj['goal']];
                                        console.log(values);
                                        return d3.max(values);
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
                                    return "translate(" + (x(Object.keys(d)[0]) + 38) + ",10)";
                                });
                            period.selectAll('rect')
                                .data(function (d) {
                                    var value = d[Object.keys(d)[0]];
                                    return [value['fact'],value['goal']];
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
                                    var value = d[Object.keys(d)[0]];
                                    return [value['fact'],value['goal']];
                                })
                                .transition()
                                .text(function (d) {
                                    return d;
                                })
                                .attr('y', function (d) {
                                    return y(d) + 15;
                                });
                        }
                        else $scope.nodata = true;
                    }).error(function(e){
                        $scope.nodata = true;
                    });
                else if(newVal[1]=='today'){
                    svg.style('display','none');
                    todaysvg
                        .style('display','block')
                        .selectAll('text')
                        .remove();
                    $http({
                        url:localStorage.getItem('ip')+'retailer/user/todayTarget?sessionID='+sID,
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        }
                    }).success(function(data){
                        console.log(data);
                        if(data.length==0)
                            todaysvg.append('text')
                                .text('今日没有任务，请联系项目主管')
                                .attr({
                                    'x':'0',
                                    'y':'30'
                                });
                        else{
                            var d = data[0];
                            todaysvg.append('text')
                                .text('行销渠道：'+ d.salesMode.name)
                                .attr({
                                    'x':0,
                                    'y':30,
                                    'height':30
                                });
                            todaysvg.append('text')
                                .text('到访目标：'+d.quotaVisit)
                                .attr({
                                    'x':0,
                                    'y':60,
                                    'height':30
                                });
                            todaysvg.append('text')
                                .text('成交目标：'+d.quotaDeal)
                                .attr({
                                    'x':0,
                                    'y':90,
                                    'height':30
                                });
                            todaysvg.append('text')
                                .text('预算：'+d.budget)
                                .attr({
                                    'x':0,
                                    'y':120,
                                    'height':30
                                });
                            todaysvg.append('text')
                                .text('行销区域：'+d.area)
                                .attr({
                                    'x':0,
                                    'y':150,
                                    'height':30
                                })
                        }
                    });
                }
            },true);
        });
    }]);
