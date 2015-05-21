angular.module('marketing-module')
    .controller('marketingHeaderController',function($scope,$element,$http){
        $scope.gotoCustomer = function(){
            $element.find('.item').removeClass('active');
            $element.find('.customer').addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoBackup = function(){
            $element.find('.item').removeClass('active');
            $element.find('.backup').addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoPGoals = function(){
            $element.find('.item').removeClass('active');
            $element.find('.goals').addClass('active');
            $element.find('.personal').addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoPInfo = function(){
            $element.find('.item').removeClass('active');
            $element.find('.info').addClass('active');
            $element.find('.personal').addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoPRanking = function(){
            $element.find('.item').removeClass('active');
            $element.find('.ranking').addClass('active');
            $element.find('.personal').addClass('active');
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
    //main url path controllers
    .controller('customer',function($scope,$rootScope,$http){
        $scope.n = 0;
        $rootScope.gotoCustomer();
        $scope.dataList = [];
        var pageNum = 1,idle=true,totalPageNum= 1,
            id = sessionStorage.getItem('sessionID'),
            uuid = sessionStorage.getItem('uuid');
        $list = angular.element("#custTable");
        $list.height(window.innerHeight-150);
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
    })
    .controller('backup',function($rootScope,$scope){
        $rootScope.gotoBackup();
        $scope.location = '请点击地图选择当前位置';
        var pt = null;
        $scope.success = false;
        $scope.next = function(){
            location.assign('#/backup/'+$scope.location+'/'+pt);
        };
        var map = new BMap.Map('map');
        var gc = new BMap.Geocoder();
        navigator.geolocation.getCurrentPosition(function(position){
            var point = new BMap.Point(position.coords.longitude,position.coords.latitude);
            map.centerAndZoom(point,15);
        });
        map.addEventListener("click", function(e){
            var point = e.point;
            pt = [point.lng,point.lat];
            gc.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                var addr = addComp.province + ", " +
                    addComp.city + ", " +
                    addComp.district + ", " +
                    addComp.street + ", " +
                    addComp.streetNumber;
                $scope.location = addr;
                $scope.success = true;
                $scope.$apply();
            });
        });
    })
    .controller('pGoals',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.gotoPGoals();
    })
    .controller('pInfo',function($scope,$rootScope,$routeParams,$http,getInfo){
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
    })
    .controller('pRanking',function($rootScope,$scope){
        $scope.n = 'visited';
        $scope.c = 'all';
        $rootScope.gotoPRanking();
    })
    //secondary url path controllers
    .controller('customerDetails',function($routeParams,$scope,$http){
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
    })
    .controller('backupInfo',function($scope,$routeParams,$http,$compile){
        $('#myModal').modal({
            backdrop:'static',
            keyboard:false,
            show:false
        });
        var uuid = sessionStorage.getItem('uuid');
        $scope.customer = {
            location:$routeParams.location,
            pt:$routeParams.pt,
            time:(new Date()).toString().slice(4,-15),
            name:'',
            phone:'',
            description:''
        };
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
            $http({
                url:localStorage.getItem('ip')+'retailer/customer/create',
                method:'POST',
                data:'sessionID='+sID+
                '&position='+cus.pt+
                '&name='+cus.name+
                '&mobile='+cus.phone+
                '&detail='+cus.description+
                '&salesUUID='+uuid,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                if(data.result=='1'){
                    var html = '<span>上传成功！<a ng-click="'+
                    "quitTo('customer')"+
                    '">点击</a>跳转到客户列表界面</span>';
                    console.log(html);
                    angular.element('#upload-info').append($compile(html)($scope));
                    //$scope.$apply();
                    //location.assign('#/customer');
                }
                else {
                    var html = '<span>存入数据库失败，请点击<a ng-click="'+
                    "quitTo('backup')" +
                    '">重新登记客户信息</a></span>';
                    angular.element('#upload-info').append($compile(html)($scope));
                }
            }).error(function(err){
                var html = '<p>'+err+'</p>'+'<span>存入数据库失败，请点击<a ng-click="'+
                    "quitTo('backup')" +
                    '">重新登记客户信息</a></span>';
                angular.element('#upload-info').append($compile(html)($scope));
            });
        };
    });