$(function() {
  $('#logo_src').attr("src",ShopUrl+'/system/upfiles/shop/common/home_logo.png');
  $.ajax({
      url: MapiUrl + "/index.php?w=index",
      type: 'get',
      dataType: 'json',
      success: function(result) {
          var dt = new Date();
  				y=dt.getFullYear();
  				$('#site_name').html(y + " "+ result.datas.seo.html_title);
				$('#mb_app').attr("src",result.datas.mobile_wx);
      }
  });

});

//该方法用来清除最近一周的缓存
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
