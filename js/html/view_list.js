var key = $api.getStorage('key');
$(function(){
    
    //渲染list
    var load_class = new wtScrollLoad();
    load_class.loadInit({
        'url':MapiUrl + '/index.php?w=member_goodsbrowse&t=browse_list',
        'getparam':{'key':key},
        'tmplid':'viewlist_data',
        'containerobj':$("#viewlist"),
        'iIntervalId':true,
        'data':{MUrl:MUrl}
    });

    $("#clearbtn").click(function(){
        $.ajax({
            type: 'post',
            url: MapiUrl + '/index.php?w=member_goodsbrowse&t=browse_clearall',
            data: {key: key},
            dataType: 'json',
            async: false,
            success: function(result) {
                if (result.code == 200) {
                    //$.sDialog({skin: "green", content: "清空成功", okBtn: false, cancelBtn: false});
                    location.href = 'views_list.html';
                }else{
                    $.sDialog({skin: "red", content: result.datas.error, okBtn: false, cancelBtn: false});
                }
            }
        });
    });
});

