var goods_id = getQueryString('gid');
$(function(){
		var key = $api.getStorage('key');
		if(key==''){
			location.href = '../html/member/login.html';
		}

		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_fx&t=fx_add",
			data:{key:key,id:goods_id},
			dataType:'json',
			//jsonp:'callback',
			success:function(result){
				checkLogin(result.login);//检测是否登录了
                if(result.code == 400){
                        $.sDialog({
                          skin:"red",
                          content:result.datas.error,
                          okBtn:false,
                          cancelBtn:false
                        });
                        setTimeout("location.href = '../html/member/member.html'",2000);
                        return false;
                 }
				var data = result.datas.data;
				var to_url = data.fx_url;
        var title = data.goods_name;
        document.title = title;

				$('.goods_name').html('<span>促销</span>'+result.datas.data.goods_name);
				$('.goods_pic_url').html('<img src="'+data.goods_image+'" style="width:100%; height:100%; max-width:360px;max-height:360px;" />');
				$('.goods_price').html('<em>¥'+result.datas.data.goods_price+'</em>');
                $('.goods_marketprice').html('<em>原价：¥'+result.datas.data.goods_marketprice+'</em>');
                $('.goods_body').html('<dl style=\"padding: 0.4rem\">'+result.datas.data.goods_body+'</dl>');
                //$('.member_name').html(result.datas.data.member_name+' 精心为您推荐');
                
                    //生成海报
                $('#share_poster').click(function(){
									confirmPermission('storage,camera,photos',{
								    callback:function(){
								        //console.log('storage本地存储权限已获取!');
								    }
								  });
									var goods_image = data.goods_image;
									api.imageCache({
									    url: goods_image
									}, function(ret, err) {
									    var url = ret.url;
											$('.goods_pic_url').html('<img src="'+url+'" style="width:100%; height:100%; max-width:360px;max-height:360px;" />');
									});
									$.sDialog({
                      skin:"block",
                      content:'正在生成海报...',
                      okBtn:false,
                      cancelBtn:false,
                    "lock":true
                  });
                    $(".box").show();
                    $(".container").show();
                    setTimeout(function (){
                          html2canvas(document.querySelector("#boximg"),{allowTaint:false,useCORS:true}).then(function(canvas) {
							  					    dataURL =canvas.toDataURL("image/png");
                              var newImg = new Image();
                              newImg.src=dataURL;
                              newImg.crossOrigin = 'anonymous';
                              newImg.onload = function () {
                    				  $("#download_img").append(newImg);
                          }
                        });
                  }, 2000);

                  });

                $(".close").click(function(){
                      $(".box").hide();
                  		$("#download_img").html("");
                    });

				        //显示二维码
                var qrcode = new QRCode(document.getElementById("qrcodeConIn"), {
                    text: to_url,
                    width: 100 * 2,
                    height: 100 * 2,
                    colorDark : '#000000',
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                setTimeout(function(){
                    if(!$("#qrcodeConIn img").attr("src")){
                        $("#qrcodeConIn img").show();
                        $("#qrcodeConIn canvas").hide();
                        var canvas = $("#qrcodeConIn canvas")[0];
                        var dataURL = canvas.toDataURL("image/png");
                        $("#qrcodeConIn img").attr("src",dataURL);
                    }
                },0);

								$('#poster_img').click(function(){
									confirmPermission('storage,camera,photos',{
								    callback:function(){
								        //console.log('storage本地存储权限已获取!');
								    }
								  });
									var imgdataURL = $("#download_img img").attr("src");
                  var trans = api.require('trans');
                  trans.saveImage({
                          base64Str : imgdataURL.slice(22),
                          album : true,
                          imgPath : 'fs://',
                          imgName : result.datas.data.member_name+result.datas.data.fx_id+'.png'
                  }, function(ret, err) {
                          if (ret.status) {
                                  //alert(JSON.stringify(ret));
                                  api.toast({
                                          msg : '已保存到相册',
                                          duration : 3000,
                                          location : 'middle'
                                  });
                          } else {
																api.toast({
																				msg : '保存失败，试下截屏保存海报吧',
																				duration : 3000,
																				location : 'middle'
																});
                          }
									        });

								  });

						//分享弹出框
						var dialogBox = api.require('dialogBox');
						$("#share_link").click(function(){
						confirmPermission('storage',{
							callback:function(){
								//  console.log('storage本地存储权限已获取!');
							}
						});
						dialogBox.actionMenu ({
								tapClose: true,
								rect:{
										h: 150
								},
								texts:{
										 cancel: '取消'
								},
								items:[
								{
										text: '微信',
										icon: 'widget://image/icon/weixin_icon.png'
								},
								{
										text: '朋友圈',
										icon: 'widget://image/icon/pyq_ico.png'
								},
								{
										text: 'QQ',
										icon: 'widget://image/icon/qq_icon.png'
								},
								{
										text: 'QQ空间',
										icon: 'widget://image/icon/qzone_ico.png'
								},
								{
										text: '微博',
										icon: 'widget://image/icon/weibo_icon.png'
									},
								{
										text: '链接',
										icon: 'widget://image/icon/copy_icon.png'
									}
								],
								styles:{
										bg:'#FFF',
										column: 6,
										itemText: {
												color: '#000',
												size: 12,
												marginT:8
										},
										itemIcon:{
												size:38
										},
										cancel:{
												bg: 'fs://icon.png',
												color:'#000',
												h: 44 ,
												size: 14
										}
								}
						}, function(ret){
								//alert(JSON.stringify(ret));
								if(ret.index==0){
									var share_type='session';
								}else if(ret.index==1){
									var share_type='timeline';
								}else if(ret.index==2){
									var share_type='QFriend';
								}else if(ret.index==3){
									var share_type='QZone';
								}else if(ret.index==4){
									var share_type='weibo';
								}else if(ret.index==5){
									var share_type='copy';
								}else if(ret.eventType=="cancel"){
										dialogBox.close({
												dialogName: 'actionMenu'
										});
										return false;
								}
								ShareGoods(data,share_type);
						});
						});
						//分享end
			}

});


});


				function ShareGoods(data,share_type){
				  var old_img_url = data.goods_image;
				  var img_url = old_img_url.lastIndexOf("/");
				  if(img_url == -1){
				    img_url = old_img_url.lastIndexOf("\\");
				  }

				  var img_filename = old_img_url.substr(img_url +1);
				  var img_index = img_filename.indexOf("@");
				  if(img_index != -1){
				    img_filename = img_filename.substr(0,img_index);
				  }

				  var savePath = api.cacheDir + "/sharePic/";
				  var imageFilter = api.require('imageFilter');
				  var thumb = $api.getStorage(name, savePath+name);
				  if(typeof(thumb)!="undefined" &&thumb!=""){
				      if(share_type=='timeline'||share_type=='session'){
				          WxShare(data,thumb,share_type);
				      }else if(share_type=="QZone"||share_type=='QFriend'){
				           QqShare(data,thumb,share_type);
				      }else if(share_type=="weibo"){
				        WeiboShare(data,thumb,share_type);
				      }else if(share_type=="copy"){
				        CopyShare(data,thumb,share_type);
				      }
				      return ;
				  }
				 api.imageCache({
				   url: data.goods_image
				 }, function(ret, err){
				   if(ret.status){
				     console.log(JSON.stringify(ret));
				     var cacheImg = ret.url;
				     var systemType = api.systemType;
				     if(systemType=='ios'){
				       console.log("ios");
				       imageFilter.compress({
				         img: cacheImg,
				         quality: 0.1,
				         size:{
				         w:150,
				         h:150
				         },
				         save : {
				           album : false,
				           imgPath : savePath,
				           imgName : img_filename
				         }
				       }, function(ret, err){
				         if( ret.status ){
				             $api.setStorage(name, savePath+name);
				           var thumb = savePath+img_filename;

				           if(share_type=='timeline'||share_type=='session'){
				               WxShare(data,thumb,share_type);
				           }else if(share_type=="QZone"||share_type=='QFriend'){
				                QqShare(data,thumb,share_type);
				           }else if(share_type=="weibo"){
				             WeiboShare(data,thumb,share_type);
				           }else if(share_type=="copy"){
				             CopyShare(data,thumb,share_type);
				           }
				         }else{

				         }
				       });
				     }
				     if(systemType=='android'){
				       imageFilter.compress({
				         img: cacheImg,
				         quality: 0.1,
				         size:{
				         w:100,
				         h:100
				         },
				         save : {
				           album : false,
				           imgPath : savePath,
				           imgName : img_filename
				         }
				       }, function(ret, err){
				         if( ret.status ){
				            $api.setStorage(name, savePath+name);
				            var thumb = savePath+img_filename;
				            if(share_type=='timeline'||share_type=='session'){
				                WxShare(data,thumb,share_type);
				            }else if(share_type=="QZone"||share_type=='QFriend'){
				                 QqShare(data,thumb,share_type);
				            }else if(share_type=="weibo"){
				              WeiboShare(data,thumb,share_type);
				            }else if(share_type=="copy"){
				              CopyShare(data,thumb,share_type);
				            }
				         }else{
				         }
				       });
				     }
				     }
				   });
				}
				function WxShare(data,thumb,type){
				   var dialogBox = api.require('dialogBox');
				    var wxPlus = api.require('wxPlus');
					wxPlus.isInstalled(function(ret, err) {
					if (ret.installed) {
				      wxPlus.shareWebpage({
				        scene: type,
				        title: data.goods_name,
				        description: data.goods_name,
				        thumb: ''+thumb+'',
				        contentUrl: data.fx_url
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
				}

				function QqShare(data,thumb,type){
				  var dialogBox = api.require('dialogBox');
				  var _shareqq = api.require('QQPlus');
				   _shareqq.shareNews({
				       url:data.fx_url,
				       type:type,
				       title:data.goods_name,
				       description:data.goods_name,
				       imgUrl:thumb
				   },function(ret,err){
				      if (ret.status){
				        api.toast({msg: '分享成功'});
				        dialogBox.close({
				            dialogName: 'actionMenu'
				        });
				      }
				    });
				}

				function WeiboShare(data,thumb,type){
				    var dialogBox = api.require('dialogBox');
				    var weiboPlus= api.require('weiboPlus');
				    weiboPlus.shareWebPage({
				        text: data.goods_name,
				        title: data.goods_name,
				        description: data.goods_name,
				        thumb: thumb,
				        contentUrl: data.fx_url
				    }, function(ret, err) {
				        if (ret.status) {
				          api.toast({msg: '分享成功'});
				          dialogBox.close({
				              dialogName: 'actionMenu'
				          });
				        }
				    });
				}

				function CopyShare(data,thumb,type){
				  var dialogBox = api.require('dialogBox');
				  var clipBoard = api.require('clipBoard');
				  clipBoard.set({
				      value: '推荐:'+data.goods_name+data.fx_url
				  }, function(ret, err) {
				      if (ret) {
				        api.toast({msg: '已复制，粘贴发送给好友吧'});
				        dialogBox.close({
				            dialogName: 'actionMenu'
				        });
				      }
				  });
				}
