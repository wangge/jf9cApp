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
    if(key==''){
	location.href = 'login.html';
    }
    var predepoit_=0;
    var b_type = 'alipay';
    $('input[type="radio"]').on('change',function(){
      b_type = $(this).val();
      if(b_type == 'bank'){
        $('#bank_name').show();
      }else{
        $('#bank_name').hide();
      }
    });	
	//获取余额余额
	$.getJSON(MapiUrl + '/index.php?w=recharge&t=my_asset', {'key':key,'fields':'predepoit'}, function(result){
		
		$("#allmoney").html(result.datas.predepoit);
		predepoit_=result.datas.predepoit;
		$("#allmoney").html(result.datas.available_fx_trad);
		$("#bill_bank_name").html(result.datas.bill_bank_name);
		$("#bill_type_number").html(result.datas.bill_type_number);
		$("#bill_user_name").html(result.datas.bill_user_name);
		$("#mobilenum").html(result.datas.member_mobile);
		
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
	        setTimeout(window.location.href = 'pd_cash_edit.html',2000);
	        
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
	        setTimeout(window.location.href = 'pd_cash_edit.html',2000);
	        return false;
		}
		}
		
		
		
		
	});	
	
	var referurl = document.referrer;//上级网址
	$("input[name=referurl]").val(referurl);
	$.sValid.init({
        rules:{
            tradc_amount:"required",
			//pdc_bank_no:"required",
			//pdc_bank_user:"required",
			//mobilenum:"required",
			pay_pwd:"required"
        },
        messages:{
            tradc_amount:"请输入提现金额！",
			//pdc_bank_no:"请输入收款账号！",
			//pdc_bank_user:"请输入收款人姓名！",
			//mobilenum:"请输入手机号码！",
			pay_pwd:"请输入支付密码！",
            
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
                //$(".error-tips").html(errorHtml).show();
            }else{
                 $(".error-tips").html("").hide();
            }
        }  
    });
	$('#btn').click(function(){
		var pdc_amount = $('#tradc_amount').val();
		var pdc_bank_name = $('#bill_bank_name').html();
		var pdc_bank_no = $('#bill_type_number').html();
		var pdc_bank_user = $('#bill_user_name').html();
		var mobilenum = $('#mobilenum').html();
		var pay_pwd = $('#pay_pwd').val();
		var pdc_type_code = $('#bill_type_code').val();

		if(parseFloat(predepoit_)<parseFloat(pdc_amount))
		{
			alert('提现金额不能大于余额余额！');
			return false;
		}
		if(pdc_type_code =='bank' && pdc_bank_name =='')
		{
			alert('请输入银行开户行！');
			return false;
		}
		var client = 'wap';
		if($.sValid()){
	          $.ajax({
				type:'post',
				url:MapiUrl+"/index.php?w=recharge&t=pd_cash_add",	
				data:{pdc_amount:pdc_amount,pdc_type_code:pdc_type_code,pdc_bank_name:pdc_bank_name,pdc_bank_no:pdc_bank_no,pdc_bank_user:pdc_bank_user,mobilenum:mobilenum,password:pay_pwd,key:key,client:client},
				dataType:'json',
				success:function(result){
					if(!result.datas.error){
						$.sDialog({
							skin:"red",
							content:"提交成功，请等待审核及支付",
							okBtn:false,
							cancelBtn:false
						}); 
						setTimeout("location.href = 'pdcashlist.html'",2000); 
						
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