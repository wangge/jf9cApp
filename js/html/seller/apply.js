$(function() {
    var Client = 'wap';
    var _do = getQueryString('do');
    var seller_name = $api.getStorage('seller_name');
    var username = $api.getStorage('username');
    var referurl = document.referrer;
    var key = $api.getStorage('key');
	$("#seller_name").val(username);
    if (!key) {
        window.location.href = '../member/login.html';
        return;
    }
    //动态加载
    $.ajax({
        url: MapiUrl + "/index.php?w=seller_apply&t=do_apply",
        type: 'POST',
        dataType: 'json',
        data: {client: Client, key: key,do:_do},
        success: function(result){
            var data = result.datas;

            if (data.join_state.step == 4) {
                $.sDialog({
                    skin:"block",
                    content:'等待审核，请等待开通',
                    okBtn:false,
                    cancelBtn:false
                });
                setTimeout("location.href = 'do-applyc.html'",2000);
            }

            if (data.join_state.step == 6) {
                $.sDialog({
                    skin:"block",
                    content:'完成付款，请等待开通',
                    okBtn:false,
                    cancelBtn:false
                });
                setTimeout("location.href = 'do-applyc.html'",2000);
            }


            if (data.join_state.step == 5) {
                $.sDialog({
                    skin:"block",
                    content:'申请已确认，请支付费用',
                    okBtn:false,
                    cancelBtn:false
                });
                setTimeout("location.href = 'do-applyc.html'",2000);
            }

            if (data.join_state.step == 100) {
                $.sDialog({
                    skin:"block",
                    content:'已成功入驻，新入驻请重新登录',
                    okBtn:false,
                    cancelBtn:false
                });
            		$api.setStorage('wxout', '1');
            		$api.rmStorage('username');
            		$api.rmStorage('key');
            		localStorage.removeItem('cart_count');
            		$api.rmStorage("seller_name");
            		$api.rmStorage("store_name");
            		$api.rmStorage("seller_key");
            		$api.rmStorage("is_seller");
                setTimeout("location.href = '../member/login.html'",2000);
            }

        },
        error: function(){

        }
    });
});
