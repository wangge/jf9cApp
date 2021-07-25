// 积分订单 shopwt
apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var r = $api.getStorage('key');
    if (!r) {
        window.location.href = 'login.html';
        return false;
    }
    $.getJSON(MapiUrl + "/index.php?w=member_pointorder&t=order_info", {
        key: r,
        order_id: getQueryString("order_id")
    },
    function(t) {
        t.datas.MUrl = MUrl;
        $("#order-info-container").html(template.render("order-info-tmpl", t.datas));
        $(".cancel-order").click(e);
        $(".sure-order").click(o);

    });
    function e() {
        var r = $(this).attr("order_id");
        $.sDialog({
            content: "确定取消订单？",
            okFn: function() {
                t(r)
            }
        })
    }
    function t(e) {
        $.ajax({
            type: "post",
            url: MapiUrl + "/index.php?w=member_pointorder&t=cancel_order",
            data: {
                order_id: e,
                key: r
            },
            dataType: "json",
            success: function(r) {
                if (r.datas && r.datas == 1) {
                    window.location.reload()
                }
            }
        })
    }
    function o() {
        var r = $(this).attr("order_id");
        $.sDialog({
            content: "确定收到了货物吗？",
            okFn: function() {
                i(r)
            }
        })
    }
    function i(e) {
        $.ajax({
            type: "post",
            url: MapiUrl + "/index.php?w=member_pointorder&t=receiving_order",
            data: {
                order_id: e,
                key: r
            },
            dataType: "json",
            success: function(r) {
                if (r.datas && r.datas == 1) {
                    window.location.reload()
                }
            }
        })
    }

});
