$(function (){
    var html = "";
	var cart_count = 0;
	cart_count = localStorage.getItem('cart_count');
	if(!cart_count){
		
	}
      	html = '<div id="footnav" class="footnav clearfix"><ul>'
		+'<li><a onclick="WtfootUrl(this)" url="'+MUrl+'/index.html"><i class="home"></i><p>首页</p></a></li>'
		+'<li><a onclick="WtfootUrl(this)" url="'+MUrl+'/html/categroy.html"><i class="categroy"></i><p>分类</p></a></li>'
		+'<li><a onclick="WtfootUrl(this)" url="'+MUrl+'/html/search.html"><i class="search"></i><p>搜索</p></a></li>'
		+'<li><a onclick="WtfootUrl(this)" url="'+MUrl+'/html/cart_list.html"><span id="cart_count"><i class="cart"></i><sup>' + cart_count + '</sup></span><p>购物车</p></a></li>'
		+'<li><a onclick="WtfootUrl(this)" url="'+MUrl+'/html/member/member.html"><i class="member"></i><p>我的</p></a></li></ul>'
		+'</div>';
	$("#footer").html(html);
	if(typeof(navigate_id) == 'undefined'){navigate_id="0";}
	//当前页面
	if(navigate_id == "1"){
		$(".footnav .home").parent().addClass("current");
		$(".footnav .home").attr('class','home2');
	}else if(navigate_id == "2"){
		$(".footnav .categroy").parent().addClass("current");
		$(".footnav .categroy").attr('class','categroy2');
	}else if(navigate_id == "3"){
		$(".footnav .search").parent().addClass("current");
		$(".footnav .search").attr('class','search2');
	}else if(navigate_id == "4"){
		$(".footnav .cart").parent().parent().addClass("current");
		$(".footnav .cart").attr('class','cart2');
	}else if(navigate_id == "5"){
		$(".footnav .member").parent().addClass("current");
		$(".footnav .member").attr('class','member2');
	}
});