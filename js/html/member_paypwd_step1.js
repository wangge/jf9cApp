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
                   content: '先手机验证了，再来',
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

    $('#send').click(function(){
            var captcha = $.trim($("#captcha").val());
            var codekey = $.trim($("#codekey").val());
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=member_account&t=modify_paypwd_step2",
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
                            } else {
                                em.html(t);
                            }
                        },1000);
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
                }
            });
    });

    $('#nextform').click(function(){
        var auth_code = $.trim($("#auth_code").val());
        if (auth_code) {
            $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=member_account&t=modify_paypwd_step3",
                data:{key:key,auth_code:auth_code},
                dataType:'json',
                success:function(result){
                    if(result.code == 200){
                        $.sDialog({
                            skin:"block",
                            content:'手机验证成功，正在跳转',
                            okBtn:false,
                            cancelBtn:false
                        });
                    	setTimeout("location.href = 'member_paypwd_step2.html'",1000);
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
                }
            });
        }
    });
});
