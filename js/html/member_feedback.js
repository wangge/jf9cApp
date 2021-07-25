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
    var post_data = 0;
    $('#feedbackbtn').click(function(){
		if (post_data) {
		    errorTipsShow("<p>正在处理中，请勿重复点击！</p>");
            return false;
        }
        var feedback = $('#feedback').val();
        if (feedback == '') {
            $.sDialog({
                skin:"red",
                content:'请填写反馈内容',
                okBtn:false,
                cancelBtn:false
            });
            return false;
        }
        post_data = 1;
        $.ajax({
            url:MapiUrl+"/index.php?w=member_feedback&t=feedback_add",
            type:"post",
            dataType:"json",
            data:{key:key, feedback:feedback},
            success:function (result){
                if(checkLogin(result.login)){
                    if(!result.datas.error){
                        errorTipsShow('<p>提交成功</p>');

                        setTimeout(function(){
							WTback();
                            //window.location.href = 'member.html';
                        }, 3000);
                    }else{
                        errorTipsShow('<p>' + result.datas.error + '</p>');
                    }
                }
            }
        });
    });
});