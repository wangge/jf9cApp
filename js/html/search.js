var cart_count = 0;
	cart_count = localStorage.getItem('cart_count');
$(function(){
if(cart_count >0) {
	$(".footnav ul li sup").show().html(cart_count);
}
	Array.prototype.unique = function()
	{
		var n = [];
		for(var i = 0; i < this.length; i++)
		{
			if (n.indexOf(this[i]) == -1) n.push(this[i]);
		}
		return n;
	}
	var keyword = decodeURIComponent(getQueryString('keyword'));
    if (keyword) {
    	$('#keyword').val(keyword);writeClear($('#keyword'));
    }
    $('#keyword').on('input',function(){
    	var value = $.trim($('#keyword').val());
    	if (value == '') {
    		$('#search_tip_list_container').hide();
    	} else {
            $.getJSON(MapiUrl + '/index.php?w=goods&t=auto_complete',{term:$('#keyword').val()}, function(result) {
            	if (!result.datas.error) {
                	var data = result.datas;
                	data.MUrl = MUrl;
                	if (data.list.length > 0) {
                		$('#search_tip_list_container').html(template.render('search_tip_list_script',data)).show();
                	} else {
                		$('#search_tip_list_container').hide();
                	}
            	}
            })
    	}
    });

    $('.input-del').click(function(){
        $(this).parent().removeClass('write').find('input').val('');
		$api.rmStorage('deft_key_name');
	    $api.rmStorage('deft_key_value');
    });
    $('.del-hisSearch').click(function(){
        $.sDialog({skin: "green", content: '成功删除', okBtn: false, cancelBtn: false});
        $(this).parents().children("dd").remove();
        $api.rmStorage('hisSearch');
    });

    template.helper('$buildUrl',buildUrl);
    $.getJSON(MapiUrl + '/index.php?w=index&t=search_key_list', function(result) {
    	var data = result.datas;
    	data.MUrl = MUrl;
    	$('#hot_list_container').html(template.render('hot_list',data));
        $('#search_his_list_container').html(template.render('search_his_list',data));
    })

    $('#header-nav').click(function(){
    	if ($('#keyword').val() == '') {
			//$.sDialog({skin: "green", content: '请输入搜索关键字', okBtn: false, cancelBtn: false});
    		window.location.href = buildUrl('keyword',$api.getStorage('deft_key_value') ? $api.getStorage('deft_key_value') : '');
    	} else {
    		window.location.href = buildUrl('keyword',$('#keyword').val());
    	}
    });
        var key = $api.getStorage('key');
        if (key) {
         $.getJSON(MapiUrl + "/index.php?w=member_goodsbrowse&t=browse_list", {key:key}, function (result) {
                    var data = result.datas;
                    var html = template.render('browse_list', data);		
                    $("#get_browse").append(html);
                });
         }
});
