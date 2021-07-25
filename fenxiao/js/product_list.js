var page = paged;
var curpage = 1;
var hasmore = true;
var footer = false;
var keyword = decodeURIComponent(getQueryString('keyword'));
//var gc_id = getQueryString('gc_id');
var b_id = getQueryString('b_id');
var sort = getQueryString('sort');
var order = getQueryString('order');
var area_id = getQueryString('area_id');
var price_from = getQueryString('price_from');
var price_to = getQueryString('price_to');
var own_shop = getQueryString('own_shop');
var gift = getQueryString('gift');
var robbuy = getQueryString('robbuy');
var xianshi = getQueryString('xianshi');
var virtual = getQueryString('virtual');
var ci = getQueryString('ci');
var myDate = new Date();
var searchTimes = myDate.getTime();
var cate_id = 0;
var reset = true;
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var clickable = isAndroid?false:true;
var myScroll,
    categoryChlidList = {};
$(function(){
	var key = $api.getStorage('key');
		if(!key){
			window.location.href = '../html/member/login.html';
			return false;
		}
//分类
 $.getJSON(MapiUrl+"/index.php?w=goods_class&t=get_child_all_list", function(result){
		var data = result.datas;
		data.MUrl = MUrl;
		var html = template.render('category-one', data);
        for (var i in data.list) {
            var category = data.list[i];
            categoryChlidList[category.gc_id] = category.gc_list;
        }
        cate_id = parseInt(data.list[0].gc_id);
		$("#categroy-left").html(html);
		$("#categroy-left").on('touchmove',function (e) {e.preventDefault()});//解决部分卡顿
		myScroll = new IScroll('#categroy-left', { mouseWheel: true, click: true });
	});

	$('#categroy-left').on('click','.category', function(){
        var obj = $(this);
	    $('.loading').show();
	    $(this).parent().addClass('selected').siblings().removeClass("selected");
        cate_id = parseInt(obj.attr('date-id'));
        curpage = 1;
		hasmore = true;
        reset = true;
        $('#goods_key').val('');
		get_list();
        $('.loading').hide();
        myScroll.scrollToElement(document.querySelector('.categroy-list li:nth-child(' + ($(this).parent().index()+1) + ')'), 1000);
	});

   $('#search_btn').click(function(){
        curpage = 1;
		hasmore = true;
        reset = true;
    	get_list();
    }); 
    
    // 商品展示形式
    $('#show_style').click(function(){
        if ($('#product_list').hasClass('grid')) {
            $(this).find('span').removeClass('browse-grid').addClass('browse-list');
            $('#product_list').removeClass('grid').addClass('list');
        } else {
            $(this).find('span').addClass('browse-grid').removeClass('browse-list');
            $('#product_list').addClass('grid').removeClass('list');
        }
    });

    // 排序显示隐藏
    $('#sort_default').click(function(){
        if ($('#sort_inner').hasClass('hide')) {
            $('#sort_inner').removeClass('hide');
        } else {
            $('#sort_inner').addClass('hide');
        }
    });
    $('#nav_ul').find('a').click(function(){
        $(this).addClass('current').parent().siblings().find('a').removeClass('current');
        if (!$('#sort_inner').hasClass('hide') && $(this).parent().index() > 0) {
            $('#sort_inner').addClass('hide');
        }
    });
    $('#sort_inner').find('a').click(function(){
        $('#sort_inner').addClass('hide').find('a').removeClass('cur');
        var text = $(this).addClass('cur').text();
        $('#sort_default').html(text + '<i></i>');
    });


    get_list();
    $(window).scroll(function(){
        if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
            get_list();
        }
    });
});

function get_list() {
	var key = $api.getStorage('key');
var gc_id = parseInt(cate_id);
		if(!key){
			window.location.href = '../html/member/login.html';
			return false;
		}
    $('.loading').remove();
    if (!hasmore) {
        return false;
    }
    if (reset) {
        curpage = 1;
    }
    hasmore = false;
    var goods_name = $('#goods_key').val();
    param = {};
    param.page = page;
    param.curpage = curpage;
    if (gc_id != '') {
        param.gc_id = gc_id;
    } else if (keyword != '') {
        param.keyword = keyword;
    } else if (b_id != '') {
        param.b_id = b_id;
    }
    if (key != '') {
        param.key = key;
    }
    if (sort != '') {
        param.sort = sort;
    }
    if (order != '') {
        param.order = order;
    }
    if(goods_name!=''){
        param.keyword = goods_name;
    }

    $.getJSON(MapiUrl + '/index.php?w=member_fx&t=goods_list' + window.location.search.replace('?','&'), param, function(result){
    	if(!result) {
    		result = [];
    		result.datas = [];
    		result.datas.goods_list = [];
    	}
        checkLogin(result.login);//检测是否登录了
        if(result.code == 400){
                $.sDialog({
                  skin:"red",
                  content:result.datas.error,
                  okBtn:false,
                  cancelBtn:false
                });
                WTback();
                return false;
         }
		result.datas.MapiUrl = MapiUrl;
        $('.loading').remove();
        curpage++;
        var html = template.render('home_body', result);
        if (reset) {
            reset = false;
            $("#product_list").html(html);
        } else {
            $("#product_list").append(html);
        }
        hasmore = result.hasmore;
    });
}

function init_get_list(o, k) {
    order = o;
    sort = k;
    curpage = 1;
    hasmore = true;
    $("#product_list .goods-secrch-list").html('');
    get_list();
}

function addfxgoods(gid){
  var e = $api.getStorage("key");

  if (isEmpty(e)) {
     $.sDialog({
        skin:"block",
        content:t.datas.error,
        okBtn:false,
        cancelBtn:false
   });
	window.location.href = '../html/member/login.html';
	return false;
  }else{
    $.ajax({
        url: MapiUrl + "/index.php?w=member_fx&t=fx_add",
        data: {
           key: e,
           id: gid
        },
        type: "post",
        success: function(e) {
            var t = $.parseJSON(e);
                if (!t.datas.error) {
                        $.sDialog({
                            skin:"block",
                            content:'添加成功',
                            okBtn:false,
                            cancelBtn:false
                        });
                } else {
                        $.sDialog({
                            skin:"block",
                            content:t.datas.error,
                            okBtn:false,
                            cancelBtn:false
                        });

                }
        }
    })
  }
}

