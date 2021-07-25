apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var key = $api.getStorage('seller_key');
    if (!key) {
        window.location.href = 'seller.html';
        return false;
    }
    template.helper('isEmpty', function(o) {
        for (var i in o) {
            return false;
        }
        return true;
    });

    $.ajax({
        type: 'post',
        url: MapiUrl+'/index.php?w=seller_chat&t=get_user_list',
        data: {key:key,recent:1},
        dataType:'json',
        success: function(result){
            checkLogin(result.login);
            var data = result.datas;
            //渲染模板
            $("#messageList").html(template.render('messageListScript', data));
            $('.msg-list-del').click(function(){
                var t_id = $(this).attr('t_id');
                $.ajax({
                    type: 'post',
                    url: MapiUrl+'/index.php?w=seller_chat&t=del_msg',
                    data: {key:key,t_id:t_id},
                    dataType:'json',
                    success: function(result){
                        if (result.code == 200) {
                            location.reload();
                        } else {
                            $.sDialog({
                                skin:"red",
                                content:result.datas.error,
                                okBtn:false,
                                cancelBtn:false
                            });
                            return false;
                        }
                    }
                });
            });
        }
    });
});
