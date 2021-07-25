$(function(){
    if (getQueryString('seller_key') != '') {
        var key = getQueryString('seller_key');
        var seller_name = getQueryString('seller_name');
        $api.setStorage('seller_key', key);
        $api.setStorage('seller_name', seller_name);
    } else {
        var key = $api.getStorage('seller_key');
        var seller_name = $api.getStorage('seller_name');
    }
    var is_seller = $api.getStorage('is_seller');
    if(is_seller!=1){
        $.sDialog({
            skin:"red",
            okBtn: true,
            okBtnText: "下一步",
            content: '还不是商家，请登录或入驻',
            "cancelBtn": true,
            "lock":true,
            "okFn": function() {
                window.location.href = 'apply.html';
            },
            "cancelFn": function() {
				WTback(this);
               //location.href = '../member/member.html';
            }
        });
    }

    if(key && seller_name){
        $.ajax({
            type:'post',
            url:MapiUrl+"/index.php?w=seller_index",
            data:{key:key},
            dataType:'json',
            success:function(result){
                checkSellerLogin(result.login);
                if (result.datas.error) {
                  $.sDialog({
                      skin:"block",
                      content:'登录超时，请重新登录',
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
                  return false;
                } else{
                var html = ''
                    + '<div class="member-per"></div><div class="member-info">'
                        + '<div class="store-avatar"><img src="' + result.datas.store_info.store_avatar + '"/></div>'
                        + '<div class="seller-name">'+result.datas.store_info.store_name+'</div>'
                        + '<div class="store-name"><sup>' + result.datas.store_info.grade_name + '</sup><a href="../../html/store.html?store_id='+result.datas.store_info.store_id+'"><span>进入店铺</span></a></div>'
                    + '</div>'
                    + '<div class="member-collect">'
                        + '<span><em>' + result.datas.store_info.daily_sales.ordernum + '</em><p>昨日销量</p></span>'
                        + '<span><em>' +result.datas.store_info.monthly_sales.ordernum + '</em><p>当月销量</p></span>'
                        + '<span><em>' +result.datas.statics.online + '</em><p>出售中</p></span>'
                        + '<span><a href="../member/member_assets.html"><em>' +result.datas.store_info.predepoit + '</em><p>我的余额</p></a></span>'
                    + '</div>';
                $(".member-top").html(html);

                //订单管理
                var html = ''
                    + '<li><a href="store_orders_list.html?data-state=state_new">'+ (result.datas.seller_info.order_nopay_count > 0 ? '<em></em>' : '') +'<i class="cc-01"></i><p>待付款</p></a></li>'
                    + '<li><a href="store_orders_list.html?data-state=state_pay">' + (result.datas.seller_info.order_noreceipt_count > 0 ? '<em></em>' : '') + '<i class="cc-02"></i><p>待发货</p></a></li>'
                    + '<li><a href="store_orders_list.html?data-state=state_send">' + (result.datas.seller_info.order_notakes_count > 0 ? '<em></em>' : '') + '<i class="cc-03"></i><p>已发货</p></a></li>'
                    + '<li><a href="store_orders_list.html?data-state=state_success">' + (result.datas.seller_info.return > 0 ? '<em></em>' : '') + '<i class="cc-05"></i><p>已完成</p></a></li>';
                $("#order_ul").html(html);

                //商品管理
			var html = ''
				+ '<li><a href="store_goods_list.html"><i class="cc-07"></i><p>出售中</p></a></li>'
				+ '<li><a href="store_goods_list.html?showtype=offlinegoods"><i class="cc-10"></i><p>仓库中</p></a></li>'
				+ '<li><a href="store_goods_list.html?showtype=illegalgoods"><i class="cc-14"></i><p>违规商品</p></a></li>'
				+ '<li><a href="store_goods_add.html"><i class="cc-04"></i><p>发布商品</p></a></li>'
                $("#goods_ul").html(html);
                //订单统计
			var html = ''
				+ '<li><a href="seller_stat_index.html"><i class="cc-21"></i><p>店铺概况</p></a></li>'
				//+ '<li><a href="seller_stat_goodslist.html"><i class="cc-18"></i><p>店铺统计</p></a></li>'
				+ '<li><a href="seller_stat_storeflow.html"><i class="cc-19"></i><p>店铺流量</p></a></li>'
				+ '<li><a href="seller_stat_goodsflow.html"><i class="cc-20"></i><p>商品流量</p></a></li>'
				+ '<li><a href="seller_stat_hotgoods.html"><i class="cc-22"></i><p>热销排行</p></a></li>'
                $("#order_stat").html(html);
                 //统计结算
                //var html = ''
                //    + '<li><div><p style="font-size:18px;color:red;font-weight:bold;">'+result.datas.statnew_arr.orderamount+'</p><p>营业额</p></div></li><li><div><p style="font-size:18px;color:red;font-weight:bold;">'+result.datas.statnew_arr.ordernum+'</p><p>下单量</p></div></li><li><div><p style="font-size:18px;color:red;font-weight:bold;">'+result.datas.statnew_arr.ordermembernum+'</p><p>下单会员</p></div></li><li><div><p style="font-size:18px;color:red;font-weight:bold;">'+result.datas.statnew_arr.avgorderamount+'</p><p>平均价格</p></div></li>'
                //$("#asset_ul").html(html);

                return false;
            }
            }
        });
    } else {
        var html = ''
            + '<div class="member-per"></div><div class="member-info">'
                + '<a href="javascript:;" class="default-avatar" style="display:block;"></a>'
                + '<a href="../member/login.html" class="to-login">登录</a>'
            + '</div>'
            + '<div class="member-collect">'
                + '<span>'
                    + '<a href="javascript:;">'
                        + '<em>0</em>'
                        + '<p>昨日销量</p>'
                    + '</a>'
                + '</span>'
                + '<span>'
                    + '<a href="javascript:;">'
                        + '<em>0</em>'
                        + '<p>当月销量</p>'
                    + '</a>'
                + '</span>'
                + '<span>'
                    + '<a href="javascript:;">'
                        + '<em>0</em>'
                        + '<p>出售中</p>'
                    + '</a>'
                + '</span>'
                + '<span>'
                    + '<a href="javascript:;">'
                        + '<em>0</em>'
                        + '<p>我的余额</p>'
                    + '</a>'
                + '</span>'
            + '</div>';
        $(".member-top").html(html);

        //订单管理
        var html = ''
            + '<li><a href="javascript:;"><i class="cc-01"></i><p>待付款</p></a></li>'
            + '<li><a href="javascript:;"><i class="cc-02"></i><p>待发货</p></a></li>'
            + '<li><a href="javascript:;"><i class="cc-03"></i><p>已发货</p></a></li>'
            + '<li><a href="javascript:;"><i class="cc-04"></i><p>已完成</p></a></li>'
		//	+ '<li><a href="javascript:;"><i class="cc-05"></i><p>退款/退货</p></a></li>';
        $("#order_ul").html(html);

       //商品管理
        var html = ''
			+ '<li><a href="javascript:;"><i class="cc-07"></i><p>出售中</p></a></li>'
			+ '<li><a href="javascript:;"><i class="cc-10"></i><p>仓库中</p></a></li><li>'
			+ '<a href="javascript:;"><i class="cc-14"></i><p>违规商品</p></a></li>'
			+ '<li><a href="javascript:;"><i class="cc-04"></i><p>发布商品</p></a></li>'
			$("#goods_ul").html(html);
        var html = ''
				+ '<li><a href="javascript:;"><i class="cc-21"></i><p>店铺概况</p></a></li>'
				//+ '<li><a href="seller_stat_goodslist.html"><i class="cc-18"></i><p>店铺统计</p></a></li>'
				+ '<li><a href="javascript:;"><i class="cc-19"></i><p>店铺流量</p></a></li>'
				+ '<li><a href="javascript:;"><i class="cc-20"></i><p>商品流量</p></a></li>'
				+ '<li><a href="javascript:;"><i class="cc-22"></i><p>热销排行</p></a></li>'
                $("#order_stat").html(html);
        return false;
    }

    //滚动header固定到顶部
    $.scrollTransparent();
});
