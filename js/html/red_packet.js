apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function (){ 
    var id = getQueryString("id");
    //渲染页面
    $.ajax({
       url:MapiUrl+"/index.php?w=red_packet&t=index",
       type:"get",
       data:{id:id},
       dataType:"json",
       success:function(result){
          var data = result.datas;
          if(data.error){
				api.toast( {
				  msg: data.error,
				  duration: 2000,
				  location: 'middle'
				});
				setTimeout(function () {
				  api.closeWin();
				}, 3000);
          }
       }
    });

	$('#rush_get').click(function(){//领取红包
    
		var key = $api.getStorage("key");//登录标记
        if(!key){
             window.location.href = 'member/login.html';
			 return;
        }else{
			$.ajax({
			   url:MapiUrl+"/index.php?w=member_packet&t=getpack",
			   type:"get",
			   data:{id:id,key:key},
			   dataType:"json",
			   success:function(result){
				  var data = result.datas;
				  if(data.error){
					  //更改样式
					  document.getElementById('chaihongbao').style.display="none";
					  document.getElementById('fenxiang').style.display="block";
						api.toast( {
						  msg: data.error,
						  duration: 2000,
						  location: 'middle'
						});
						setTimeout(function () {
						  api.closeWin();
						}, 3000);
				  }else{
					  //更改样式
					  document.getElementById('chaihongbao').style.display="none";
					  document.getElementById('fenxiang').style.display="block";
						api.confirm({
								title: "温馨提示",
								msg: data.error,
								buttons:[ "查看", "退出"]
						},function(ret,err){
							if(ret.buttonIndex == 1){
								location.href = '../html/member/packet_list.html';
							}else{
								WTCloseWin();
							}
						});
				  }
			   }
			});
		}

	});

});