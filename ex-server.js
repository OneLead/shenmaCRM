var express = require('express');
var lessMiddleware = require('less-middleware');
var app = express();
var request = require('request');

app.use(lessMiddleware(__dirname));
app.use(express.static(__dirname));
app.get('/:category',function(req,res){
    if(req.params.category=='favicon.ico')
        res.sendFile(__dirname+'/public/'+req.params.category);
    else res.sendFile(__dirname+'/public/'+req.params.category+'.html');
});
app.post('/getWechatInfo/:code',function(reque,response){
    var appId = "wxeec1054109271fda";
    var appSecret = "3cbf6a2f862671243ceab9981e35e54e";
    var grant_type="authorization_code";
    var code = reque.params.code;
    var url = "https://api.weixin.qq.com/sns/oauth2/access_token";

    var getTokenUrl = url+'?appid='+appId+'&secret='+appSecret+'&code='+code+'&grant_type='+grant_type;
    request(getTokenUrl, function(err,res,bdy) {
        var data = JSON.parse(bdy);
        var accessToken = data.access_token;
        var openid = data.openid;
        var url = 'https://api.weixin.qq.com/sns/userinfo';
        var getInfoUrl = url+
                '?access_token='+
            accessToken+
            '&openid='+
            openid+
            '&lang=zh_CN';
        //res.send(getInfoUrl);
        request(getInfoUrl, function(err,res,bdy){
            var data = JSON.parse(bdy);
            //console.log(data);
            response.json(data);
        });
    });
});
app.listen(8000,function(){
    console.log('Running Express on 8000');
});