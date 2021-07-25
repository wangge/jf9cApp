$(function(){
    $.getJSON(MapiUrl + '/index.php?w=document&t=privacy', function(result){
        $("#privacy").html(result.datas.doc_content);
    });
});