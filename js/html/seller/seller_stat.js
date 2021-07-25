$(function() { 
    if (getQueryString("seller_key") != "") {
        var a = getQueryString("seller_key");
        $api.setStorage("seller_key", a);
    } else {
        var a = $api.getStorage("seller_key");
    }
    if(!a){
        window.location.href = '../member/login.html';
    }
    if (a) {
        $.ajax({
            type: "post",
            url: MapiUrl + "/index.php?w=seller_stat&t=ordersamount",
            data: {
                key: a,
				stattype:'year'
            },
            dataType: "json",
            success: function(a) {  
                 document.write(JSON.stringify(a));
            } 
        })
    }
    $.scrollTransparent()
});