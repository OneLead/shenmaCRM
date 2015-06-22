function rad(d)
{
    return d * Math.PI / 180.0;
}

function GetDistance( lat1,  lng1,  lat2,  lng2)
{
    var s;
    if( ( Math.abs( lat1 ) > 90  ) ||(  Math.abs( lat2 ) > 90 ) ){
        s = '纬度不正确';
    }
    else if( ( Math.abs( lng1 ) > 180  ) ||(  Math.abs( lng2 ) > 180 ) ){
        s = '经度不正确';
    }else {
        var radLat1 = rad(lat1);
        var radLat2 = rad(lat2);
        var a = radLat1 - radLat2;
        var b = rad(lng1) - rad(lng2);
        s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
    }
    return s;
}
angular.module('leader-module')
    .controller('leaderHeaderController',function($scope,$element,$http){
        $scope.goto = function(name1,name2){
            $element.find('li.item').removeClass('active');
            $element.find('li.'+name1).addClass('active');
            if(name2)$element.find('li.'+name2).addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.exit = function(){
            var id = sessionStorage.getItem('sessionID');
            $http({
                url:localStorage.getItem('ip')+'retailer/user/logoff?sessionID='+id,
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(){
                location.assign('/');
            });
        };
    })
    .controller('taskListCtrl',function($scope,$rootScope,$http){
        var sessionID = sessionStorage.getItem('sessionID');
        var curPage = 1;
        var totalPageNum = 1;
        $rootScope.goto('task');
        $scope.loading = true;
        $scope.new = function(){
            location.assign('#/task/update/new');
        };
        $scope.listData = [];
        function loadNewData(){
            $http({
                url:localStorage.getItem('ip')+'retailer/task/query?sessionID='+sessionID+
                '&aCurPage='+(curPage++)+'&aPageSize='+10,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                $scope.listData = $scope.listData.concat(data.data.dataList);
                totalPageNum = data.data.totalPageNum;
                $scope.loading = false;
            });
        }
        loadNewData();
        $(document).on('scroll',function(e){
            if($(document).scrollTop()+screen.height-$(document).height()>-1 && curPage<=totalPageNum && !$scope.loading){
                $scope.loading = true;
                loadNewData();
            }
        });
    })
    .controller('taskUpdateCtrl',function($http,$routeParams,$scope,$compile){
        var sessionID = sessionStorage.getItem('sessionID'),
            uuid = $routeParams.id,
            flag = 0,
            options = document.forms.task.staff.options,
            userList = [];
        $scope.r = 45;
        $scope.radius = '';
        $scope.success = false;
        var map = new BMap.Map('map',{enableMapClick:false});
        var gc = new BMap.Geocoder();
        var overlay = document.createElement('div');
        overlay.setAttribute('id','overlay');
        map.getContainer().appendChild(overlay);
        var zoomControl=new BMap.ZoomControl();
        map.addControl(zoomControl);//添加缩放控件
        function drawCircleAndLogDiff(lngLatPoint,log){
            var cPixel = map.pointToPixel(lngLatPoint);
            if(log) {
                var pointTop = map.pixelToPoint(new BMap.Pixel(cPixel.x, cPixel.y - $scope.r));
                var pointLeft = map.pixelToPoint(new BMap.Pixel(cPixel.x - $scope.r, cPixel.y));
                //console.log('竖直半径：'++'Km');
                //console.log('水平半径：'++'Km');
                $scope.radius=Math.round((GetDistance(pointTop.lat,pointTop.lng,lngLatPoint.lat,lngLatPoint.lng)+GetDistance(pointLeft.lat,pointLeft.lng,lngLatPoint.lat,lngLatPoint.lng))*500)+'米';
                $scope.$apply();
            }
            overlay.style.top = cPixel.y;
            overlay.style.left = cPixel.x;
            overlay.setAttribute('style',
                'top:'+(cPixel.y-$scope.r)+'px;left:'+(cPixel.x-$scope.r)+'px;'+
                'width:'+2*$scope.r+'px;height:'+2*$scope.r+'px;display:block;');
        }
        map.addEventListener("click", function(e){
            //var center = map.getCenter();
            $scope.data.area = e.point.lng + ',' + e.point.lat;
            gc.getLocation(e.point, function(rs){
                            var addComp = rs.addressComponents;
                            var addr = addComp.province + ", " +
                                addComp.city + ", " +
                                addComp.district + ", " +
                                addComp.street + ", " +
                                addComp.streetNumber + " 周边";
                            $scope.location = addr;
                            $scope.success = true;
                            $scope.$apply();
                        });
            drawCircleAndLogDiff(e.point,true);
            makeCircleFollow();
        });
        function makeCircleFollow() {
            var temp = $scope.data.area.split(',');
            var point = new BMap.Point(temp[0], temp[1]);
            map.addEventListener("moveend", function () {
                drawCircleAndLogDiff(point,false);
            });
            map.addEventListener("zoomend", function () {
                drawCircleAndLogDiff(point,true);
            });
            map.addEventListener("touchmove",function(e){
                if(e.touches.length==1)//console.log(e.target.offsetX, e.target.offsetY);
                drawCircleAndLogDiff(point,false);
            });
        }
        $scope.setDate = function(d){
            var date = new Date();
            if(d=='tomorrow'){
                date.setTime(date.getTime()+86400000);
                var month = date.getMonth();
                var day = date.getDate();
                $scope.date = date.getFullYear()+'-'+
                (month>8?month+1:'0'+(month+1))+'-'+(day>9?day:'0'+day);//存储日期
                angular.element('label.time.tomorrow').addClass('active');
            }
            else if(d=='today'){
                var month = date.getMonth();
                var day = date.getDate();
                $scope.date = date.getFullYear()+'-'+
                (month>8?month+1:'0'+(month+1))+'-'+(day>9?day:'0'+day);//存储日期
                angular.element('label.time.today').addClass('active');
            }
            else{
                angular.element('label.time').removeClass('active');
            }
        };
        $scope.data = {};//存储当前员工、行销方式等任务信息
        $scope.methods = [];//存储所有行销方式
        $scope.staffs = [];//存储所有员工
        $scope.pastTask = false;
        $http({
            url:localStorage.getItem('ip')+'retailer/salesMode/getAll?sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            if(data.result=='1'){
                $scope.methods = data.data;
                flag++;
            }
        });
        $http({
            url:localStorage.getItem('ip')+'retailer/user/queryProjectUser?sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            if(data.result=='1'){
                console.log(data);
                $scope.staffs = data.data.dataList;
                flag++;
            }
        });
        $scope.quitTo = function(x){
            $('#myModal').modal('hide');
            var interval = setInterval(function(){
                if(!$('#myModal').hasClass('in')){
                    clearInterval(interval);
                    if(x)location.assign('#/task/list');
                    else location.assign('#/task/update/new');
                }
            },300);
        };
        $scope.submit = function(d){
            $('#myModal').modal('show');
            var userListUpdate = '';
            for(var i= 0,l=options.length,o;i<l;i++){
                o=options[i];
                if(o.selected==true)userListUpdate+='&listUserUUID[]='+o.value;
            }
            $http({
                url:localStorage.getItem('ip')+'retailer/task/'+(uuid=='new'?'create':'modify'),
                data:(uuid=='new'?'':'uuid='+uuid+'&')+'sessionID='+sID+
                '&salesModeUUID='+$scope.data.salesMode.uuid+'&budget='+ d.budget+
                '&name='+ (d.name||'未命名任务')+'&area='+ d.area+','+map.getZoom()+','+$scope.radius+','+$scope.location+'&quotaVisit='+ d.quotaVisit+
                '&quotaDeal='+ d.quotaDeal+'&actionTime='+$scope.date+userListUpdate,
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                //console.log('update success',data);
                var html;
                if(data.result=='1'){
                    html = '<span>上传成功！<a ng-click="'+
                        "quitTo(true)"+
                        '">点击</a>跳转到任务列表界面</span>';
                    angular.element('#upload-info').append($compile(html)($scope));
                    //$scope.$apply();
                    //location.assign('#/customer');
                }
                else {
                    html = '<span>存入数据库失败，请点击<a ng-click="'+
                        "quitTo(false)" +
                        '">重新登记任务信息</a></span>';
                    angular.element('#upload-info').append($compile(html)($scope));
                }
            });
        };
        $scope.validate = function(){
            var validate =
                flag==3 &&
                /2[0-9]{3}-[0-1][0-9]-[0-3][0-9]/.test($scope.date) &&
                /[1-9][0-9]*/.test($scope.data.budget) &&
                /[1-9][0-9]*/.test($scope.data.quotaDeal) &&
                /[1-9][0-9]*/.test($scope.data.quotaVisit) &&
                /.*周边$/.test($scope.location) &&
                $scope.data.name.length <= 26;
            if(!validate)return validate;
            else {
                for(var i= 0,l=options.length,o;i<l;i++){
                    o=options[i];
                    if(o.selected==true) {
                        return uuid == 'new' || /[0-9a-zA-Z]{32}/.test($scope.data.salesMode.uuid);
                    }
                }
                return false;
            }
        };
        if(uuid=='new'){
            flag++;
            $scope.data.name = '';
            $scope.setDate('tomorrow');
            $scope.pastTask = false;
            $scope.data.salesMode = {uuid:''};
            $scope.location = '请点击／缩放地图，使蓝色圆形覆盖目标区域';
            map.centerAndZoom('北京',11);
        }
        else{
            $scope.location = "正在获取行销区域……";
            $http({
                url:localStorage.getItem('ip')+'retailer/task/find?sessionID='+sessionID+
                    '&uuid='+uuid,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                if(data.result=='1'){
                    //设置data.data最重要的是salesMode.uuid被初始化
                    $scope.data = data.data;
                    console.log(data);
                    var temp = data.data.area.split(',');
                    $scope.location = temp.slice(4).join(',');
                    $scope.data.area = temp.slice(0,2).join(',');
                    $scope.success = true;
                    var pointGot = new BMap.Point(+temp[0],+temp[1]);
                    map.centerAndZoom(pointGot,+temp[2]);
                    drawCircleAndLogDiff(pointGot,true);
                    makeCircleFollow();
                    //初始化执行时间
                    $scope.date = data.data.actionTime;
                    (function(){
                        angular.element('label.time').removeClass('active');
                        var dateSplit = $scope.date.split('-');
                        var date,today = new Date();
                        if(today.getFullYear()==dateSplit[0]
                            &&today.getMonth()+1==dateSplit[1]
                            &&today.getDate()==dateSplit[2]){
                            angular.element('label.time.today').addClass('active');
                        }
                        else{
                            today.setDate(today.getDate()+1);
                            if(today.getFullYear()==dateSplit[0]
                                &&today.getMonth()+1==dateSplit[1]
                                &&today.getDate()==dateSplit[2]){
                                angular.element('label.time.tomorrow').addClass('active');
                            }
                        }
                    })();
                    //设置被派发任务的有哪些员工（初始化多选列表）
                    var inter = setInterval(function(){
                        if(flag==2){
                            clearInterval(inter);
                            userList = data.data.userList;
                            userList.hasUuid = function(uuid){
                                for(var i = 0, l = this.length; i < l; i++){
                                    if(this[i].uuid===uuid)return true;
                                }
                                return false;
                            };
                            for(var i = 0, l = options.length, o; i < l; i++){
                                o=options[i];
                                if(userList.hasUuid(o.value)){
                                    o.selected = true;
                                }
                            }
                            flag++;
                            $scope.$apply();
                        }
                    },400);
                }
            });
        }
    })
    .controller('signListCtrl',function(CheckInService,$rootScope,$scope){
        $rootScope.goto('sign');
        $scope.c = 'day';
        $scope.keyword = '';
        $scope.goto = function(str){
            $scope.c = str;
        };
        $scope.$watch('c',function(nV){
            $scope.nodata = true;
            CheckInService.list({sessionID:sID,dateType:nV},function(data){
                //console.log(data);
                if(data.result=='1'){
                    $scope.tableData = data.data;
                    if($scope.tableData.length!==0)$scope.nodata = false;
                }
            });
        });
        $scope.judge = function(sign){
            return sign.userID.search($scope.keyword)+1!==0
            || sign.name.search($scope.keyword)+1!==0
            || sign.count.search($scope.keyword)+1!==0;
        };
        $scope.jumpToDetail = function(uuid,name,type){
            if(uuid===undefined)location.assign('#/sign/detail/795c6d8f1a624806a81a92d797dda5be/'+name+'/'+type);
            else location.assign('#/sign/detail/'+uuid+'/'+name+'/'+type);
        };
        //alert('list');
    })
    .controller('signDetailCtrl',function($scope,CheckInService,$routeParams){
        console.info('detail '+$routeParams.uuid);
        $scope.nodata = true;
        $scope.keyword = '';
        $scope.name = $routeParams.name;
        $scope.judge = function(sign){
            return sign.position.split(',').slice(2).join(',').search($scope.keyword)+1!==0
                || sign.signTime.search($scope.keyword)+1!==0;
        };
        CheckInService.detail({sessionID:sID,dateType:$routeParams.type,uUUID:$routeParams.uuid},function(data){
            console.log(data);
            if(data.result=='1'){
                $scope.tableData = data.data;
                if($scope.tableData.length!==0)$scope.nodata = false;
                var dateArr=data.extendAttr.date.split('-');
                switch($routeParams.type){
                    case 'day':
                        $scope.date = dateArr[0]+'年'+dateArr[1]+'月'+dateArr[2]+'日';
                        break;
                    case 'week':
                        $scope.date = dateArr[0]+'年第'+dateArr[1]+'周';
                        break;
                    case 'month':
                        $scope.date = dateArr[0]+'年'+dateArr[1]+'月';
                        break;
                }
            }
        });
    })
    .controller('rankingCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'all';
        $scope.d = 'person';
        $rootScope.goto('project','ranking');
    })
    .controller('expenseCtrl',function($scope,$rootScope){
        $scope.n = 'total';
        $scope.c = 'week';
        $scope.s = 'knockdowned';
        $rootScope.goto('project','expense');
    })
    .controller('goalsCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.goto('project','goals');
    })
    .controller('leaderCtrl',function($scope,$rootScope,$routeParams,$http,getInfo){
        $rootScope.goto('project','leader');
        $scope.data = {};
        $http({
            url:'/getWechatInfo/'+$routeParams.code,
            method:'POST'
        })
            .success(function(data){
                //alert(data.nickname);
                $scope.data = data;
            });
        getInfo($scope);
    });