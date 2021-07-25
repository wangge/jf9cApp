$(function() {
    var html = '<div id="footnav" class="footnav clearfix"><ul>' + '<li><a class="current" href="seller.html"><i class="home2"></i><p>首页</p></a></li>' + '<li><a href="store_orders_list.html"><i  class="cc-09"></i><p>订单</p></a></li>' + '<li><a href="store_goods_list.html"><i class="cc-07"></i><p>商品</p></a></li>' + '<li><a href="store_orders_list.html?data-state=state_pay"><i class="cc-03"></i><p>待发货</p></a></li>' + '<li><a href="store_goods_add.html"><i class="cc-04"></i><p>发布</p></a></li></ul>' + '</div>';
    $("#footer").html(html);
    var s_key = $api.getStorage('seller_key');
    if(s_key){
    $("#logoutbtn").hide();
    }
    $("#logoutbtn").click(function() {
        var a = $api.getStorage("sellername");
        var e = $api.getStorage("seller_key");
        var i = "wap";
        $.ajax({
            type: "get",
            url: MapiUrl + "/index.php?w=logout",
            data: {
                username: a,
                key: e,
                client: i
            },
            success: function(a) {
                if (a) {
                    $api.setStorage('wxout', '1');
                		$api.rmStorage('username');
                		$api.rmStorage('key');
                		localStorage.removeItem('cart_count');
                		$api.rmStorage("seller_name");
                		$api.rmStorage("store_name");
                		$api.rmStorage("seller_key");
                		$api.rmStorage("is_seller");
                    location.href = "../member/member.html";
                }
            }
        })
    })
});
