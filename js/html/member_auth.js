$(function () {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return;
    }
    //没有手机验证时提示
    $.ajax({
        type:'get',
         url:MapiUrl+"/index.php?w=member_account&t=get_mobile_info",
        data:{key:key},
        dataType:'json',
        success:function(result){
            checkLogin(result.login);
            if(result.code == 200){
            	if (!result.datas.state) {
                     $.sDialog({
                        skin:"red",
                        okBtn: true,
                        okBtnText: "去验证",
                        content: '先手机验证了，再来申请',
                        "cancelBtn": true,
                        "lock":true,
                        "okFn": function() {
                            location.href = 'member_mobile_bind.html';
                        },
                        "cancelFn": function() {
                           WTCloseWin();
                        }
                    });
                    return false;
            	}

            }
        }
	});
    var _do = getQueryString('do');
    $.getJSON(MapiUrl + '/index.php?w=member_auth&t=auth', {key: key, do: _do}, function (result) {
        checkLogin(result.login);
        if (result.datas.error) {
            $.sDialog({
                skin: "red",
                content: result.datas.error,
                okBtn: true,
                okFn: function () {
                    if (result.redirect) {
                        WTCloseWin();
                    }
                    return false;
                },
                cancelBtn: true,
                cancelFn: function () {
                    if (result.redirect) {
                        WTCloseWin();
                    }
                    return false;
                }
            });
            return false;
        }
/*        if(result.datas.is_auth == 1){
            $('.header-title').hide();
            $('.header-tab').show();
        }*/
        var html = template.render('member-auth-tmpl', result.datas);
        $("#member-auth-div").html(html);

        //验证规则
        $.sValid.init({
            rules: {
				member_truename: "required",
                company_name: "required",
                area_info: "required",
                company_address_detail: "required",
                company_phone: "required",
                company_store_name: "required",
                business_licence_number_elc: "required",
                member_card_front: "required",
                member_card_back: "required"
            },
            messages: {
				member_truename: "个人真实姓名必填！",
                company_name: "公司名称必填！",
                area_info: "公司所在地必填！",
                company_address_detail: "公司详细地址必填！",
                company_phone: "公司电话必填！",
                company_store_name: "店名必填！",
                business_licence_number_elc: "营业执照图片必须！",
                member_card_front: "个人身份证图片正面必须！",
                member_card_back: "个人身份证图片反面必须！"
            },
            callback: function (eId, eMsg, eRules) {
                if (eId.length > 0) {
                    var errorHtml = "";
                    $.map(eMsg, function (idx, item) {
                        errorHtml += "<p>" + idx + "</p>";
                    });
                    errorTipsShow(errorHtml);
                } else {
                    errorTipsHide();
                }
            }
        });
        //提交
        $('.form-btn a').click(function () {
            if ($.sValid()) {
				var member_truename = $('#member_truename').val();
                var company_name = $('#company_name').val();
                var area_id = $('#area_info').attr('data-areaid');
                var city_id = $('#area_info').attr('data-areaid2');
                var company_address = $('#area_info').val();
                var company_address_detail = $('#company_address_detail').val();
                var company_phone = $('#company_phone').val();
                var company_store_name = $('#company_store_name').val();
                var business_licence_number_elc = $('#business_licence_number_elc').val();
                var member_card_front = $('#member_card_front').val();
                var member_card_back = $('#member_card_back').val();

                $.ajax({
                    type: 'post',
                    url: MapiUrl + "/index.php?w=member_auth&t=submit_info",
                    data: {
                        key: key,
						member_truename: member_truename,
                        company_name: company_name,
                        area_id: area_id,
                        city_id: city_id,
                        company_address: company_address,
                        company_address_detail: company_address_detail,
                        company_phone: company_phone,
                        company_store_name: company_store_name,
                        business_licence_number_elc: business_licence_number_elc,
                        member_card_front: member_card_front,
                        member_card_back: member_card_back
                    },
                    dataType: 'json',
                    success: function (result) {
                        checkLogin(result.login);
                        if (result.datas.error) {
                            $.sDialog({
                                skin: "red",
                                content: result.datas.error,
                                okBtn: false,
                                cancelBtn: false
                            });
                            return false;
                        }
                        //window.location.href =  'member_auth.html';
                    }
                });
            }
        });

        // 选择地区
        $('#area_info').on('click', function () {
            $.areaSelected({
                success: function (data) {
                    $('#area_info').val(data.area_info).attr({'data-areaid': data.area_id, 'data-areaid2': (data.area_id_2 == 0 ? data.area_id_1 : data.area_id_2)});
                }
            });
        });


        //图片上传
        $('input[name="file"]').on("click",function(){
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
              url : MapiUrl + MapiUrl + "/index.php?w=member_auth&t=ajax_upload_image&client=wap",
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
    });
});
