$(function (){
	var cart_count = 0;
	cart_count = localStorage.getItem('cart_count');
    if (getQueryString('key') != '') {
        var key = getQueryString('key');
        var username = getQueryString('username');
        $api.setStorage('key', key);
        $api.setStorage('username', username);
    } else {
        var key = $api.getStorage('key');
    }
    var key = $api.getStorage('key');
	$('#logoutbtn').click(function(){
		var username = $api.getStorage('username');
		var key = $api.getStorage('key');
		var client = 'wap';
		$.ajax({
			type:'get',
			url:MapiUrl+'/index.php?w=logout',
			data:{username:username,key:key,client:client},
			success:function(result){
				if(result){
					$api.setStorage('wxout', '1');
					$api.rmStorage('username');
					$api.rmStorage('key');
					localStorage.removeItem('cart_count');
					location.href = '../../index.html';
				}
			}
		});
	});
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