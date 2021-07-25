$(function(){
    var mobile = getQueryString("mobile");
    var captcha = getQueryString("captcha");

    // 显示密码
    $('#checkbox').click(function(){
        if ($(this).prop('checked')) {
            $('#password').attr('type', 'text');
        } else {
            $('#password').attr('type', 'password');
        }
    });
    
    $.sValid.init({//注册验证
        rules:{
            password:"required"
        },
        messages:{
            password:"密码必填!"
        },
        callback:function (eId,eMsg,eRules){
            if(eId.length >0){
                var errorHtml = "";
                $.map(eMsg,function (idx,item){
                    errorHtml += "<p>"+idx+"</p>";
                });
                errorTipsShow(errorHtml);
            }else{
                errorTipsHide()
            }
        }  
    });
    
    $('#completebtn').click(function(){
        var password = $("#password").val();
        if($.sValid()){
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=connect&t=find_password",  
                data:{phone:mobile, captcha:captcha, password:password, client:'wap'},
                dataType:'json',
                success:function(result){
                    if(!result.datas.error){
                        $api.setStorage('username',result.datas.username);
                        $api.setStorage('key',result.datas.key);
						errorTipsShow("<p>重设密码成功，正在跳转...</p>");
						setTimeout("location.href = 'login.html'",2000);
                    }else{
                        errorTipsShow("<p>"+result.datas.error+"</p>");
                    }
                }
            });         
        }
    });
});
