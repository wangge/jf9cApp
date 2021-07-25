apiready= function(){
}
$(function(){
	$('#logo_src').attr("src",ShopUrl+'/system/upfiles/shop/common/home_logo.png');
    var key = $api.getStorage('key');
    if (key) {
			api.closeToWin({
				name: 'root'
			});
    }
    $.getJSON(MapiUrl + '/index.php?w=connect&t=get_state', function(result){
        var ua = navigator.userAgent.toLowerCase();
        var allow_login = 0;
				if (result.datas.connect_wx == '1') {
            allow_login = 1;
            $('.wxapp').parent().show().css("display","inline-block");
        }
        if (allow_login) {
            $('.joint-login').show();
        }
    });
	var referurl = document.referrer;//上级网址
	//shopwt v5.2
	if (!referurl) {
        try {
            if (window.opener) {
                referrer = window.opener.location.href;
            }
        }
        catch (e) {}
    }
	$.sValid.init({
        rules:{
            username:"required",
            userpwd:"required"
        },
        messages:{
            username:"用户名必须填写",
            userpwd:"密码必填"
        },
        callback:function (eId,eMsg,eRules){
            if(eId.length >0){
                var errorHtml = "";
                $.map(eMsg,function (idx,item){
                    errorHtml += "<p>"+idx+"</p>";
                });
                errorTipsShow(errorHtml);
            }else{
                errorTipsHide();
            }
        }
    });
    var allow_submit = true;
	$('#loginbtn').click(function(){
			if (allow_submit) {
				allow_submit = false;
			} else {
				return false;
			}
		var username = $('#username').val();
		var pwd = $('#userpwd').val();
		var client = 'wap';
		if($.sValid()){
	          $.ajax({
				type:'post',
				url:MapiUrl+"/index.php?w=login",
				data:{username:username,password:pwd,client:client},
				dataType:'json',
				success:function(result){
				    allow_submit = true;
					if(!result.datas.error){
						if(typeof(result.datas.key)=='undefined'){
							return false;
						}else{
						    // 更新cookie购物车
						    updateCookieCart(result.datas.key);
							$api.setStorage('username',result.datas.username);
							$api.setStorage('key',result.datas.key);
							var is_seller = 0;
							if(result.datas.sell) {
								if(result.datas.sell.seller_name&&result.datas.sell.key){
									$api.setStorage('seller_name',result.datas.sell.seller_name);
									$api.setStorage('store_name',result.datas.sell.store_name);
									$api.setStorage('seller_key',result.datas.sell.key);
									is_seller = 1;
								}
							}
							$api.setStorage('is_seller',is_seller);
							LoginBack();
						}
		                errorTipsHide();
					}else{
		                errorTipsShow('<p>' + result.datas.error + '</p>');
					}
				}
			 });
        }
	});
	$('.weibo').click(function(){
	    location.href = MapiUrl+'/index.php?w=connect&t=get_sina_oauth2';
	})
    $('.qq').click(function(){
        location.href = MapiUrl+'/index.php?w=connect&t=get_qq_oauth2';
    })
    $('.wx').click(function(){
        location.href = MapiUrl+'/index.php?w=connect&t=index';
    })
});

	//微信APP登录触发
	function weixin_login(){
		var wxPlus = api.require('wxPlus');
		wxPlus.isInstalled(function(ret, err) {
			if (ret.installed) {
				wxPlus.auth({
				},function(ret, err){
					if (ret.status) {
					   //获取token
						wxPlus.getToken({
							code: ret.code
							}, function(ret_token, err_token) {
							if (ret_token.status) {
								wxPlus.getUserInfo({
									accessToken: ret_token.accessToken,
									openId: ret_token.openId
								}, function (ret2, err) {
									if (ret2.status) {
										var e = 'wx' + ret_token.openId.substring(19);
										var nickName = ret2.nickname;
										var headimgurl = ret2.headimgurl;
										var email = ret_token.openId.substring(19) + "@qq.com";
										var unionid = ret2.unionid;
										setTimeout(logins(nickName, headimgurl,e, email, unionid), 150);
									} else {
										alert(err.code);
									}
								});
							} else {
								//alert(JSON.stringify(err_token));
							}
						});

					} else {
						//alert(err.code);
					}
				});
			} else {
				alert('当前设备未安装微信客户端');
			}
		});
	}

    //微信APP登录
    function logins(nickName,headimgurl, p, email, unionid) {
        api.ajax({
            url: MapiUrl + '/index.php?w=login&t=runlogin',
            method: 'post',
            dataType: 'json',
            data: {
                values: {
                    username: nickName,
                    password: p,
                    headimgurl: headimgurl,
                    unionid: unionid,
                    client: 'wap'
                }

            }
        }, function (ret, err) {
			if (ret.code == 400) {
                regist(nickName,headimgurl, p, email, unionid);
                return false;
            }
						updateCookieCart(ret.datas.key);
						$api.setStorage("username", ret.datas.username);
						$api.setStorage("key", ret.datas.key);
						var is_seller = 0;
						if(ret.datas.sell) {
							if(ret.datas.sell.seller_name && ret.datas.sell.key){
								$api.setStorage('seller_name',ret.datas.sell.seller_name);
								$api.setStorage('store_name',ret.datas.sell.store_name);
								$api.setStorage('seller_key',ret.datas.sell.key);
								is_seller = 1;
							}
						}
						$api.setStorage('is_seller',is_seller);

						setTimeout(function () {
							LoginBack();
						}, 150);
        });
    }

    //微信新用户
    function regist(nickName,headimgurl, p, email, unionid) {
        api.ajax({
            url: MapiUrl + '/index.php?w=login&t=runregister',
            method: 'post',
            dataType: 'json',
            data: {
                values: {
                    username: nickName,
                    password: p,
                    password_confirm: p,
                    email: email,
                    unionid: unionid,
                    headimgurl: headimgurl,
                    client: 'wap'
                }
            }
        }, function (ret, err) {
            if (ret) {
                console.log('zhuce' + JSON.stringify(ret));
				if(ret.code == '200'){
					updateCookieCart(ret.datas.key);
					$api.setStorage("username", ret.datas.username);
					$api.setStorage("key", ret.datas.key);
					LoginBack();
				}
			} else {
				console.log(JSON.stringify(err));
			}
		});
}
//登录成功
function LoginBack() {
	api.sendEvent({
			name: 'LoginTo',
			extra: {
					msg: '登录成功'
			}
	});
	api.toast({
		msg: '登录成功',
		duration: 2000,
		location: 'middle'
	});
	setTimeout(function () {
		api.closeToWin({
			name: 'root'
		});
	}, 2000);
}
