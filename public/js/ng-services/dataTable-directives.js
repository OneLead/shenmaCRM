angular.module('datatablesDirectives', []).directive('datatable', function ($http) {
    return {
        // I restricted it to A only. I initially wanted to do something like
        // <datatable> <thead> ... </thead> </datatable>
        // But thead elements are only valid inside table, and <datatable> is not a table.
        // So.. no choice to use <table datatable>
        restrict: 'A',

        link: function ($scope, $elem, attrs) {
            var options = {
            };

            // Start with the defaults. Change this to your defaults.
            options = {
                // "bProcessing": true,
                // "bServerSide": true,
                // "sPaginationType": "full_numbers",
                // 如果加上下面这段内容，则使用post方式传递数据
                // "fnServerData": function ( sSource, aoData, fnCallback ) {
                // 	$.ajax( {
                // 		"dataType": 'json',
                // 		"type": "get",
                // 		"url":  'http://127.0.0.1:8080/retailer/customer/queryReport?aCurPage=1&aPageSize=10&reportType=2&dateType=week&state=3&sessionID=5CD572C0544C979AAFE919179220A0BB',
                // 		// "data": aoData,
                // 		success: function(data, status) {
                // 			sSource= data.data.dataList;
                // 		}
                // 	} );
                // },
                // 行的回调函数
                // "fnRowCallback" : function(nRow, aData, iDisplayIndex,
                // 		iDisplayIndexFull) {
                // 	var str = "";
                // 	// alert('aData.data.dataList.count');
                // 	str +="<td>"
                // 		+ aData.data.dataList.count
                // 		+ "</td>"
                // 		+ "<td>"
                // 		+ aData.data.dataList.count
                // 		+ "</td>"
                // 		+ "<td>"
                // 		+ aData.data.dataList.count
                // 		+ "</td>";
                // 	$(nRow).empty().append(str);
                // }
            } ;

            // If dtOptions is defined in the controller, extend our default option.
            if (typeof $scope.dtOptions !== 'undefined') {

                angular.extend(options, $scope.dtOptions);
            }

            // If dtoptions is not declared, check the other options
            if (attrs['dtoptions'] === undefined) {

                // Get the attributes, put it in an options
                // We need to do a switch/case because attributes does not retain case
                // and datatables options are case sensitive. Damn. It's okay! We need to detect
                // the callbacks anyway and call it as functions, so it works out!
                // I put what I needed, most of my settings are not dynamics except those 2.
                for (property in attrs) {
                    switch (property) {
                        // This is the ajax source
                        case 'sajaxsource':
                            options['sAjaxSource'] = attrs[property];
                            break;
                        // This is the ajax data prop. For example, your result might be
                        // {code: 200, data: [ .. ]} -> in the case, sAjaxDataProp is data
                        case 'sajaxdataprop':
                            options['sAjaxDataProp'] = attrs[property];
                            break;
                    }
                }
            }
            else {
                // If dtoptions is declare, extend the current options with it.

                angular.extend(options, $scope.dtOptions);
            }

            // Just some basic validation.
            if (typeof options['sAjaxSource'] === 'undefined') {

                throw "Ajax Source not defined! Use sajaxsource='/api/v1/blabla'";
            }

            // for Angular http inceptors
            if (typeof options['fnServerData'] === 'undefined') {
                $scope.dtOptions['fnServerData'] = function (sSource, aoData, resultCb) {
                    $http.get(sSource, aoData).then(function (result) {
                        resultCb(result.data);
                    });
                };
            }

            // Get the column options, put it in a aocolumn object.
            // Obviously, mdata is the only one required.
            // I personally just needed those 3, if you need other more feel free to add it.
            // mData also accepts a function; I'm sure there's a more elegant way but for now
            // it detects if it's a function, and if it is, do it.
//            options.aoColumns = [];

            // Get the thead rows.
            //$elem.find('thead th').each(function() {
            //    var colattr = angular.element(this);
            //    colattr = colattr.data();
            //    //console.log(colattr);
            //    //console.log('demodeo');
            //    // Detects if it's a function. Must exist in scope.
            //        //console.log('<1?');
            //        options.aoColumns.push({
            //            mData: colattr.mdata,
            //            sClass: colattr.sclass,
            //            bVisible: colattr.bvisible,
            //            mRender: colattr.mrender
            //        });
            //
            //});

            // Load the datatable!
            $scope.table = $elem.dataTable(options).api();
            //console.log(options);
            console.log($scope.table.search);
        }
    }
});