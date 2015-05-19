angular.module('chartDataService', [])
    .factory('getCharts', ['$http', function($http) {
        var getCharts = function(reportType,dateType,state,curPage,pageSize){
            console.log("current page: ",curPage);
            id = sessionStorage.getItem('sessionID');
            var reports = ['ranking','goals','rankingM'];
            var states = ['pending','visited','chip','knockdowned'];
            rType = reports.indexOf(reportType)+1;
            sType = states.indexOf(state);
            return $http({
                url:localStorage.getItem('ip')+'retailer/customer/queryReport?'+
                'reportType='+rType+'&dateType='+ dateType+
                '&state='+ sType +'&sessionID='+id+
                '&aCurPage='+curPage+'&aPageSize='+pageSize,
                method:'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
        };
        return getCharts;
    }]);