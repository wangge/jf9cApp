$(function() {
    var key = $api.getStorage('seller_key');
    var ob_id = getQueryString('ob_id');
    if (!key) {
        window.location.href = '../member/login.html';
    }
	$.ajax({
        type:'post',
        url:MapiUrl+"/index.php?w=seller_bill&t=show_bill",
        data:{key:key,ob_id:ob_id},
        dataType:'json',
        success:function(result){
				checkLogin(result.login);//检测是否登录了
				var t = template.render("order-info-tmpl", result.datas);
				
				$('#order-info-container').html(t);
				if(result.datas.bill_info.ob_state==1){
					$('.form-btn').show();
					$('#show_ok').hide();
				}else{
					$('.form-btn').hide();
					$('#show_ok').show();
				}
				
		}
            
    });
	
	
	$('.btn').click(function(){
	    $.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=seller_bill&t=confirm_bill",
			data:{key:key,ob_id:ob_id},
			dataType:'json',
			success:function(result){
					checkLogin(result.login);//检测是否登录了
					if (result.datas.error) {
						$.sDialog({
							skin:"red",
							content:result.datas.error,
							okBtn:false,
							cancelBtn:false
						});
						return false;
					}else{
                        alert('操作成功！');
						location.href = 'store_bill_info.html?ob_id='+ob_id;
					}
					
			}
				
		});
	})
	
});