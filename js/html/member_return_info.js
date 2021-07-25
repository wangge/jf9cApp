$(function(){
    var key = $api.getStorage('key');
    var return_id = getQueryString("refund_id");
    template.helper('isEmpty', function(o) {
        for (var i in o) {
            return false;
        }
        return true;
    });
    $.getJSON(MapiUrl + '/index.php?w=member_return&t=get_return_info', {key:key,return_id:return_id}, function(result){
        $('#return-info-div').html(template.render('return-info-script', result.datas));
    });
});