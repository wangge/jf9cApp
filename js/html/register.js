$(function(){
	$('#logo_src').attr("src",ShopUrl+'/system/upfiles/shop/common/home_logo.png');
    var key = $api.getStorage('key');
    if (key) {
			api.closeToWin({
				name: 'root'
			});
    }
    $.getJSON(MapiUrl + '/index.php?w=connect&t=get_state', function(result){
            if (result.datas.connect_email_reg == '0') {
                $.sDialog({
                        skin:"red",
                        content:"系统没有开启邮箱注册",
                        okBtn:false,
                        cancelBtn:false
                });
                setTimeout("location.href = 'login.html'",3000);
                return false;
            }
         if (result.datas.connect_email_reg != '0') {
            $(".forgot-r").show();
        }
    });
	$.sValid.init({
        rules:{
        	username:{
                required:true,
                username:true
            },
            userpwd:"required",            
            password_confirm:"required",
            email:{
            	required:true,
            	email:true
            }
        },
        messages:{
            username:{
            	required:"用户名必填",
            	username:"用户名有特殊字符"
            },
            userpwd:"密码必填", 
            password_confirm:"确认密码必填",
            email:{
            	required:"邮件必填",
            	email:"邮件格式不正确"
            }
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
	var register_member = 0;
	$('#registerbtn').click(function(){
		var username = $("input[name=username]").val();
		var pwd = $("input[name=pwd]").val();
		var password_confirm = $("input[name=password_confirm]").val();
		var email = $("input[name=email]").val();
		var client = 'wap';
		if (register_member) {
		    errorTipsShow("<p>正在处理中，请勿重复点击！</p>");
            return false;
        }
		if($.sValid()){
		    register_member = 1;
			$.ajax({
				type:'post',
				url:MapiUrl+"/index.php?w=login&t=register",
				data:{username:username,password:pwd,password_confirm:password_confirm,email:email,client:client},
				dataType:'json',
				success:function(result){
					if(!result.datas.error){
						if(typeof(result.datas.key)=='undefined'){
							return false;
						}else{
                            updateCookieCart(result.datas.key);
							$api.setStorage('username',result.datas.username);
							$api.setStorage('key',result.datas.key);
							LoginBack();
						}
		                errorTipsHide();
					}else{
		                errorTipsShow("<p>"+result.datas.error+"</p>");
		                register_member = 0;
					}
				}
			});
		}
	});
});
//登录成功
function LoginBack() {
	api.sendEvent({
			name: 'LoginTo',
			extra: {
					msg: '注册成功'
			}
	});
	api.toast({
		msg: '注册成功',
		duration: 2000,
		location: 'middle'
	});
	setTimeout(function () {
		api.closeToWin({
			name: 'root'
		});
	}, 2000);
}
