var page = paged;
var curpage = 1;
var hasMore = true;
var footer = false;
var reset = true;
var orderKey = '';
var cate_id = 0;
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var clickable = isAndroid?false:true;
var myScroll,
    categoryChlidList = {};
$(function(){
	var key = $api.getStorage('key');
		if(!key){
			window.location.href = '../html/member/login.html';
	}

 $.getJSON(MapiUrl+"/index.php?w=goods_class&t=get_child_all_list", function(result){
		var data = result.datas;
		data.MUrl = MUrl;
		var html = template.render('category-one', data);
        for (var i in data.list) {
            var category = data.list[i];
            categoryChlidList[category.gc_id] = category.gc_list;
        }
        cate_id = parseInt(data.list[0].gc_id);
		$("#categroy-left").html(html);
		$("#categroy-left").on('touchmove',function (e) {e.preventDefault()});//解决部分卡顿
		myScroll = new IScroll('#categroy-left', { mouseWheel: true, click: true });
	});

	$('#categroy-left').on('click','.category', function(){
        var obj = $(this);
	    $('.loading').show();
	    $(this).parent().addClass('selected').siblings().removeClass("selected");
        cate_id = parseInt(obj.attr('date-id'));
        curpage = 1;
		hasMore = true;
        reset = true;
        $('#goods_key').val('');
		initPage();
        $('.loading').hide();
        myScroll.scrollToElement(document.querySelector('.categroy-list li:nth-child(' + ($(this).parent().index()+1) + ')'), 1000);
	});
    

    $('#search_btn').click(function(){
        reset = true;
    	initPage();
    });


	function initPage(){
        var c_id = parseInt(cate_id);
		var goods_name = $('#goods_key').val();
	    if (reset) {
	        curpage = 1;
	        hasMore = true;
	    }
        $('.loading').remove();
        if (!hasMore) {
            return false;
        }
        hasMore = false;

		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_fx&t=fx_goods&page="+page+"&curpage="+curpage+"&cate_id="+c_id,
			data:{key:key,goods_name:goods_name},
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



    // 删除分销商品
    $('#order-list').on('click','.delete-fxgoods',deleteFxgoods);

   //删除分销商品
    function deleteFxgoods(){
        var fx_id = $(this).attr("fx_id");

        $.sDialog({
            content: '是否移除分销商品？',
            okFn: function() { deleteFxId(fx_id); }
        });
    }

    function deleteFxId(fx_id) {
        $.ajax({
            type:"post",
            url:MapiUrl+"/index.php?w=member_fx&t=drop_goods",
            data:{fx_id:fx_id,key:key},
            dataType:"json",
            success:function(result){
                if(result.datas && result.datas == 1){
                    reset = true;
                    initPage();
                } else {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
                }
            }
        });
    }
    //初始化页面
    initPage();
    $(window).scroll(function(){
        if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
            initPage();
        }
    });
});
