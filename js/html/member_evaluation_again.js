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
    if (!key) {
        window.location.href = 'login.html';
        return false;
    }
    var order_id = getQueryString('order_id');

    $.getJSON(MapiUrl + '/index.php?w=member_evaluate&t=again', {key:key, order_id:order_id}, function(result){
        if (result.datas.error) {
            $.sDialog({
                skin:"red",
                content:result.datas.error,
                okBtn:false,
                cancelBtn:false
            });
            return false;
        }
        var html = template.render('member-evaluation-script', result.datas);
        $("#member-evaluation-div").html(html);

        //图片上传
        $('input[name="file"]').on("click",function(){
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
                  api.showProgress({
                    style: 'default',
                    animationType: 'fade',
                    text: '图片上传中...',
                    modal: false
                  });
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
                  api.showProgress({
                    style: 'default',
                    animationType: 'fade',
                    text: '图片上传中...',
                    modal: false
                  })
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
              element.parent().after('<div class="upload-loading"><i></i></div>');
              element.parent().siblings('.pic-thumb').remove();
              api.ajax({
              timeout : 100,
              method : 'post',
              url : MapiUrl + "/index.php?w=sns_album&t=file_upload&client=wap",
              data : {
                    values:{key:key,name:"upfile"},
                     files:{upfile : ret.data},
              },
              dataType : 'json',
              }, function(_ret, _err) {
                api.hideProgress();
                element.parent().siblings('.upload-loading').remove();
                if(_ret.code==200){
                  element.parent().after('<div class="pic-thumb"><img src="'+_ret.datas.file_url+'"/></div>');
                  element.parent().siblings('.upload-loading').remove();
                  element.parents('a').next().val(_ret.datas.file_name);
                }else{
                  api.alert({msg:_ret.message});
                }
              });
            } else {
              api.hideProgress();
              element.parent().siblings('.upload-loading').remove();
              api.alert({msg:err.msg});
            };
        }

        /*$('input[name="file"]').ajaxUploadImage({
            url : MapiUrl + "/index.php?w=sns_album&t=file_upload",
            data:{key:key},
            start :  function(element){
                element.parent().after('<div class="upload-loading"><i></i></div>');
                element.parent().siblings('.pic-thumb').remove();
            },
            success : function(element, result){
                checkLogin(result.login);
                if (result.datas.error) {
                    element.parent().siblings('.upload-loading').remove();
                    $.sDialog({
                        skin:"red",
                        content:'图片尺寸过大！',
                        okBtn:false,
                        cancelBtn:false
                    });
                    return false;
                }
                element.parent().after('<div class="pic-thumb"><img src="'+result.datas.file_url+'"/></div>')
                element.parent().siblings('.upload-loading').remove();
                element.parents('a').next().val(result.datas.file_name);
            }
        });*/

        // 星星选择
        $('.star-level').find('i').click(function(){
            var _index = $(this).index();
            for (var i=0; i<5; i++) {
                var _i = $(this).parent().find('i').eq(i);
                if (i<=_index) {
                    _i.removeClass('star-level-hollow').addClass('star-level-solid');
                } else {
                    _i.removeClass('star-level-solid').addClass('star-level-hollow');
                }
            }
            $(this).parent().next().val(_index + 1);
        });

        $('.btn-l').click(function(){
            var _form_param = $('form').serializeArray();
            var param = {};
            param.key = key;
            param.order_id = order_id;
            for (var i=0; i<_form_param.length; i++) {
                param[_form_param[i].name] = _form_param[i].value;
            }
            $.ajax({//获取区域列表
                type:'post',
                url:MapiUrl+'/index.php?w=member_evaluate&t=save_again',
                data:param,
                dataType:'json',
                async:false,
                success:function(result){
                    checkLogin(result.login);
                    if (result.datas.error) {
                        $.sDialog({
                            skin:"red",
                            content:result.datas.error,
                            okBtn:false,
                            cancelBtn:false
                        });
                        return false;
                    }
                    window.location.href = 'order_list.html';
                }
            });
        });
    });

});
