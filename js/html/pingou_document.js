$(function(){
    var headTitle = document.title;
    var html = '<div class="header-box">'
                    +'<div class="header-l">'
                    +'<a onclick="WTback(this)" href="javascript:;">'
					+'<i class="back"></i>'
					+'</a></div>'
                    +'<h1>'+headTitle+'</h1>'
                +'</div>';
    //渲染页面
    $("#header").html(html);
    
    $.getJSON(MapiUrl + '/index.php?w=pingou&t=agreement', function(result){
        $("#document").html(result.datas.doc_content);
    });
});