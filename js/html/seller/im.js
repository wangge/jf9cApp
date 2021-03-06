//by sho p wt.c om 商家IM
if (getQueryString('seller_key') != '') {
    var key = getQueryString('seller_key');
} else {
    var key = $api.getStorage('seller_key');
}
var nodeShopUrl = '';
var memberInfo = {};
var resourceShopUrl = '';
var smilies_array = new Array();
smilies_array[1] = [['1', ':smile:', 'smile.gif', '28', '28', '28','微笑'], ['2', ':sad:', 'sad.gif', '28', '28', '28','难过'], ['3', ':biggrin:', 'biggrin.gif', '28', '28', '28','呲牙'], ['4', ':cry:', 'cry.gif', '28', '28', '28','大哭'], ['5', ':huffy:', 'huffy.gif', '28', '28', '28','发怒'], ['6', ':shocked:', 'shocked.gif', '28', '28', '28','惊讶'], ['7', ':tongue:', 'tongue.gif', '28', '28', '28','调皮'], ['8', ':shy:', 'shy.gif', '28', '28', '28','害羞'], ['9', ':titter:', 'titter.gif', '28', '28', '28','偷笑'], ['10', ':sweat:', 'sweat.gif', '28', '28', '28','流汗'], ['11', ':mad:', 'mad.gif', '28', '28', '28','抓狂'], ['12', ':lol:', 'lol.gif', '28', '28', '28','阴险'], ['13', ':loveliness:', 'loveliness.gif', '28', '28', '28','可爱'], ['14', ':funk:', 'funk.gif', '28', '28', '28','惊恐'], ['15', ':curse:', 'curse.gif', '28', '28', '28','咒骂'], ['16', ':dizzy:', 'dizzy.gif', '28', '28', '28','晕'], ['17', ':shutup:', 'shutup.gif', '28', '28', '28','闭嘴'], ['18', ':sleepy:', 'sleepy.gif', '28', '28', '28','睡'], ['19', ':hug:', 'hug.gif', '28', '28', '28','拥抱'], ['20', ':victory:', 'victory.gif', '28', '28', '28','胜利'], ['21', ':sun:', 'sun.gif', '28', '28', '28','太阳'],['22', ':moon:', 'moon.gif', '28', '28', '28','月亮'], ['23', ':kiss:', 'kiss.gif', '28', '28', '28','示爱'], ['24', ':handshake:', 'handshake.gif', '28', '28', '28','握手']];
var t_id = getQueryString('t_id');
var chat_goods_id = getQueryString('goods_id');
$(function(){
    $.getJSON( MapiUrl+'/index.php?w=seller_chat&t=get_node_info',{key:key,u_id:t_id,chat_goods_id:chat_goods_id}, function(result){
        checkLogin(result.login);
        connentNode(result.datas);
        if (!$.isEmptyObject(result.datas.chat_goods)) {
            var goods = result.datas.chat_goods;
            var html = '<div class="wtm-chat-product"> <div class="goods-pic"><img src="' + goods.pic + '" alt=""/></div><div class="goods-content"><div class="goods-name" goods_id="' + goods.goods_id + '"><a onclick="WtOpenUrl(this)" url="../goods_detail.html?goods_id=' + goods.goods_id + '">' + goods.goods_name + '</div></a><div class="goods-price">￥' + goods.goods_sale_price + "</div><p><a href='javascript:;' class='send_goods_url'>发送链接</a></p></div> </div>";
            $("#chat_msg_html").append(html);
        }
    });

    var connentNode = function(data){
        var socket_data = data;
        nodeShopUrl = data.node_site_url;
        memberInfo = data.member_info;
        userInfo = data.user_info;
        $('h1').html(userInfo.store_name != '' ? userInfo.store_name : userInfo.member_name);
        $('#into_shop').attr('href','../store.html?store_id='+userInfo.store_id);
        resourceShopUrl = data.static_site_url;
        if (!data.node_chat) {
            $.sDialog({
                skin:"red",
                content:'IM客服没有开启，换其它方式联系客服',
                okBtn:false,
                cancelBtn:false
            });
            return false;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = nodeShopUrl+'/socket.io/socket.io.js';
        document.body.appendChild(script);
        checkIO();
        function checkIO() {
            setTimeout(function(){
                if ( typeof io === "function" ) {
                    connect_node();
                } else {
                    checkIO();
                }
            },500);
        }
        function connect_node() {
                var connect_url = nodeShopUrl;
                var connect = 0;//连接状态
                var member = {};

                member['u_id'] = memberInfo.member_id;
                member['u_name'] = memberInfo.member_name;
                member['avatar'] = memberInfo.member_avatar;
                member['s_id'] = memberInfo.store_id;
                member['s_name'] = memberInfo.store_name;
                member['s_avatar'] = memberInfo.store_avatar;

                    var socket = io(NodeUrl, { 'path': '/socket.io', 'transports': ['websocket'], 'reconnection': false });
                      socket.on('connect', function () {
                        connect = 1;
                        socket.emit('update_user', member);
                        // 在线状态
                        socket.on('get_msg', function (data) {
                          get_msg(data);
                        });
                        socket.on('disconnect', function () {
                          connect = 0;

                            setTimeout(function(){
                                connentNode(socket_data)
                            },1000);
                        });
                      });

                function node_send_msg(data){
                    if(connect === 1) {
                        $.ajax({
                            type:'post',
                            url:MapiUrl+'/index.php?w=seller_chat&t=send_msg',
                            data:data,
                            dataType:'json',
                            success: function(result){
                                if (result.code == 200) {
                                    var msgData = result.datas.msg;
                                    socket.emit('send_msg', msgData);
                                    msgData.avatar = memberInfo.member_avatar;
                                    msgData.class='msg-me';
                                    insert_html(msgData);
                                    $('#msg').val('');
                                } else {
                                    $.sDialog({
                                        skin:"red",
                                        content:result.datas.error,
                                        okBtn:false,
                                        cancelBtn:false
                                    });
                                    return false;
                                }
                            },
                            error: function(msg){
                                $.sDialog({
                                    skin:"red",
                                    content:'请求失败',
                                    okBtn:false,
                                    cancelBtn:false
                                });
                                return false;
                            }
                        });
                    }else{
						connect = 1;
						checkIO();
					}
                }
                function node_del_msg(max_id, f_id){
                    if(connect === 1) {
                        socket.emit('del_msg', {'max_id':max_id, 'f_id':f_id});
                    }
                }
                // 接收消息
                function get_msg(data) {
                    var max_id;
                    for (var k in data){
                        var msgData = data[k];
                        if (data[k].f_id != t_id) {
                            continue;
                        }
                        max_id= k;
                        msgData.avatar = (!$.isEmptyObject(userInfo.store_id)? userInfo.store_avatar : userInfo.member_avatar);
                        msgData.class='msg-other';
                        insert_html(msgData);
                    }
                    if (typeof(max_id) != 'undefined') {
                        node_del_msg(max_id, t_id);
                    }
                }
                $('#submit').click(function(){
                    var t_msg = $('#msg').val();
                    if (t_msg == '') {
                        $.sDialog({
                            skin:"red",
                            content:'请填写内容',
                            okBtn:false,
                            cancelBtn:false
                        });
                        return false;
                    }
                    node_send_msg({key:key,t_id:t_id,t_name:userInfo.member_name,t_msg:t_msg,chat_goods_id:chat_goods_id});
                    $('#chat_smile').addClass('hide');
                    $('.wtm-chat-con').css('bottom', '2rem');
                    $('#msg').focus();
                });
            //开始
              $(".send_goods_url").live("click", function(){
		 var goods_url = MUrl+"/html/goods_detail.html?goods_id=" + $(".goods-name").attr("goods_id");
                var goods_pic = $(".goods-pic img").attr("src");
                var goods_name = $(".goods-name a").html();
                var goods_price = $(".goods-price").html();
                var last_msg = $("#msg").val() + goods_url +"&nbsp;"+ goods_name +"&nbsp;"+ goods_price;
                $("#msg").val(last_msg).trigger("click");
      				      $("#submit").trigger("click");
                  });
            //结束
        }

        for(var i in smilies_array[1]) {
            var s = smilies_array[1][i];
            var smilieimg = '<img title="'+s[6]+'" alt="'+s[6]+'" data-sign="'+s[1]+'" src="'+resourceShopUrl+'/js/smilies/images/'+s[2]+'">';
            $('#chat_smile > ul').append('<li>'+smilieimg+'</li>');
        }

        $('#open_smile').click(function(){
            if ($('#chat_smile').hasClass('hide')) {
                $('#chat_smile').removeClass('hide');
                $('.wtm-chat-con').css('bottom', '7rem');
            } else {
                $('#chat_smile').addClass('hide');
                $('.wtm-chat-con').css('bottom', '2rem');
            }
        });
        $('#chat_smile').on('click', 'img', function(){
            var _sign = $(this).attr('data-sign');
            var dthis = $('#msg')[0];
            var start = dthis.selectionStart;
            var end = dthis.selectionEnd;
            var top = dthis.scrollTop;
            dthis.value = dthis.value.substring(0, start) + _sign + dthis.value.substring(end, dthis.value.length);
            dthis.setSelectionRange(start + _sign.length, end + _sign.length);
        });

        // 查看更多聊天记录
        $('#chat_msg_log').click(function(){
            $.ajax({
                type:'post',
                url:MapiUrl+'/index.php?w=seller_chat&t=get_chat_log&page=50',
                data:{key:key,t_id:t_id,t:30},
                dataType:'json',
                success: function(result){
                    if(result.code == 200){
                        if (result.datas.list.length == 0) {
                            $.sDialog({
                                skin:"block",
                                content:'暂无聊天记录',
                                okBtn:false,
                                cancelBtn:false
                            });
                            return false;
                        }
                        result.datas.list.reverse();
                        $("#chat_msg_html").html('');
                        for (var i=0; i<result.datas.list.length; i++) {
                            var _list = result.datas.list[i];
                            if (_list.f_id != t_id) {
                                var data = {};
                                data.class = 'msg-me';
                                data.avatar = memberInfo.member_avatar;
                                data.t_msg = _list.t_msg;
                                insert_html(data);
                            } else {
                                var data = {};
                                data.class = 'msg-other';
                                data.avatar = userInfo.store_avatar == '' ? userInfo.member_avatar : userInfo.store_avatar;
                                data.t_msg = _list.t_msg;
                                insert_html(data);
                            }
                        }
                    } else {
                        $.sDialog({
                            skin:"red",
                            content:result.datas.error,
                            okBtn:false,
                            cancelBtn:false
                        });
                        return false;
                    }
                }
            });
        });

        //$('#chat_msg_log').trigger("click");//加载显示聊天记录

        function insert_html(msgData) {
            msgData.t_msg = update_chat_msg(msgData.t_msg);
            var html = '<dl class="'+msgData.class+'"><dt><img src="' + msgData.avatar + '" alt=""/><i></i></dt><dd>'+msgData.t_msg+'</dd></dl>';
            $("#chat_msg_html").append(html);
            if (!$.isEmptyObject(msgData.goods_content)) {
                var goods = msgData.goods_content;
                var html = '<div class="wtm-chat-product"> <a href="../goods_detail.html?goods_id=' + goods.goods_id + '" target="_blank"><div class="goods-pic"><img src="' + goods.pic36 + '" alt=""/></div><div class="goods-content"><div class="goods-name">' + goods.goods_name + '</div><div class="goods-price">￥' + goods.goods_sale_price + '</div></div></a> </div>';
                $("#chat_msg_html").append(html);
            }
            $("#anchor-bottom")[0].scrollIntoView();
        }
        // 表情
        function update_chat_msg(msg){
            if (typeof smilies_array !== "undefined") {
                msg = ''+msg;
                for(var i in smilies_array[1]) {
                    var s = smilies_array[1][i];
                    var re = new RegExp(""+s[1],"g");
                    var smilieimg = '<img title="'+s[6]+'" alt="'+s[6]+'" src="'+resourceShopUrl+'/js/smilies/images/'+s[2]+'">';
                    msg = msg.replace(re,smilieimg);
                }
            }
			//发送图片 sh wt  o p .c om
			rr = new RegExp('\\[SIMG:(.*?)\\]', "g");
			msg = msg.replace(rr, "<a href='$1' ><img src=$1 /></a>");
            return msg;
        }

        //图片上传
        $('input[name="_pic"]').on("click",function(){
          //权限判断处理
          confirmPermission('storage,camera,photos',{
            callback:function(){
                //console.log('storage本地存储权限已获取!');
            }
        });
            var _this = $(this);
          api.actionSheet({
            title: '上传图片',
            cancelTitle: '取消',
            buttons: ['拍照', '从手机相册选择']
          }, function(ret, err) {
            if (ret) {
              var sourceType = ret.buttonIndex;
              if (sourceType == 1) { // 拍照
                api.getPicture({
                  sourceType: 'camera',
                  encodingType: 'jpg',
                  mediaValue: 'pic',
                  allowEdit: false,
                  destinationType: 'url',
                  quality: 90,
                  saveToPhotoAlbum: true
                }, function(ret, err) {
                  _upload_GoodsPic(ret, err,_this);
                });
              } else if (sourceType == 2) { // 从相机中选择
                api.getPicture({
                  sourceType: 'library',
                  encodingType: 'jpg',
                  mediaValue: 'pic',
                  destinationType: 'url',
                  quality: 100
                }, function(ret, err) {
                  _upload_GoodsPic(ret, err,_this);
                });
              }else{
                return;
              }
            }
          });

        });

        //上传
        function _upload_GoodsPic(ret,err,element){
            if (ret) {
              var key = $api.getStorage("key");
              api.showProgress({
                style : 'default',
                animationType : 'fade',
                title : '上传中',
                modal : false
              });
              api.ajax({
              timeout : 100,
              method : 'post',
              url : MapiUrl + "/index.php?w=seller_chat&t=image_send&client=wap",
              data : {
                    values:{key:key,name:"upfile"},
                     files:{upfile : ret.data},
              },
              dataType : 'json',
              }, function(_ret, _err) {
                api.hideProgress();
                if(_ret.code==200){
              		  $('#msg').val('[SIMG:' + _ret.datas.url + ']');
              		  $('#submit').trigger("click");
                }else{;
                    api.alert({msg:_ret.message});
                }
              });
            } else {
              api.hideProgress();
              api.alert({msg:err.msg});
            };
        }
    }

});
