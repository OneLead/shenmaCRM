angular.module('admin-module')
    .controller('adminHeaderController',function($scope,$element){
        $scope.gotoRoles = function(){
            $element.find('.roles').addClass('active');
            $element.find('.create').removeClass('active');
            $element.find('.search').removeClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoNew = function(){
            $element.find('.create').addClass('active');
            $element.find('.roles').removeClass('active');
            $element.find('.search').removeClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.gotoSearch = function(){
            $element.find('.create').removeClass('active');
            $element.find('.roles').removeClass('active');
            $element.find('.search').addClass('active');
            var $collapse = $element.find('.navbar-collapse');
            $collapse.addClass('collapsing')
                .removeClass('in');
            setTimeout(function(){
                $collapse.removeClass('collapsing');
            },300);
        };
        $scope.search = function(key){
            if(key==undefined||key=='')alert('请输入搜索关键词');
            else location.assign('#/search/'+key);
        };
    })
    .controller('rolesController',function($rootScope,$http,$scope){
        var sessionID = sessionStorage.getItem('sessionID');
        $http({
            url:localStorage.getItem('ip')+'retailer/role/getAll?sessionID='+sessionID,
            method:"GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function(data){
            console.log(data);
            if(data.result==="1")
            $scope.data = data.data;
        });
        $rootScope.gotoRoles();
    })
    .controller('createController',function($rootScope){
        $rootScope.gotoNew();
    })
    .controller('modifyController',function($rootScope){
        $rootScope.gotoSearch();
    })
    .controller('searchController',function($rootScope){
        $rootScope.gotoSearch();
    });