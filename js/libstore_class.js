/**
 * 所有店铺分类 v3-b12
 */

var keyword = decodeURIComponent(getQueryString('keyword'));
var store_id = decodeURIComponent(getQueryString('store_id'));
if (keyword != '') {
    	$('#J_SearchQ').val(keyword);
    }
var mk_idc ;
$(function() {
       $.ajax({
        url:MapiUrl+"/index.php?w=libstore&t=store_class_list",
        type:'get',
        jsonp:'callback',
        dataType:'jsonp',
        success:function(result){
            var data = result.datas;
            data.MUrl = MUrl;
            var html = template.render('map_shop_class', data);
            $("#J_DroadLoad").html(html);
            var html = template.render('class_left_div', data);
            $("#class_left_content").html(html);
            var html = template.render('class_right_div', data);
            $("#class_right_content").html(html);
        }
    });
    param = {};
    keyword=$('#J_SearchQ').val();
    mk_idc=$('.shop-nav a').eq(0).data('mk_idc');
    if (keyword != '') {
        param.keyword = keyword;
    }
    if (store_id != '') {
        param.store_id = store_id;
    }
    if (mk_idc != '') {
        param.mk_idc = mk_idc;
    }
    $("#J_MapCompanySearch").on('click', '#J_SearchQ', function(){
        location.href = 'search_map.html?keyword=' + keyword;
    });
    page(1);

     $('#J_DroadLoad').on('click','.weui-media-box__title', function(event){
      var haSelected=$(this).parent().parent().parent().find('.categories').hasClass('selected');
	    $(this).parent().parent().parent().css('height','auto');
	    $(this).parent().parent().parent().find('.categories').removeClass("selected");
      if(haSelected){
        $(this).parent().parent().parent().find('.categories').removeClass("selected");
      }else{
        $(this).parent().parent().parent().find('.categories').addClass("selected");
      }
	});   
  $('#J_DroadLoad').on('click','span', function(event){
      var haSelected=$(this).hasClass('selected_blue');
	    $(this).parent().parent().parent().parent().parent().parent().find('span').removeClass("selected_blue");
	    $(this).parent().parent().parent().parent().parent().parent().find('span').css('background','#fff');
      if(haSelected){
        $(this).removeClass("selected_blue");
        $(this).css('background','#fff');
      }else{
        $(this).addClass("selected_blue");
        $(this).css('background','#4C8CDF');
      }
      var mk_idc;
      if(!haSelected){
       mk_idc = $(this).attr('mk_idc');        
      }
	    $.getJSON(MapiUrl + '/index.php?w=libstore&t=index', {mk_idc:mk_idc}, function(result){
	        var data = result.datas;
          var store_count=data.store_list.length;
          $("#store_count").html(data.store_count);
          var html = template.render('map_store_list', data);
          $(".store_list_cnt").html(html);
          var pages = Math.ceil(data.store_count/5)>100?100:Math.ceil(data.store_count/5);
         $('.page_box').html('<span onclick="prePage('+num+')">上一页</span>' +
                         '<span onclick="nextPage('+num+','+pages+')">下一页</span>' +
                         '<span style="width: 20px;padding-left: 50px;border: 0">' +
                         '<input type="number" class="pageNumber" value="'+num+'">/'+pages+'</span>' +
                         '<span onclick="turnToPage('+pages+')" class="turnToPage">确定</span>');
          new GlobalBind;
          if ($("#J_BaiduMap").length > 0) {
            var a = document.documentElement.clientHeight || document.body.clientHeight;
            $("#J_BaiduMap").css("height",a);
            var e = new BaiduMap;
            e.createMap();
            if ($("#J_CompanyMap").length > 0) {
                var i = $(".j_MapCompanyList").attr("data-bmapx");
                var n = $(".j_MapCompanyList").attr("data-bmapy");
                e.mapInit(i, n);
                if ($("#J_MapCompanyBox").attr("data-iswechat") != "true") {
                    window.onload = function() {
                        new Tips("路线规划中，请稍后...");
                        setTimeout(function() {
                            $("#J_AppExitTipWarp").remove();
                            if ($(".j_MapCompanyList").attr("data-distance") <= GLOBAL.Config.x_distance) {
                                $(".j_MapCompanyLocation").trigger("click")
                            }
                        }, 2500)
                    }
                }
            }
            var r = new Array;
            $(".j_MapcompanyPoint").each(function() {
                var a = $(this).attr("data-bmapx");
                var e = $(this).attr("data-bmapy");
                var i = new Array(a,e);
                r.push(i)
            });
            if (r) {
                e.mapSetIcon(r)
            }
        }
         
          
          
          
	    });
	});
  $("#search_store").click(function() {
          keyword = $('#J_SearchQ').val();
          $.getJSON(MapiUrl + '/index.php?w=libstore&t=index', {keyword:keyword}, function(result){
	        var data = result.datas;
          var store_count=data.store_list.length;
          $("#store_count").html(data.store_count);
          var html = template.render('map_store_list', data);
          $(".store_list_cnt").html(html);
          
          new GlobalBind;
          if ($("#J_BaiduMap").length > 0) {
            var a = document.documentElement.clientHeight || document.body.clientHeight;
            $("#J_BaiduMap").css("height",a);
            var e = new BaiduMap;
            e.createMap();
            if ($("#J_CompanyMap").length > 0) {
                var i = $(".j_MapCompanyList").attr("data-bmapx");
                var n = $(".j_MapCompanyList").attr("data-bmapy");
                e.mapInit(i, n);
                if ($("#J_MapCompanyBox").attr("data-iswechat") != "true") {
                    window.onload = function() {
                        new Tips("路线规划中，请稍后...");
                        setTimeout(function() {
                            $("#J_AppExitTipWarp").remove();
                            if ($(".j_MapCompanyList").attr("data-distance") <= GLOBAL.Config.x_distance) {
                                $(".j_MapCompanyLocation").trigger("click")
                            }
                        }, 2500)
                    }
                }
            }
            var r = new Array;
            $(".j_MapcompanyPoint").each(function() {
                var a = $(this).attr("data-bmapx");
                var e = $(this).attr("data-bmapy");
                var i = new Array(a,e);
                r.push(i)
            });
            if (r) {
                e.mapSetIcon(r)
            }
        }
          
          
          
          
	    });
        });
        
        $("#showClass").click(function() {
          var a = $(this).html();
          if(a=='展开'){
            $(this).html('折叠');
            $('#showDiv').css('height','334px');
          }else{
            $(this).html('展开');
            $('#showDiv').css('height','');
          }
          
        });
        $(".open_close").click(function() {
          var a = $(this).html();
          if(a=='展'){
            $(this).html('收');
            $('.mapCompany .mapCompany-shoplist ul').css('max-height','355px');
          }else{
            $(this).html('展');
            $('.mapCompany .mapCompany-shoplist ul').css('max-height','204px');
          }
          
        });
});