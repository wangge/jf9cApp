apiready=function(){
	refreshList();
		//监听返回事件
		api.addEventListener({
				name: 'LoginTo'
		}, function(ret, err) {
				location.reload();
		});
		/*api.addEventListener({
            name:'viewappear'
			}, function(ret, err){
			api.setStatusBarStyle({
			  style: 'light',
			  color: '#ec5151'
			});
		});*/
}
$(function(){
    var guesslike_hasmore= true;
    var e = $api.getStorage('key'); 
        if (e) {
         $.getJSON(MapiUrl + "/index.php?w=member_goodsbrowse&t=browse_list", {key:e}, function (result) {
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
                var like_html = template.render('like_list', data);		
                $("#get_like").append(like_html);
                guesslike_hasmore = result.hasmore;
            });
           rec_cupage ++;
     }
    });
});
var cart_count = 0;
	cart_count = localStorage.getItem('cart_count');
$(function(){
if(cart_count > 0) {
		$(".footnav ul li sup").show().html(cart_count);
}


    if (getQueryString('key') != '') {
        var key = getQueryString('key');
        var username = getQueryString('username');
        $api.setStorage('key', key);
        $api.setStorage('username', username);
	updateCookieCart(key);
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=connect&t=sellerlogin",	
			data:{key:key},
			dataType:'json',
			success:function(result){
				if(!result.datas.error){
						var is_seller = 0;
						if(result.datas.sell) {
							if(result.datas.sell.seller_name&&result.datas.sell.key){
								$api.setStorage('seller_name',result.datas.sell.seller_name);
								$api.setStorage('store_name',result.datas.sell.store_name);
								$api.setStorage('seller_key',result.datas.sell.key);
								is_seller = 1;
							}
						}
						$api.setStorage('is_seller',is_seller);
				}
			}
		 }); 
    } else {
        var key = $api.getStorage('key');
    }
	//shopwt v5.2 第三方登录后返回上回访问页面
	var redirect_uri = $api.getStorage('redirect_uri');
	if(redirect_uri && getQueryString('info') == 'wt'){
	    window.location.href = redirect_uri;
    }

	if(key){
        $.ajax({
            type:'post',
            url:MapiUrl+"/index.php?w=member_index",
            data:{key:key},
            dataType:'json',
            success:function(result){
                checkLogin(result.login);
                var html = '<div class="member-per"></div><div class="member-info">'
                    + '<div class="user-avatar"> <a onclick="WtLoginUrl(this)" url="member_update_avatar.html"><img src="' + result.datas.member_info.avatar +"?id="+10000*Math.random() + '"/></a> </div>'
                    + '<div class="user-name"> <span>'+result.datas.member_info.user_name+'<sup>等级：' + result.datas.member_info.level_name + '</sup>'
		    + '<sup id="isplus" style="margin-left:62px;font-size: 11px;"><a onclick="WtLoginUrl(this)" url="member_up.html">升级为PLUS<a/></sup></span></div>'
                    + '<a onclick="WtLoginUrl(this)" url="signin.html" class="to-signin">签到</a>'
                    + '</div>'
                    + '<div class="member-collect"><span><a onclick="WtLoginUrl(this)" url="favorites.html"><em>' + result.datas.member_info.favorites_goods + '</em>'
                    + '<p>商品收藏</p>'
                    + '</a> </span><span><a onclick="WtLoginUrl(this)" url="favorites_store.html"><em>' +result.datas.member_info.favorites_store + '</em>'
                    + '<p>店铺收藏</p>'
                    + '</a> </span><span><a onclick="WtLoginUrl(this)" url="views_list.html"><em>' +result.datas.member_info.goods_browse + '</em>'
                    + '<p>历史浏览</p>'
                    + '</a> </span><span><a onclick="WtLoginUrl(this)" url="predepositlog_list.html"><em>' +result.datas.member_info.predepoit + '</em>'
                    + '<p>我的余额</p>'
                    + '</a> </span></div>';
                //渲染页面

                $(".member-top").html(html);

                var html = '<li><a onclick="WtLoginUrl(this)" url="order_list.html?data-state=state_new">'+ (result.datas.member_info.order_nopay_count > 0 ? '<em>'+result.datas.member_info.order_nopay_count+'</em>' : '') +'<i class="cc-01"></i><p>待付款</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="order_list.html?data-state=state_pay">' + (result.datas.member_info.state_pay_count > 0 ? '<em>'+result.datas.member_info.state_pay_count+'</em>' : '') + '<i class="cc-03"></i><p>待发货</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="order_list.html?data-state=state_send">' + (result.datas.member_info.order_noreceipt_count > 0 ? '<em>'+result.datas.member_info.order_noreceipt_count+'</em>' : '') + '<i class="cc-02"></i><p>待收货</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="order_list.html?data-state=state_noeval">' + (result.datas.member_info.order_noeval_count > 0 ? '<em>'+result.datas.member_info.order_noeval_count+'</em>' : '') + '<i class="cc-04"></i><p>待评价</p></a></li>'
                    //+ '<li><a onclick="WtLoginUrl(this)" url="order_list.html?data-state=state_notakes">' + (result.datas.member_info.order_notakes_count > 0 ? '<em>'+result.datas.member_info.order_notakes_count+'</em>' : '') + '<i class="cc-03"></i><p>待自提</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="member_refund.html">' + (result.datas.member_info.return > 0 ? '<em>'+result.datas.member_info.return+'</em>' : '') + '<i class="cc-05"></i><p>退款/退货</p></a></li>';
                //渲染页面

                $("#order_ul").html(html);

                var html = '<li><a onclick="WtLoginUrl(this)" url="predepositlog_list.html"><i class="cc-06"></i><p>余额</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="rechargecardlog_list.html"><i class="cc-07"></i><p>充值卡</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="voucher_list.html"><i class="cc-08"></i><p>代金券</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="coupon_list.html"><i class="cc-09"></i><p>优惠券</p></a></li>'
                    + '<li><a onclick="WtLoginUrl(this)" url="pointslog_list.html"><i class="cc-10"></i><p>积分</p></a></li>';
                $('#asset_ul').html(html);
                if(result.datas.member_info.level == 3) {
                   $('#isplus').hide();
                   }

                return false;
            }
        });
	} else {
	    var html = '<div class="member-per"></div><div class="member-info">'
	        + '<a onclick="WtLoginUrl(this)" url="login.html" class="default-avatar" style="display:block;"></a>'
	        + '<a onclick="WtLoginUrl(this)" url="login.html" class="to-login">登录/注册</a>'
	        + '</div>'
	        + '<div class="member-collect"><span><a onclick="WtLoginUrl(this)" url="login.html"><i class="favorite-goods"></i>'
	        + '<p>商品收藏</p>'
	        + '</a> </span><span><a onclick="WtLoginUrl(this)" url="login.html"><i class="favorite-store"></i>'
	        + '<p>店铺关注</p>'
	        + '</a> </span><span><a onclick="WtLoginUrl(this)" url="login.html"><i class="goods-browse"></i>'
	        + '<p>历史浏览</p>'
	        + '</a> </span><span><a onclick="WtLoginUrl(this)" url="login.html"><i class="goods-balance"></i>'
	        + '<p>我的余额</p>'
	        + '</a> </span></div>';
	    //渲染页面
	    $(".member-top").html(html);

        var html = '<li><a onclick="WtLoginUrl(this)" url="login.html"><i class="cc-01"></i><p>待付款</p></a></li>'
        + '<li><a onclick="WtLoginUrl(this)" url="login.html"><i class="cc-02"></i><p>待收货</p></a></li>'
        + '<li><a onclick="WtLoginUrl(this)" url="login.html"><i class="cc-03"></i><p>待自提</p></a></li>'
        + '<li><a onclick="WtLoginUrl(this)" url="login.html"><i class="cc-04"></i><p>待评价</p></a></li>'
        + '<li><a onclick="WtLoginUrl(this)" url="login.html"><i class="cc-05"></i><p>退款/退货</p></a></li>';
        //渲染页面
        $("#order_ul").html(html);
	 var html = '<li><a onclick="WtLoginUrl(this)" url="predepositlog_list.html"><i class="cc-06"></i><p>余额</p></a></li>' + '<li><a onclick="WtLoginUrl(this)" url="rechargecardlog_list.html"><i class="cc-07"></i><p>充值卡</p></a></li>' + '<li><a onclick="WtLoginUrl(this)" url="voucher_list.html"><i class="cc-08"></i><p>代金券</p></a></li>' + '<li><a onclick="WtLoginUrl(this)" url="coupon_list.html"><i class="cc-09"></i><p>优惠券</p></a></li>' + '<li><a onclick="WtLoginUrl(this)" url="pointslog_list.html"><i class="cc-10"></i><p>积分</p></a></li>';
        $("#asset_ul").html(html);
        return false;
	}

	  //滚动header固定到顶部
	  $.scrollTransparent();
});
