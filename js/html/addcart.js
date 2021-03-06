//添加到购物车
function addcart(ele){
  var e = $api.getStorage("key");
  var t =1;
  var a = 0;
  var new_i="";
  var r=ele.attributes["goods_id"].nodeValue;
  if (isEmpty(e)) {
    var o = decodeURIComponent(localStorage.getItem("goods_cart"));
    if (r < 1) {
        show_tip_new(ele);
        return false
    }
    if (o=='null'||o=='') {
        o = r + "," + t;
        a = 1;
    } else {
        var old_insert=false;
        var i = o.split("|");
        for (var n = 0; n < i.length; n++) {
            var l = i[n].split(",");
            if (l[0]==r) {
              old_insert=true;
              var new_num=parseInt(parseInt(l[1])+1);
              $('#amount_'+r).html(new_num);
              $('#del_'+r).show();
              $('#amount_'+r).show();
              a=a+new_num;
              new_i+=l[0]+','+new_num+'|';
            }else{
              new_i+=i[n]+'|';
              a+=parseInt(l[1]);
            }
        }
        o=new_i.substring(0,new_i.length-1);
        if(!old_insert){
          a+=1;
          o +='|'+r + "," + t;
        }
    }
    localStorage.setItem("goods_cart", o);
    localStorage.setItem("cart_count", a);
    show_tip_new(ele);
    getCartCount(e);
    setTimeout(function (){
        $(".cart-btn").html('<span id="cart_count"><sup>' +a+ '</sup><i></i></span>');
    }, 800);
    return false
  }else{
    $.ajax({
        url: MapiUrl + "/index.php?w=member_cart&t=cart_add",
        data: {
            key: e,
            goods_id: r,
            quantity: t
        },
        type: "post",
        success: function(e) {
            var t = $.parseJSON(e);
            if (checkLogin(t.login)) {
                if (!t.datas.error) {
                    show_tip_new(ele);
                    localStorage.removeItem("cart_count");
                    getCartCount(e);
                    $(".cart-btn").html('<span id="cart_count"><sup>' +localStorage.getItem("cart_count")+ '</sup><i></i></span>')
                } else {
                    $.sDialog({
                        skin: "red",
                        content: t.datas.error,
                        okBtn: false,
                        cancelBtn: false
                    })
                }
            }
        }
    })
  }
}
function s(e, t) {
    var o = e.length;
    while (o--) {
        if (e[o] === t) {
            return true
        }
    }
    return false
}
function show_tip_new(ele) {
    var goods_id=ele.attributes["goods_id"].nodeValue;
    var str="#goods_pic"+goods_id+" > img";
    var goods_pic=$("#goods_pic"+goods_id+" > img").first();
    var e = goods_pic.clone().css({
        "z-index": "999",
        height: "3rem",
        width: "3rem"
    });
    e.fly({
        start: {
            left: goods_pic.offset().left,
            top: goods_pic.offset().top - $(window).scrollTop()
        },
        end: {
            left: $(".cart-btn").offset().left + 40,
            top: $(".cart-btn").offset().top - $(window).scrollTop(),
            width: 0,
            height: 0
        },
        onEnd: function() {
            e.remove()
        }
    })
}
