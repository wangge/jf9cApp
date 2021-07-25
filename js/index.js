apiready = function () {
	/*api.addEventListener({
		name:'viewappear'
		}, function(ret, err){
		api.setStatusBarStyle({
		  style: 'light',
			color:'transparent'
		  //color: '#ec5151'
		});
	});*/
}
var myScroll;
var guesslike_hasmore= true;
var ua = navigator.userAgent.toLowerCase();
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var clickable = isAndroid?false:true;
var wx_share = 0;
var cart_count = 0;
cart_count = localStorage.getItem('cart_count');
var key = $api.getStorage('key');
$(function() {
if(cart_count > 0) {
		$(".footnav ul li sup").show().html(cart_count);
}
    $('#header-nav').click(function(){
    	if ($('#keyword').val() == '') {
    		window.location.href = baseUrl('keyword',$api.getStorage('deft_key_value') ? $api.getStorage('deft_key_value') : '');
    	} else {
    		window.location.href = baseUrl('keyword',$('#keyword').val());
    	}
    });
	//大类分类列表
	$.getJSON(MapiUrl+"/index.php?w=goods_class&t=get_child_all_list", function(result){
		var data = result.datas;
		data.MUrl = MUrl;
		var html = template.render('nav-class-list', data);

		$("#nav-show-class").html(html);
        $(".classify").html(html);
		var ele = $("#nav-show-class");
        ele.width((ele.find("li").length + 1) * (ele.find("li").width()+20));
        myScroll = new IScroll('.nav-content', { 
	            scrollX:true,
	            mouseWheel:true,
	            click:clickable
	    });
	});
    $.ajax({
        url: MapiUrl + "/index.php?w=index",
        type: 'get',
        dataType: 'json',
        success: function(result) {
            var data = result.datas.index;
            var html = '';
			//显示商城名title
            var title = result.datas.seo.html_title;
            document.title = title;
            $("meta[name='keywords']").attr('content',result.datas.seo.seo_keywords);
			$("meta[name='description']").attr('content',result.datas.seo.seo_description);
            $.each(data, function(k, v) {
                $.each(v, function(kk, vv) {
                    switch (kk) {
                        case 'show_list':
                        case 'home3':
                            $.each(vv.item, function(k3, v3) {
                                vv.item[k3].url = baseUrl(v3.type, v3.data);
                            });
                            break;

                        case 'home1':
                            vv.url = baseUrl(vv.type, vv.data);
                            break;

                        case 'home2':
                        case 'home4':
                            vv.square_url = baseUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = baseUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = baseUrl(vv.rectangle2_type, vv.rectangle2_data);
                            break;
                        case 'home5':
                            vv.square_url = baseUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = baseUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = baseUrl(vv.rectangle2_type, vv.rectangle2_data);
                            vv.rectangle3_url = baseUrl(vv.rectangle3_type, vv.rectangle3_data);
                            break;
		    	case 'home6':
                            vv.square_url = baseUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = baseUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = baseUrl(vv.rectangle2_type, vv.rectangle2_data);
                            break;
				case 'home7':
                            vv.square_url = baseUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = baseUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = baseUrl(vv.rectangle2_type, vv.rectangle2_data);
                            vv.rectangle3_url = baseUrl(vv.rectangle3_type, vv.rectangle3_data);
                            vv.rectangle4_url = baseUrl(vv.rectangle4_type, vv.rectangle4_data);
                            vv.rectangle5_url = baseUrl(vv.rectangle5_type, vv.rectangle5_data);
                            vv.rectangle6_url = baseUrl(vv.rectangle6_type, vv.rectangle6_data);
                            vv.rectangle7_url = baseUrl(vv.rectangle7_type, vv.rectangle7_data);
                            vv.rectangle8_url = baseUrl(vv.rectangle8_type, vv.rectangle8_data);
                            vv.rectangle9_url = baseUrl(vv.rectangle9_type, vv.rectangle9_data);
                            break;
		    	case 'home8':
                            vv.square_url = baseUrl(vv.square_type, vv.square_data);
                            vv.rectangle1_url = baseUrl(vv.rectangle1_type, vv.rectangle1_data);
                            vv.rectangle2_url = baseUrl(vv.rectangle2_type, vv.rectangle2_data);
                            vv.rectangle3_url = baseUrl(vv.rectangle3_type, vv.rectangle3_data);
                            break;
                    }

                    if (k == 0) {
                        $("#main-container1").html(template.render(kk, vv));
                    } else {
                      if(kk=='home7'){
                        $("#ico_set").html(template.render(kk, vv));
                      }else{
                        html += template.render(kk, vv);
                      }
                    }
                    return false;
                });
            });

            $("#main-container2").html(html);

            $('.show_list').each(function() {
                //图片轮播
                 var swiper = new Swiper('.show_list .swiper-container', {
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
                /*swiper.el.onmouseover = function(){ //鼠标放上暂停轮播
                  swiper.autoplay.stop();
                }
                swiper.el.onmouseleave = function(){
                  swiper.autoplay.start();
                }*/

            });

	    $('.xianshi').each(function() {
            //图片轮播
             var swiper = new Swiper('.xianshi .swiper-container', {
                  passiveListeners : false,
                  spaceBetween: 30,
                  centeredSlides: true,
                  loop:true,
                  autoplay: {
                    delay: 2500,
                  }
                });
              /*  swiper.el.onmouseover = function(){ //鼠标放上暂停轮播
                  swiper.autoplay.stop();
                }
                swiper.el.onmouseleave = function(){
                  swiper.autoplay.start();
                }*/

            });

        }
    });


    	 $.ajax({
				url:MapiUrl+"/index.php?w=index&t=getgg",
				type:'get',
				data:{ac_id:1},
				jsonp:'callback',
				dataType:'jsonp',
				success:function(result){
					var data = result.datas;
					data.MUrl = MUrl;
					var html = template.render('getgg_tpl', data);
					$("#getgg").html(html);
                      //向上滚动 公告
    var mySwiperNotice = new Swiper('#notice', {
        passiveListeners : false,
        direction: 'vertical',
        height: 40,
        loop: true,
        loop:true,
        autoplay: {
            delay: 2500,
            paginationClickable: true,
        },
        allowTouchMove: false,
        })
				}
			});
    
        if (key) {
         $.getJSON(MapiUrl + "/index.php?w=member_goodsbrowse&t=browse_list", {key:key}, function (result) {
                    var data = result.datas;
                    var html = template.render('browse_list', data);		
                    $("#get_browse").append(html);
                });
         }
    var rec_cupage = 1;
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            if(!guesslike_hasmore) return;
            $.getJSON(MapiUrl + "/index.php?w=index&t=goods_guesslike&curpage="+rec_cupage, function (result) {
                var data = result.datas;
                var html = template.render('like_list', data);		
                $("#get_like").append(html);
                guesslike_hasmore = result.hasmore;
            });
           rec_cupage ++;
     }
    });
});

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
      var time_v = $(this).attr("count_down");
      if(time_v < 0){
        	obj.html("时间：已结束");
         }
	});
}
$(function() {
	setTimeout("takeCount()", 1000);
});
