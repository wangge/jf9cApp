$(function() {
  $('#logo_src').attr("src",ShopUrl+'/system/upfiles/shop/common/home_logo.png');
  $('#mb_app').attr("src",ShopUrl+'/system/upfiles/shop/common/mb_app.png');

    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'about.html';
        return;
    }
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=member_account&t=index",
        data:{key:key},
        dataType:'json',
        success:function(result){
            if(result.code == 200){
				$('#avator_img').attr('src',result.datas.avatar);
            	if (result.datas.m_state) {
            		$('#mobile_link').attr('href','member_mobile_modify.html');
            		$('#mobile_value').html(result.datas.mobile);
            	}
				var dt = new Date();
				y=dt.getFullYear();
				$('#site_name').html(y + " "+ result.datas.site_name);
				if (!result.datas.p_state) {
            		$('#paypwd_tips').html('未设置');

            	}
            }else{
            }
        }
    });
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=member_auth&t=index",
        data:{key:key},
        dataType:'json',
        success:function(result){
            if(result.code == 200){
            	if (result.datas.member_auth == 0) {
            		$('#member_auth').html('未认证');
            	}else{
					$('#member_auth').html('已认证');
					$('.member_auth').attr('href','javascript:void(0);');
				}

            }
        }
	});
	$('#logoutbtn').click(function(){
		var username = $api.getStorage('username');
		var key = $api.getStorage('key');
		var client = 'app';
		$.ajax({
			type:'get',
			url:MapiUrl+'/index.php?w=logout',
			data:{username:username,key:key,client:client},
			success:function(result){
				if(result){
					$api.setStorage('wxout', '1');
					$api.rmStorage('username');
					$api.rmStorage('key');
					localStorage.removeItem('cart_count');
					$api.rmStorage("seller_name");
					$api.rmStorage("store_name");
          $api.rmStorage("seller_key");
					$api.rmStorage("is_seller");
          api.sendEvent({
              name: 'LoginTo',
              extra: {
                  msg: '退出成功'
              }
          });
          setTimeout("api.closeWin({})", 2000);
          WTback();
					//location.href = 'member.html';
				}
			}
		});
	});

});

/**
 *该方法用来清除最近一周的缓存
 *  **/
function clearCache(){
	api.actionSheet({
		title:"清理缓存",
		cancelTitle:"取消",
		destructiveTitle:"确定"
    },function(ret,err){
    	if(ret.buttonIndex==1){//确定按钮
    		//进度条提示
    		api.showProgress({
    			animationType:"fade",//进度提示框动画类型
    			title: '努力清除中...',
			    modal: true
            });
            //开始清除
            api.clearCache({},function(ret,err){
            	api.hideProgress();//进度条隐藏
            	api.toast({
			        msg: '清除完成'
			    });
            });
    	}
    });
}
