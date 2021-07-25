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
    $.getJSON(MapiUrl + '/index.php?w=member_index&t=my_asset', {key:key}, function(result){
        checkLogin(result.login);
        $('#predepoit').html(result.datas.predepoit+' 元');
        $('#rcb').html(result.datas.available_rc_balance+' 元');
        $('#voucher').html(result.datas.voucher+' 张');
        $('#coupon').html(result.datas.coupon+' 个');
        $('#point').html(result.datas.point+' 分');
    });
});