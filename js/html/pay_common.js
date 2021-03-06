var buy_step2 = 0;
var key = $api.getStorage('key');
var password,rcb_pay,pd_pay,payment_code;
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
					api.sendEvent({
						name: 'LoginTo',
						extra: {
							index: 2
						}
					});
					WTCloseWin();
                 return false;
             }
             // 从下到上动态显示隐藏内容
             $.animationUp({
                 valve:'',
                 scroll:'',
                 start : function(){
                 buy_step2 = 1;
                 },
                close : function(){
                    buy_step2 = 0;
                    $(".pay-sel label").each(function(){
                    	$(this).removeClass('checked');
                    });
                }
             });

             // 需要支付金额
             $('#onlineTotal').html(result.datas.pay_info.pay_amount);

             // 是否设置支付密码
             if (!result.datas.pay_info.member_paypwd) {
                 $('#wrapperPaymentPassword').find('.input-box-help').show();
             }

             // 支付密码标记
             var _use_password = false;
             if (parseFloat(result.datas.pay_info.payed_amount) <= 0) {
                 if (parseFloat(result.datas.pay_info.member_available_pd) == 0 && parseFloat(result.datas.pay_info.member_available_rcb) == 0) {
                     $('#internalPay').hide();
                 } else {
                     $('#internalPay').show();
                     // 充值卡
                     if (parseFloat(result.datas.pay_info.member_available_rcb) != 0) {
                         $('#wrapperUseRCBpay').show();
                         $('#availableRcBalance').html(parseFloat(result.datas.pay_info.member_available_rcb).toFixed(2));
                     } else {
                         $('#wrapperUseRCBpay').hide();
                     }

                     // 余额
                     if (parseFloat(result.datas.pay_info.member_available_pd) != 0) {
                         $('#wrapperUsePDpy').show();
                         $('#availablePredeposit').html(parseFloat(result.datas.pay_info.member_available_pd).toFixed(2));
                     } else {
                         $('#wrapperUsePDpy').hide();
                     }
                 }
             } else {
                 $('#internalPay').hide();
             }

             password = '';
             $(document).off('change','#paymentPassword').on('change','#paymentPassword',function(){
                password = $(this).val();
            });

             rcb_pay = 0;
             $('#useRCBpay').click(function(){
                 if ($(this).prop('checked')) {
                     _use_password = true;
                     $('#wrapperPaymentPassword').show();
                     rcb_pay = 1;
                 } else {
                     if (pd_pay == 1) {
                         _use_password = true;
                         $('#wrapperPaymentPassword').show();
                     } else {
                         _use_password = false;
                         $('#wrapperPaymentPassword').hide();
                     }
                     rcb_pay = 0;
                 }
             });

             pd_pay = 0;
             $('#usePDpy').click(function(){
                 if ($(this).prop('checked')) {
                     _use_password = true;
                     $('#wrapperPaymentPassword').show();
                     pd_pay = 1;
                 } else {
                     if (rcb_pay == 1) {
                         _use_password = true;
                         $('#wrapperPaymentPassword').show();
                     } else {
                         _use_password = false;
                         $('#wrapperPaymentPassword').hide();
                     }
                     pd_pay = 0;
                 }
             });

             payment_code = '';
             if (!$.isEmptyObject(result.datas.pay_info.payment_list)) {
                 var readytoWXPay = false;
                 var readytoAliPay = false;
            		 var readytoWXH5Pay = false;
            		 var readytoPayPal = false;
                 var readytoWXAPPPay = false;
                 var m = navigator.userAgent.match(/MicroMessenger\/(\d+)\./);
                 if (parseInt(m && m[1] || 0) >= 5) {
                     // 微信内浏览器
                     readytoWXPay = true;
                 } else {
                     readytoAliPay = true;
            		     readytoWXH5Pay = true;
            		     readytoPayPal = true;
                     readytoWXAPPPay = true;
                 }
                 for (var i=0; i<result.datas.pay_info.payment_list.length; i++) {
                     var _payment_code = result.datas.pay_info.payment_list[i].payment_code;
                     if (_payment_code == 'alipay_native' && readytoAliPay) {
                         $('#'+ _payment_code).parents('label').show();
                         if (payment_code == '') {
                             payment_code = _payment_code;
                             $('#'+_payment_code).attr('checked', true).parents('label').addClass('checked');
                         }
                     }
                     if (_payment_code == 'wxpay' && readytoWXAPPPay) {
                         $('#'+ _payment_code).parents('label').show();
                         if (payment_code == '') {
                             payment_code = _payment_code;
                             $('#'+_payment_code).attr('checked', true).parents('label').addClass('checked');
                         }
                     }
                 }
             }

             $('#alipay_native').click(function(){
                 payment_code = "alipay_native";
             });
             $('#wxpay').click(function() {
               payment_code = "wxpay";
             });
             $('#toPay').click(function(){
                 if (payment_code == '') {
                     $.sDialog({
                         skin:"red",
                         content:'请选择支付方式',
                         okBtn:false,
                         cancelBtn:false
                     });
                     return false;
                 }
                 if (_use_password) {
                     // 验证支付密码是否填写
                     if (password.length == 0) {
                         $.sDialog({
                             skin:"red",
                             content:'请填写支付密码',
                             okBtn:false,
                             cancelBtn:false
                         });
                         return false;
                     }
                     // 验证支付密码是否正确
                     $.ajax({
                         type:'post',
                         url:MapiUrl+'/index.php?w=member_buy&t=check_pd_pwd',
                         dataType:'json',
                         data:{key:key,password:password},
                         success:function(result){
                             if (result.datas.error) {
                                 $.sDialog({
                                     skin:"red",
                                     content:result.datas.error,
                                     okBtn:false,
                                     cancelBtn:false
                                 });
                                 return false;
                             }
                                if(w == 'member_buy')w_val='pay_new';
                                else if(w == 'member_grade')w_val='pd_pay_new';
                                else w_val='vr';
                                goToPayment(pay_sn,w_val);
                         }
                     });
                 } else {
                       if(w == 'member_buy')w_val='pay_new';
                        else if(w == 'member_grade')w_val='pd_pay_new';
                        else w_val='vr';
                        goToPayment(pay_sn,w_val);
                 }
             });
         }
     });
 }
 function goToPayment(pay_sn,t) {
	 if(payment_code =='wxpay'){
     var url = MapiUrl+'/index.php?w=member_payment&t=wx_app_pay3&client=app';
     if(t=='vr'){
        url = MapiUrl+'/index.php?w=member_payment&t=wx_app_vr_pay3&client=app';
     }
		$.ajax({
        url:url,
        data:{
            key:key,
            pay_sn:pay_sn,
            password:password,
  					rcb_pay:rcb_pay,
  					pd_pay:pd_pay,
            paytype:t,
  					payment_code:payment_code
        },
        dataType:"json",
        type:"post",
        success:function(result){
					//console.log('----' + JSON.stringify(result.datas.pay_amount));
					 if(result.datas.pay_amount){
						//当全低用时，提示信息
						 $.sDialog({
							 skin:"red",
							 content:'支付成功',
							 okBtn:false,
							 cancelBtn:false
						 });
						setTimeout("location.href = '../member/order_list.html?data-state=state_pay'", 2000);
						return false;
					 }
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
							setTimeout("location.href = '../member/order_list.html?data-state=state_pay'", 2000);
							} else {
								$.sDialog({
									 skin:"red",
									 content:'支付失败',
									 okBtn:false,
									 cancelBtn:false
								 });
							setTimeout("location.href = '../member/order_list.html?data-state=state_new'", 2000);
							}
						});
					 }
				}
		});
	 }else if(payment_code =='alipay_native'){
		 var _url = MapiUrl+'/index.php?w=member_payment&t=alipay_native_pay';
     if(t=='vr'){
        _url = MapiUrl+'/index.php?w=member_payment&t=alipay_native_vr_pay';
     }
		$.ajax({
        url:_url,
        data:{
            key:key,
            pay_sn:pay_sn,
            password:password,
  					rcb_pay:rcb_pay,
  					pd_pay:pd_pay
           // paytype:t,
  				//	payment_code:'alipay_native'
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
            //console.log(JSON.stringify(result));
            var aliPayPlus = api.require('aliPayPlus');
            aliPayPlus.payOrder({
                orderInfo: ''+result.datas.signStr
            }, function(ret, err) {
						  if (ret.code=='9000') {
											//支付成功
											 $.sDialog({
												 skin:"red",
												 content:'支付成功',
												 okBtn:false,
												 cancelBtn:false
											 });
										setTimeout("location.href = '../member/order_list.html?data-state=state_pay'", 2000);
										} else {
											$.sDialog({
												 skin:"red",
												 content:'支付失败',
												 okBtn:false,
												 cancelBtn:false
											 });
										setTimeout("location.href = '../member/order_list.html?data-state=state_new'", 2000);
										}
						});
					 }
				}
		});
	 }
	 else{
		   location.href = MapiUrl+'/index.php?w=member_payment&t='+t+'&key=' + key + '&pay_sn=' + pay_sn + '&password=' + password + '&rcb_pay=' + rcb_pay + '&pd_pay=' + pd_pay + '&payment_code=' + payment_code;
	 }
 }
