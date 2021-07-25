$(function(){
    $.getJSON(MapiUrl + '/index.php?w=document&t=agreement', function(result){
        $("#document").html(result.datas.doc_content);
    });
});