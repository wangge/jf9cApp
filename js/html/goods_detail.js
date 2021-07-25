var goods_id = getQueryString("goods_id");
var map_list = [];
var map_index_id = '';
var store_id;

$(function (){
    var key = $api.getStorage('key');
	$api.setStorage('redirect_uri','/html/goods_detail.html?goods_id='+goods_id);
    var unixTimeToDateString = function(ts, ex) {
        ts = parseFloat(ts) || 0;
        if (ts < 1) {
            return '';
        }
        var d = new Date();
        d.setTime(ts * 1e3);
        var s = '' + d.getFullYear() + '-' + (1 + d.getMonth()) + '-' + d.getDate();
        if (ex) {
            s += ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        }
        return s;
    };

    var buyLimitation = function(a, b) {
        a = parseInt(a) || 0;
        b = parseInt(b) || 0;
        var r = 0;
        if (a > 0) {
            r = a;
        }
        if (b > 0 && r > 0 && b < r) {
            r = b;
        }
        return r;
    };

    template.helper('isEmpty', function(o) {
        for (var i in o) {
            return false;
        }
        return true;
    });


    get_detail(goods_id);
  //点击商品规格，获取新的商品
  function arrowClick(self,myData){
    $(self).addClass("current").siblings().removeClass("current");
    //拼接属性
    var curEle = $(".spec").find("a.current");
    var curSpec = [];
    $.each(curEle,function (i,v){
        // convert to int type then sort
        curSpec.push(parseInt($(v).attr("specs_value_id")) || 0);
    });
    var spec_string = curSpec.sort(function(a, b) { return a - b; }).join("|");
    //获取商品ID
    goods_id = myData.spec_list[spec_string];
    get_detail(goods_id);
  }

  function contains(arr, str) {//检测goods_id是否存入
	    var i = arr.length;
	    while (i--) {
           if (arr[i] === str) {
	           return true;
           }
	    }
	    return false;
	}
  $.sValid.init({
        rules:{
            buynum:"digits"
        },
        messages:{
            buynum:"请输入正确的数字"
        },
        callback:function (eId,eMsg,eRules){
            if(eId.length >0){
                var errorHtml = "";
                $.map(eMsg,function (idx,item){
                    errorHtml += "<p>"+idx+"</p>";
                });
                $.sDialog({
                    skin:"red",
                    content:errorHtml,
                    okBtn:false,
                    cancelBtn:false
                });
            }
        }
    });
  //检测商品数目是否为正整数
  function buyNumer(){
    $.sValid();
  }

  function get_detail(goods_id) {
      //渲染页面
      $.ajax({
         url:MapiUrl+"/index.php?w=goods&t=goods_detail",
         type:"get",
         data:{goods_id:goods_id,key:key},
         dataType:"json",
         success:function(result){
            var data = result.datas;
            if(!data.error){
              //商品图片格式化数据
              if(data.goods_image){
                var goods_image = data.goods_image.split(",");
                data.goods_image = goods_image;
              }else{
                 data.goods_image = [];
              }
              //商品规格格式化数据
              if(data.goods_content.spec_name){
                var goods_map_spec = $.map(data.goods_content.spec_name,function (v,i){
                  var goods_specs = {};
                  goods_specs["goods_spec_id"] = i;
                  goods_specs['goods_spec_name']=v;
                  if(data.goods_content.spec_value){
                      $.map(data.goods_content.spec_value,function(vv,vi){
                          if(i == vi){
                            goods_specs['goods_spec_value'] = $.map(vv,function (vvv,vvi){
                              var specs_value = {};
                              specs_value["specs_value_id"] = vvi;
                              specs_value["specs_value_name"] = vvv;
                              return specs_value;
                            });
                          }
                        });
                        return goods_specs;
                  }else{
                      data.goods_content.spec_value = [];
                  }
                });
                data.goods_map_spec = goods_map_spec;
              }else {
                data.goods_map_spec = [];
              }

              // 电子券商品限购时间和数量
              if (data.goods_content.is_virtual == '1') {
                  data.goods_content.virtual_indate_str = unixTimeToDateString(data.goods_content.virtual_indate, true);
                  data.goods_content.buyLimitation = buyLimitation(data.goods_content.virtual_limit, data.goods_content.upper_limit);
              }

              // 预售发货时间
              if (data.goods_content.is_presell == '1') {
                  data.goods_content.presell_deliverdate_str = unixTimeToDateString(data.goods_content.presell_deliverdate);
              }

              //渲染模板
              var html = template.render('goods_detail', data);
              $("#goods_detail_html").html(html);

              if (data.goods_content.is_virtual == '0') {
            	  $('.goods-detail-o2o').remove();
              }

              //渲染模板
              var html = template.render('goods_detail_sepc', data);
              $("#goods_detail_spec_html").html(html);
                    if (data.goods_content.pingou_sale == '1') {
                        var log_id = getQueryString("log_id");
                        if (log_id) $(".cart_pingou_sale").html('参团');
                    }

              //渲染模板
              var html = template.render('voucher_script', data);
              $("#voucher_html").html(html);
	      var html = template.render('product_title', data);
	      $("head").append(html);
              if (data.goods_content.is_virtual == '1') {
            	  store_id = data.store_info.store_id;
            	  virtual();
              }
                    if (data.goods_content.pingou_sale == '1') {
                        takeCount();
              }

              // 购物车中商品数量
              if (localStorage.getItem('cart_count')) {
                  if (localStorage.getItem('cart_count') > 0) {
                      $('#cart_count,#cart_count1').html('<sup>'+localStorage.getItem('cart_count')+'</sup>');
                  }
              }

              //图片轮播
        var swiper = new Swiper('.q_banner .swiper-container', {
            passiveListeners : false,
            pagination: {
                el: '.swiper-container .swiper-pagination',
            },
            paginationClickable: true,

        });

$('.q_banner .swiper-slide').each(function(index){
        $(this).click(function(){
            $('#goods_detail_html').addClass("img-position2").removeClass("img-position1");
            $('.mask').show();
            var thisIndex = index;
            $('.wrap_big').show();
            $('.big-closs').show();
            var pic = $(".wrap_big .swiper-zoom-container .big_url");
            for(i=0;pic.length>i;i++){
                p_img = pic[i].src;
                p = p_img.lastIndexOf('.')+1;
                img_type = p_img.substring(p);
                picimg = p_img.replace('_360.','_1280.');
                 pic[i].src=picimg;
            }
            $('html,body').css('overflow','hidden');
            var swiper = new Swiper('.wrap_big .swiper-container_big', {
                passiveListeners : false,
                 pagination: {
                el: '.swiper-container_big .swiper-pagination',
            },
                paginationClickable: true,
                initialSlide:thisIndex,
                zoom : {
                    toggle: false,
                }
            });
        });
    });

    $('.big-closs').click(function(){
            $('#goods_detail_html').addClass("img-position1").removeClass("img-position2");
            $('html,body').css('overflow','auto');
            $(this).hide();
            $('.mask').hide();
            $('.wrap_big').hide();
    });
    $('.mask').each(function(index){
        $(this).click(function(){
            $('html,body').css('overflow','auto');
            $(this).hide();
            $('.big-closs').hide();
            $('.wrap_big').hide();
            $('#goods_detail_html').addClass("img-position1").removeClass("img-position2");

        });
    });
    $("#rule_link").click(function(){
            var con = $("#rule_info").html();
				$.sDialog({
					content: con,
					"width": 100,
					"height": 100,
					"cancelBtn": false,
					"lock": true
				});
        	});


              //商品描述
              $(".pddcp-arrow").click(function (){
                $(this).parents(".pddcp-one-wp").toggleClass("current");
              });
              //规格属性
              var myData = {};
              myData["spec_list"] = data.spec_list;
              $(".spec a").click(function (){
                var self = this;
                arrowClick(self,myData);
              });
              //购买数量，减
              $(".minus").click(function (){
                 var buynum = $(".buy-num").val();
                 if(buynum >1){
                    $(".buy-num").val(parseInt(buynum-1));
                 }
              });
              //购买数量加
              $(".add").click(function (){
                 var buynum = parseInt($(".buy-num").val());
                 if(buynum < data.goods_content.goods_storage){
                    $(".buy-num").val(parseInt(buynum+1));
                 }
              });
              // 一个F码限制只能购买一件商品 所以限制数量为1
              if (data.goods_content.is_fcode == '1') {
                  $('.minus').hide();
                  $('.add').hide();
                  $(".buy-num").attr('readOnly', true);
              }
              //收藏
              $(".pd-collect").click(function (){
                  if ($(this).hasClass('favorate')) {
                      if (dropFavoriteGoods(goods_id)) $(this).removeClass('favorate');
                  } else {
                      if (favoriteGoods(goods_id)) $(this).addClass('favorate');
                  }
              });
  $("#share_link").click(function(){
	//分享弹出框
  var dialogBox = api.require('dialogBox');
  confirmPermission('storage',{
    callback:function(){
      //  console.log('storage本地存储权限已获取!');
    }
  })
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


              //加入购物车
              $("#add-cart").click(function (){
                var key = $api.getStorage('key');//登录标记
                var quantity = parseInt($(".buy-num").val());
						var lowest = parseInt($(".lowestnum").val());
							if(quantity<lowest)
							{
                                $.sDialog({
                                    skin: "red",
                                    content: "购买数量低于起批数量",
                                    okBtn: false,
                                    cancelBtn: false
                                });
								return false;
							}
                 if(!key){
                     var goods_content = decodeURIComponent(localStorage.getItem('goods_cart'));
                     if (goods_content == null) {
                         goods_content = '';
                     }
                     if(goods_id<1){
                         show_tip();
                         return false;
                     }
                     var cart_count = 0;
                     if(!goods_content){
                         goods_content = goods_id+','+quantity;
                         cart_count = 1;
                     }else{
                         var goodsarr = goods_content.split('|');
                         for (var i=0; i<goodsarr.length; i++) {
                             var arr = goodsarr[i].split(',');
                             if(contains(arr,goods_id)){
                                 show_tip();
                                 return false;
                             }
                         }
                         goods_content+='|'+goods_id+','+quantity;
                         cart_count = goodsarr.length;
                     }
                     // 加入cookie
					 localStorage.setItem("goods_cart", goods_content);
                     // 更新cookie中商品数量
					 localStorage.setItem("cart_count", cart_count);
                     show_tip();
                     getCartCount();
                     $('#cart_count,#cart_count1').html('<sup>'+cart_count+'</sup>');
                     return false;
                 }else{
                    $.ajax({
                       url:MapiUrl+"/index.php?w=member_cart&t=cart_add",
                       data:{key:key,goods_id:goods_id,quantity:quantity},
                       type:"post",
                       success:function (result){
                          var rData = $.parseJSON(result);
                          if(checkLogin(rData.login)){
                            if(!rData.datas.error){
                                show_tip();
                                // 更新购物车中商品数量
                                localStorage.removeItem("cart_count");
                                getCartCount();
                                $('#cart_count,#cart_count1').html('<sup>'+localStorage.getItem('cart_count')+'</sup>');
                            }else{
                              $.sDialog({
                                skin:"red",
                                content:rData.datas.error,
                                okBtn:false,
                                cancelBtn:false
                              });
                            }
                          }
                       }
                    })
                 }
              });

              //立即购买
              if (data.goods_content.is_virtual == '1') {
                  $("#buy-now").click(function() {
                      var key = $api.getStorage('key');//登录标记
                      if (!key) {
                        window.location.href = 'member/login.html';
                        return false;
                      }

                      var buynum = parseInt($('.buy-num').val()) || 0;

                      if (buynum < 1) {
                            $.sDialog({
                                skin:"red",
                                content:'参数错误！',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
                      if (buynum > data.goods_content.goods_storage) {
                            $.sDialog({
                                skin:"red",
                                content:'库存不足！',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }

                      // 电子券商品限购数量
                      if (data.goods_content.buyLimitation > 0 && buynum > data.goods_content.buyLimitation) {
                            $.sDialog({
                                skin:"red",
                                content:'超过限购数量！',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }

                      var json = {};
                      json.key = key;
                      json.cart_id = goods_id;
                      json.quantity = buynum;
                      $.ajax({
                          type:'post',
                          url:MapiUrl+'/index.php?w=member_vr_buy&t=buy_step1',
                          data:json,
                          dataType:'json',
                          success:function(result){
                              if (result.datas.error) {
                                  $.sDialog({
                                      skin:"red",
                                      content:result.datas.error,
                                      okBtn:false,
                                      cancelBtn:false
                                  });
                              } else {
                                  location.href = 'order/vr_buy.html?goods_id='+goods_id+'&quantity='+buynum;
                              }
                          }
                      });
                  });
              } else {
                        var buy_pingou = 0;
                        var log_id = getQueryString("log_id");
                        var buyer_id = getQueryString("buyer_id");
                        function cart_buy() {
                     var key = $api.getStorage('key');//登录标记
                     if(!key){
                        window.location.href = 'member/login.html';
						return false;
                     }else{
                         var buynum = parseInt($('.buy-num').val()) || 0;

                      if (buynum < 1) {
                            $.sDialog({
                                skin:"red",
                                content:'参数错误！',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
                      if (buynum > data.goods_content.goods_storage) {
                            $.sDialog({
                                skin:"red",
                                content:'库存不足！',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
						 // 拼团商品限购数量
                      if (buy_pingou == 1 &&data.goods_content.goods_maxnum > 0 && buynum > data.goods_content.goods_maxnum) {
                            $.sDialog({
                                skin:"red",
                                content:'购买数量不能超过'+data.goods_content.goods_maxnum,
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }

                        var json = {};
                        json.key = key;
                        json.cart_id = goods_id+'|'+buynum;
                        $.ajax({
                            type:'post',
                            url:MapiUrl+'/index.php?w=member_buy&t=buy_step1',
                            data:json,
                            dataType:'json',
                            success:function(result){
                                if (result.datas.error) {
                                    $.sDialog({
                                        skin:"red",
                                        content:result.datas.error,
                                        okBtn:false,
                                        cancelBtn:false
                                    });
                                }else{
                                            var u = 'order/buy.html?goods_id=' + goods_id + '&buynum=' + buynum;
                                            if (buy_pingou) u += '&pingou=1&log_id=' + log_id + '&buyer_id=' + buyer_id;
                                            location.href = u;
                                        }
                                    }
                                });
                            }
                        }
                        $("#buy-now").click(function () {cart_buy();});
                        if (data.goods_content.pingou_sale == '1') {
                            $(".pingou_sale .invite-btn").click(function () {cart_buy();});
                            $(".pingou_sale .order-btn").click(function () {
                                buy_pingou = 1;
                                cart_buy();
                            });
                        }
              }

            }else {

              $.sDialog({
                  content: data.error,
                  okBtn:false,
                  cancelBtnText:'返回',
                  cancelFn: function() { history.back(); }
              });
            }

            //验证购买数量是不是数字
            $("#buynum").blur(buyNumer);


            // 从下到上动态显示隐藏内容
            $.animationUp({
                valve : '.animation-up,#goods_spec_selected',          // 动作触发
                wrapper : '#goods_detail_spec_html',    // 动作块
                scroll : '#product_roll',     // 滚动块，为空不触发滚动
                start : function(){       // 开始动作触发事件
                    $('.goods-detail-foot').addClass('hide').removeClass('block');
                },
                close : function(){        // 关闭动作触发事件
                    $('.goods-detail-foot').removeClass('hide').addClass('block');
                }
            });

            $.animationUp({
                valve : '#getVoucher',          // 动作触发
                wrapper : '#voucher_html',    // 动作块
                scroll : '#voucher_roll',     // 滚动块，为空不触发滚动
            });

            $('#voucher_html').on('click', '.btn', function(){
                getFreeVoucher($(this).attr('data-tid'));
            });

            // 联系客服
            $('.kefu').click(function(){
	    // $(this).attr('href','tel:' + data.store_info.store_phone);
				if (data.store_info.node_chat) {
					 window.location.href = 'member/im.html?goods_id=' + goods_id + '&t_id=' + result.datas.store_info.member_id;
				}else{
				$(this).attr('href','tel:' + data.store_info.store_phone);
                	//window.location.href = "http://wpa.qq.com/msgrd?v=3&uin=" + result.datas.store_info.store_qq + "&site=qq&menu=yes";
            	}




            })
         }
      });
  }

  $.scrollTransparent();
  $('#goods_detail_html').on('click', '#get_area_selected', function(){
      $.areaSelected({
          success : function(data){
              $('#get_area_selected_name').html(data.area_info);
              //更改为支持区县下 var area_id = data.area_id_2 == 0 ? data.area_id_1:data.area_id_2;
              var area_id = data.area_id_3 == 0 ? data.area_id_1:data.area_id_3;
              $.getJSON(MapiUrl + '/index.php?w=goods&t=calc', {goods_id:goods_id,area_id:area_id},function(result){
                  $('#get_area_selected_whether').html(result.datas.if_store_cn);
                  $('#get_area_selected_content').html(result.datas.content);
                  if (!result.datas.if_store) {
                      $('.buy-handle').addClass('no-buy');
                      $('.buy-hide').show();
                      $('.buy-show').hide();
                  } else {
                      $('.buy-handle').removeClass('no-buy');
                      $('.buy-hide').hide();
                      $('.buy-show').show();
                  }
              });
          }
      });
  });

  $('body').on('click', '#goodsDetail', function(){
      $(this).parent().addClass("cur").siblings().removeClass("cur");
        $("html,body").scrollTo({toT:0})
  });
  $('body').on('click', '#goodsBody', function(){
      window.location.href = 'goods_info.html?goods_id=' + goods_id;
  });
  $('body').on('click', '#goodsEvaluation,#goodsEvaluation1', function(){
      window.location.href = 'goods_eval.html?goods_id=' + goods_id;
  });

  $('#list-address-scroll').on('click','dl > a',map);
  $('#map_all').on('click',map);
    $(window).scroll(function() {
      /*  if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            goods_body();
        }*/
        api.addEventListener({
        　　name:'scrolltobottom',
            extra:{threshold:0}
        }, function(ret, err){
　　　　　　//上拉加载时需要加载的数据
          goods_body();
       });
    });
    $(window).scroll(function(){
        if ($(window).scrollTop() <= $('#header-box').height()) {
            $('.header-nav li').removeClass("cur").eq(0).addClass("cur");
        }
    });

});

function goods_body() {
$(".goods-detail-bottom").html("");
$('.header-nav li').removeClass("cur").eq(1).addClass("cur");
var html = '<div class="goods-detail-info">'
		+'<div class="title"><a href="javascript:void(0);">商品详情</a></div></div>';
    $.ajax({
        url: MapiUrl + "/index.php?w=goods&t=goods_body",
        data: {goods_id: goods_id},
        type: "get",
        success: function(result) {
            $(".body-info").html(html+result);
        }
    });
}

function show_tip() {
    var flyer = $('.goods-pic > img').clone().css({'z-index':'999','height':'3rem','width':'3rem'});
    flyer.fly({
        start: {
            left: $('.goods-pic > img').offset().left,
            top: $('.goods-pic > img').offset().top-$(window).scrollTop()
        },
        end: {
            left: $("#cart_count1").offset().left+40,
            top: $("#cart_count1").offset().top-$(window).scrollTop(),
            width: 0,
            height: 0
        },
        onEnd: function(){
            flyer.remove();
        }
    });
}

function virtual() {
	$('#get_area_selected').parents('.goods-detail-item').remove();
    $.getJSON(MapiUrl + '/index.php?w=goods&t=store_o2o_addr', {store_id:store_id},function(result){
    	if (!result.datas.error) {
    		if (result.datas.addr_list.length > 0) {
    	    	$('#list-address-ul').html(template.render('list-address-script',result.datas));
    	    	map_list = result.datas.addr_list;
    	    	var _html = '';
    	    	_html += '<dl index_id="0">';
    	    	_html += '<dt>'+ map_list[0].name_info +'</dt>';
    	    	_html += '<dd>'+ map_list[0].address_info +'</dd>';
    	    	_html += '</dl>';
    	    	_html += '<p><a href="tel:'+ map_list[0].phone_info +'"></a></p>';
    	    	$('#goods-detail-o2o').html(_html);

    	    	$('#goods-detail-o2o').on('click','dl',map);

    	    	if (map_list.length > 1) {
    	    		$('#store_addr_list').html('查看全部'+map_list.length+'家分店地址');
    	    	} else {
    	    		$('#store_addr_list').html('查看商家地址');
    	    	}
    	    	$('#map_all > em').html(map_list.length);
    		} else {
    			$('.goods-detail-o2o').hide();
    		}
    	}
    });
    $.animationLeft({
        valve : '#store_addr_list',
        wrapper : '#list-address-wrapper',
        scroll : '#list-address-scroll'
    });
}

function map() {
	  $('#map-wrappers').removeClass('hide').removeClass('right').addClass('left');
	  $('#map-wrappers').on('click', '.header-l > a', function(){
		  $('#map-wrappers').addClass('right').removeClass('left');
	  });
	  $('#baidu_map').css('width', document.body.clientWidth);
	  $('#baidu_map').css('height', document.body.clientHeight);
	  map_index_id = $(this).attr('index_id');
	  if (typeof map_index_id != 'string'){
		  map_index_id = '';
	  }
	  if (typeof(map_js_flag) == 'undefined') {
	      $.ajax({
	          url: '../map.js',
	          dataType: "script",
	          async: false
	      });
	  }
	if (typeof BMap == 'object') {
	    baidu_init();
	} else {
	    load_script();
	}
}
function talert(){
  alert("分享成功");
  var key2 = $api.getStorage('key');
  $.ajax({
    url: MapiUrl + "/index.php?w=sharepoint&gid="+goods_id,
    type: 'get',
    data:{key:key2},
    dataType: 'json',
    success: function(result) {
     }
  });
}
function takeCount() {
	setTimeout("takeCount()", 1000);
	$(".time-remain").each(function(){
		var obj = $(this);
		var tms = obj.attr("count_down");
		if (tms>0) {
			tms = parseInt(tms)-1;
			var days = Math.floor(tms / (1 * 60 * 60 * 24));
			var hours = Math.floor(tms / (1 * 60 * 60)) % 24;
			var minutes = Math.floor(tms / (1 * 60)) % 60;
			var seconds = Math.floor(tms / 1) % 60;

			if (days < 0) days = 0;
			if (hours < 0) hours = 0;
			if (minutes < 0) minutes = 0;
			if (seconds < 0) seconds = 0;
			if(days>9){
			  obj.find("[time_id='d']").html('9+');
			}else{
			 obj.find("[time_id='d']").html(days);
			}
			obj.find("[time_id='h']").html(hours);
			obj.find("[time_id='m']").html(minutes);
			obj.find("[time_id='s']").html(seconds);
			obj.attr("count_down",tms);
		}
	});
}
$(function(){
		setTimeout("takeCount()", 1000);
});

function ShareGoods(data,share_type){
  var old_img_url = data.goods_image[0];
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
   url: data.goods_image[0]
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
			//apiKey: 'wx90c9a14e76746ebc',
			scene: type,//'timeline',//朋友圈 session好友
			title: data.goods_content.goods_name,
			description: data.goods_content.goods_name,
			thumb: ''+thumb+'',
			contentUrl: MUrl+'/html/goods_detail.html?goods_id='+data.goods_content.goods_id
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
       url:MUrl+'/html/goods_detail.html?goods_id='+data.goods_content.goods_id,
       type:type,
       title:data.goods_content.goods_name,
       description:data.goods_content.goods_name,
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
        text: data.goods_content.goods_name,
        title: data.goods_content.goods_name,
        description: data.goods_content.goods_name,
        thumb: thumb,
        contentUrl: MUrl+'/html/goods_detail.html?goods_id='+data.goods_content.goods_id
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
      value: '推荐:'+data.goods_content.goods_name+MUrl+'/html/goods_detail.html?goods_id='+data.goods_content.goods_id
  }, function(ret, err) {
      if (ret) {
        api.toast({msg: '已复制，可直接粘贴发送'});
        dialogBox.close({
            dialogName: 'actionMenu'
        });
      }
  });
}

//新分享
$(function (){
      // 分享弹窗
      $("body").on("click", "#pd-share", function () {
      alert("111");
        $(".select-wrap").removeClass("hide");
      });

      $("body").on("click", ".select-wrap .close img", function () {
        $(".select-wrap").addClass("hide");
      });

      $("body").on("click", ".wx-share-tip", function (e) {
        $(".wx-share-tip").addClass("hide");
      });

      $("body").on("click", ".wx-share-hb .hb-close", function () {
        $(".wx-share-hb").addClass("hide");
      });
      var shareImg = "";
      // 展示海报
      $("body").on("click", ".select-wrap li", function () {
        var id = $(this).data("id");
        $(".select-wrap").addClass("hide");
        if (id == "wx" && iswx()) {
                $(".wx-share-tip").removeClass("hide");
            }
            else if (id == "url") {
                var url = '推荐:'+document.title+MUrl+'/html/goods_detail.html?goods_id='+getQueryString("goods_id");
                var successful;
                if (navigator.userAgent.match(/(iPhone|iPod|iPad|iOS)/i)) { //ios
                    var copyDOM = document.createElement('div');//要复制文字的节点
                    copyDOM.innerHTML = url;
                    document.body.appendChild(copyDOM);
                    var range = document.createRange();    
                    // 选中需要复制的节点  
                    range.selectNode(copyDOM);  
                    // 执行选中元素  
                    window.getSelection().addRange(range);  
                    // 执行 copy 操作  
                    successful = document.execCommand('copy');    
                    // 移除选中的元素  
                    window.getSelection().removeAllRanges();
                    $(copyDOM).hide()
                }else{
                    var oInput = document.createElement('input')
                    oInput.value = url;
                    document.body.appendChild(oInput)
                    oInput.select() // 选择对象
                    successful = document.execCommand('Copy') //执行浏览器复制命令
                    oInput.className = 'oInput'
                    oInput.style.display = 'none'
                    oInput.remove()
                }
                if(successful){
                    alert("复制成功，记得发给朋友哦");
                }else{
                    alert("复制失败，换个方式分享吧");
                }
            }
            else if (id == "hb") {
                if (!shareImg) {
                    $.ajax({
                    url:MapiUrl + "/index.php?w=goodsshare&t=sharepic&id=" + getQueryString("goods_id"),
                      data: {
                        id: getQueryString("goods_id"),
                        client: "wap",
                      },
                     type:"get",
                      dataType:"json",
                      success: function (res) {
                        if (res.code == 200) {
                          shareImg = res.datas.sharepic;
                          $(".wx-share-hb .hb-src").attr("src", shareImg);
                          $(".wx-share-hb .hb-tip").attr("src","../images/zh_cn_hb_tip2.png"
                                      ); 
                          $(".wx-share-hb").removeClass("hide"); 
                        }else{
                            $.sDialog({
                                skin:"red",
                                content:"海报生成失败，换个方式分享吧",
                                okBtn:false,
                                cancelBtn:false
                            });
                        }
                      },
                    });
                  }
            }    
        
      });//分享end
});
