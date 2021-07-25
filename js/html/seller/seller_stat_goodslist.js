$(function() {
	if (getQueryString('seller_key') != '') {
		var key = getQueryString('seller_key');
		var seller_name = getQueryString('seller_name');
		$api.getStorage('seller_key', key);
		$api.getStorage('seller_name', seller_name);
	} else {
		var key = $api.getStorage('seller_key');
		var seller_name = $api.getStorage('seller_name');
	}
	if(key == ''){
		window.location.href= '../member/login.html';
	}
	if (key && seller_name) {
		$.ajax({
			type: 'post',
			url: MapiUrl + "/index.php?w=seller_stat_index&t=seller_stat_goodslist",
			data: {
				key: key
			},
			dataType: 'json',
			success: function(result) {
				var data = result.datas;
                if(data.error){
                	alert('请重新登录！');
		            window.location.href= '../member/login.html';	
                }
                
                
			}
		});
	}else{
        alert('请重新登录！');
		window.location.href= '../member/login.html';		
	};
})



function gcategoryInit(divId) {
	$("#" + divId + " > select").get(0).onchange = gcategoryChange;
	window.onerror = function() {
		return true
	};
	$("#" + divId + " .edit_gcategory").click(gcategoryEdit)
}
function gcategoryChange() {
	$(this).nextAll("select").remove();
	var selects = $(this).siblings("select").andSelf();
	var id = 0;
	var names = new Array();
	for (i = 0; i < selects.length; i++) {
		sel = selects[i];
		if (sel.value > 0) {
			id = sel.value;
			name = sel.options[sel.selectedIndex].text;
			names.push(name)
		}
	}
	$(this).parent().find(".mls_id").val(id);
	$(this).parent().find(".mls_name").val(name);
	$(this).parent().find(".mls_names").val(names.join("\t"));
	if (this.value > 0) {
		var _self = this;
		var url = SITEURL + '/index.php?con=index&fun=josn_class&callback=?';
		$.getJSON(url, {
			'gc_id': this.value
		}, function(data) {
			if (data) {
				if (data.length > 0) {
					$("<select class='class-select'><option value=''>-请选择-</option></select>").change(gcategoryChange).insertAfter(_self);
					var data = data;
					for (i = 0; i < data.length; i++) {
						$(_self).next("select").append("<option data-explain='" + data[i].commis_rate + "' value='" + data[i].gc_id + "'>" + data[i].gc_name + "</option>")
					}
				} else {
					$(_self).attr('end', '1')
				}
			}
		})
	}
}
function gcategoryEdit() {
	$(this).siblings("select").show();
	$(this).siblings("span").andSelf().remove()
}
function show_gc_1(depth, gc_json) {
	var html = '<select name="search_gc[]" id="search_gc_0" nc_type="search_gc" class="querySelect">';
	html += ('<option value="0">请选择...</option>');
	if (gc_json) {
		for (var i in gc_json) {
			if (gc_json[i].depth == 1) {
				html += ('<option value="' + gc_json[i].gc_id + '">' + gc_json[i].gc_name + '</option>')
			}
		}
	}
	html += '</select>';
	$("#searchgc_td").html(html)
}
function show_gc_2(chooseid, gc_json) {
	if (gc_json && chooseid > 0) {
		var childid = gc_json[chooseid].child;
		if (childid) {
			var html = '<select name="search_gc[]" id="search_gc_' + gc_json[chooseid].depth + '" nc_type="search_gc" class="querySelect">';
			html += ('<option value="0">请选择...</option>');
			var childid_arr = childid.split(",");
			if (childid_arr) {
				for (var i in childid_arr) {
					html += ('<option value="' + gc_json[childid_arr[i]].gc_id + '">' + gc_json[childid_arr[i]].gc_name + '</option>')
				}
			}
			html += '</select>';
			$("#searchgc_td").append(html)
		}
	}
}
function init_gcselect(chooseid_json, gc_json) {
	show_gc_1(1, gc_json);
	if (chooseid_json) {
		for (var i in chooseid_json) {
			show_gc_2(chooseid_json[i], gc_json);
			$('#search_gc_' + i).val(chooseid_json[i]);
			$('#choose_gcid').val(chooseid_json[i])
		}
	}
	$("[nc_type='search_gc']").on('change', function() {
		$(this).nextAll("[nc_type='search_gc']").remove();
		var chooseid = $(this).val();
		if (chooseid > 0) {
			$("#choose_gcid").val(chooseid);
			show_gc_2(chooseid, gc_json)
		} else {
			chooseid = $(this).prev().val();
			$("#choose_gcid").val(chooseid)
		}
	})
}