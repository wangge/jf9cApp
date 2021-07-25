;(function($){
    var Client = 'wap';
    var _do = getQueryString('do');
    var seller_name = $api.getStorage('seller_name');
    var username = decodeURI($api.getStorage('username'));
    var referurl = document.referrer;
    var key = $api.getStorage('key');
    $("#seller_name").val(username);
    if (!key) {
        window.location.href = '../member/login.html';
        return;
    }
    // 选择地区
    $('#area_info').on('click', function () {
        $.areaSelected({
            success: function (data) {
                $('#area_info').val(data.area_info);
                $('#pro_id').val(data.area_id_1)
                $('#city_id').val(data.area_id_2)
                $('#area_id').val(data.area_id)
            }
        });
    });


    //提交
    $(".submit").click(function(){
        var curr_step = $(this).attr('step');
        if(curr_step==4){
                $.sValid.init({
                rules:{
                    seller_name: "required",
                    store_name: "required",
                    store_class: {
                        required: true,
                        min: 1
                    }
                },
                messages:{
                    seller_name: "商家账号必须填写",
                    store_name: "店铺名称必须填写",
                    store_class: {
                        required: '请选择经营类目',
                        min: '请选择经营类目'
                    },
                },
                callback:function (eId,eMsg,eRules){
                    if(eId.length >0){
                        var errorHtml = "";
                        $.map(eMsg,function (idx,item){
                            errorHtml += "<p>"+idx+"</p>";
                        });
                        errorTipsShow(errorHtml);
                    }else{
                        errorTipsHide();
                    }
                }
            });
        }
        if($.sValid()){
            var step = $(this).attr('step');
            $.ajax({
                url: MapiUrl + "/index.php?w=seller_apply&t=do_apply",
                type: 'POST',
                dataType: 'json',
                data: $("form").serialize() + '&key=' + key + '&step=' + step + '&stype=1&client=' + Client,
                success: function(result){
                    var data = result.datas;
                    if (data.result == 'ok') {
                        var next_step = data.next_step;
                        var cur_step = data.next_step - 1;
                        var html = '<div class="alert-box"><i class="fa fa-check"></i>' + data.next_tips + '</div>';
                        $("li.step-" + cur_step).addClass('active');
                        $("fieldset.step-" + cur_step).hide();
                        $("fieldset.step-" + next_step).html(html);
                        $("fieldset.step-" + next_step).show();
                    }
                    if (result.datas.error) {
                            $.sDialog({
                                skin: "red",
                                content: result.datas.error,
                                okBtn: false,
                                cancelBtn: false
                            });
                            return false;
                        }
                }
            });
            return;
        }
    });

    //动态加载
    $.ajax({
        url: MapiUrl + "/index.php?w=seller_apply&t=do_apply",
        type: 'POST',
        dataType: 'json',
        data: {client: Client, key: key,do:_do},
        success: function(result){
            var data = result.datas;

            if (data.join_state.step == 4) {
                $("#progressbar li").removeClass('active');
                for (var i = 1; i <= 4; i++) {
                    $("#progressbar li.step-" + i).addClass('active');
                    if (i < 4) {
                        $("fieldset.step-" + i).hide();
                    } else {
                        var html = '<div class="alert-box"><i class="fa fa-check"></i>' + data.join_state.msg + '</div>';
                        $("fieldset.step-" + i).html(html);
                        $("fieldset.step-" + i).show();
                    }
                };
                return;
            }

            if (data.join_state.step == 5) {

                Zepto.sValid.init({
                    rules: {
                        paying_money_certificate_val: "required"
                    },
                    messages: {
                        paying_money_certificate_val: "请上传付款凭证"
                    },
                    callback:function (eId,eMsg,eRules){
                        if(eId.length >0){
                            var errorHtml = "";
                            Zepto.map(eMsg,function (idx,item){
                                errorHtml += "<p>"+idx+"</p>";
                            });
                            errorTipsShow(errorHtml);
                        }else{
                            errorTipsHide();
                        }
                    }
                });

                $("#progressbar li").removeClass('active');
                for (var i = 1; i <= data.join_state.step; i++) {
                    $("#progressbar li.step-" + i).addClass('active');
                    if (i < data.join_state.step) {
                        $("fieldset.step-" + i).hide();
                    } else {
                        $("fieldset.step-" + i).find('.fs-subtitle').html(data.join_state.msg);
                        $("fieldset.step-" + i).show();
                    }
                };
                return;
            }

            if (data.join_state.step == 6) {
                $("#progressbar li").removeClass('active');
                for (var i = 1; i <= data.join_state.step; i++) {
                    $("#progressbar li.step-" + i).addClass('active');
                    if (i < data.join_state.step) {
                        $("fieldset.step-" + i).hide();
                    } else {
                        $("#progressbar li.step-" + i).removeClass('active');
                        var html = '<div class="alert-box"><i class="fa fa-check"></i>' + data.join_state.msg + '</div>';
                         if (data.join_state.do == 0) {
                            html +='<a id="reapply_btn" href="do-applyc.html?do=reapply" class="btn">重新申请</a>';
                         }
                        $("fieldset.step-" + i).html(html);
                        $("fieldset.step-" + i).show();
                    }
                };
                return;
            }

            if (data.join_state.step == 100) {
                $.sDialog({
                    skin:"block",
                    content:'已成功入驻，新入驻请重新登录',
                    okBtn:false,
                    cancelBtn:false
                });
                $api.setStorage('wxout', '1');
                $api.rmStorage('username');
                $api.rmStorage('key');
                localStorage.removeItem('cart_count');
                $api.rmStorage("seller_name");
                $api.rmStorage("store_name");
                $api.rmStorage("seller_key");
                $api.rmStorage("is_seller");
                setTimeout("location.href = '../member/login.html'",2000);
            }
            var sg_html = template.render('sg_html', data);
            var sc_html = template.render('sc_html', data);

            $(".apply-document").html(data.agreement);
            $("#sg_id").html(sg_html);
            $("#sc_id").html(sc_html);
        },
        error: function(){

        }
    });

    //步骤
    var current_fs, next_fs, previous_fs; //fieldsets
    var animating; //flag to prevent quick multi-click glitches
    $(".next").click(function(){
        var curr_step = $(this).attr('step');

        if(curr_step==2){
            $.sValid.init({
                rules:{
                    //company_name: "required",
                    area_info: "required",
                    company_address_detail: "required",
                    contacts_name: "required",
                    contacts_phone:{
                        required:true,
                        mobile:true
                    },
                    contacts_email:{
                        email:true
                    },

                    organization_code_electronic: "required",
                    general_taxpayer: "required",
                    business_licence_number_elc: "required"
                },
                messages:{
                    //company_name: "姓名必填!",
                    area_info: "请填写所在地",
                    company_address_detail: "请填写详细地址",
                    //company_phone: "公司电话必填！",
                    contacts_name: "请填写姓名",
                    contacts_phone:{
                        required:"请填写手机号码",
                        mobile:"请正确输入手机号码"
                    },
                    contacts_email:{
                        email:"请正确输入邮件"
                    },
                    organization_code_electronic: "请上传身份证正面图片",
                    general_taxpayer: "请上传身份证反面图片",
                    business_licence_number_elc: "请上传手执身份证图片"
                },
                callback:function (eId,eMsg,eRules){
                    if(eId.length >0){
                        var errorHtml = "";
                        $.map(eMsg,function (idx,item){
                            errorHtml += "<p>"+idx+"</p>";
                        });
                        errorTipsShow(errorHtml);
                    }else{
                        errorTipsHide();
                    }
                }
            });
           if(!$.sValid()){
                return false;
           }
        }
         /*if(curr_step==3){
            $.sValid.init({
                rules:{
                    bank_account_name: "required"
                    //store_name: "required"
                },
                messages:{
                    bank_account_name: "公司名必须填写!"
                    //store_name: "店铺名称必须填写!"
                },
                callback:function (eId,eMsg,eRules){
                    if(eId.length >0){
                        var errorHtml = "";
                        $.map(eMsg,function (idx,item){
                            errorHtml += "<p>"+idx+"</p>";
                        });
                        errorTipsShow(errorHtml);
                    }else{
                        errorTipsHide();
                    }
                }
            });
           if(!$.sValid()){
                return false;
           }
        }*/

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        $("fieldset").hide();
        //show the next fieldset
        next_fs.show();
    });

    $(".previous").click(function(){

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        $("fieldset").hide();
        //show the previous fieldset
        previous_fs.show();
    });

    $(".submit").click(function(){
        return false;
    });

		//身份证正面扫描件上传
    $('input[name="organization_code_electronic_file"]').on("click",function(){
      //权限判断处理
      confirmPermission('storage,camera,photos',{
        callback:function(){
            //console.log('storage本地存储权限已获取!');
        }
    });
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
							_organization_code_electronic_file(ret, err);


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
							_organization_code_electronic_file(ret, err);
						});
					}else{
						return;
					}
				}
			});

		});

    //上传身份正
  	function _organization_code_electronic_file(ret,err){
  		//获取图片
  			if (ret) {
  				api.ajax({
  				timeout : 100,
  				method : 'post',
  				url : MapiUrl + "/index.php?w=seller_apply&t=ajax_upload_image&client=wap",
  				data : {
  				files:{upfile : ret.data},
  				},
  				dataType : 'json',
  				}, function(_ret, _err) {
  					api.hideProgress();
  					if(_ret.state){
              $('input[name="organization_code_electronic_file"]').after('<div class="input input-thumb input-pay-thumb"><img height="60" src="'+_ret.pic_url+'"></div>');
  						$('input[name="organization_code_electronic"]').val(_ret.pic_name);

  					}else{
  						api.alert({msg:_ret.message});
  					}
  				});
  			} else {
  				api.alert({msg:err.msg});
  			};
  	}

//身份证反面扫描件上传
$('input[name="general_taxpayer_file"]').on("click",function(){
  //权限判断处理
  confirmPermission('storage,camera,photos',{
    callback:function(){
        //console.log('storage本地存储权限已获取!');
    }
});
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
          _general_taxpayer_file(ret, err);


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
          _general_taxpayer_file(ret, err);
        });
      }else{
        return;
      }
    }
  });

});

//上传身份正
function _general_taxpayer_file(ret,err){
  //获取图片
    if (ret) {
      api.ajax({
      timeout : 100,
      method : 'post',
      url : MapiUrl + "/index.php?w=seller_apply&t=ajax_upload_image&client=wap",
      data : {
      files:{upfile : ret.data},
      },
      dataType : 'json',
      }, function(_ret, _err) {
        api.hideProgress();
        if(_ret.state){
          $('input[name="general_taxpayer_file"]').after('<div class="input input-thumb input-pay-thumb"><img height="60" src="'+_ret.pic_url+'"></div>');
          $('input[name="general_taxpayer"]').val(_ret.pic_name);

        }else{
          api.alert({msg:_ret.message});
        }
      });
    } else {
      api.alert({msg:err.msg});
    };
}

//手持身份证图片上传
$('input[name="business_licence_number_elc_file"]').on("click",function(){
  //权限判断处理
  confirmPermission('storage,camera,photos',{
    callback:function(){
        //console.log('storage本地存储权限已获取!');
    }
});
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
          _business_licence_number_elc_file(ret, err);


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
          _business_licence_number_elc_file(ret, err);
        });
      }else{
        return;
      }
    }
  });

});

//手持
function _business_licence_number_elc_file(ret,err){
  //获取图片
    if (ret) {
      api.ajax({
      timeout : 100,
      method : 'post',
      url : MapiUrl + "/index.php?w=seller_apply&t=ajax_upload_image&client=wap",
      data : {
      files:{upfile : ret.data},
      },
      dataType : 'json',
      }, function(_ret, _err) {
        api.hideProgress();
        if(_ret.state){
          $('input[name="business_licence_number_elc_file"]').after('<div class="input input-thumb input-pay-thumb"><img height="60" src="'+_ret.pic_url+'"></div>');
          $('input[name="business_licence_number_elc"]').val(_ret.pic_name);

        }else{
          api.alert({msg:_ret.message});
        }
      });
    } else {
      api.alert({msg:err.msg});
    };
}

//图片资料上传
$('input[name="paying_money_certificate"]').on("click",function(){
  //权限判断处理
  confirmPermission('storage,camera,photos',{
    callback:function(){
        //console.log('storage本地存储权限已获取!');
    }
});
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
          _paying_money_certificate(ret, err);


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
          _paying_money_certificate(ret, err);
        });
      }else{
        return;
      }
    }
  });

});

//图片资料
function _paying_money_certificate(ret,err){
  //获取图片
    if (ret) {
      api.ajax({
      timeout : 100,
      method : 'post',
      url : MapiUrl + "/index.php?w=seller_apply&t=ajax_upload_image&client=wap",
      data : {
      files:{upfile : ret.data},
      },
      dataType : 'json',
      }, function(_ret, _err) {
        api.hideProgress();
        if(_ret.state){
          $('input[name="paying_money_certificate"]').after('<div class="input input-thumb input-pay-thumb"><img height="60" src="'+_ret.pic_url+'"></div>');
          $('input[name="paying_money_certificate_val"]').val(_ret.pic_name);

        }else{
          api.alert({msg:_ret.message});
        }
      });
    } else {
      api.alert({msg:err.msg});
    };
}

    $('#btn_select_category').on('click', function() {

        $(".gc-wrap-pre").remove();
        $.ajax({
            url: MapiUrl + "/index.php?w=seller_apply&t=get_goods_category",
            type: 'POST',
            dataType: 'json',
            data: {client: Client},
            success: function(result){
                var data = result.datas;
                var html = template.render('gc_html', data);
                $('#btn_select_category').after('<div class="gc-wrap gc-wrap-pre"><select class="input input-select gc-select col-3">' + html + '</select></div>');
            },
            error: function(){

            }
        });
    });

    $("#msform").delegate('.gc-select', 'change', function(event) {
        var index_id = $(this).index();
        var gc_id = $(this).val();
        var cur_select = $('.gc-select').eq(index_id);
        if (index_id == 2) {
            var gc_id_arr = new Array();
            var gc_name_arr = new Array();
            var html = '';
            for (var i = 0; i <= index_id; i++) {
                if (i == 2) {
                    html += '<span>' + $(".gc-select").eq(i).find("option:checked").text() + ' (分佣' + $(".gc-select").eq(i).find("option:checked").attr('data-commis-rate') + '%)</span>';
                } else {
                    html += '<span>' + $(".gc-select").eq(i).find("option:checked").text() + '</span>';
                }
                gc_id_arr.push($(".gc-select").eq(i).val());
                gc_name_arr.push($(".gc-select").eq(i).find("option:checked").text());
            };
            html += '<span class="handle"><em wttype="btn_drop_category" data="' + gc_id_arr.join(",") + '">删除</em></span>';
            $(".gc-result dl").append('<dd>' + html + '</dd><input type="hidden" name="store_class_ids[]" value="' + gc_id_arr.join(",") + '" /><input type="hidden" name="store_class_names[]" value="' + gc_name_arr.join(",") + '" />');
            select_store_class_count();
            $(".gc-wrap-pre").remove();
            return;
        } else {
            $.ajax({
                url: MapiUrl + "/index.php?w=seller_apply&t=get_goods_category",
                type: 'POST',
                dataType: 'json',
                data: {client: Client, 'gc_id': gc_id},
                success: function(result){
                    var data = result.datas;
                    var html = template.render('gc_html', data);
                    if(index_id==0){
                        $('.cl1').remove();
                        $('.cl2').remove();
                    }
                    if(index_id==1){
                        $('.cl2').remove();
                    }
                    cur_select.after('<select class="input input-select gc-select col-3 cl'+(index_id+1)+'">' + html + '</select>');


                    if(data.gc_list==false || data.gc_list.length==0){
                         var gc_id_arr = new Array();
                        var gc_name_arr = new Array();
                        var html = '';
                        for (var i = 0; i <= index_id; i++) {
                            if (i == 1) {
                                html += '<span>' + $(".gc-select").eq(i).find("option:checked").text() + ' (分佣' + $(".gc-select").eq(i).find("option:checked").attr('data-commis-rate') + '%)</span>';
                            } else {
                                html += '<span>' + $(".gc-select").eq(i).find("option:checked").text() + '</span>';
                            }
                            gc_id_arr.push($(".gc-select").eq(i).val());
                            gc_name_arr.push($(".gc-select").eq(i).find("option:checked").text());
                        };
                        html += '<span>无</span><span class="handle"><em wttype="btn_drop_category" data="' + gc_id_arr.join(",") + '">删除</em></span>';
                        $(".gc-result dl").append('<dd>' + html + '</dd><input type="hidden" name="store_class_ids[]" value="' + gc_id_arr.join(",") + '" /><input type="hidden" name="store_class_names[]" value="' + gc_name_arr.join(",") + '" />');
                        select_store_class_count();
                        $(".gc-wrap-pre").remove();
                    }

                },
                error: function(){

                }
            });
        }
    });

    $('.gc-result').on('click', '[wttype="btn_drop_category"]', function() {
       $(this).parent().parent("dd").remove();
        select_store_class_count();
    });
    // 统计已经选择的经营类目
    function select_store_class_count() {
        var store_class_count = $('.gc-result').find('dd').length;
            $('#store_class').val(store_class_count);
    }
})(Zepto)
