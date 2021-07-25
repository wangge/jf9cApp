/*apiready=function(){
	api.addEventListener({
		name:'viewappear'
		}, function(ret, err){
		api.setStatusBarStyle({
		  style: 'dark',
		  color: 'rgba(255,255,255,0.9)'
		});
	});
}*/
var myScroll,
    category_one=[],
    categoryChlidList = {};
$(function() {
    $("#header").on('click', '.header-inp', function(){
        location.href = MUrl + '/html/search.html';
    });
	
    $.getJSON(MapiUrl+"/index.php?w=goods_class&t=get_child_all_list", function(result){
		var data = result.datas;
		data.MUrl = MUrl;
		var html = template.render('category-one', data);
		
        for (var i in data.list) {
            var category = data.list[i];
            categoryChlidList[category.gc_id] = category.gc_list;
			category_one = data.list[0];
        }
		
		$("#categroy-left").html(html);
		
		var categoryId = category_one.gc_id;
		var categoryList = categoryChlidList[categoryId];
		var html = template.render('category-two', {gc_list : categoryList,MUrl : MUrl});
		$("#categroy-right").html(html);
		$("#categroy-left").on('touchmove',function (e) {e.preventDefault()});//解决部分卡顿
		myScroll = new IScroll('#categroy-left', {mouseWheel: true, click: true});
		new IScroll('#categroy-right', {mouseWheel: true, click: true});
	});

	
	$('#categroy-left').on('click','.category', function(){
	    $('.pre-loading').show();
	    $(this).parent().addClass('selected').siblings().removeClass("selected");
	    var categoryId = $(this).attr('date-id');
        var categoryList = categoryChlidList[categoryId];
        var html = template.render('category-two', {gc_list : categoryList,MUrl : MUrl});
        $("#categroy-right").html(html);
	    $("#categroy-right").on('touchmove',function (e) {e.preventDefault()});//解决部分卡顿
        new IScroll('#categroy-right', {
			mouseWheel: true, click: true
		});
        myScroll.scrollToElement(document.querySelector('.categroy-list li:nth-child(' + ($(this).parent().index()+1) + ')'), 1000);
	});

});

function showDefault(id){
	var categoryId = id;
	var categoryList = categoryChlidList[categoryId];
	var html = template.render('category-two', {gc_list : categoryList,MUrl : MUrl});
	$("#categroy-right").html(html);
	$("#categroy-right").on('touchmove',function (e) {e.preventDefault()});//解决部分卡顿
	new IScroll('#categroy-right', {mouseWheel: true, click: true});
	myScroll.scrollToElement(document.querySelector('.categroy-list li:nth-child(' + ($(this).parent().index()+1) + ')'), 1000);
	
}
