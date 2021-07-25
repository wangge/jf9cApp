$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = '../html/member/login.html';
        return;
    }
    //没有手机验证时提示
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=member_account&t=get_mobile_info",
        data:{key:key},
        dataType:'json',
        success:function(result){
            checkLogin(result.login);
            if(result.code == 200){
                if (!result.datas.state) {
                     $.sDialog({
                        skin:"red",
                        okBtn: true,
                        okBtnText: "去验证",
                        content: '先手机验证了，再来申请',
                        "cancelBtn": true,
                        "lock":true,
                        "okFn": function() {
                            location.href = '../html/member/member_mobile_bind.html';
                        },
                        "cancelFn": function() {
                           WTCloseWin();
                        }
                    });
                }else{
                    //手机验证通过后
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=member_fx&t=index",
        data:{key:key},
        dataType:'json',
        success:function(result){
			checkLogin(result.login);
            if(result.code == 200){
                var html = '<div class="member-per"></div><div class="member-info">'
                    + '<div class="user-avatar"> <img src="' + result.datas.member_info.avatar + '"/> </div>'
                    + '<div class="user-name"> <span>'+result.datas.member_info.user_name+'<sup>' + result.datas.member_info.level_name + '</sup></span> </div>'
                    + '</div>'
                    + '<div class="member-collect"><span><a onclick="WtOpenUrl(this)" url="fx_commission.html"><em>' + result.datas.member_info.available_fx_trad + '</em>'
                    + '<p>可提现金额</p>'
                    + '</a> </span><span><a onclick="WtOpenUrl(this)" url="fx_commission.html"><em>' +result.datas.member_info.freeze_fx_trad + '</em>'
                    + '<p>冻结佣金金额</p>'
                    + '</a> </span></div>';
                //渲染页面

                                $(".member-top").html(html);
                              $("#fx_user").attr('href','../html/goods_fx.html?mid='+ result.datas.member_info.member_id);
                return false;

            }else{
                            if (result.datas.error) {
                                if(result.is_fxuser == "1" || result.is_fxuser == "4" || result.is_fxuser == "5"){
                                    $.sDialog({
                                        skin:"red",
                                        content:result.datas.error,
                                        okBtn:false,
                                        cancelBtn:false
                                    });
                                    WTback();
                                    return false;
                                   }
                                if (result.is_fxuser == "0" || result.is_fxuser == "3") {
                                            //没有成为分销员时
                                             $.sDialog({
                                                skin:"red",
                                                okBtn: true,
                                                okBtnText: "去申请",
                                                content:result.datas.error,
                                                "cancelBtn": true,
                                                "lock":true,
                                                "okFn": function() {
                                                    location.href = 'fx_join.html';
                                                },
                                                "cancelFn": function() {
                                                   WTback();
                                                }
                                            });
                                    }
                                }
                            }
                        }
                    });
                    //end
                }
            }
        }
    });

});
