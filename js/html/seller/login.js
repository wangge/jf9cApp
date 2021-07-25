$(function(){
    var key = $api.getStorage('seller_key');
    var seller_name = $api.getStorage('seller_name');
    if (key && seller_name) {
    	$ap.rmStorage('seller_key');
		$ap.rmStorage('seller_name');
        window.location.href = 'seller.html';
        return;
    }
    //上级网址
    var referurl = document.referrer;
    $.sValid.init({
        rules:{
            username:"required",
            userpwd:"required"
        },
        messages:{
            username:"用户名必须填写！",
            userpwd:"密码必填!"
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
    $('#loginbtn').click(function(){//会员登陆
        var username = $('#username').val();
        var pwd = $('#userpwd').val();
        var client = 'wap';
        if($.sValid()){
			if (allow_submit) {
				allow_submit = false;
			} else {
				return false;
			}
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=seller_login",
                data:{seller_name:username,password:pwd,client:client},
                dataType:'json',
                success:function(result){
                    allow_submit = true;
                    if(!result.datas.error){
                        if(typeof(result.datas.key)=='undefined'){
                            return false;
                        }else{
                            //存储卖家信息
                            $api.setStorage('seller_name',result.datas.seller_name);
                            $api.setStorage('store_name',result.datas.store_name);
                            $api.setStorage('seller_key',result.datas.key);
                            if(result.datas.mem){
                              var mem=result.datas.mem;
                              if(mem.username&&mem.key)	{
                                $api.setStorage('username',mem.username);
                                $api.setStorage('key',mem.key);
                              }
                            }

                            if (referurl.indexOf('do-applly')) {
                                referurl = 'seller.html';
                            }
                            location.href = 'seller.html';
                        }
                        errorTipsHide();
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
                }
            });
        }
    });
});
