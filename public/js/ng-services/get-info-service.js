angular.module('userInfo', [])
    .factory('getInfo', ['$http', function($http) {
        var getinfo = function(s){
            var id = sessionStorage.getItem('sessionID');
            $http({
                url:localStorage.getItem('ip')+'retailer/user/getUserInfo?sessionID='+id,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).success(function(data){
                console.log(data);
                s.userinfo = data;
            });
        };
        return getinfo;
    }]);