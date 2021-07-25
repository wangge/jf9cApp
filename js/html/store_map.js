$(function() {
    var key = getCookie('key');
    var store_id = getQueryString("store_id");
    if(!store_id){
        window.location.href = MUrl+'/index.html';
    }
    $("#goods_search").attr('href','store_search.html?store_id='+store_id);
    $("#store_intro").attr('href','store_info.html?store_id='+store_id);
    //加载店铺详情
    $.ajax({
        type: 'post',
        url: MapiUrl + "/index.php?w=store&t=store_info",
        data: {key: key, store_id: store_id},
        dataType: 'json',
        success: function(result) {
			if (result.datas.error) {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
					setTimeout("location.href = MUrl+'/shop.html'",3000);
					return false;
             }
        	var htmla = '';
            var data = result.datas;
            var urlstore = MUrl+"/html/store.html?store_id=" + data.store_info.store_id;
            $("#store-id").attr("href",urlstore);
            //显示页面title
            var title = data.store_info.store_name+'-'+data.store_info.site_name+'';
            document.title = title;
             var store_decoration = data.store_info.mb_store_decoration_switch ;
            $("meta[name='description']").attr('content',""+data.store_info.store_name+'，包括：'+data.store_info.store_keywords+'；'+data.store_info.store_description+'。'+"");
            $("meta[name='keywords']").attr('content',""+data.store_info.store_keywords+"");
          
          if (!data.store_info.node_chat) {
		    $('.store_kefu').hide();
		    //$('.wtm-store-bottom li').css('width','20%');
	    }
            //联系客服
            $('#store_kefu').click(function(){
                window.location.href = MUrl+'/html/member/im.html?t_id=' + result.datas.store_info.member_id;
            });
            //联系客服
            $('#store_tel').click(function(){
              $(this).attr('href','tel:' + result.datas.store_info.store_phone);
                //window.location.href = 'tel:' + result.datas.store_info.store_phone;
            });
			//联系客服
            $('#store_qq').click(function(){
                window.location.href = "https://wpa.qq.com/msgrd?v=3&uin=" + result.datas.store_info.store_qq + "&site=qq&menu=yes";
            });
           
			//地图
				  $('#baidu_map').css('width', '100%');
				  $('#baidu_map').css('height', '100%');
				  
				  var map = new BMap.Map("baidu_map");
				
				var city = new BMap.LocalCity();

				var currentArea = '';
				var currentCity = '';
				
				//map.enableScrollWheelZoom(true);
				city.get(local_city);
				function local_city(cityResult){
				
                  currentCity = cityResult.name;

          		var point = new BMap.Point(result.datas.store_info.baidu_lng, result.datas.store_info.baidu_lat);
                map.centerAndZoom(point, 16);  
                map.enableScrollWheelZoom(); 
                   var myIcon = new BMap.Icon(MUrl+"/images/ico_map.png",new BMap.Size(35,35),{
                    anchor: new BMap.Size(15,15)    
                });
                  var marker=new BMap.Marker(point,{icon: myIcon});  
 
    map.addOverlay(marker);  
    var licontent="<b>"+result.datas.store_info.store_name+"</b><br>";  
        licontent+="<span><strong>地址：</strong>"+result.datas.store_info.store_address+"</span><br>";  
        licontent+="<span><strong>电话：</strong>"+result.datas.store_info.store_phone+"</span><br>";          
    var opts = { 
        width : 200,
        height: 80,
    };         
    var  infoWindow = new BMap.InfoWindow(licontent, opts);  
    marker.openInfoWindow(infoWindow);  
    marker.addEventListener('click',function(){
        marker.openInfoWindow(infoWindow);
    });  
                
                }
          //地图end
          
          
          			//地图
			$('#store_addr_map').click(function(){
				  
              	$.sDialog({
                     skin:"red",
                     content:"正在定位导航中",
                     okBtn:false,
                     cancelBtn:false
                 });

    var map = new BMap.Map("baidu_map");

    var point = new BMap.Point(result.datas.store_info.baidu_lng, result.datas.store_info.baidu_lat);

    map.centerAndZoom(point, 16);

    map.enableScrollWheelZoom();

   // var myIcon = new BMap.Icon("myicon.png",new BMap.Size(30,30),{

    //    anchor: new BMap.Size(10,10)

   // });

   // var marker=new BMap.Marker(point,{icon: myIcon});

   // map.addOverlay(marker);

    var geolocation = new BMap.Geolocation();

    geolocation.getCurrentPosition(function(r){

        if(this.getStatus() == BMAP_STATUS_SUCCESS){

            var mk = new BMap.Marker(r.point);

            map.addOverlay(mk);

            var latCurrent = r.point.lat;

            var lngCurrent = r.point.lng;

            location.href="https://api.map.baidu.com/direction?origin="+latCurrent+","+lngCurrent+"&destination="+result.datas.store_info.baidu_lng+","+result.datas.store_info.baidu_lat+"&mode=driving&region="+currentCity+"&output=html";

            //destination 替换成经纬度、 注意别写反了
            //region 替换城市名称
        }

        else {

            //alert('failed'+this.getStatus());
                $.sDialog({
                     skin:"red",
                     content:"定位失败，请重新点击定位吧",
                     okBtn:false,
                     cancelBtn:false
                 });
        }

    },{enableHighAccuracy: true})
              
              
			});
          //点击导航end

           
              //店铺底部菜单
              if(data.store_info.mb_store_menu.on == 1){

                  var htmlac = '';
                  var newa = data.store_info.mb_store_menu;
                  var witj = 100 / newa.nou - 1;

                  if(newa.nou > 0){
                      $("#ccas").remove();
                      htmlac +="<ul id='ccas'>";
                      $.each(data.store_info.mb_store_menu.data, function(ktt, vtt) {

                          if(vtt.name){
                              htmlac +="<li style= width:"+  witj + "%><a href=" + vtt.links + ">" + vtt.name +"</a></li>";        	
                          }                  

                      })
                      htmlac +="</ul>";

                      $(".wtm-store-bottom").prepend(htmlac);

                  }	
              }
        }
    });



    //免费领取代金券
    $("#store_voucher").click(function(){
        if (!$("#store_voucher_con").html()) {
            $.ajax({
                type: 'post',
                url: MapiUrl + '/index.php?w=voucher&t=voucher_tpl_list',
                data: {store_id: store_id, gettype: 'free'},
                dataType: 'json',
                async: false,
                success: function(result) {
                    if (result.code == 200) {
                        var html = template.render('store_voucher_con_tpl', result.datas);
                        $("#store_voucher_con").html(html);
                    }
                }
            });
        }
        //从下到上动态显示隐藏内容
        $.animationUp({'valve':''});
    });
    //领店铺代金券
    $('#store_voucher_con').on('click', '[wt_type="getvoucher"]', function(){
        getFreeVoucher($(this).attr('data-tid'));
    });




});
