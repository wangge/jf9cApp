    var key = $api.getStorage('key');
    var store_id = getQueryString("store_id");
//处理商品上新返回的数据
function tidyStoreNewGoodsData(goodsData){
    if (goodsData.goods_list.length <= 0) {
        return goodsData;
    }
    var obj = $('#newgoods').find('[addtimetext="'+goodsData.goods_list[0].goods_addtime_text+'"]');
    var curr_date = '';
    $.each(goodsData.goods_list,function(index,item){
        if (curr_date != item.goods_addtime_text && obj.html() == null) {
            goodsData.goods_list[index].goods_addtime_text_show = item.goods_addtime_text;
            curr_date = item.goods_addtime_text;
        }
    });
    return goodsData;
}

$(function() {
    if(!store_id){
        window.location.href = '../index.html';
    }
    $api.setStorage('redirect_uri','/html/store.html?store_id='+store_id);
    $("#goods_search").attr('href','store_search.html?store_id='+store_id);
    $("#store_intro").attr('href','store_info.html?store_id='+store_id);

    //显示轮播
    function  slidersShow(){
            $('#store_sliders').each(function() {
                //图片轮播
                 var swiper = new Swiper('#store_sliders .swiper-container', {
                  passiveListeners : false,
                  spaceBetween: 30,
                  centeredSlides: true,
                  loop:true,
                  autoplay: {
                    delay: 2500,
                    paginationClickable: true,
                  },
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                  }
                });
            });
    }

    //加载店铺详情
    $.ajax({
        type: 'post',
        url: MapiUrl + "/index.php?w=store&t=store_info",
        data: {key: key, store_id: store_id},
        dataType: 'json',
        success: function(result) {
			if (result.datas.error) {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
					setTimeout("location.href = 'shop.html'",3000);
					return false;
             }
        	var htmla = '';
            var data = result.datas;
                var urlstore = "store.html?store_id=" + data.store_info.store_id;
                $("#store-id").attr("href",urlstore);
            //显示页面title
            var title = data.store_info.store_name+'-'+data.store_info.site_name+'';
            document.title = title;
             var store_decoration = data.store_info.mb_store_decoration_switch ;
            $("meta[name='description']").attr('content',""+data.store_info.store_name+'，包括：'+data.store_info.store_keywords+'；'+data.store_info.store_description+'。'+"");
            $("meta[name='keywords']").attr('content',""+data.store_info.store_keywords+"");
            //店铺banner
            var html = template.render('store_banner_tpl', data);
            $("#store_banner").html(html);
            //显示收藏按钮
            if (data.store_info.is_favorate) {
                $("#store_notcollect").hide();
                $("#store_collected").show();
            }else{
                $("#store_notcollect").show();
                $("#store_collected").hide();
            }
            //banner 背景图
            if (data.store_info.mb_title_img) {
                $('.store-top-bg .img').css('background-image', 'url('+data.store_info.mb_title_img+')');
            }else{//输出随机的背景图
                var topBgs = [];
                topBgs[0] = "../images/store_h_bg_01.jpg";
                topBgs[1] = "../images/store_h_bg_02.jpg";
                topBgs[2] = "../images/store_h_bg_03.jpg";
                topBgs[3] = "../images/store_h_bg_04.jpg";
                topBgs[4] = "../images/store_h_bg_05.jpg";
                var randomBgIndex = Math.round( Math.random() * 4 );
                $('.store-top-bg .img').css('background-image', 'url('+ topBgs[randomBgIndex] +')');
            }
            //店铺轮播图
            if (data.store_info.mb_sliders.length > 0) {
                var html = template.render('store_sliders_tpl', data);
                $("#store_sliders").html(html);
                slidersShow();
            }else{
                $("#store_sliders").parent().hide();
            }
	    if (!data.store_info.node_chat) {
		    $('.store_kefu').hide();
		    //$('.wtm-store-bottom li').css('width','20%');
	    }
            //联系客服
            $('#store_kefu').click(function(){
                $(this).attr('href','member/im.html?t_id=' + result.datas.store_info.member_id);
            });
            //联系客服
            $('#store_tel').click(function(){
              $(this).attr('href','tel:' + result.datas.store_info.store_phone);
                //window.location.href = 'tel:' + result.datas.store_info.store_phone;
            });
			//联系客服
            $('#store_qq').click(function(){
                window.location.href = "http://wpa.qq.com/msgrd?v=3&uin=" + result.datas.store_info.store_qq + "&site=qq&menu=yes";
            });
			//地图
			$('#store_addr_map').click(function(){
				  $('#map-wrappers').removeClass('hide').removeClass('right').addClass('left');
				  $('#map-wrappers').on('click', '.header-l > a', function(){
					  $('#map-wrappers').addClass('right').removeClass('left');
				  });
				  $('#baidu_map').css('width', document.body.clientWidth);
				  $('#baidu_map').css('height', '100%');
				  var map = new BMap.Map("baidu_map");
				var city = new BMap.LocalCity();
				//var top_left_navigation = new BMap.NavigationControl();
				//var overView = new BMap.OverviewMapControl();
				var currentArea = '';
				var currentCity = '';
				//map.addControl(top_left_navigation);
				//map.addControl(overView);
				map.enableScrollWheelZoom(true);
				city.get(local_city);
				function local_city(cityResult){
					map.centerAndZoom(cityResult.center, 15);
					currentCity = cityResult.name;
						var pointArray = new Array();
						var point = '';
						var marker = '';
						var label = '';
						var k = 0;
							point = new BMap.Point(result.datas.store_info.baidu_lng, result.datas.store_info.baidu_lat);
							pointArray[k++] = point;
							label = new BMap.Label(""+result.datas.store_info.store_name,{offset:new BMap.Size(20,-10)});
							marker = new BMap.Marker(point);
							marker.setTitle('地址:'+result.datas.store_info.store_address);
							marker.setLabel(label);
							//marker.enableDragging();
							map.addOverlay(marker);


						map.setViewport(pointArray);

				}

			});
            //店主推荐
            var html = template.render('goods_recommend_tpl', data);
            $("#goods_recommend").html(html);
            if(store_decoration == 1){
            	$('.lunbo').hide();
         	    $('.tuijian').hide();
            	$('.paihang').hide();
            	//开始计算生成首页

            $.each(data.store_info.decoration, function(k, v) {

                $.each(v, function(kk, vv) {

                    switch (kk) {
                        case 'adv_list':
                        case 'home3':
                            $.each(vv.item, function(k3, v3) {
                                vv.item[k3].url = buildUrl(v3.type, v3.data);
                            });
                            break;

                        case 'home1':
                            vv.url = buildUrl(vv.type, vv.data);
                            break;

                        case 'home2':
                        case 'home4':
                            vv.square_url = buildUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = buildUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = buildUrl(vv.rectangle2_type, vv.rectangle2_data);
                            break;
                        case 'store_announcement':
                            $.each(vv.item, function(kkk, vvv) {
                            	vv.item[kkk].urll = buildUrl('store_announcement', vvv.article_id);
                            });
                            break;
                        case 'store_introduction':

                    }
                    if (k == 0) {
						if(kk=='store_introduction'){
							var si_data='<div class="wtm-home-block">';
							if (vv.title) {
								si_data +='<div class="tit-bar">'+vv.title+'</div>';
							}
							si_data +='<div class="default"><ul class="store_introduction">'+vv.article_content
							+'</ul></div></div>';
							$("#main-container1").html(si_data);
						}else{
						$("#main-container1").html(template.render(kk, vv));
						}
                    } else {
                    	if(kk=='store_introduction'){
							var si_data='<div class="wtm-home-block">';
							if (vv.title) {
								si_data +='<div class="tit-bar">'+vv.title+'</div>';
							}
							si_data +='<div class="default"><ul class="store_introduction">'+vv.article_content
							+'</ul></div></div>';
							htmla += si_data;
						}else{
                    	 htmla += template.render(kk, vv);
						}

                    }
                    return false;
                });
            });

            $("#main-container2").html(htmla);
            $('.show_list').each(function() {
                //图片轮播
                 var swiper = new Swiper('#main-container1 .swiper-container', {
                  passiveListeners : false,
                  spaceBetween: 30,
                  centeredSlides: true,
                  loop:true,
                  autoplay: {
                    delay: 2500,
                    paginationClickable: true,
                  },
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                  }
                });
            });




            }


//店铺导航
if(data.store_info.store_imgname.on == 1){
	$("#nav_tab li").addClass("selected2");
	$.each(data.store_info.store_imgname.data, function(kt, vt) {
		switch (kt) {
            case '1':
            if(vt.img){
            $("[data-type='storeindex']").text(vt.name);
            $("[data-type='storeindex']").prepend("<i class='store'></i>");
            $(".store").css("background-image","url(" + vt.img +")");

            if(vt.links){
            	$("[data-type='storeindex']").attr("href",vt.links);
            }
            }
            break;
            case '2':
            if(vt.img){
            $("[data-type='categroy']").text(vt.name);
            $("[data-type='categroy']").prepend("<i class='categroy'></i>");
            $(".categroy").css("background-image","url(" + vt.img +")");
            if(vt.links){
            	$("[data-type='categroy']").attr("href",vt.links);
            }
            }
            case '3':
            if(vt.img){
            $("[data-type='allgoods']").text(vt.name);
            $("[data-type='allgoods']").prepend("<i class='goods'></i>");
            $(".goods").css("background-image","url(" + vt.img +")");
            if(vt.links){
            	$("[data-type='allgoods']").attr("href",vt.links);
            }
            }
            break;
            case '4':
            if(vt.img){
            $("[data-type='newgoods']").text(vt.name);
            $("[data-type='newgoods']").prepend("<i class='new'></i>");
            $(".new").css("background-image","url(" + vt.img +")");
            if(vt.links){
            	$("[data-type='newgoods']").attr("href",vt.links);
            }
            }
            break;
            case '5':
            if(vt.img){
            $("[data-type='storeactivity']").text(vt.name);
            $("[data-type='storeactivity']").prepend("<i class='sale'></i>");
            $(".sale").css("background-image","url(" + vt.img +")");
            if(vt.links){
            	$("[data-type='storeactivity']").attr("href",vt.links);
            }
            }
            break;
        }
    })
}

//店铺底部菜单
if(data.store_info.mb_store_menu.on == 1){

	var htmlac = '';
	var newa = data.store_info.mb_store_menu;
	var witj = 100 / newa.nou - 1;

	if(newa.nou > 0){
		$("#ccas").remove();
		htmlac +="<ul id='ccas'>";
		$.each(data.store_info.mb_store_menu.data, function(ktt, vtt) {

    	    if(vtt.name){
    	        htmlac +="<li style= width:"+  witj + "%><a href=" + vtt.links + ">" + vtt.name +"</a></li>";
    	    }

    	})
		htmlac +="</ul>";

		$(".wtm-store-bottom").prepend(htmlac);

	}




}
        }
    });

    //加载商品排行
    $('#goods_rank_tab').find('a').click(function(){
        $('#goods_rank_tab').find('li').removeClass('selected');
        $(this).parent().addClass('selected').siblings().removeClass("selected");

        var data_type = $(this).attr('data-type');
        var ordertype = data_type+'desc';
        var shownum = 10;

        $("[wt_type='goodsranklist']").hide();
        $("#goodsrank_"+data_type).show();

        //如果已加载过数据则不重复加载
        if ($("#goodsrank_"+data_type).html()) {
            return;
        }

        //加载商品列表
        $.ajax({
            type: 'post',
            url: MapiUrl + '/index.php?w=store&t=store_goods_rank',
            data: {store_id: store_id, ordertype:ordertype, num:shownum},
            dataType: 'json',
            success: function(result) {
                if (result.code == 200) {
                    var html = template.render('goodsrank_'+data_type+'_tpl', result.datas);
                    $("#goodsrank_"+data_type).html(html);
                        if($("#goodsrank_salenum").css("display") == 'none') {
                        $('.top-list').each(function() {
                            //图片轮播
                             var swiper = new Swiper('#goodsrank_collect .swiper-container', {
                              passiveListeners : false,
                              spaceBetween: 10,
                              slidesPerView: 5,
                              centeredSlides: true,
                              loop:true,
                              autoplay: {
                                delay: 2500
                              }
                            });
                        });

                  } else {
                        $('.top-list').each(function() {
                        //图片轮播
                         var swiper = new Swiper('#goodsrank_salenum .swiper-container', {
                          passiveListeners : false,
                          spaceBetween: 10,
                          slidesPerView: 5,
                          centeredSlides: true,
                          loop:true,
                          autoplay: {
                            delay: 2500
                          }
                        });
                    });

                  }

                }
            }
        });
    });
    $('#goods_rank_tab').find("a[data-type='collect']").trigger('click');

    $('#nav_tab').waypoint(function() {
        $("#nav_tab_con").toggleClass('fixed');
    }, {
        offset: '0'
    });

    //加载商品上新
    function getStoreNewGoods(){
        var param = {};
        param.store_id = store_id;
        var load_class_newgoods = new wtScrollLoad();
        load_class_newgoods.loadInit({'url':MapiUrl + '/index.php?w=store&t=store_new_goods','getparam':param,'tmplid':'newgoods_tpl','containerobj':$("#newgoods"),'iIntervalId':true,'resulthandle':'tidyStoreNewGoodsData'});
    }
    //加载店铺促销活动
    function getStoreActivity(){
        $.ajax({
            type: 'post',
            url: MapiUrl + "/index.php?w=store&t=store_sale",
            data: {store_id: store_id},
            dataType: 'json',
            success: function(result) {
                result.datas.store_id = store_id;
                var html = template.render('storeactivity_tpl', result.datas);
                $("#storeactivity_con").html(html);
            }
        });
    }

    //导航
    $("#nav_tab").find('a').click(function(){
        $('#nav_tab').find('li').removeClass('selected');
        $(this).parent().addClass('selected').siblings().removeClass("selected");
        $("#storeindex_con,#allgoods_con,#newgoods_con,#storeactivity_con").hide();
        window.scrollTo(0,0);

        var data_type = $(this).attr('data-type');
        switch (data_type){
            case 'storeindex':
                $("#storeindex_con").show();
                slidersShow();
                break;
              case 'categroy':
                    location.href = 'store_search.html?store_id='+store_id;
                break;
            case 'allgoods':
                if (!$("#allgoods_con").html()) {
                    $("#allgoods_con").load('store_goods_list.html',function(){
                        $(".goods-search-list-nav").addClass('posr');
                        $(".goods-search-list-nav").css("top","0");
                        $("#sort_inner").css("position","static");
                    });
                }
                $("#allgoods_con").show();
                break;
            case 'newgoods':
                if (!$("#newgoods").html()) {
                    getStoreNewGoods();
                }
                $("#newgoods_con").show();
                break;
            case 'storeactivity':
                if (!$("#storeactivity_con").html()) {
                    getStoreActivity();
                }
                $("#storeactivity_con").show();
                break;
        }
    });

    //免费领取代金券
    $("#store_voucher").click(function(){
        if (!$("#store_voucher_con").html()) {
            $.ajax({
                type: 'post',
                url: MapiUrl + '/index.php?w=voucher&t=voucher_tpl_list',
                data: {store_id: store_id, gettype: 'free'},
                dataType: 'json',
                async: false,
                success: function(result) {
                    if (result.code == 200) {
                        var html = template.render('store_voucher_con_tpl', result.datas);
                        $("#store_voucher_con").html(html);
                    }
                }
            });
        }
        //从下到上动态显示隐藏内容
        $.animationUp({'valve':''});
    });
    //领店铺代金券
    $('#store_voucher_con').on('click', '[wt_type="getvoucher"]', function(){
        getFreeVoucher($(this).attr('data-tid'));
    });

    //收藏店铺
    $("#store_notcollect").live('click',function() {
        //添加收藏
        var f_result = favoriteStore(store_id);
        if (f_result) {
            $("#store_notcollect").hide();
            $("#store_collected").show();
            var t;
            var favornum = (t = parseInt($("#store_favornum_hide").val())) > 0?t+1:1;
            $('#store_favornum').html(favornum);
            $('#store_favornum_hide').val(favornum);
        }
    });
    //取消店铺收藏
    $("#store_collected").live('click',function() {
        //取消收藏
        var f_result = dropFavoriteStore(store_id);
        if (f_result) {
            $("#store_collected").hide();
            $("#store_notcollect").show();
            var t;
            var favornum = (t = parseInt($("#store_favornum_hide").val())) > 1?t-1:0;
            $('#store_favornum').html(favornum);
            $('#store_favornum_hide').val(favornum);
        }
    });

});

function talert(){
  //alert("分享成功");
  $.ajax({
    url: MapiUrl + "/index.php?w=sharepoint&gid="+store_id,
    type: 'get',
    data:{key:key},
    dataType: 'json',
    success: function(result) {
     }
});
}
