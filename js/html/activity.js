$(function(){
    var activity_id = getQueryString('activity_id');
		if (activity_id=='') {
    window.location.href = '../index.html';
	}else {
		loadActivity(activity_id);
	}
});

function loadActivity(activity_id){
    $.ajax({
        url: MapiUrl + "/index.php?w=activity&t=activity_show&activity_id=" + activity_id,
        type: 'get',
        dataType: 'json',
        success: function(result) {
			
			if(result.code == 200){
            $('title,h1').html(result.datas.html_title);   
			
			if(!result) {
    		result = [];
    		result.datas = [];
    		result.datas.activity = [];
			result.datas.list = [];
			}
			var activity_pic = template.render('activity_pic', result);
			$("#activity_top").append(activity_pic);
			var list_goods = template.render('list_goods', result);
			$("#activity_goods_list").append(list_goods);
		}else {
				$.sDialog({
						skin:"red",
						content:result.datas.error,
						okBtn:false,
						cancelBtn:false
					});
			setTimeout("location.href = '../index.html'",2000);
			}
        }
    });

}
