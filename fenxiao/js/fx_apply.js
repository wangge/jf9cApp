$(function(){
    var key = $api.getStorage('key');
	var predepoit_=0;
	//获取余额余额
	$.getJSON(MapiUrl + '/index.php?w=member_fx&t=my_asset', {'key':key}, function(result){

		$("#allmoney").html(result.datas.available_fx_trad);
		$("#bill_bank_name").html(result.datas.bill_bank_name);
		$("#bill_type_number").html(result.datas.bill_type_number);
		$("#bill_user_name").html(result.datas.bill_user_name);
		
	      if(result.datas.bill_type_code == 'bank'){
	        $('#bank_name').show();
	      }else{
	        $('#bank_name').hide();
	      }
		if (result.datas.bill_type_code == null || result.datas.bill_type_code == undefined || result.datas.bill_type_code == '') { 
			  	$.sDialog({
	            skin:"red",
	            content:"先完善提现信息再来",
	            okBtn:false,
	            cancelBtn:false
	        });
	        setTimeout(window.location.href = 'fx_access_edit.html',2000);
	        
	        return false;
			  }
		if(result.datas.bill_type_code =='alipay'){
			$("#bill_type_code").val('支付宝');
		}else{
			$("#bill_type_code").val('银行');
			if (result.datas.bill_bank_name == null || result.datas.bill_bank_name == undefined || result.datas.bill_bank_name == '') { 
			$.sDialog({
	            skin:"red",
	            content:"开户行为空，去完善",
	            okBtn:false,
	            cancelBtn:false
	        });
	        setTimeout(window.location.href = 'fx_access_edit.html',2000);
	        return false;
		}
		}
		
		predepoit_=result.datas.available_fx_trad;
	});
	
	var referurl = document.referrer;//上级网址
	$("input[name=referurl]").val(referurl);
	$.sValid.init({
        rules:{
            pdc_amount:"required",
			password:"required"
        },
        messages:{
            pdc_amount:"请输入提现金额！",
			password:"请输入支付密码！",
            
        },
        callback:function (eId,eMsg,eRules){
            if(eId.length >0){
                var errorHtml = "";
                $.map(eMsg,function (idx,item){
                    errorHtml += "<p>"+idx+"</p>";
                });
				 $.sDialog({
							skin:"red",
							content:errorHtml,
							okBtn:false,
							cancelBtn:false
						});
            }else{
                 $(".error-tips").html("").hide();
            }
        }
    });
	$('#btn').click(function(){
		var tradc_amount = $('#tradc_amount').val();
		if(tradc_amount =='')
		{
			alert('请输入提现金额！');
			return false;
		}
		var pay_pwd = $('#pay_pwd').val();
		if(pay_pwd =='')
		{
			alert('请输入提现金额！');
			return false;
		}
		var key = $api.getStorage('key');
		if(!key){
			location.href = '../html/member/login.html';
			return false;
		}
		if(parseFloat(predepoit_)<parseFloat(tradc_amount))
		{
			alert('提现金额不能大于余额余额！');
			return false;
		}
		var client = 'wap';
		if($.sValid()){
	        $.ajax({
				type:'post',
				url:MapiUrl+"/index.php?w=member_fx&t=cash_apply",
				data:{tradc_amount:tradc_amount,pay_pwd:pay_pwd,key:key,client:client},
				dataType:'json',
				success:function(result){
				checkLogin(result.login);//检测是否登录了
                if(result.code == 400){
                        $.sDialog({
                          skin:"red",
                          content:result.datas.error,
                          okBtn:false,
                          cancelBtn:false
                        });
                        return false;
                 }
					if(!result.datas.error){
						$(".error-tips").hide();
						location.href = 'fx_cash.html';

					}else{
						  $.sDialog({
							skin:"red",
							content:result.datas.error,
							okBtn:false,
							cancelBtn:false
						});
					}
				}
			 });
        }
	});
});
