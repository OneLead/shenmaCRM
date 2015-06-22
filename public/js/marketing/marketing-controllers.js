angular.module('marketing-module')
    .controller('marketingHeaderController',['$scope','$element','$http',function($scope,$element,$http){
        var $collapse = $element.find('.navbar-collapse');
        $scope.gotoIndex = function(){
            $element.find('.item').removeClass('active');
            $collapse.removeClass('in');
        };
        $scope.gotoCustomer = function(){
            $element.find('.item').removeClass('active');
            $element.find('.customer').addClass('active');
            $collapse.removeClass('in');
        };
        $scope.gotoBackup = function(){
            $element.find('.item').removeClass('active');
            $element.find('.backup').addClass('active');
            $collapse.removeClass('in');
        };
        $scope.gotoPGoals = function(){
            $element.find('.item').removeClass('active');
            $element.find('.goals').addClass('active');
            $element.find('.personal').addClass('active');
            $collapse.removeClass('in');
        };
        $scope.gotoPInfo = function(){
            $element.find('.item').removeClass('active');
            $element.find('.info').addClass('active');
            $element.find('.personal').addClass('active');
            $collapse.removeClass('in');
        };
        $scope.gotoPRanking = function(){
            $element.find('.item').removeClass('active');
            $element.find('.ranking').addClass('active');
            $element.find('.personal').addClass('active');
            $collapse.removeClass('in');
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
    }])
    .controller('indexController',['$scope','CheckInService','$rootScope',function($scope,CheckInService,$rootScope){
        $rootScope.gotoIndex();
        $scope.signing = false;
        document.body.style.backgroundColor = 'rgb(44,46,47)';
        var checkIn = {
            state:false,//是否已完成第一次定位
            lng:0,
            lat:0,
            location:'未获取'
        };
        geo.addEventListener("geofail",function(){
            alert('定位失败');
            $scope.signing = false;
        });
        geo.addEventListener("geosuccess",function(evt){
            var addr = evt.detail.coords;
            if((checkIn.lng = addr.lng) && (checkIn.lat = addr.lat))
                setPtAndAddr(checkIn);
        });
        function setPtAndAddr(checkIn){
            var point = new BMap.Point(checkIn.lng, checkIn.lat);
            var gc = new BMap.Geocoder();
            gc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                checkIn.location = checkIn.lng + "," + checkIn.lat + "," + addComp.province + "," +
                addComp.city + "," +
                addComp.district + "," +
                addComp.street + "," +
                addComp.streetNumber;
                if(checkIn.state){
                    CheckInService.checkIn({
                        position:checkIn.location,
                        sessionID:sID
                    },function(data){
                        if(data.result=='1')alert('签到成功');
                        else if(data.result=='0')alert('签到失败：'+data.errMsg);
                        $scope.signing = false;
                    });
                }
                else checkIn.state = true;//第一次定位成功后才会为真
            });
        }
        $scope.checkIn = function(){
            //alert('签到！');
            if(checkIn.state){
                $scope.signing = true;
                $('i.icon.-location.-large').click();
            }
            else alert('正在定位中，请稍后再试。如果始终出现此消息，则可能定位功能无效，可刷新页面再试。');
        };
    }])
    //main url path controllers
    .controller('customer',['$scope','$rootScope','$http',function($scope,$rootScope,$http){
        document.body.style.backgroundColor = 'white';
        $scope.n = 0;
        $rootScope.gotoCustomer();
        $scope.dataList = [];
        var pageNum = 1,idle=true,totalPageNum= 1,
            id = sessionStorage.getItem('sessionID'),
            uuid = sessionStorage.getItem('uuid');
        $list = angular.element("#custTable");
        $list.height(window.innerHeight-110);
        $list.on('scroll',function(e){
            var t = e.target;
            if(idle && pageNum<totalPageNum && t.scrollHeight-t.scrollTop-5 <= +t.style.height.slice(0,-2)){
                console.log('load new data');
                getData(++pageNum, $scope.n);
            }
        });
        function getData(pageNum, cat){
            idle = false;
            $http({
                url:localStorage.getItem('ip')+'retailer/customer/query?sessionID='+id+
                '&aCurPage='+pageNum+'&aPageSize=20&state[]='+cat+'&salesUUID='+uuid,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                if(data.result=="1"){
                    $scope.dataList = $scope.dataList.concat(data.data.dataList);
                    console.log($scope.dataList);
                    totalPageNum = data.data.totalPageNum;
                }
                idle = true;
            });
        }
        $scope.$watch('n',function(newVal){
            $scope.dataList = [];
            if(idle)getData(pageNum,newVal);
        });
    }])
    .controller('backup',['$scope','$routeParams','$http','$compile','$rootScope',function($scope,$routeParams,$http,$compile,$rootScope){
        document.body.style.backgroundColor = 'white';
        $rootScope.gotoBackup();
        $('#myModal').modal({
            backdrop:'static',
            keyboard:false,
            show:false
        });
        if(sessionStorage.getItem('notask'))$http({
            url:localStorage.getItem('ip')+'retailer/user/getUserInfo?sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            if(data.taskList.length==0){
                $('#myModal').modal('show');
                var html="<p>今天没有任务，请联系项目主管。</p><a class='btn' ng-click='";
                    html+= 'quitTo("customer")';
                    html+="'>回到客户列表</a>";
                angular.element('#upload-info').empty().append($compile(html)($scope));
            }
        });
        $scope.loading = true;
        $scope.customer = {
            location:'正在获取位置……',
            pt:'',
            time:(new Date()).toString().slice(4,-15),
            name:'',
            phone:'',
            description:''
        };
        var lon,lat;
        function setPtAndAddr(lon,lat){
            $scope.customer.pt = lon +','+ lat;
            var point = new BMap.Point(lon, lat);
            gc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                $scope.customer.location = addComp.province + ", " +
                addComp.city + ", " +
                addComp.district + ", " +
                addComp.street + ", " +
                addComp.streetNumber;//传给显示值的参数
                $scope.loading = false;
                $scope.$apply();
            });
            $scope.$apply();
        }
        geo.addEventListener("geofail",function(evt){alert('定位失败');});
        geo.addEventListener("geosuccess",function(evt){
            var addr = evt.detail.coords;
            lon = addr.lng;
            lat = addr.lat;
            setPtAndAddr(lon,lat);
        });
        //var uuid = sessionStorage.getItem('uuid');
        var gc = new BMap.Geocoder();
        $scope.validatePhone = function(){
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            return reg.test($scope.customer.phone);
        };
        $scope.quitTo = function(str){
            $('#myModal').modal('hide');
            var interval = setInterval(function(){
                if(!$('#myModal').hasClass('in')){
                    clearInterval(interval);
                    location.assign('#/'+str);
                }
            },300);//
        };
        $scope.next = function(cus){
            $('#myModal').modal('show');
            var data = 'sessionID='+sID+
                '&position='+cus.pt+','+cus.location+
                '&name='+cus.name+
                '&mobile='+cus.phone+
                '&detail='+(cus.detail||'空')/*+
             '&salesUUID='+uuid*/,
                url = localStorage.getItem('ip')+'retailer/customer/create';
            $http({
                url:url,
                method:'POST',
                data:data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                //alert(data.result);
                if(data.result=='1'){
                    var html = '<span>上传成功！<a ng-click="'+
                        "quitTo('customer')"+
                        '">点击</a>跳转到客户列表界面</span>';
                    //alert(html);
                    angular.element('#upload-info').empty().append($compile(html)($scope));
                    //$scope.$apply();
                    //location.assign('#/customer');
                }
                else {
                    var html = '<span>'+data.errMsg+'请点击<a ng-click="'+
                        "quitTo('backup')" +
                        '">重新登记客户信息</a></span>';
                    angular.element('#upload-info').empty().append($compile(html)($scope));
                }
            }).error(function(err){
                var html = '<p>'+err+'</p>'+'<span>存入数据库失败，请点击<a ng-click="'+
                    "quitTo('backup')" +
                    '">重新登记客户信息</a></span>';
                angular.element('#upload-info').empty().append($compile(html)($scope));
            });
        };
    }])
    .controller('pGoals',['$scope','$rootScope',function($scope,$rootScope){
        document.body.style.backgroundColor = 'white';
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.gotoPGoals();
    }])
    .controller('pInfo',['$scope','$rootScope','$routeParams','$http','getInfo',function($scope,$rootScope,$routeParams,$http,getInfo){
        document.body.style.backgroundColor = 'white';
        $rootScope.gotoPInfo();
        $scope.data = {};
        $scope.userinfo = {};
        $http({
            url:'/getWechatInfo/'+$routeParams.code,
            method:'POST'
        })
            .success(function(data){
                //console.log(data);
                $scope.data = data;
            });
        getInfo($scope);
    }])
    .controller('pRanking',['$rootScope','$scope',function($rootScope,$scope){
        document.body.style.backgroundColor = 'white';
        $scope.n = 'visited';
        $scope.c = 'all';
        $rootScope.gotoPRanking();
    }])
    //secondary url path controllers
    .controller('customerDetails',['$routeParams','$scope','$http',function($routeParams,$scope,$http){
        document.body.style.backgroundColor = 'white';
        //console.log($routeParams);
        var id = $routeParams.customerID;
        $scope.service = false;
        $scope.data = {};
        $http({
            url:localStorage.getItem('ip')+'retailer/customer/detail?uuid='+id+'&sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            console.log(data);
            if(data.result=="1")$scope.data = data.data;
        });
    }]);