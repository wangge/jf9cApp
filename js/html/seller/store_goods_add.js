$(function() {
    var a = $api.getStorage("seller_key");
    $.sValid.init({
        rules: {
            g_name: "required",
            g_price: "required",
            g_discount: "required",
            area_info: "required",
            goods_image: "required",
            g_body: "required",
            g_storage: "required",
			goods_image_main: "required",
            image_body_0 : "required",
			g_freight:"required"
        },
        messages: {
            g_name: "请填写商品名字",
            g_price: "请填写商品价",
			g_discount:"请输入折扣",
            area_info: "请选择商品分类",
            goods_image_main: "请至少上传一张商品主图",
            image_body_0 :"第一张商品主图必须上传",
            g_storage: "请填写商品库存",
            g_body: "请填写商品描述",
            g_freight:"输入物流费用"
        },
        callback: function(a, e, r) {
            if (a.length > 0) {
                var i = "";
                $.map(e,
                function(a, e) {
                    i += "<p>" + a + "</p>"
                });
                errorTipsShow(i)
            } else {
                errorTipsHide()
            }
        }
    });
    $("#header-nav").click(function() {
        $(".btn").click()
    });

	$("#g_freight").on("blur",
    function() {

             var catid=$("#area_info").attr("data-cid1");
			 var minvalue=0;
			 //var alertstr="运费至少3元.";
			 var feelvalue=$(this).val();
			 var sourcefee=0;
			 var grapfee=0;

			 //判断物流费数字
			if(!(/^\d+(\.\d+)?$/.test(feelvalue))){
			  alert("运费请输入数字");
			  $(this).val("");
			  $(this).focus();
			  $("#feeinfo").html("");

			}else{
				 if(feelvalue<minvalue){
					  alert('请输入正确物流费用，'+alertstr);
					  $(this).val("");
			  		  $(this).focus();
					  $("#feeinfo").html("");
				 }else{

				   //grapfee= feelvalue.toFixed(2);
				   //$("#feeinfo").html("物流费："+(feelvalue).toFixed(2)+"元，总费用："+grapfee);

				 }
			 }
    });

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
          var seller_key = $api.getStorage("seller_key");
          element.parent().after('<div class="upload-loading"><i></i></div>');
          element.parent().siblings('.pic-thumb').remove();
  				api.ajax({
  				timeout : 100,
  				method : 'post',
  				url : MapiUrl + "/index.php?w=seller_album&t=image_upload&client=wap",
  				data : {
                values:{
                  key:seller_key,name:"upfile"
                },
  				      files:{upfile : ret.data},
  				},
  				dataType : 'json',
  				}, function(_ret, _err) {
  					api.hideProgress();
            element.parent().siblings('.upload-loading').remove();
  					if(_ret.code==200){
              element.parent().after('<div class="pic-thumb"><img src="'+_ret.datas.thumb_name+'"/></div>');
              element.parent().siblings('.upload-loading').remove();
              element.parents('a').next().val(_ret.datas.name);
              element.parents('a').next().attr('data-img',_ret.datas.thumb_name);
  					}else{
  						api.alert({msg:_ret.datas.error});
  					}
  				});
  			} else {
          api.hideProgress();
          element.parent().siblings('.upload-loading').remove();
  				api.alert({msg:err.msg});
  			};
  	}
	    //视频上传
        $("#goods_video_file").change(function () {
            var img = document.getElementById("goods_video_file").files; 
            var fileObj = document.getElementById("goods_video_file").files[0]; 
            var index= fileObj['name'].lastIndexOf(".");
            var tv_id=fileObj['name'].substring(index);
            if(tv_id!=".mp4" && tv_id!=".MP4") {
                 $.sDialog({
                    skin:"red",
                    content:'视频限于mp4格式',
                    okBtn:false,
                    cancelBtn:false
	             });
                 return false
            }
            if (typeof (fileObj) == "undefined" || fileObj.size <= 0) {
                $.sDialog({
                    skin:"red",
                    content:'请选择MP4视频文件',
                    okBtn:false,
                    cancelBtn:false
	           });
                return;
            }
            var formFile = new FormData();
            formFile.append("file", fileObj);
            formFile.append("key", a);
            var data = formFile;
            $(this).parent().after('<div class="upload-loading"><i></i></div>');
            $.ajax({
                type: "post",
                url: MapiUrl + "/index.php?w=seller_album&t=_getGoodsVideo",
                data:data,
                type: "Post",
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                
                success: function(result) {
                    $.sDialog({
                        skin: "red",
                        content: '视频上传完成',
                        okBtn: false,
                        cancelBtn: false
                    });
                        var video = $('<video controls="controls" width="48" height="43" src="' + result.datas.goods_video_url + '">');
                        $('#pic_video').html('').append(video);
    	                $('#pic_video').siblings('.upload-loading').remove();
    	                $('#video_file').val(result.datas.goods_video);
                    
                },error:function(e){
                     alert(JSON.stringify(e));
                }
            })

        });
    $(".btn").click(function() {
        if ($.sValid()) {
			var g_img_1=$("#image_body_0").val();
			var g_img_2=$("#image_body_1").val();
			var g_img_3=$("#image_body_2").val();
			var g_img_4=$("#image_body_3").val();
			var g_img_5=$("#image_body_4").val();
			var imgall="";
			if(g_img_1!="")
				imgall=imgall+g_img_1+",";
			if(g_img_2!="")
				imgall=imgall+g_img_2+",";
			if(g_img_3!="")
				imgall=imgall+g_img_3+",";
			if(g_img_4!="")
				imgall=imgall+g_img_4+",";
			if(g_img_5!="")
				imgall=imgall+g_img_5+",";
			if(imgall!="")
				imgall=imgall.substring(0,imgall.length-1);
			$.sDialog({
				        autoTime:'10000',
                        skin: "red",
                        content: '正在发布商品...',
						okBtn: false,
                        cancelBtn: false
                        });
            var cate_id = $("#area_info").attr("data-cid3");
            if(cate_id ==0){
                cate_id = $("#area_info").attr("data-cid2");
            }

            $.ajax({
                type: "post",
                url: MapiUrl + "/index.php?w=seller_goods&t=goods_add",
                data: {
                    key: a,
                    cate_id: cate_id,
                    cate_name: $("#area_info").attr("data-catname"),
                    g_name: $("#g_name").val(),
          					g_jingle:'',
          					b_id:0,
          					b_name:'',
                    g_price: $("#g_price").val(),
                    g_plusprice: $("#g_plusprice").val(),
                    g_marketprice: $("#g_marketprice").val(),
					          g_costprice: $("#g_price").val(),
                    g_discount: $("#g_discount").val(),
					//image_path:$("#goods_image_main").val(),
					image_all:imgall,
					goods_video: $("#video_file").val(),
                    g_storage: $("#g_storage").val(),
                    g_serial: $("#g_serial").val(),
          					g_alarm:1,
          					g_barcode:'',
          					attr:'',
          					custom:'',
                    g_body: $("#g_body").val(),
                    m_body: $("#g_body").val(),
          					starttime:'2017-03-27',
          					starttime_H:'00',
          					starttime_i:'05',
          					province_id:0,
          					city_id:0,
          					freight:0,
          					transport_title:'',
          					sgcate_id:'',
          					plate_top:0,
          					plate_bottom:0,
          					g_freight:$("#g_freight").val(),
          					g_vat:0,
          					g_state:$('#goodstate input[name="g_state"]:checked').val(),
          					g_commend:1,
          					is_gv:0,
          					g_vlimit:0,
          					g_vinvalidrefund:0,
          					sup_id:0,
          					type_id:0
                },
                dataType: "json",
                success: function(a) {
                    if (a.code==200) {
                        $.sDialog({
                        skin: "red",
                        content: '商品发布成功',
                        okBtn: false,
                        cancelBtn: false
                        });
						            location.href = "store_goods_list.html";
                    } else {
                        $.sDialog({
                        skin: "red",
                        content: a.datas.error,
                        okBtn: false,
                        cancelBtn: false
                        });
                    }
                },error:function(e){
				  // alert(JSON.stringify(e));
				}
            })
        }
    });
	$("#g_marketprice").blur(function(){

     var dis=$(this).val();

	 var gp= $("#g_price").val();

	 if(gp==""){
		 gp=0;
		 $(this).val(0);
	 }

 if(/^[0-9]+.?[0-9]*$/.test(dis)){
	   $("#g_discount").val(Math.round((gp/dis)*100));
	 }else{
	              $.sDialog({
                        skin: "red",
                        content: '请输入数字',
                        okBtn: true,
						okFn:function(){$("#g_marketprice").val("");},
                        cancelBtn: false
                    });
	 }

	});
    $("#area_info").on("click",
    function() {
        $.goodsClassSelected({
            success: function(a) {
                $("#area_info").val(a.area_info).attr({
                    "data-cid1":  a.area_id_1,
                    "data-cid2":  a.area_id_2,
                    "data-cid3":  a.area_id_3,
                    "data-catname": a.area_info
                })
            }
        })
    })
});
