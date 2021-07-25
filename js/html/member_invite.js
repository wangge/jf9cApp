apiready=function(){
  var wxPlus = api.require('wxPlus');
  wxPlus.isInstalled(function(ret, err) {
  	if (ret.installed) {
    } else {
      $(".invite-share").hide();
    }
  });
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function(){
		var key = $api.getStorage('key');
    if(!key){
		window.location.href = 'login.html';
		return false;
    }
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_invite",
			data:{key:key},
			dataType:'json',
			//jsonp:'callback',
			success:function(result){
				checkLogin(result.login);
				var data = result.datas.member_info;
				var logo_wx = MUrl+'/images/logo_mb.png';
				var to_url = MUrl+'/html/invite.html?smid='+data.user_id;
        var title = data.user_name;
        var description = data.user_name+' 邀请您领积分，积分兑换礼品';
        var thumb = MUrl+'/images/logo_mb.png';
        var contentUrl = MUrl+'/html/invite.html?smid='+data.user_id;


				$api.setStorage('redirect_uri','/html/invite.html?smid='+data.user_id);

				$('#username').html(data.user_name);
				$('#myurl').val(data.myurl);
				$('#myurl_src').attr("src",data.myurl_src);
				$('.get_url').attr("href",data.myurl);

        $('#contbox').click(function(){
            var timestamp = new Date().getTime()
            api.download({
                url: data.myurl_src,
                savePath: 'fs://user'+timestamp+'.jpeg',
                report: true,
                cache: true,
                allowResume: true
            }, function(ret, err) {
                if(ret){
                    api.toast({
                        msg:'图片已保存到本地'
                    })
                }
                api.saveMediaToAlbum({
                    path: 'fs://user'+timestamp+'.jpeg'
                }, function(ret, err) {

                });
            });
        });

        $('#wx_sha').click(function(){
			var dialogBox = api.require('dialogBox');
			var wxPlus = api.require('wxPlus');
			wxPlus.isInstalled(function(ret, err) {
			if (ret.installed) {
				  wxPlus.shareWebpage({
					//apiKey: 'wx90c9a14e76746ebc',
					scene: 'timeline',//'timeline',//朋友圈 session好友
					title: title,
					description: description,
					thumb: ''+thumb+'',
					contentUrl: contentUrl
				  }, function (ret, err) {
					if (ret.status) {
					  api.toast({msg: '分享成功'});
					  dialogBox.close({
						  dialogName: 'actionMenu'
					  });
					}
				  });
			} else {
					alert('当前设备未安装微信客户端');
				}
			});
        });

        $('#qq_url').click(function(){
          var dialogBox = api.require('dialogBox');
          var _shareqq = api.require('QQPlus');
           _shareqq.shareNews({
               url:contentUrl,
               type:'QFriend',
               title:title,
               description:description,
               imgUrl:thumb
           },function(ret,err){
              if (ret.status){
                api.toast({msg: '分享成功'});
                dialogBox.close({
                    dialogName: 'actionMenu'
                });
              }
            });
        });

        $('#qzone_url').click(function(){
          var dialogBox = api.require('dialogBox');
          var _shareqq = api.require('QQPlus');
           _shareqq.shareNews({
               url:contentUrl,
               type:'QZone',
               title:title_share,
               description:description,
               imgUrl:thumb
           },function(ret,err){
              if (ret.status){
                api.toast({msg: '分享成功'});
                dialogBox.close({
                    dialogName: 'actionMenu'
                });
              }
            });
        });

        $('#weibo_url').click(function(){
            var dialogBox = api.require('dialogBox');
            var weiboPlus= api.require('weiboPlus');
            weiboPlus.shareWebPage({
                text: title,
                title: title,
                description: description,
                thumb: thumb,
                contentUrl: contentUrl
            }, function(ret, err) {
                if (ret.status) {
                  api.toast({msg: '分享成功'});
                  dialogBox.close({
                      dialogName: 'actionMenu'
                  });
                }
            });
        });

        /*点击复制*/
        $('#myurl').click(function(){
          var dialogBox = api.require('dialogBox');
          var clipBoard = api.require('clipBoard');
          clipBoard.set({
              value: data.user_name+' 邀请您领积分，积分兑换礼品：'+contentUrl
          }, function(ret, err) {
              if (ret) {
                api.toast({msg: '已复制，可直接粘贴发送'});
                dialogBox.close({
                    dialogName: 'actionMenu'
                });
              }
          });
        });



			}
		});



	$('.abtn').click(function(){
		$('#invite-more').show();
	});

});
