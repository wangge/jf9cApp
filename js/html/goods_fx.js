var page = paged;
var curpage = 1;
var hasmore = true;
var footer = false;
var keyword = decodeURIComponent(getQueryString('keyword'));
var gc_name = decodeURIComponent(getQueryString('gc_name'));
var gc_id = getQueryString('gc_id');
var member_id = getQueryString('mid');
var b_id = getQueryString('b_id');
var key = getQueryString('key');
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
var key_m = $api.getStorage('key');
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var clickable = isAndroid?false:true;

$(function(){
	$.sDialog({
			skin:"block",
			content:'请点击【分享】给朋友才生效哦',
			okBtn:false,
			cancelBtn:false,
		"lock":true
	});
	//大类分类列表
	$.getJSON(MapiUrl+"/index.php?w=goods_class&t=get_child_all_list", function(result){
		var data = result.datas;
		data.MUrl = MUrl;
		var html = template.render('nav-class-list', data);

		$("#nav-show-class").html(html);
		var ele = $("#nav-show-class");
		ele.width((ele.find("li").length + 1) * (ele.find("li").width()+20));
		myScroll = new IScroll('.nav-content', { 
            scrollX:true,
            mouseWheel: true,
            click:clickable
        });
	});
	//点击分类
	$('#nav-show-class').on('click','.gc_active', function(){
		gc_id = $(this).attr('date-id');
		$("#product_list .goods-secrch-list").html('');
		hasmore = true;
     	curpage=1;
	    get_list();
		$(this).parent().addClass('active').siblings().removeClass("active");
		myScroll.scrollToElement(document.querySelector('.active'), 1000, true, true);
	});

    $.animationLeft({
        valve : '#search_show',
        wrapper : '.wtm-full-mask',
        scroll : '#list-items-scroll'
    });
    $("#header").on('click', '.header-inp', function(){
        location.href = 'search.html?keyword=' + keyword;
    });
    if (keyword != '') {
    	$('#keyword').html(keyword);
    }

    // 商品展示形式
    $('#show_style').click(function(){
        if ($('#product_list').hasClass('list')) {
            $(this).find('span').removeClass('browse-list').addClass('browse-grid');
            $('#product_list').removeClass('list').addClass('grid');
        } else {
            $(this).find('span').addClass('browse-list').removeClass('browse-grid');
            $('#product_list').addClass('list').removeClass('grid');
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

    $('#product_list').on('click', '.goods-store a',function(){
        var $this = $(this);
        var store_id = $(this).attr('data-id');
        var store_name = $(this).text();
        $.getJSON(MapiUrl + '/index.php?w=store&t=store_credit', {store_id:store_id}, function(result){
            var html = '<dl>'
                + '<dt><a href="store.html?store_id=' + store_id + '">' + store_name + '<span class="arrow-r"></span></a></dt>'
                + '<dd class="' + result.datas.store_credit.store_desccredit.percent_class + '">描述相符：<em>' + result.datas.store_credit.store_desccredit.credit + '</em><i></i></dd>'
                + '<dd class="' + result.datas.store_credit.store_servicecredit.percent_class + '">服务态度：<em>' + result.datas.store_credit.store_servicecredit.credit + '</em><i></i></dd>'
                + '<dd class="' + result.datas.store_credit.store_deliverycredit.percent_class + '">发货速度：<em>' + result.datas.store_credit.store_deliverycredit.credit + '</em><i></i></dd>'
                + '</dl>';
            //渲染页面

            $this.next().html(html).show();
        });
    }).on('click', '.sotre-creidt-box', function(){
        $(this).hide();
    });
    get_memberInfo();
    get_list();
    $(window).scroll(function(){
        if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
            get_list();
        }
    });

});

function get_list() {
    $('.loading').remove();
    if (!hasmore) {
        return false;
    }
    hasmore = false;
    param = {};
    param.page = page;
    param.curpage = curpage;
	param.member_id = member_id;
    if (gc_id != '') {
        param.gc_id = gc_id;
    } else if (keyword != '') {
        param.keyword = keyword;
    } else if (b_id != '') {
        param.b_id = b_id;
    }
    if (key != '') {
        param.keya = key;
    }
    if (order != '') {
        param.order = order;
    }
    if (key_m != '') {
        param.key = key_m;
    }


    $.getJSON(MapiUrl + '/index.php?w=goods_fx&t=fx_goods' + window.location.search.replace('?','&'), param, function(result){
    	if(!result) {
    		result = [];
    		result.datas = [];
    		result.datas.goods_list = [];
    	}
        $('.loading').remove();
        curpage++;
        var html = template.render('home_body', result);
        $("#product_list .goods-secrch-list").append(html);
        hasmore = result.hasmore;
    });
}

function get_memberInfo(){
	$.ajax({
		type: 'post',
		url: MapiUrl + "/index.php?w=goods_fx&t=index",
		data: {key: key, member_id: member_id},
		dataType: 'json',
		success: function(result) {
			if (result.datas.error) {
					$.sDialog({
						skin:"red",
						content:result.datas.error,
						okBtn:false,
						cancelBtn:false
					});
					return false;
			 }
			var htmla = '';
			var data = result.datas;
			//banner
			var html = template.render('store_banner_tpl', data);
			$("#store_banner").html(html);
			//输出随机的背景图
			var topBgs = [];
			topBgs[0] = "../images/store_h_bg_01.jpg";
			topBgs[1] = "../images/store_h_bg_02.jpg";
			topBgs[2] = "../images/store_h_bg_03.jpg";
			topBgs[3] = "../images/store_h_bg_04.jpg";
			topBgs[4] = "../images/store_h_bg_05.jpg";
			var randomBgIndex = Math.round( Math.random() * 4 );
			$('.store-top-bg .img').css('background-image', 'url('+ topBgs[randomBgIndex] +')');


		 //分享弹出框
		var dialogBox = api.require('dialogBox');
		$("#goods_share").click(function(){
		confirmPermission('storage',{
			callback:function(){
				//  console.log('storage本地存储权限已获取!');
			}
		});
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
		}
	});
}


function init_get_list(o, k) {
    order = o;
    key = k;
    curpage = 1;
    hasmore = true;
    $("#product_list .goods-secrch-list").html('');
    $('#footer').removeClass('posa');
    get_list();
}

function ShareGoods(data,share_type){
	var old_img_url = data.member_info.avatar;
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
	 url: data.member_info.avatar
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
	var g_name = "你的好友【"+data.member_info.user_name+"】推荐给你一些TA喜欢的东西";
	wxPlus.isInstalled(function(ret, err) {
		if (ret.installed) {
			wxPlus.shareWebpage({
				scene: type,
				title: g_name,
				description: g_name,
				thumb: ''+thumb+'',
				contentUrl: MUrl+'/html/goods_fx.html?mid='+member_id
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
	var g_name = "你的好友【"+data.member_info.user_name+"】推荐给你一些TA喜欢的东西";
	 _shareqq.shareNews({
			 url:MUrl+'/html/goods_fx.html?mid='+member_id,
			 type:type,
			 title:g_name,
			 description:g_name,
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
		var g_name = "你的好友【"+data.member_info.user_name+"】推荐给你一些TA喜欢的东西";
		weiboPlus.shareWebPage({
				text: g_name,
				title: g_name,
				description: g_name,
				thumb: thumb,
				contentUrl: MUrl+'/html/goods_fx.html?mid='+member_id,
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
	var g_name = "你的好友【"+data.member_info.user_name+"】推荐给你一些TA喜欢的东西";
	var dialogBox = api.require('dialogBox');
	var clipBoard = api.require('clipBoard');
	clipBoard.set({
			value: g_name+MUrl+'/html/goods_fx.html?mid='+member_id,
	}, function(ret, err) {
			if (ret) {
				api.toast({msg: '已复制，粘贴发送给好友吧'});
				dialogBox.close({
						dialogName: 'actionMenu'
				});
			}
	});
}
