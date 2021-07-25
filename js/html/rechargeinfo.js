apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var e = $api.getStorage('key');
    if (!e) {
        window.location.href = 'login.html';
        return false;
    }
	var pay_sn=getQueryString('pay_sn');
		$.ajax({
			type:'post',
            url:MapiUrl+"/index.php?w=recharge&t=recharge_order",
			data:{key:e,pay_sn:pay_sn},
			dataType:'json',
			success:function(result){
				if(!result.datas.error){
					var data = result.datas;					
					data.MapiUrl = MapiUrl;
					data.key = e;
					
					template.helper('p2f', function(s) {
						return (parseFloat(s) || 0).toFixed(2);
					});
					var html = template.render('rechargeinfo-tmpl', data);
					$("#rechargeinfo").html(html);	
				}
				else{
					alert(result.datas.error);
					WTback();
					//location.href="member.html";
				}				
			}
		});
	
	$('#rechargeinfo').on('click','.check-payment',function() {
        var pay_sn = $(this).attr('data-paySn');
        toPay(pay_sn,'recharge','recharge_order');
        return false;
    });
       
	


});