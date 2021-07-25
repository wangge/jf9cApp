var key = $api.getStorage('key');
var payment_code;
 // 现在支付方式
 function toPay(pay_sn,w,t) {
     $.ajax({
         type:'post',
         url:MapiUrl+'/index.php?w='+w+'&t='+t,
         data:{
             key:key,
             pay_sn:pay_sn
             },
         dataType:'json',
         success: function(result){
             checkLogin(result.login);
             if (result.datas.error) {
				  $.sDialog({
                     skin:"red",
                     content:result.datas.error,
                     okBtn:false,
                     cancelBtn:false
                 });
                 return false;
             }
             // 从下到上动态显示隐藏内容
             $.animationUp({valve:'',scroll:''});

             // 需要支付金额
             $('#onlineTotal').html(result.datas.pdinfo.pdr_amount);
             payment_code = '';
             if (!$.isEmptyObject(result.datas.payment_list)) {
                 var readytoWXPay = false;
                 var readytoAliPay = false;
                 var readytoWXAPPPay = false;
				         var readytoWXH5Pay = false;
                 var m = navigator.userAgent.match(/MicroMessenger\/(\d+)\./);
                 if (parseInt(m && m[1] || 0) >= 5) {
                     // 微信内浏览器
                     readytoWXPay = true;
                 } else {
                    readytoAliPay = true;
					          readytoWXH5Pay = true;
                    readytoWXAPPPay = true;
                 }
                 for (var i=0; i<result.datas.payment_list.length; i++) {
                     var _payment_code = result.datas.payment_list[i].payment_code;
                     if (_payment_code == 'alipay' && readytoAliPay) {
                         $('#'+ _payment_code).parents('label').show();
                         if (payment_code == '') {
                             payment_code = _payment_code;
                             $('#'+_payment_code).attr('checked', true).parents('label').addClass('checked');
                         }
                     }
                     if (_payment_code == 'wxpay' && readytoWXAPPPay) {
                         $('#wxpay').parents('label').show();
                         if (payment_code == '') {
                             payment_code = _payment_code;
                             $('#'+_payment_code).attr('checked', true).parents('label').addClass('checked');
                         }
                     }
                 }
             }

             $('#alipay').click(function(){
                 payment_code = 'alipay';
             });
             $('#wxpay').click(function(){
                  payment_code = 'wxpay';
              });
             $('#toPay').click(function(){
                 if (payment_code == '') {
				  $.sDialog({
                     skin:"red",
                     content:"请选择支付方式",
                     okBtn:false,
                     cancelBtn:false
                 });
                     return false;
                 }
                goToPayment(pay_sn);

             });
         }
     });
 }

 function goToPayment(pay_sn) {
   if(payment_code =='wxpay'){
		$.ajax({
                url:MapiUrl+'/index.php?w=member_payment_recharge&t=wx_app_pd_pay',
                data:{
                    key:key,
                    pay_sn:pay_sn,
                    pdr:1,
          					payment_code:payment_code
                },
                dataType:"json",
                type:"post",
                success:function(result){
					 if (result.datas.error) {
						 $.sDialog({
							 skin:"red",
							 content:result.datas.error,
							 okBtn:false,
							 cancelBtn:false
						 });
						 return false;
					 }else{
						var wxPayPlus = api.require('wxPayPlus');
						wxPayPlus.payOrder(result.datas, function(ret, err) {
							if (ret.status) {
								//支付成功
								 $.sDialog({
									 skin:"red",
									 content:'支付成功',
									 okBtn:false,
									 cancelBtn:false
								 });
									setTimeout("location.href = '../member/member_assets.html'", 2000);
							} else {
								$.sDialog({
									 skin:"red",
									 content:'支付失败',
									 okBtn:false,
									 cancelBtn:false
								 });
								setTimeout("location.href = '../member/pdrecharge_list.html'", 2000);
							}
						});
					 }
				}
		});
	 }else{
     location.href = MapiUrl+'/index.php?w=member_payment_recharge&t=pd_pay&key=' + key + '&pay_sn=' + pay_sn + '&pdr=1&payment_code=' + payment_code;
      }
 }
