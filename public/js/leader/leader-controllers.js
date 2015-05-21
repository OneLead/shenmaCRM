angular.module('leader-module')
    .controller('leaderHeaderController',function($scope,$element,$http){
        $scope.goto = function(name1,name2){
            $element.find('li.item').removeClass('active');
            $element.find('li.'+name1).addClass('active');
            if(name2)$element.find('li.'+name2).addClass('active');
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
        $rootScope.goto('task');
        $scope.new = function(){
            location.assign('#/task/update/new');
        };
        $scope.listData = [];
        $http({
            url:localStorage.getItem('ip')+'retailer/task/query?sessionID='+sessionID+
                '&aCurPage='+curPage+'&aPageSize='+10,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            console.log(data);
            $scope.listData = data.data;
        });
    })
    .controller('taskUpdateCtrl',function($http,$routeParams,$scope,$compile){
        var sessionID = sessionStorage.getItem('sessionID'),
            uuid = $routeParams.id,
            flag = 0,
            options = document.forms.task.staff.options,
            userList = [];
        (function(){
            var date = new Date();
            date.setTime(date.getTime()+86400000);
            var month = date.getMonth();
            var day = date.getDate();
            $scope.date = date.getFullYear()+'-'+
            (month>8?month+1:'0'+(month+1))+'-'+(day>9?day:'0'+day);//存储日期
        })();
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
            url:localStorage.getItem('ip')+'retailer/user/query?sessionID='+sID+
                '&userName='+userName+'&userPass='+userPass+'&aCurPage='+1+'&aPageSize='+100,
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
                url:localStorage.getItem('ip')+'retailer/task/'+(uuid=='new'?'create?':'modify?uuid='+uuid+'&')+
                'sessionID='+sID+
                '&salesModeUUID='+document.forms.task.method.value+'&budget='+ d.budget+
                '&name='+'写死'+'&area='+ d.area+'&quotaVisit='+ d.quotaVisit+
                '&quotaDeal='+ d.quotaDeal+'&actionTime='+$scope.date+userListUpdate,
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                //console.log('update success',data);
                if(data.result=='1'){
                    var html = '<span>上传成功！<a ng-click="'+
                        "quitTo(true)"+
                        '">点击</a>跳转到任务列表界面</span>';
                    angular.element('#upload-info').append($compile(html)($scope));
                    //$scope.$apply();
                    //location.assign('#/customer');
                }
                else {
                    var html = '<span>存入数据库失败，请点击<a ng-click="'+
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
                /[1-9][0-9]*/.test($scope.data.quotaVisit);
            if(!validate)return validate;
            else {
                var tag=false;
                for(var i= 0,l=options.length,o;i<l;i++){
                    o=options[i];
                    if(o.selected==true) {
                        return uuid == 'new' || /[0-9a-z]{32}/.test($scope.data.salesMode.uuid);
                        tag=true;
                    }
                }
                if(!tag)return false;
            }
        };
        if(uuid=='new'){
            flag++;
            $scope.pastTask = false;
        }
        else{
            $http({
                url:localStorage.getItem('ip')+'retailer/task/find?sessionID='+sessionID+
                    '&uuid='+uuid,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                if(data.result=='1'){
                    $scope.data = data.data;
                    var createTime = new Date(data.data.createTime.slice(0,10)),
                        now = new Date();
                    $scope.pastTask = createTime < now.setDate(now.getDate()+1);
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
    .controller('rankingCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'all';
        $scope.d = 'person';
        $rootScope.goto('project','ranking');
    })
    .controller('expenseCtrl',function($scope,$rootScope){
        $scope.n = 'total';
        $scope.c = 'week';
        $rootScope.goto('project','expense');
    })
    .controller('goalsCtrl',function($scope,$rootScope){
        $scope.n = 'visited';
        $scope.c = 'month';
        $rootScope.goto('project','goals');
    })
    .controller('leaderCtrl',function($scope,$rootScope,$routeParams,$http){
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
    });