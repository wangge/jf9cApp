var mobile = '';  //手机号
var sec_val = ''; //验证码
var sec_key = ''; //验证码key
var m_captcha = ''; //短信验证码
var passwd = '';
var send_sms_state = 0;  //手机短信验证码发送状态
var key = $api.getStorage('key');
if (key) {
  api.closeToWin({
    name: 'root'
  });
}

$(function(){
$('#logo_src').attr("src",ShopUrl+'/system/upfiles/shop/common/home_logo.png');
    $.getJSON(MapiUrl + '/index.php?w=connect&t=get_state', function(result){
        if (result.datas.connect_email_reg != '0') {
            $(".forgot-r").show();
        }
        if (result.datas.connect_sms_reg == '0' && result.datas.connect_email_reg == '0') {
            $.sDialog({
                    skin:"red",
                    content:"系统关闭注册功能",
                    okBtn:false,
                    cancelBtn:false
            });
            setTimeout("location.href = '../../index.html'",3000);
            return false;
        }
    });
    loadVercode();
    $("#refreshcode").bind('click',function(){
        loadVercode();
    });
    $.sValid.init({
        rules:{
            usermobile:{
                required:true,
                mobile:true
            },
            captcha:{
                required:true,
                minlength:4,
                maxlength:4
            },
            mobilecode:{
                required:true,
                digits:true,
                minlength:6,
                maxlength:6
            },
            password:{
                required:true,
                minlength:6,
                maxlength:20
            }
        },
        messages:{
            usermobile:{
                required:"请填写手机号",
                mobile:"手机号不正确"
            },
            captcha:{
                required:"请输入图片验证码",
                minlength:"图片验证码为4位字符",
                maxlength:"图片验证码为4位字符"
            },
            mobilecode:{
                required:"请输入短信验证码",
                digits:"短信验证码为6位整数",
                minlength:"短信验证码为6位整数",
                maxlength:"短信验证码为6位整数"
            },
            password:{
                required:"请输入登陆密码",
                minlength:"登陆密码为6-20位字符",
                maxlength:"登陆密码为6-20位字符"
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

    // 显示密码
    $('.code-show-pwd').click(function(){
        if ($(this).hasClass('show')) {
            $('#password').attr('type', 'password');
        } else {
            $('#password').attr('type', 'text');
        }
        $(this).toggleClass('show');
    });

    //获取短信验证码
    $('#again').click(function(){
        sec_val = $('#captcha').val();
        sec_key = $('#codekey').val();
        mobile = $('#usermobile').val();
        if(mobile == '' || ! /^(1{1})+\d{10}$/.test(mobile)){
            errorTipsShow("<p>请输入正确的手机号</p>");
            return false;
        }
        if(sec_val == '' || sec_val.length != 4){
            errorTipsShow("<p>请输入正确的图片验证码</p>");
            return false;
        }
        if(!send_sms_state){
            send_sms_state = 1;
            send_sms(mobile, sec_val, sec_key);
        }
    });

    var register_member = 0;
	$('#refister_mobile_btn').click(function(){
        if (register_member) {
            errorTipsShow("<p>正在处理中，请勿重复点击！</p>");
            return false;
        }
	    if ($.sValid()) {
            sec_val = $('#captcha').val();
            sec_key = $('#codekey').val();
            mobile = $('#usermobile').val();
            m_captcha = $('#mobilecode').val();
            passwd = $('#password').val();
            var chk_captcha = check_sms_captcha(mobile,m_captcha);
            if(chk_captcha > 0){
                register_member = 1;
                $.ajax({
                    type:'post',
                    url:MapiUrl+"/index.php?w=connect&t=sms_register",
                    data:{phone:mobile, captcha:m_captcha, password:passwd, client:'wap'},
                    dataType:'json',
                    success:function(result){
                        if(!result.datas.error){
                            $api.setStorage('username',result.datas.username);
                            $api.setStorage('key',result.datas.key);
							//errorTipsShow("<p>注册成功</p>");
							LoginBack();
                            //location.href = 'member.html';
                        }else{
                            errorTipsShow("<p>"+result.datas.error+"</p>");
                            register_member = 0;
                        }
                    }
                });
            }else{
                loadVercode();
                errorTipsShow('<p>短信验证码校验失败<p>');
            }
	    } else {
	        return false;
	    }
	});
});

// 发送短信验证码
function send_sms(mobile, sec_val, sec_key) {
    $.getJSON(MapiUrl+'/index.php?w=connect&t=get_sms_captcha', {type:1,phone:mobile,sec_val:sec_val,sec_key:sec_key}, function(result){
        if(!result.datas.error){
            $.sDialog({
                skin:"green",
                content:'发送成功',
                okBtn:false,
                cancelBtn:false
            });
            $('.code-again').hide();
            $('.code-countdown').show().find('em').html(result.datas.sms_time);
            var times_Countdown = setInterval(function(){
                var em = $('.code-countdown').find('em');
                var t = parseInt(em.html() - 1);
                if (t == 0) {
                    send_sms_state = 0;
                    $('.code-again').show();
                    $('.code-countdown').hide();
                    clearInterval(times_Countdown);
                } else {
                    em.html(t);
                }
            },1000);
        }else{
            send_sms_state = 0;
            loadVercode();
            errorTipsShow('<p>' + result.datas.error + '<p>');
        }
    });
}

//验证短信验证码
function check_sms_captcha(mobile, captcha) {
    var s = 0;
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=connect&t=check_sms_captcha",
        data:{type:1,phone:mobile,captcha:captcha },
        dataType:'json',
        async:false,
        success:function(result){
            if(!result.datas.error){
                s = 1;
            }
        }
    });
    return s;
}

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
