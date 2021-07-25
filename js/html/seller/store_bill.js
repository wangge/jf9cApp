var page = paged;
var curpage = 1;
var hasMore = true;
var footer = false;
var reset = true;
var orderKey = "";
$(function() {
    var e = $api.getStorage("seller_key");
    if (!e) {
        window.location.href = "seller.html"
    }
    if (getQueryString("data-state") != "") {
        $("#filtrate_ul").find("li").has('a[data-state="' + getQueryString("data-state") + '"]').addClass("selected").siblings().removeClass("selected")
    }
    $("#search_btn").click(function() {
        reset = true;
        t()
    });
    $("#fixed_nav").waypoint(function() {
        $("#fixed_nav").toggleClass("fixed")
    },
    {
        offset: "50"
    });
    function t() {
        if (reset) {
            curpage = 1;
            hasMore = true
        }
        $(".loading").remove();
        if (!hasMore) {
            return false
        }
        hasMore = false;
        var t = $("#filtrate_ul").find(".selected").find("a").attr("data-state");
        var r = $("#order_key").val();
        $.ajax({
            type: "post",
            url: MapiUrl + "/index.php?w=seller_bill&t=list&page=" + page + "&curpage=" + curpage,
            data: {
                key: e,
                state_type: t,
                keyword : r
            },
            dataType: "json",
            success: function(e) {
                curpage++;
                hasMore = e.hasmore;
                if (!hasMore) {
                    get_footer()
                }
                if (e.datas.bill_list.length <= 0) {
                    $("#footer").addClass("posa")
                } else {
                    $("#footer").removeClass("posa")
                }
                var r = template.render("bill-list-tmpl", e);
                if (reset) {
                    reset = false;
                    $("#bill-list").html(r)
                } else {
                    $("#bill-list").append(r)
                }

           
		   }
        })
    }

	
	$("#filtrate_ul").find("a").click(function() {
        $("#filtrate_ul").find("li").removeClass("selected");
        $(this).parent().addClass("selected").siblings().removeClass("selected");
        reset = true;
        window.scrollTo(0, 0);
        t()
    });
    t();
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            t()
        }
    })
});
function get_footer() {
    if (!footer) {
        footer = true;
        $.ajax({
            url: "seller_footer.js",
            dataType: "script"
        })
    }
}