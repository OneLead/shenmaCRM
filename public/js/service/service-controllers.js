angular.module('service-module')
    .controller('serviceHeaderController',['$scope','$element','$http',function($scope,$element,$http){
        $scope.goto = function(name){
            $element.find('.item').removeClass('active');
            $element.find('.'+name).addClass('active');
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
    }])
    .controller('queryController',['$scope','$rootScope','$http',function($scope,$rootScope,$http){
        $rootScope.goto('query');
        $scope.phoneNum = '';
        $scope.method = {};
        $scope.state = {};
        $scope.methods = [];
        $scope.search = {
            key:'phone',
            value:$scope.phoneNum
        };
        $http({
            url:localStorage.getItem('ip')+'retailer/salesMode/getAll?sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            if(data.result=='1')$scope.methods = data.data;
        });
        $scope.$watch('[search.key,method,state,phoneNum]',function(newVal){
            switch(newVal[0]){
                case 'phone':
                    $scope.search.value = '';
                    $scope.search.value = newVal[3];
                    break;
                case 'method':
                    $scope.search.value = [];
                    for(key in newVal[1]){
                        if(newVal[1][key])$scope.search.value.push(key);
                    }
                    break;
                case 'state':
                    $scope.search.value = [];
                    for(state in newVal[2]){
                        if(newVal[2][state])$scope.search.value.push(state);
                    }
                    break;
            }
        },true);
        $scope.find = function(search){
            console.log(search);
            location.assign('#/qresult/'+search.key+'/'+search.value);
        };
        $scope.validatephone = function(){
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            return reg.test($scope.search.value);
        };
        $scope.validate = function(){
            if($scope.search.key=='phone') {
                return $scope.validatephone();
            }
            else if($scope.search.key=='method'){
                var reg = /[0-9a-f]{32}/;
                for(i in $scope.search.value){
                    if(!reg.test($scope.search.value[i]))return false;
                }
                return true;
            }
            else if($scope.search.key=='state'){
                var reg = /(pending|visits|chips|knockdowns)/;
                for(i in $scope.search.value){
                    if(!reg.test($scope.search.value[i]))return false;
                }
                return true;
            }
        };
    }])
    .controller('qresultController',['$scope','$routeParams','$http',function($scope,$routeParams,$http){
        $scope.dataList = [];
        var pageNum=1,
            idle = true,
            totalPageNum,
            id = sessionStorage.getItem('sessionID'),
            querydata,
            states = ['pending','visits','chips','knockdowns'];
        switch($routeParams.key){
            case 'phone':querydata = '&mobile='+$routeParams.value;break;
            case 'method':
                var values = $routeParams.value.split(',');
                querydata = '';
                for(key in values){
                    querydata += '&method[]='+values[key];
                }
                break;
            case 'state':
                var values = $routeParams.value.split(',');
                querydata = '';
                for(key in values){
                    querydata += '&state[]='+(states.indexOf(values[key]));
                }
                break;
        }
        console.log(querydata);
        function getData(pageNum){
            idle = false;
            $http({
                url:localStorage.getItem('ip')+'retailer/customer/query?sessionID='+id+
                '&aCurPage='+pageNum+'&aPageSize=10'+querydata,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                console.log(data);
                if(data.result=="1"){
                    $scope.dataList = $scope.dataList.concat(data.data.dataList);
                    totalPageNum = data.data.totalPageNum;
                }
                idle = true;
            });
        }
        $scope.stateParse = function(state){
            switch(state){
                case '0': return '未';break;
                case '1': return '访';break;
                case '2': return '筹';break;
                case '3': return '成';break;
                default: return '错';
            }
        };
        getData(pageNum);
        $list = angular.element("ul.cust-list");
        $list.height(window.innerHeight-150);
        $list.on('scroll',function(e){
            var t = e.target;
            if(idle && pageNum<totalPageNum && t.scrollHeight-t.scrollTop-5 <= +t.style.height.slice(0,-2)){
                console.log('load new data');
                getData(++pageNum);
            }
        });
    }])
    .controller('listController',['$scope','$rootScope','$http',function($scope,$rootScope,$http){
        $rootScope.goto('list');
        $scope.dataList = [];
        $scope.n = 1;
        $scope.change = function(n){
            $scope.n = n;
        };
        var pageNum,
            idle = true,
            totalPageNum,
            id = sessionStorage.getItem('sessionID');
        $scope.$watch('n',function(newVal){
            pageNum = 1;
            $scope.dataList = [];
            getData(pageNum, newVal-1);
        });
        function getData(pageNum, cat){
            idle = false;
            $http({
                url:localStorage.getItem('ip')+'retailer/customer/query?sessionID='+id+
                '&aCurPage='+pageNum+'&aPageSize=10&state[]='+cat,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                console.log(data);
                if(data.result=="1"){
                    $scope.dataList = $scope.dataList.concat(data.data.dataList);
                    totalPageNum = data.data.totalPageNum;
                }
                idle = true;
            });
        }
        $scope.stateParse = function(state){
            switch(state){
                case '0': return '未';break;
                case '1': return '访';break;
                case '2': return '筹';break;
                case '3': return '成';break;
                default: return '错';
            }
        };
        $list = angular.element("ul.cust-list");
        $list.height(window.innerHeight-150);
        $list.on('scroll',function(e){
            var t = e.target;
            if(idle && pageNum<totalPageNum && t.scrollHeight-t.scrollTop-5 <= +t.style.height.slice(0,-2)){
                console.log('load new data');
                getData(++pageNum, $scope.n-1);
            }
        });
    }])
    .controller('custDetails',['$routeParams','$scope','$http',function($routeParams,$scope,$http){
        $scope.service = true;
        $scope.data = {};
        var id =  $routeParams.cust;
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
        $scope.changeState = function(){
            location.assign('#/'+id+'/change');
        }
    }])
    .controller('custChange',['$scope',function($scope){
        $scope.step = 0;
    }])
    .controller('stepContentCtrl',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
        $scope.updating = true;
        var id = $routeParams.cust;
        var custData = {};
        $http({
            url:localStorage.getItem('ip')+'retailer/customer/detail?uuid='+id+'&sessionID='+sID,
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            console.log(data);
            if(data.result=="1"){
                custData = data.data;
                $scope.visitCount = custData.visitCount=='null'?0:custData.visitCount;
                $scope.$parent.step = +custData.state+1;
                $scope.updating = false;
            }
        });
        function updateServer(updateTime){
            $scope.updating = true;
            var url = localStorage.getItem('ip')+'retailer/customer/modifyCustomer';
            var datapost = 'sessionID='+sID+
                '&uuid='+id+
                '&position='+custData.position+
                '&name='+custData.name+
                '&visitCount='+$scope.visitCount+
                '&mobile='+custData.mobile+
                '&detail='+(custData.detail||'')+
                '&state='+($scope.$parent.step-1)+
                '&isUpdate='+updateTime;
            $http({
                url:url,
                method:'POST',
                data:datapost,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=gb2312'
                }
            }).success(function(data){
                if(data.result=='1'){
                    $scope.updating=false;
                }
                else alert('update cust state failed!');
            });
        }
        $scope.nextStep = function(){
            $scope.$parent.step++;
            if($scope.$parent.step=='2')
                $scope.visitCount = '1';
            updateServer(true);
        };
        $scope.prevStep = function(){
            $scope.$parent.step--;
            if($scope.$parent.step=='1')
                $scope.visitCount = '0';
            updateServer(false);
        };
        $scope.addCount = function(){
            if(+$scope.visitCount<=60)
                $scope.visitCount = +$scope.visitCount+1+'';
            updateServer(true);
        };
        $scope.cutCount = function(){
            if(+$scope.visitCount>1)
                $scope.visitCount = +$scope.visitCount-1+'';
            else if(+$scope.visitCount==1)
                $scope.prevStep();
            updateServer(false);
        };
    }]);