var page = paged;
var curpage = 1;
var hasMore = true;
var footer = false;
var reset = true;
var orderKey = '';

$(function(){
	var key = $api.getStorage('key');
	if(!key){
		window.location.href = '../html/member/login.html';
	}

	if (getQueryString('data-state') != '') {
	    $('#filtrate_ul').find('li').has('a[data-state="' + getQueryString('data-state')  + '"]').addClass('selected').siblings().removeClass("selected");
	}

    $('#search_btn').click(function(){
        reset = true;
    	initPage();
    });

	function initPage(){
	    if (reset) {
	        curpage = 1;
	        hasMore = true;
	    }
        $('.loading').remove();
        if (!hasMore) {
            return false;
        }
        hasMore = false;
	    var state_type = $('#filtrate_ul').find('.selected').find('a').attr('data-state');
	    var orderKey = $('#order_key').val();
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_fx&t=fx_bill&page="+page+"&curpage="+curpage,
			data:{key:key, bill_state:state_type, goods_name : orderKey},
			dataType:'json',
			success:function(result){
				checkLogin(result.login);//检测是否登录了
                if(result.code == 400){
                        $.sDialog({
                          skin:"red",
                          content:result.datas.error,
                          okBtn:false,
                          cancelBtn:false
                        });
                        WTback();
                        return false;
                 }
				curpage++;
                hasMore = result.hasmore;
                if (!hasMore) {
                    get_footer();
                }

				var data = result;
				data.MUrl = MUrl;//页面地址
				data.MapiUrl = MapiUrl;
				data.key = $api.getStorage('key');

				var html = template.render('order-list-tmpl', data);
				if (reset) {
				    reset = false;
				    $("#order-list").html(html);
				} else {
                    $("#order-list").append(html);
                }
			}
		});

	}




    $('#filtrate_ul').find('a').click(function(){
        $('#filtrate_ul').find('li').removeClass('selected');
        $(this).parent().addClass('selected').siblings().removeClass("selected");
        reset = true;
        window.scrollTo(0,0);
        initPage();
    });

    //初始化页面
    initPage();
    $(window).scroll(function(){
        if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
            initPage();
        }
    });
});
function get_footer() {
    if (!footer) {
        footer = true;
        $.ajax({
            url: 'fx_footer.js',
            dataType: "script"
          });
    }
}
