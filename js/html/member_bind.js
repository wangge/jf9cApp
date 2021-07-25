$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return;
    }	
	$('#wx_bind').click(function(){
		    $.ajax({
                type:'post',
                url:MapiUrl+"/index.php?w=member_bind&t=weixinbind&client=app",
                data:{key:key},
                dataType:'json',
                success:function(result){
					if(result.code == 200){
					    var bind = result.datas.bind;
							if(bind){
								if(bind == 1){
								api.toast({
									msg: '绑定成功',
									duration: 2000,
									location: 'middle'
								});
								setTimeout(function () {
									api.closeToWin({
										name: 'root'
									});
								}, 2000);
								}else if(bind == 2){
								api.toast({
									msg: '绑定失败',
									duration: 2000,
									location: 'middle'
								});
								setTimeout(function () {
									api.closeToWin({
										name: 'root'
									});
								}, 2000);
								}else if(bind == 3){
								api.toast({
									msg: '当前微信已绑定其它会员',
									duration: 2000,
									location: 'middle'
								});
								setTimeout(function () {
									api.closeToWin({
										name: 'root'
									});
								}, 2000);
								}
							}
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
					
                    
                }
            });
    	 //location.href = MapiUrl+'/index.php?w=member_bind&t=weixinbind&client=app&key='+key;
    });
});
