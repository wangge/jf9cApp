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
		  style: 'dark',
		  color: 'rgba(255,255,255,0.9)'
		});
	});*/
}
/*apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
      if (ret.value.index == 3) { //底部导航切换
          cart_back();
      } else {
          location.reload();
          cart_backshow();
      }

    });
}
function cart_back() {
var cart_back = document.getElementById('cart_back');
  cart_back.style.display ="none";
}
function cart_backshow() {
var cart_back = document.getElementById('cart_back');
  cart_back.style.display ="block";
}*/

var guesslike_hasmore = true;
$(function (){
    goods_guesslike();
    var rec_cupage = 2;
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
$(function (){
if(cart_count > 0) {
	$(".footnav ul li sup").show().html(cart_count);
}

    template.helper('isEmpty', function(o) {
        for (var i in o) {
            return false;
        }
        return true;
    });
    template.helper('decodeURIComponent', function(o){
        return decodeURIComponent(o);
    });
    var key = $api.getStorage('key');
    if(!key){
        var goods = decodeURIComponent(localStorage.getItem('goods_cart'));
        if (goods != null) {
            var goodsarr = goods.split('|');
        } else {
            goodsarr = {};
        }
        var cart_list = new Array();
        var sum = 0;
        if(goodsarr.length>0){
            for(var i=0;i<goodsarr.length;i++){
                var info = goodsarr[i].split(',');
                if (isNaN(info[0]) || isNaN(info[1])) continue;
                data = getGoods(info[0], info[1]);
                if ($.isEmptyObject(data)) continue;
                if (cart_list.length > 0) {
                    var has = false
                    for (var j=0; j<cart_list.length; j++) {
                        if (cart_list[j].store_id == data.store_id) {
                            cart_list[j].goods.push(data);
                            has = true
                        }
                    }
                    if (!has) {
                        var datas = {};
                        datas.store_id = data.store_id;
                        datas.store_name = data.store_name;
                        datas.goods_id = data.goods_id;
                        var goods = new Array();
                        goods = [data];
                        datas.goods = goods;
                        cart_list.push(datas);
                    }
                } else {
                    var datas = {};
                    datas.store_id = data.store_id;
                    datas.store_name = data.store_name;
                    datas.goods_id = data.goods_id;
                    var goods = new Array();
                    goods = [data];
                    datas.goods = goods;
                    cart_list.push(datas);
                }

                sum += parseFloat(data.goods_sum);
            }
        }
        var rData = {cart_list:cart_list, sum:sum.toFixed(2), cart_count:goodsarr.length, check_out:false};
        rData.MUrl = MUrl;
        var html = template.render('cart-list', rData);
        $('#cart-list').addClass('no-login');
        $("#cart-list-wp").html(html);
        $('.goto-settlement,.goto-shopping').parent().hide();
        //删除购物车
        $(".goods-del").click(function(){
            var $this = $(this);
            $.sDialog({
                skin:"red",
                content:'确认删除吗？',
                okBtn:true,
                cancelBtn:true,
                okFn: function() {
                    var goods_id = $this.attr('cart_id');
                    for(var i=0;i<goodsarr.length;i++){
                        var info = goodsarr[i].split(',');
                        if (info[0] == goods_id) {
                            goodsarr.splice(i,1);
                            break;
                        }
                    }
					localStorage.setItem('goods_cart',goodsarr.join('|'));
                    // 更新cookie中商品数量
					localStorage.setItem('cart_count',goodsarr.length-1);
                    location.reload();
                }
            });
        });
         //购买数量，减
        $(".minus").click(function(){
            var sPrents = $(this).parents(".cart-litemw-cnt");
            var goods_id = sPrents.attr('cart_id');
            for(var i=0;i<goodsarr.length;i++){
                var info = goodsarr[i].split(',');
                if (info[0] == goods_id) {
                    if (info[1] == 1) {
                        return false;
                    }
                    info[1] = parseInt(info[1]) - 1;
                    goodsarr[i] = info[0] + ',' + info[1];
		    getGoods(info[1], info[0]);
                    sPrents.find('.buy-num').val(info[1]);
					window.location.href = 'cart_list.html';
                }
            }
            localStorage.setItem('goods_cart',goodsarr.join('|'));
        });
        //购买数量加
        $(".add").click(function(){
            var sPrents = $(this).parents(".cart-litemw-cnt");
            var goods_id = sPrents.attr('cart_id');
            for(var i=0;i<goodsarr.length;i++){
                var info = goodsarr[i].split(',');
                if (info[0] == goods_id) {
                    info[1] = parseInt(info[1]) + 1;
                    goodsarr[i] = info[0] + ',' + info[1];
		    getGoods(info[1], info[0]);
                    sPrents.find('.buy-num').val(info[1]);
					window.location.href = 'cart_list.html';
                }
            }
            localStorage.setItem('goods_cart',goodsarr.join('|'));
        });
    }else{
        //初始化页面数据
        function initCartList(){
             $.ajax({
                url:MapiUrl+"/index.php?w=member_cart&t=cart_list",
                type:"post",
                dataType:"json",
                data:{key:key},
                success:function (result){
                    if(checkLogin(result.login)){
                        if(!result.datas.error){
                            if (result.datas.cart_list.length == 0) {
                                localStorage.setItem('cart_count',0);
                            }
                            var rData = result.datas;

                            rData.MUrl = MUrl;
                            rData.check_out = true;
                            var html = template.render('cart-list', rData);
                            $("#cart-list-wp").html(html);
                            //删除购物车
                            $(".goods-del").click(function(){
                                var  cart_id = $(this).attr("cart_id");
                                $.sDialog({
                                    skin:"red",
                                    content:'确认删除吗？',
                                    okBtn:true,
                                    cancelBtn:true,
                                    okFn: function() {
                                        delCartList(cart_id);
                                    }
                                });
                            });
                             //购买数量，减
                            $(".minus").click(minusBuyNum);
                            //购买数量加
                            $(".add").click(addBuyNum);
                            $(".buynum").blur(buyNumer);
                            // 从下到上动态显示隐藏内容
                            for (var i=0; i<result.datas.cart_list.length; i++) {
                                $.animationUp({
                                    valve : '.animation-up' + i,          // 动作触发，为空直接触发
                                    wrapper : '.wtm-bottom-mask' + i,    // 动作块
                                    scroll : '.wtm-bottom-mask-rolling' + i,     // 滚动块，为空不触发滚动
                                });
                            }
                            // 领店铺代金券
                            $('.wtm-voucher-list').on('click', '.btn', function(){
                                getFreeVoucher($(this).attr('data-tid'));
                            });
                            $('.store-activity').click(function(){
                                $(this).css('height', 'auto');
                            });
                        }else{
                           alert(result.datas.error);
                        }
                    }
                }
            });
        }
        initCartList();
        //删除购物车
        function delCartList(cart_id){
            $.ajax({
                url:MapiUrl+"/index.php?w=member_cart&t=cart_del",
                type:"post",
                data:{key:key,cart_id:cart_id},
                dataType:"json",
                success:function (res){
                    if(checkLogin(res.login)){
                        if(!res.datas.error && res.datas == "1"){
                            initCartList();
                            localStorage.removeItem('cart_count');
                            // 更新购物车中商品数量
                            getCartCount();
                        }else{
                            alert(res.datas.error);
                        }
                    }
                }
            });
        }
        //购买数量减
        function minusBuyNum(){
            var self = this;
            editQuantity(self,"minus");
        }
        //购买数量加
        function addBuyNum(){
            var self = this;
            editQuantity(self,"add");
        }
        //购买数量增或减，请求获取新的价格
        function editQuantity(self,type){
            var sPrents = $(self).parents(".cart-litemw-cnt");
            var cart_id = sPrents.attr("cart_id");
            var numInput = sPrents.find(".buy-num");
            var goodsPrice = sPrents.find(".goods-price");
            var buynum = parseInt(numInput.val());
	    var goods_id = sPrents.attr("goods_id");
            var quantity = 1;
            if(type == "add"){
                quantity = parseInt(buynum+1);
            }else {
                if(buynum >1){
                    quantity = parseInt(buynum-1);
                }else {
                    return false;
                }
            }
            $('.pre-loading').removeClass('hide');
            $.ajax({
                url:MapiUrl+"/index.php?w=member_cart&t=cart_edit_quantity",
                type:"post",
                data:{key:key,cart_id:cart_id,quantity:quantity,goods_id:goods_id},
                dataType:"json",
                success:function (res){
                    if(checkLogin(res.login)){
                        if(!res.datas.error){
                            numInput.val(quantity);
                            goodsPrice.html('￥<em>' + res.datas.goods_price + '</em>');
                            calculateTotalPrice();
                        }else{
                            $.sDialog({
                                skin:"red",
                                content:res.datas.error,
                                okBtn:false,
                                cancelBtn:false
                            });
                        }
                        $('.pre-loading').addClass('hide');
                    }
                }
            });
        }

        //去结算
        $('#cart-list-wp').on('click', ".check-out > a", function(){
            //购物车ID
            var cartIdArr = [];
            $('.cart-litemw-cnt').each(function(){
                if ($(this).find('input[name="cart_id"]').prop('checked')) {
                    var cartId = $(this).find('input[name="cart_id"]').val();
                    var cartNum = parseInt($(this).find('.value-box').find("input").val());
                    var cartIdNum = cartId+"|"+cartNum;
                    cartIdArr.push(cartIdNum);
                }
            });
            var cart_id = cartIdArr.toString();
            api.openWin({
      				name: 'buy',
      				url: 'order/buy.html?ifcart=1&cart_id='+cart_id,
      				bounces: false,
      				rect: {
      					x: 0,
      					y: 0,
      					w: 'auto',
      					h: 'auto'
      				}
      			});
            //window.location.href = "order/buy.html?ifcart=1&cart_id="+cart_id;
        });

        //验证
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
        function buyNumer(){
            $.sValid();
        }
    }

    // 店铺全选
    $('#cart-list-wp').on('click', '.store_checkbox', function(){
        $(this).parents('.wtm-cart-container').find('input[name="cart_id"]').prop('checked', $(this).prop('checked'));
        calculateTotalPrice();
    });
    // 所有全选
    $('#cart-list-wp').on('click', '.all_checkbox', function(){
        $('#cart-list-wp').find('input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        calculateTotalPrice();
    });

    $('#cart-list-wp').on('click', 'input[name="cart_id"]', function(){
        calculateTotalPrice();
    });


});

function calculateTotalPrice() {
    var totalPrice = parseFloat("0.00");
    $('.cart-litemw-cnt').each(function(){
        if ($(this).find('input[name="cart_id"]').prop('checked')) {
            totalPrice += parseFloat($(this).find('.goods-price').find('em').html()) * parseInt($(this).find('.value-box').find('input').val());
        }
    });
    $(".total-money").find('em').html(totalPrice.toFixed(2));
    check_button();
    return true;
}

function getGoods(goods_id, goods_num){

    var data = {};
    $.ajax({
        type:'get',
        url:MapiUrl+'/index.php?w=goods&t=goods_detail&goods_id='+goods_id + "&quanity=" + goods_num,
        dataType:'json',
        async:false,
        success:function(result){
            if (result.datas.error) {
                return false;
            }
            var pic = result.datas.goods_image.split(',');
            data.cart_id = goods_id;
            data.store_id = result.datas.store_info.store_id;
            data.store_name = result.datas.store_info.store_name;
            data.goods_id = goods_id;
            data.goods_name = result.datas.goods_content.goods_name;
            data.goods_price = result.datas.goods_content.goods_price;
            data.goods_num = goods_num;
            data.goods_image_url = pic[0];
            data.goods_sum = (parseInt(goods_num)*parseFloat(result.datas.goods_content.goods_price)).toFixed(2);
        }
    });
    return data;
}
function check_button() {
    var _has = false
    $('input[name="cart_id"]').each(function(){
        if ($(this).prop('checked')) {
            _has = true;
        }
    });
}
//v5.2 添加登录后，返回购物车
function car_login(){
	$api.setStorage('redirect_uri','/html/cart_list.html');
	window.location.href='member/login.html';
}
function car_register(){
	$api.setStorage('redirect_uri','/html/cart_list.html');
	window.location.href='member/register.html';
}
function goods_guesslike(){
    $.getJSON(MapiUrl + "/index.php?w=index&t=goods_guesslike", function (result) {
        var data = result.datas;
        var like_html = template.render('like_list', data);		
        $("#get_like").append(like_html);
    });
}