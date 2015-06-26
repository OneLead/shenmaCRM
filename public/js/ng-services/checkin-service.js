angular.module('CheckIn',['ngResource'])
    .factory('CheckInService',['$resource',function($resource){
        var ip = localStorage.getItem('ip');
        return $resource(ip+'retailer/user/:verb',{sessionID:'@sessionID'},{
            checkIn:{
                method:'POST',
                params:{verb:'sign'},
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            },
            list:{
                method:'GET',
                params:{verb:'querySign',dateType:'@dateType',date:0},
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            },
            managerList:{
                method:'GET',
                params:{verb:'querySign',dateType:'@dateType',date:0,projectUUID:'@pUUID'},
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            },
            detail:{
                method:'GET',
                params:{verb:'signDetailList',dateType:'@dateType',date:0,userUUID:'@userUUID'},
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            },
            managerDetail:{
                method:'GET',
                params:{verb:'signDetailList',dateType:'@dateType',date:0,userUUID:'@userUUID',projectUUID:'@pUUID'},
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }
        });
    }]);