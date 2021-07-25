    var goods_id = getQueryString("goods_id");
var wx_share = 0;
var wx_mini = 0;
$(function() {
    var key = $api.getStorage('key');
    $api.setStorage('redirect_uri','/html/goods_detail.html?goods_id='+goods_id);
    get_detail(goods_id);
    $.ajax({
        url: MapiUrl + "/index.php?w=goods&t=goods_body",
        data: {goods_id: goods_id},
        type: "get",
        success: function(result) {
            $(".fixed-tab-pannel").html(result);
        }
    });

    $('#goodsDetail').click(function(){
        window.location.href = 'goods_detail.html?goods_id=' + goods_id;
    });
    $('#goodsBody').click(function(){
        window.location.href = 'goods_info.html?goods_id=' + goods_id;
    });
    $('#goodsEvaluation').click(function(){
        window.location.href = 'goods_eval.html?goods_id=' + goods_id;
    });

	function buyNumer() {
		$.sValid();
	}    
	function get_detail(goods_id) {
		//��Ⱦҳ��
		$.ajax({
         url:MapiUrl+"/index.php?w=goods&t=goods_detail",
         type:"get",
         data:{goods_id:goods_id,key:key},
         dataType:"json",
         success:function(result){
            var data = result.datas;
            if(!data.error){
              //��ƷͼƬ��ʽ������
              if(data.goods_image){
                var goods_image = data.goods_image.split(",");
                data.goods_image = goods_image;
              }else{
                 data.goods_image = [];
              }
              //��Ʒ����ʽ������
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

              // ����ȯ��Ʒ�޹�ʱ�������
              if (data.goods_content.is_virtual == '1') {
                  data.goods_content.virtual_indate_str = unixTimeToDateString(data.goods_content.virtual_indate, true);
                  data.goods_content.buyLimitation = buyLimitation(data.goods_content.virtual_limit, data.goods_content.upper_limit);
              }

              // Ԥ�۷���ʱ��
              if (data.goods_content.is_presell == '1') {
                  data.goods_content.presell_deliverdate_str = unixTimeToDateString(data.goods_content.presell_deliverdate);
              }

              //��Ⱦģ��
              var html = template.render('goods_detail', data);
              $("#goods_detail_html").html(html);


					//��Ⱦģ��
					var html = template.render('goods_detail_sepc', data);
					$("#goods_detail_spec_html").html(html);

					//��Ⱦģ��
//					var html = template.render('voucher_script', data);
//					$("#voucher_html").html(html);

					if (data.goods_content.is_virtual == '1') {
						store_id = data.store_info.store_id;
						virtual();
					}

					// ���ﳵ����Ʒ����
					if (localStorage.getItem('cart_count')) {
						if (localStorage.getItem('cart_count') > 0) {
							$('#cart_count,#cart_count1').html('<sup>' + localStorage.getItem('cart_count') + '</sup>');
						}
					}

	
					//��Ʒ����
					$(".pddcp-arrow").click(function() {
						$(this).parents(".pddcp-one-wp").toggleClass("current");
					});
					//�������
					var myData = {};
					myData["spec_list"] = data.spec_list;
					$(".spec a").click(function() {
						var self = this;
						arrowClick(self, myData);
					});

					//������������
					$(".minus").click(function() {
						var buynum = $(".buy-num").val();
						if (buynum > 1) {
							$(".buy-num").val(parseInt(buynum - 1));
						}
					});
					//����������
					$(".add").click(function() {
						var buynum = parseInt($(".buy-num").val());
						if (buynum < data.goods_content.goods_storage) {
							$(".buy-num").val(parseInt(buynum + 1));
						}
					});
					// һ��F������ֻ�ܹ���һ����Ʒ ������������Ϊ1
					if (data.goods_content.is_fcode == '1') {
						$('.minus').hide();
						$('.add').hide();
						$(".buy-num").attr('readOnly', true);
					}
					//�ղ�
					$(".pd-collect").click(function() {
						if ($(this).hasClass('favorate')) {
							if (dropFavoriteGoods(goods_id)) $(this).removeClass('favorate');
						} else {
							if (favoriteGoods(goods_id)) $(this).addClass('favorate');
						}
					});
					//���빺�ﳵ
              $("#add-cart").click(function (){
                var key = $api.getStorage('key');//��¼���
                var quantity = parseInt($(".buy-num").val());
						var lowest = parseInt($(".lowestnum").val());
							if(quantity<lowest)
							{
                                $.sDialog({
                                    skin: "red",
                                    content: "��������������������",
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
                     // ����cookie
					 localStorage.setItem("goods_cart", goods_content);
                     // ����cookie����Ʒ����
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
                                // ���¹��ﳵ����Ʒ����
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

              //��������
              if (data.goods_content.is_virtual == '1') {
                  $("#buy-now").click(function() {
                      var key = $api.getStorage('key');//��¼���
                      if (!key) {
						//v5.2 ��ӵ�¼�󣬷�����Ʒҳ
						$api.setStorage('redirect_uri','/html/goods_detail.html?goods_id='+goods_id);
                        window.location.href = 'member/login.html';
                        return false;
                      }

                      var buynum = parseInt($('.buy-num').val()) || 0;

                      if (buynum < 1) {
                            $.sDialog({
                                skin:"red",
                                content:'��������',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
                      if (buynum > data.goods_content.goods_storage) {
                            $.sDialog({
                                skin:"red",
                                content:'��治�㣡',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }

                      // ����ȯ��Ʒ�޹�����
                      if (data.goods_content.buyLimitation > 0 && buynum > data.goods_content.buyLimitation) {
                            $.sDialog({
                                skin:"red",
                                content:'�����޹�������',
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
                     var key = $api.setStorage('key');//��¼���
                     if(!key){
						//v5.2 ��ӵ�¼�󣬷�����Ʒҳ
						$api.setStorage('redirect_uri','/html/goods_detail.html?goods_id='+goods_id);
                        window.location.href = 'member/login.html';
                     }else{
                         var buynum = parseInt($('.buy-num').val()) || 0;

                      if (buynum < 1) {
                            $.sDialog({
                                skin:"red",
                                content:'��������',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
                      if (buynum > data.goods_content.goods_storage) {
                            $.sDialog({
                                skin:"red",
                                content:'��治�㣡',
                                okBtn:false,
                                cancelBtn:false
                            });
                          return;
                      }
						 // ƴ����Ʒ�޹�����
                      if (buy_pingou == 1 &&data.goods_content.goods_maxnum > 0 && buynum > data.goods_content.goods_maxnum) {
                            $.sDialog({
                                skin:"red",
                                content:'�����������ܳ���'+data.goods_content.goods_maxnum,
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
			  if (wx_share == 0) {
					var url_wx = location.href.split('#')[0];
					var _str = url_wx+'@@@'+data.goods_content.goods_name+'@@@'+data.goods_image[0]+'@@@'+data.goods_content.goods_name;
					$.ajax({
						url: MapiUrl + "/index.php?w=wx_share&str="+encodeURIComponent(_str)+"&goods_id="+data.goods_content.goods_id,
						data:{key:key},
						dataType: 'script',
						success: function (result) {
						}
					});
				}

            }else {

              $.sDialog({
                  content: data.error,
                  okBtn:false,
                  cancelBtnText:'����',
                  cancelFn: function() { history.back(); }
              });
            }

            //��֤���������ǲ�������
            $("#buynum").blur(buyNumer);
            

            // ���µ��϶�̬��ʾ��������
            $.animationUp({
                valve : '.animation-up,#goods_spec_selected',          // ��������
                wrapper : '#goods_detail_spec_html',    // ������
                scroll : '#product_roll',     // �����飬Ϊ�ղ���������
                start : function(){       // ��ʼ���������¼�
                    $('.goods-detail-foot').addClass('hide').removeClass('block');
                },
                close : function(){        // �رն��������¼�
                    $('.goods-detail-foot').removeClass('hide').addClass('block');
                }
            });
            
            $.animationUp({
                valve : '#getVoucher',          // ��������
                wrapper : '#voucher_html',    // ������
                scroll : '#voucher_roll',     // �����飬Ϊ�ղ���������
            });

            $('#voucher_html').on('click', '.btn', function(){
                getFreeVoucher($(this).attr('data-tid'));
            });
            
            // ��ϵ�ͷ�
            $('.kefu').click(function(){
	   
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
});
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


