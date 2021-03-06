apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return false;
    }
    //加载验证码
    $("#refreshcode").bind('click',function(){
        loadVercode();
    });

    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=member_account&t=get_mobile_info",
        data:{key:key},
        dataType:'json',
        success:function(result){
            if(result.code == 200){
            	if (result.datas.state) {
            		$('#mobile').html(result.datas.mobile);
            	} else {
                $.sDialog({
                   skin:"red",
                   okBtn: true,
                   okBtnText: "去验证",
                   content: '先手机验证了，再来申请',
                   "cancelBtn": true,
                   "lock":true,
                   "okFn": function() {
                       location.href = 'member_mobile_bind.html';
                   },
                   "cancelFn": function() {
                      WTCloseWin();
                   }
               });
            	}
            }
        }
    });

    $.sValid.init({
        /*rules:{
            captcha: {
            	required:true,
            	minlength:4
            }
        },
        messages:{
            captcha: {
            	required : "请填写图形验证码",
            	minlength : "图形验证码不正确"
            }
        },
		*/
		 rules:{
            auth_code: {
            	required:true,
            	minlength:6
            }
        },
        messages:{
            auth_code: {
            	required : "请填写短信验证码",
            	minlength : "短信验证码不正确"
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

    $('#send').click(function(){
            var captcha = $.trim($("#captcha").val());
            var codekey = $.trim($("#codekey").val());
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=member_account&t=modify_mobile_step2",
                data:{key:key,captcha:captcha,codekey:codekey},
                dataType:'json',
                success:function(result){
                    if(result.code == 200){
                    	$('#send').hide();
                        $('.code-countdown').show().find('em').html(result.datas.sms_time);
                        $.sDialog({
                            skin:"block",
                            content:'短信验证码已发出',
                            okBtn:false,
                            cancelBtn:false
                        });
                        var times_Countdown = setInterval(function(){
                            var em = $('.code-countdown').find('em');
                            var t = parseInt(em.html() - 1);
                            if (t == 0) {
                            	$('#send').show();
                                $('.code-countdown').hide();
                                clearInterval(times_Countdown);
                                $("#codeimage").attr('src',MapiUrl+'/index.php?w=vercode&k='+$("#codekey").val()+'&c=' + Math.random());
                            } else {
                                em.html(t);
                            }
                        },1000);
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                        $("#codeimage").attr('src',MapiUrl+'/index.php?w=vercode&k='+$("#codekey").val()+'&c=' + Math.random());
                        $('#captcha').val('');
                    }
                }
            });
    });

    $('#nextform').click(function(){
        var auth_code = $.trim($("#auth_code").val());
        if (auth_code) {
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=member_account&t=modify_mobile_step3",
                data:{key:key,auth_code:auth_code},
                dataType:'json',
                success:function(result){
                    if(result.code == 200){
                        $.sDialog({
                            skin:"block",
                            content:'解绑成功',
                            okBtn:false,
                            cancelBtn:false
                        });
                    	setTimeout("location.href = 'member_mobile_bind.html'",2000);
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
                }
            });
        }
    });
});
