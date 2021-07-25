var page = paged;
var curpage = 1;
var hasmore = true;
var sc_id = getQueryString("sc_id");
var area_info = decodeURIComponent(getQueryString("area_info"));
var keyword = decodeURIComponent(getQueryString("keyword"));
$(function(){
	template.helper('formatnum', function(str) {
		return parseInt(str);
	});
	$("#area_info").on("click",
		function() {
			$.areaSelected({
				success: function(a) {
					$("#area_info").val(a.area_info).attr({
						"data-areaid": a.area_id,
						"data-areaid2": a.area_id_2 == 0 ? a.area_id_1: a.area_id_2
					});
                    location.href = 'shop.html?keyword='+keyword+'&area_info='+a.area_info;
				}
			})
    });

    if (keyword != "") {
        $("#shopkeyword").val(keyword);
    }
    shop_list();
	$(window).scroll(function() {
		if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
			shop_list()
		}
	});
    if (area_info != "") {
        $("#area_info").val(area_info);
    }
    
    $('#serach_store').click(function(){
		var keyword = encodeURIComponent($('#shopkeyword').val());
		var area_info = encodeURIComponent($('#area_info').val());
        location.href = 'shop.html?keyword='+keyword+'&area_info='+area_info;
    });
});

function shop_list() {
	if (!hasmore) {
		return false
	}
	hasmore = false;
	param = {};
	param.page = page;
	param.curpage = curpage;
	if (sc_id != "") {
		param.sc_id = sc_id
	} else if (keyword != "") {
		param.keyword = keyword
	} 
	$.getJSON(MapiUrl + "/index.php?w=shopapp&t=shop_list" + window.location.search.replace("?", "&"), param, function(result) {
		if (!result) {
			result = [];
			result.datas = [];
			result.datas.shop_list = []
		}
		curpage++;
		var html = template.render('category-one', result.datas);
		$("#categroy-right").append(html);
		hasmore = result.hasmore
	})
}
