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
    //loadVercode();
    $("#refreshcode").bind("click",
    function() {
        loadVercode()
    });
    $.ajax({
        type: "get",
        url: MapiUrl + "/index.php?w=member_account&t=get_paypwd_info",
        data: {
            key: e
        },
        dataType: "json",
        success: function(e) {
            if (e.code == 200) {
                if (!e.datas.state) {
                  $.sDialog({
                     skin:"red",
                     okBtn: true,
                     okBtnText: "去设置",
                     content: '请先设置支付密码',
                     "cancelBtn": true,
                     "lock":true,
                     "okFn": function() {
                         location.href = 'member_paypwd_step1.html';
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
        rules: {
            password: {
                required: true,
                minlength: 6,
                maxlength: 20
            }
			/*,
            captcha: {
                required: true,
                minlength: 4
            }*/
        },
        messages: {
            password: {
                required: "请填写支付密码",
                minlength: "请正确填写支付密码",
                maxlength: "请正确填写支付密码"
            }
			/*,
            captcha: {
                required: "请填写图形验证码",
                minlength: "图形验证码不正确"
            }*/
        },
        callback: function(e, a, t) {
            if (e.length > 0) {
                var r = "";
                $.map(a,
                function(e, a) {
                    r += "<p>" + e + "</p>"
                });
                errorTipsShow(r)
            } else {
                errorTipsHide()
            }
        }
    });
    $("#nextform").click(function() {
        if ($.sValid()) {
            var a = $.trim($("#password").val());
            var t = $.trim($("#captcha").val());
            var r = $.trim($("#codekey").val());
            $.ajax({
                type: "post",
                url: MapiUrl + "/index.php?w=member_account&t=check_paypwd",
                data: {
                    key: e,
                    password: a,
                    captcha: t,
                    codekey: r
                },
                dataType: "json",
                success: function(e) {
                    if (e.code == 200) {
                        location.href = "member_mobile_bind.html"
                    } else {
                        errorTipsShow("<p>" + e.datas.error + "</p>");

                    }
                }
            })
        }
    })
});
