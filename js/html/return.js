var order_id,order_goods_id,goods_pay_price,goods_num;
apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return false;
    }
    $.getJSON(MapiUrl + '/index.php?w=member_refund&t=refund_form',{key:key,order_id:getQueryString('order_id'),order_goods_id:getQueryString('order_goods_id')}, function(result) {
        result.datas.MUrl = MUrl;
        $('#order-info-container').html(template.render('order-info-tmpl',result.datas));
        
        order_id = result.datas.order.order_id;
        order_goods_id = result.datas.goods.order_goods_id;
        
        // 退款原因
	    var _option = '';
	    for (var k in result.datas.reason_list) {
	        _option += '<option value="' + result.datas.reason_list[k].reason_id + '">' + result.datas.reason_list[k].reason_info + '</option>'
	    }
	    $('#refundReason').append(_option);
	    
	    // 可退金额
	    goods_pay_price = result.datas.goods.goods_pay_price;
	    $('input[name="refund_amount"]').val(goods_pay_price);
	    $('#returnAble').html('￥'+goods_pay_price);
	    
	    // 可退数量
	    goods_num = result.datas.goods.goods_num;
	    $('input[name="goods_num"]').val(goods_num);
        $('#goodsNum').html('最多' + goods_num + '件');
	    
	    // 图片上传
        $('input[name="refund_pic"]').ajaxUploadImage({
            url : MapiUrl + "/index.php?w=member_refund&t=upload_pic",
            data:{key:key},
            start :  function(element){
                element.parent().after('<div class="upload-loading"><i></i></div>');
                element.parent().siblings('.pic-thumb').remove();
            },
            success : function(element, result){
                checkLogin(result.login);
                if (result.datas.error) {
                    element.parent().siblings('.upload-loading').remove();
                    $.sDialog({
                        skin:"red",
                        content:'图片尺寸过大！',
                        okBtn:false,
                        cancelBtn:false
                    });
                    return false;
                }
                element.parent().after('<div class="pic-thumb"><img src="'+result.datas.pic+'"/></div>');
                element.parent().siblings('.upload-loading').remove();
                element.parents('a').next().val(result.datas.file_name);
            }
        });
        $('.btn-l').click(function(){
            var _form_param = $('form').serializeArray();
            var param = {};
            param.key = key;
            param.order_id = order_id;
            param.order_goods_id = order_goods_id;
            param.refund_type = 2;
            for (var i=0; i<_form_param.length; i++) {
                param[_form_param[i].name] = _form_param[i].value;
            }
            if (isNaN(parseFloat(param.refund_amount)) || parseFloat(param.refund_amount) > parseFloat(goods_pay_price) || parseFloat(param.refund_amount) == 0) {
                $.sDialog({
                    skin:"red",
                    content:'退款金额不能为空，或不能超过可退金额',
                    okBtn:false,
                    cancelBtn:false
                });
                return false;
            }
            if (param.buyer_message.length == 0) {
                $.sDialog({
                    skin:"red",
                    content:'请填写退款说明',
                    okBtn:false,
                    cancelBtn:false
                });
                return false;
            }
            if (isNaN(param.goods_num) || parseInt(param.goods_num) == 0 || parseInt(param.goods_num) > parseInt(goods_num)) {
                $.sDialog({
                    skin:"red",
                    content:'退货数据不能为空，或不能超过可退数量',
                    okBtn:false,
                    cancelBtn:false
                });
                return false;
            }
            // 退货申请提交
            $.ajax({
                type:'post',
                url:MapiUrl+'/index.php?w=member_refund&t=refund_post',
                data:param,
                dataType:'json',
                async:false,
                success:function(result){
                    checkLogin(result.login);
                    if (result.datas.error) {
                        $.sDialog({
                            skin:"red",
                            content:result.datas.error,
                            okBtn:false,
                            cancelBtn:false
                        });
                        return false;
                    }
                    window.location.href = 'member_return.html';
                }
            });
        });
    });
});