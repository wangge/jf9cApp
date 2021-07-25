//账户充值
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

	$.sValid.init({

		rules: {
			pdr_amount:"required"

		},

		messages: {
			pdr_amount:"请输入充值金额！"

		},

		callback: function(e, r, a) {

			if (e.length > 0) {

				var c = "";

				$.map(r, function(e, r) {

					c += "<p>" + e + "</p>";

				});

				errorTipsShow(c);

			} else {

				errorTipsHide();

			}

		}

	});

	$("#saveform").click(function() {
		if ($.sValid()) {
			var pdr_amount = $.trim($('#pdr_amount').val());
			if (!key) {
				window.location.href = "login.html";
				return ;
			}
			var client = 'wap';

			$.ajax({

				type: "post",

				url:MapiUrl+"/index.php?w=recharge",	

				data:{pdr_amount:pdr_amount,key:key,client:client},

				dataType: "json",
				success:function(result){
					if(!result.datas.error){
						
						location.href = 'rechargeinfo.html?pay_sn='+result.datas.pay_sn;
						
					}else{
						 errorTipsShow("<p>"+result.datas.error+"<p>");
					}
				}

			});

		}

	});

});