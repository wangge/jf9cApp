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
    if (!key) {
        window.location.href = '../member/login.html';
    }
	//滚动header固定到顶部
	$.scrollTransparent();
	
	//请求数据
	if (key && seller_name) {
		$.ajax({
			type: 'post',
			url: MapiUrl + "/index.php?w=seller_stat_index",
			data: {
				key: key
			},
			dataType: 'json',
			success: function(result) {
				var data = result.datas;
                if(data.error){
                	alert('请重新登录！');
		            location.href= '../member/login.html';		
                }
				var html = template.render('seller_stat_index', data);
				$("#seller_stat").html(html);
				/*var html = template.render('seller_stat_info', data);
				$("#seller_info").html(html);
				var html = template.render('seller_stat_other', data);
				$("#seller_other").html(html);	*/			
                var bjson = data.stattoday_json;
                var xAxis_categories = bjson.xAxis.categories;
                var legend_enabled = bjson.legend.enabled;
                var series_name = bjson.series[0].name;
                var series_data = bjson.series[0].data;
                var title_text = bjson.title.text;
                var title_x = bjson.title.x;
                var chart_type = bjson.chart.type;
                var colors = bjson.colors;
                var credits_enabled = bjson.credits.enabled;
                var exporting_enabled = bjson.exporting.enabled;
                var yAxis_title_text = bjson.yAxis.title.text;               

               $(document).ready(function() {
               	
				/**
				 * Highcharts 在 4.2.0 开始已经不依赖 jQuery 了，直接用其构造函数既可创建图表
				 **/
				var chart = new Highcharts.Chart('container', {
					title: {
						text: title_text,
						x: title_x
					},

					xAxis: {
						categories: xAxis_categories
					},
					yAxis: {
						title: {
							text: yAxis_title_text
						},
						plotLines: [{
							value: 0,
							width: 1,
							color: '#808080'
						}]
					},
					tooltip: {
						valueSuffix: '元'
					},
					legend: {
						enabled: legend_enabled,
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'middle',
						borderWidth: 0
					},
					series: [{
						name: series_name,
						data: series_data
					}]
				});});
			}
		});
	}else{
        alert('请重新登录！');
		location.href= '../member/login.html';		

	}
	
	
	

})