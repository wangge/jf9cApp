$(function(){
    var key = $api.getStorage('key');
    //渲染list
    var load_class = new wtScrollLoad();
    load_class.loadInit({
        'url':MapiUrl + '/index.php?w=member_refund&t=get_refund_list',
        'getparam':{key :key },
        'tmplid':'refund-list-tmpl',
        'containerobj':$("#refund-list"),
        'iIntervalId':true,
        'data':{MUrl:MUrl}
    });
});