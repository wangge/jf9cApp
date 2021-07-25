/**
 * 所有店铺分类 v3-b12
 */


$(function() {
    $.ajax({
        url:MapiUrl+"/index.php?w=shop_class",
        type:'get',
        jsonp:'callback',
        dataType:'jsonp',
        success:function(result){
            var data = result.datas;
            data.MUrl = MUrl;
            var html = template.render('category-one', data);
            $("#categroy-right").html(html);
        }
    });
});