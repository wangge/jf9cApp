apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return false;
    }
    var order_id = getQueryString("order_id");

    var isEmpty = function(o) {
        if (typeof o != "object")
            return ! o;
        for (var i in o)
            return false;
        return true;
    };

    $.ajax({
        type: 'post',
        url: MapiUrl + "/index.php?w=member_order_vr&t=indate_code_list",
        data:{key:key,order_id:order_id},
        dataType:'json',
        success:function(result) {
            //检测是否登录了
            checkLogin(result.login);

            var data = (result && result.datas) || {};
            if (isEmpty(data)) {
                data = {};
            }
            if (isEmpty(data.code_list)) {
                data.err = data.error || '暂无可用的兑换码列表';
            }

            template.helper('toDateString', function (ts) {
                var d = new Date(parseInt(ts) * 1000);
                var s = '';
                s += d.getFullYear() + '年';
                s += (d.getMonth() + 1) + '月';
                s += d.getDate() + '日 ';
                s += d.getHours() + ':';
                s += d.getMinutes();
                return s;
            });

            var html = template.render('order-indatecode-tmpl', data);
            $("#order-indatecode").html(html);
        }
    });

});
