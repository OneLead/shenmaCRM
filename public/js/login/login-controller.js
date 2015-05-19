/**
 * Created by yanyang on 4/15/15.
 */
angular.module('loginModule').controller('login',['$scope','$http',function($scope,$http){
    var reg = /^QD(999|(0|1|2)[0-9]{2})$/;
    $scope.loginInfo = {};
    $scope.validateID = function(ID){
        return reg.test(ID);
    };
    $scope.validate = function(info){
        return (info.password && info.security && reg.test(info.staffID));
    };
    $scope.askForVal = function(staffID){
        //TODO???????????????????????
        $http({
            url:'http://192.168.31.108:8080/retailer/user/sec',
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
                userName:'QD100'
            },
            success: function(data){
                alert(data);
            }
        });
    };
    $scope.resetPass = function(staffID){
        //TODO: ??????????????????????
    };
    $scope.loginJump = function(info){
        $http({
            url: localStorage.getItem('ip')+'retailer/user/auth',
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: 'userName='+info.staffID+'&userPass='+info.password+'&checkCode='+info.security
        })
            .success(function(data){
                console.log(data);
                if(data.result=='1'){
                    sessionStorage.setItem('sessionID',data.sessionID);
                    var role = data.data.role.roleId;
                    switch(role){
                        case '1':location.assign('/manager');break;
                        case '2':location.assign('/leader');break;
                        case '3':location.assign('/marketing');break;
                        case '4':location.assign('/service');break;
                    }
                }
            });
        //askSecCode.save(
        //    {
        //        userName:info.staffID,
        //        userPass:info.password,
        //        checkCode:info.security
        //    },
        //    function(){
        //        console.log('send post');
        //    }
        //);
        //TODO: ??[?????????????????????][????]
        //TODO: ????????location.assign();
    };
}]);