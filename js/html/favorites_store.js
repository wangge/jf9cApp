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
        return;
    }
	//渲染list
	var load_class = new wtScrollLoad();
	load_class.loadInit({
		'url':MapiUrl + '/index.php?w=member_favorites_store&t=favorites_list',
		'getparam':{'key':key},
		'tmplid':'sfavorites_list',
		'containerobj':$("#favorites_list"),
		'iIntervalId':true,
		'data':{MUrl:MUrl}
	});

	$("#favorites_list").on('click',"[wt_type='fav_del']",function(){
		var store_id = $(this).attr('data_id');
		if (store_id <= 0) {
			$.sDialog({skin: "red", content: '删除失败', okBtn: false, cancelBtn: false});
		}
		if(dropFavoriteStore(store_id)){
			$("#favitem_"+store_id).remove();
			if (!$.trim($("#favorites_list").html())) {
				location.href = 'favorites_store.html';
			}
		}
	});
});