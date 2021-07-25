apiready = function () {
  var wxPlus = api.require('wxPlus');
  wxPlus.isInstalled(function(ret, err) {
  	if (ret.installed) {
    } else {
      $("#share_link").hide();
    }
  });
      getChatCount();// 导航右侧消息
  //下拉刷新
  //refreshList();
}
//权限处理str
//判断
// app动态权限控制
// perm_: 请求单个或多个权限（逗号分隔）
// opts_.callback: 请求的权限已全部允许,执行回调
function confirmPermission (perm_,opts_) {
    var permArr=perm_.split(',');
    var hasPerm=api.hasPermission({
        list:permArr
    });
    //console.log('hasPerm:'+JSON.stringify(hasPerm));
    var allGranted=true;//申请的权限是否全部已打开
    for (var i = 0; i < hasPerm.length; i++) {
        if(!hasPerm[i].granted){
            allGranted=false;
            // api.confirm({
            //     title: '提醒',
            //     msg: '没有获得 ' + permTxt[hasPerm[i]['name']] + " 权限\n是否前往设置？",
            //     buttons: ['去设置', '取消']
            // }, function(ret, err) {
            //     if(1 == ret.buttonIndex){

            //     }
            // });
        }
    }
    if(!allGranted){
        var permTxt={
            'camera':'相机/拍照/录像',
            'contacts':'联系人读取/写入',
            'microphone':'麦克风',
            'photos':'相册',
            'location':'定位',
            'locationAlways':'后台定位，只支持iOS',
            //'notification':'状态栏通知',
            'calendar':'日历读取/写入。只支持Android',
            'phone':'手机识别码',
            'storage':'本地存储'
        };
        api.requestPermission({
            list:permArr
        },function(ret,err){
            console.log(JSON.stringify(ret))
            var list=ret.list,
                curName='';
            for (var i in list) {
                if(!list[i].granted){
                    curName=list[i].name;
                    setTimeout(function(){
                        api.toast({
                            msg: '获取"'+permTxt[curName]+'"权限被拒，对应功能无法正常使用！',
                            duration: 60000,
                            location: 'middle',
                            global:true
                        });
                    },0)
                    break;
                }else if(i==list.length-1){
                    console.log('用户允许获得权限');
                    // 请求的权限已全部允许,执行回调
                    opts_ && opts_.callback();
                }
            }
        })
    }else{
        //console.log('请求的权限已全部打开');
        // 请求的权限已全部打开,执行回调
        opts_ && opts_.callback();
    }
}


//仅限处理end
function WtOpenUrl(gname,gurl){
		if(!gurl){
			var thref = gname.getAttribute('url');
			var tname = gname.getAttribute('url');
			api.openWin({
				name: tname,
				url: thref,
				bounces: false,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			// 监听页面消失的时候，关掉页面
      /*api.addEventListener({
          name:tname
      },function(){
          api.closeWin();
      });*/
		}
		if(!tname){
			tname = gurl;
			thref = gurl;
			location.href = gurl;
	}
};
function WtLoginUrl(gname,gurl){
		if(!gurl){
			var thref = gname.getAttribute('url');
			var tname = gname.getAttribute('url');
			api.openWin({
				name: tname,
				url: thref,
				bounces: false,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
		}
		if(!tname){
			tname = gurl;
			thref = gurl;
			location.href = gurl;
	}
};
/*底部*/
function WtfootUrl(gname,gurl){
		if(!gurl){
			var thref = gname.getAttribute('url');
			var tname = gname.getAttribute('url');
			api.openWin({
				name: tname,
				url: thref,
				animation: {
					    type:"fade",
					    subType:"from_right",
					    duration:300
				},
				bounces: false,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			// 监听页面消失的时候，关掉页面
      /*api.addEventListener({
          name:tname
      },function(){
          api.closeWin();
      });*/
		}
		if(!tname){
			tname = gurl;
			thref = gurl;
			location.href = gurl;
	}
};
/*头部*/
function WtTopUrl(gname,gurl){
		if(!gurl){
			var thref = gname.getAttribute('url');
			var tname = gname.getAttribute('url');
			api.openWin({
				name: tname,
				url: thref,
				animation: {
					    type:"fade",
					    subType:"from_right",
					    duration:300
				},
				bounces: false,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			// 监听页面消失的时候，关掉页面
      /*api.addEventListener({
          name:tname
      },function(){
          api.closeWin();
      });*/
		}
		if(!tname){
			tname = gurl;
			thref = gurl;
			location.href = gurl;
	}
};
/*返回*/
function WTback(gname,gurl){
	api.sendEvent({
		name: 'LoginTo'
	});
	api.historyBack({
	},function(ret,err){
		if(!ret.status){
			api.closeWin();
		}
	});
};
//刷新页面
//登录成功
function GoToRefresh() {
    api.sendEvent({
        name: 'WtRefresh',
        extra: {
            msg: '登录成功'
        }
    });
    setTimeout(api.closeWin(),300);
};
//下拉刷新
function refreshList(){
  api.setCustomRefreshHeaderInfo({
    bgColor : '#eee',
    images : ['widget://image/dropdown_anim_00.png', 'widget://image/dropdown_anim_01.png', 'widget://image/dropdown_anim_02.png', 'widget://image/dropdown_anim_03.png', 'widget://image/dropdown_anim_04.png', 'widget://image/dropdown_anim_05.png', 'widget://image/dropdown_anim_06.png','widget://image/dropdown_anim_07.png','widget://image/dropdown_anim_08.png','widget://image/dropdown_anim_09.png','widget://image/dropdown_anim_10.png'],
    animationRate:0.2
  }, function() {
    setTimeout(function () {
      api.refreshHeaderLoadDone();
      location.reload();
    }, 1000);
    api.addEventListener({
      name : 'shake'
    }, function(ret, err) {
      api.refreshHeaderLoadDone()
    });
  });
};
// 2.跳转页面，从下往上打开，统一控制样式
function goPageFromBottom(pageName, urlName, pageParam) {
    api.openWin({
        name: pageName, // 例如 login，关闭win、frame时找该参数
        url: urlName, // 例如 login.html
        pageParam: pageParam, // 例如 {id:1,name:'zhangsan'}
        animation: {
            type: "fade", //动画类型（详见动画类型常量）
            subType: "from_bottom", // 从下往上
            duration: 300 //动画过渡时间，默认300毫秒
        }
    });
};
// 2.跳转页面，渐变的方式，统一控制样式
function goPageFromfade(pageName, urlName, pageParam) {
    api.openWin({
        name: pageName, // 例如 login，关闭win、frame时找该参数
        url: urlName, // 例如 login.html
        pageParam: pageParam, // 例如 {id:1,name:'zhangsan'}
				animation: {
					    type:"fade",
					    subType:"from_right",
					    duration:300
						},
						bounces: false,
						rect: {
							x: 0,
							y: 0,
							w: 'auto',
							h: 'auto'
						}
					});
};
//返回关闭当前窗口
function WTCloseWin() {
	setTimeout(function () {
		api.closeWin();
	}, 500);
}
//返回首页
function WThome() {
	setTimeout(function () {
	api.closeToWin({
	    name: 'root'
	});
	}, 300);
}
function WTmember(m_index) {
		/*setTimeout(function () {
		api.closeToWin({
		    name: 'root'
		});
	}, 300);*/
	 api.setFrameGroupIndex({
			 name : 'group',
			 index : m_index,
			 scroll : true
	 });
	}
  function SendNotification(r_state,site_name) {
  			if(r_state > 0){
  					api.notification({
                    sound:'widget://image/msg2.mp3',
  									notify : {
  										title: '系统通知',                //标题，Android中默认值为应用名称，支持Android和iOS 8.2以上系统
  								    content:'【'+site_name+'】提醒：您有最新消息',                //内容，默认值为'有新消息'
  								    extra:'',                   //附加信息，页面可以监听noticeclicked事件得到点击的通知的附加信息
  								    updateCurrent: true    //是否覆盖更新已有的通知，取值范围true|false。只Android有效
  									}
  					}, function(ret, err) {
  									//noticeId为主页的页面变量
  									//noticeId = ret.id;
  								SendNotification2();
  					});
  		}
  }
  function SendNotification2() {
  			api.addEventListener({
  					name:'noticeclicked'
  			},function(ret,err){
  					var value = ret.value;
  					if(ret.type == 0){
  							//APICloud推送内容
  					} else if(ret.type == 1){
  							//开发者自定义消息
  										api.openWin({
  												name: 'im_list',
  												url: 'widget://html/member/im_list.html'
  										});
  					}
  			});
  }
////////////////////////////////////////////////////////////////////
function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return r[2]; return '';
}

function addCookie(name,value,expireHours){
	var cookieString=name+"="+escape(value)+"; path=/";
	if(expireHours>0){
		var date=new Date();
		date.setTime(date.getTime()+expireHours*3600*1000);
		cookieString=cookieString+";expires="+date.toGMTString();
	}
	document.cookie=cookieString;
}

function getCookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split("; ");
	for(var i=0;i<arrcookie.length;i++){
	var arr=arrcookie[i].split("=");
	if(arr[0]==name)return unescape(arr[1]);
	}
	return null;
}

function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
}

function checkLogin(state){
	if(state == 0){

		$api.rmStorage('username');
		$api.rmStorage('key');
		localStorage.removeItem('cart_count');
		$api.rmStorage("seller_name");
		$api.rmStorage("store_name");
		$api.rmStorage("seller_key");
		$api.rmStorage("is_seller");
		//location.href = 'widget://html/member/login.html';
    api.openWin({
        name: 'LoginTo',
        url: 'widget://html/member/login.html',
        animation: {
              type:"fade",
              subType:"from_right",
              duration:300
            },
            bounces: false,
            rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
            }
          });
        return false;
	}else {
		return true;
	}
}

function contains(arr, str) {
    var i = arr.length;
    while (i--) {
           if (arr[i] === str) {
           return true;
           }
    }
    return false;
}

function baseUrl(type, data) {
    switch (type) {
        case 'keyword':
            return 'html/goods_list.html?keyword=' + encodeURIComponent(data);
        case 'special':
            return 'special.html?special_id=' + data;
        case 'goods':
            return 'html/goods_detail.html?goods_id=' + data;
        case 'url':
            return data;
    }
    return MUrl;
}

function buildUrl(type, data) {
    switch (type) {
        case 'keyword':
            return  'goods_list.html?keyword=' + encodeURIComponent(data);
        case 'special':
            return  '../special.html?special_id=' + data;
        case 'goods':
            return 'goods_detail.html?goods_id=' + data;
        case 'url':
            return data;
    }
    return MUrl;
}

function errorTipsShow(html) {
    $(".error-tips").html(html).show();
    setTimeout(function(){
        errorTipsHide();
    }, 3000);
}

function errorTipsHide() {
    $(".error-tips").html("").hide();
}

function writeClear(o) {
    if (o.val().length > 0) {
        o.parent().addClass('write');
    } else {
        o.parent().removeClass('write');
    }
    btnCheck(o.parents('form'));
}

function btnCheck(form) {
    var btn = true;
    form.find('input').each(function(){
        if ($(this).hasClass('no-follow')) {
            return;
        }
        if ($(this).val().length == 0) {
            btn = false;
        }
    });
}

/**
 * 取得默认系统搜索关键词
 * @param cmd
 */
function getSearchName() {
	var keyword = decodeURIComponent(getQueryString('keyword'));
	if (keyword == '') {
	    if($api.getStorage('deft_key_value') == null || $api.getStorage('deft_key_value') == '') {
	        $.getJSON(MapiUrl + '/index.php?w=index&t=search_hot_info', function(result) {
	        	var data = result.datas.hot_info;
	        	if(typeof data.name != 'undefined') {
	            	$('#keyword').attr('placeholder',data.name);
	            	$('#keyword').html(data.name);
	            	$api.setStorage('deft_key_name',data.name,1);
	            	$api.setStorage('deft_key_value',data.value,1);
	        	} else {
	            	$api.setStorage('deft_key_name','',1);
	            	$api.setStorage('deft_key_value','',1);
	        	}
	        })
	    } else {
	    	$('#keyword').attr('placeholder',$api.getStorage('deft_key_name'));
	    	$('#keyword').html($api.getStorage('deft_key_name'));
	    }
	}
}
// 免费领代金券
function getFreeVoucher(tid) {
    var key = $api.getStorage('key');
    if (!key) { checkLogin(0); return; }
    $.ajax({
        type:'post',
        url:MapiUrl+"/index.php?w=member_voucher&t=voucher_freeex",
        data:{tid:tid,key:key},
        dataType:'json',
        success:function(result){
            checkLogin(result.login);
            var msg = '领取成功';
            var skin = 'green';
            if(result.datas.error){
                msg = '领取失败：' + result.datas.error;
                skin = 'red';
            }
            $.sDialog({
                skin:skin,
                content: msg,
                okBtn:false,
                cancelBtn:false
            });
        }
    });
}

// 登陆后更新购物车
function updateCookieCart(key) {
    var cartlist = decodeURIComponent(localStorage.getItem('goods_cart'));
    if (cartlist) {
        $.ajax({
            type:'post',
            url:MapiUrl+'/index.php?w=member_cart&t=cart_batchadd',
            data:{key:key, cartlist:cartlist},
            dataType:'json',
            async:false
        });
        localStorage.removeItem('goods_cart');
    }
}
/**
 * 查询购物车中商品数量
 * @param key
 * @param expireHours
 */
function getCartCount(key) {
    var cart_count = 0;
    if ($api.getStorage("key") !== null && localStorage.getItem('cart_count') === null) {
        var key = $api.getStorage("key");
        $.ajax({
            type:'post',
            url:MapiUrl+'/index.php?w=member_cart&t=cart_count',
            data:{key:key},
            dataType:'json',
            async:false,
            success:function (result) {
                if (typeof(result.datas.cart_count) != 'undefined') {
                    localStorage.setItem('cart_count',result.datas.cart_count);
                    cart_count = result.datas.cart_count;
                }
            }
        });
    } else {
        cart_count = localStorage.getItem('cart_count');
    }
    if (cart_count > 0 && $('.wtm-nav-menu').has('.cart').length > 0) {
        $('.wtm-nav-menu').has('.cart').find('.cart').parents('li').find('sup').show();
        $('#header-nav').find('sup').show();
    }
}
/**
 * 查询是否有新消息
 */
 function getChatCount() {
     if ($('#header').find('.message').length > 0) {
         var key = $api.getStorage('key');
         if (key !== null) {
             $.getJSON(MapiUrl+'/index.php?w=member_chat&t=get_user_list', {key:key}, function(result){
              for (var k in result.datas.list) {
     	        	if (result.datas.list[k].r_state == '2' || result.datas.countnum > 0) {
                         $('#header').find('.message').parent().find('sup').show();
                         $('#header-nav').find('sup').show();
                         var chat_state = result.datas.list[k].r_state;
                         if(chat_state == '2'){
                           chat_state = 1;
                         } else{
                           chat_state = 0;
                         }
                         var r_state = parseInt(result.datas.countnum)+parseInt(chat_state);
                         var site_name = result.datas.site_name;
                           SendNotification(r_state,site_name);
                           api.setAppIconBadge({
                               badge: r_state
                           });
                     }
     	    	    }
          });
         }

    }
}

$(function() {
    $('.input-del').click(function(){
        $(this).parent().removeClass('write').find('input').val('');
        btnCheck($(this).parents('form'));
    });
	
	// radio样式
	$('body').on('click', 'label', function(){
	    if ($(this).has('input[type="radio"]').length > 0) {
	        $(this).addClass('checked').siblings().removeAttr('class').find('input[type="radio"]').removeAttr('checked');
	    } else if ($(this).has('[type="checkbox"]')) {
	        if ($(this).find('input[type="checkbox"]').prop('checked')) {
	            $(this).addClass('checked');
	        } else {
	            $(this).removeClass('checked');
	        }
	    }
  	});
    // 滚动条通用js
    if ($('body').hasClass('scroller-body')) {
        new IScroll('.scroller-body', {
			mouseWheel: true, click: true
		});
    }

    // 右上侧小导航控件
    $('#header').on('click', '#header-nav', function(){
        if ($('.wtm-nav-box').hasClass('show')) {
            $('.wtm-nav-box').removeClass('show');
        } else {
            $('.wtm-nav-box').addClass('show');
        }
    });
    $('#header').on('click', '.wtm-nav-box',function(){
        $('.wtm-nav-box').removeClass('show');
    });
    $(document).scroll(function(){
        $('.wtm-nav-box').removeClass('show');
    });
    getSearchName();
    getCartCount();



    //回到顶部
    $(document).scroll(function(){
        set();
    });
    $('.fix-block-r,footer').on('click', ".gotop",function (){
        btn = $(this)[0];
        this.timer=setInterval(function(){
            $(window).scrollTop(Math.floor($(window).scrollTop()*0.8));
            if($(window).scrollTop()==0) clearInterval(btn.timer,set);
        },10);
    });
    function set(){$(window).scrollTop()==0 ? $('#goTopBtn').addClass('hide') : $('#goTopBtn').removeClass('hide');}
});
(function($) {
    $.extend($, {
        /**
         * 滚动header固定到顶部
         */
        scrollTransparent: function(options) {
            var defaults = {
                    valve : '#header',          // 动作触发
                    scrollHeight : 50
            }
            var options = $.extend({}, defaults, options);
            function _init() {
                $(window).scroll(function(){
                    if ($(window).scrollTop() <= options.scrollHeight) {
                        $(options.valve).addClass('transparent').removeClass('posf');
                    } else {
                        $(options.valve).addClass('posf').removeClass('transparent');
                    }
                });

            }
            return this.each(function() {
                _init();
            })();
        },

    /**
     * 选择地区
     *
     * @param $
     */
        areaSelected: function(options) {
            var defaults = {
                    success : function(data){}
                }
            var options = $.extend({}, defaults, options);
            var ASID = 0;
            var ASID_1 = 0;
            var ASID_2 = 0;
            var ASID_3 = 0;
            var ASNAME = '';
            var ASINFO = '';
            var ASDEEP = 1;
            var ASINIT = true;
            function _init() {
                if ($('#areaSelected').length > 0) {
                    $('#areaSelected').remove();
                }
                var html = '<div id="areaSelected">'
                    + '<div class="wtm-full-mask left">'
                    + '<div class="wtm-full-mask-bg"></div>'
                    + '<div class="wtm-full-mask-block">'
                    + '<div class="header">'
                    + '<div class="header-box">'
                    + '<div class="header-l"><a href="javascript:void(0);"><i class="back"></i></a></div>'
                    + '<div class="header-title">'
                    + '<h1>选择地区</h1>'
                    + '</div>'
                    + '<div class="header-r"><a href="javascript:void(0);"><i class="close"></i></a></div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="wtm-main-box">'
                    + '<div class="wtm-single-nav">'
                    + '<ul id="filtrate_ul" class="area">'
                    + '<li class="selected"><a href="javascript:void(0);">一级地区</a></li>'
                    + '<li><a href="javascript:void(0);" >二级地区</a></li>'
                    + '<li><a href="javascript:void(0);" >三级地区</a></li>'
                    + '</ul>'
                    + '</div>'
                    + '<div class="wtm-main-box-a"><ul class="wtm-default-list"></ul></div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                $('body').append(html);
                _getAreaList();
                _bindEvent();
                _close();
            }

            function _getAreaList() {
                $.ajax({//获取区域列表
                    type:'get',
                    url:MapiUrl+'/index.php?w=area&t=area_list',
                    data:{area_id:ASID},
                    dataType:'json',
                    async:false,
                    success:function(result){
                        if (result.datas.area_list.length == 0) {
                            _finish();
                            return false;
                        }
                        if (ASINIT) {
                            ASINIT = false
                        } else {
                            ASDEEP++;
                        }
                        $('#areaSelected').find('#filtrate_ul').find('li').eq(ASDEEP-1).addClass('selected').siblings().removeClass('selected');
                        checkLogin(result.login);
                        var data = result.datas;
                        var area_li = '';
                        for(var i=0;i<data.area_list.length;i++){
                            area_li += '<li><a href="javascript:void(0);" data-id="' + data.area_list[i].area_id + '" data-name="' + data.area_list[i].area_name + '"><h4>' + data.area_list[i].area_name + '</h4><span class="arrow-r"></span> </a></li>';
                        }
                        $('#areaSelected').find(".wtm-default-list").html(area_li);
                        if (typeof(myScrollArea) == 'undefined') {
                            if (typeof(IScroll) == 'undefined') {
                                $.ajax({
                                    url: MUrl+'/js/iscroll.js',
                                    dataType: "script",
                                    async: false
                                  });
                            }
                            myScrollArea = new IScroll('#areaSelected .wtm-main-box-a', {
								mouseWheel: true, click: true
							});
                        } else {
                            myScrollArea.destroy();
                            myScrollArea = new IScroll('#areaSelected .wtm-main-box-a', {
								mouseWheel: true, click: true
							});
                        }
                    }
                });
                return false;
            }

            function _bindEvent() {
                $('#areaSelected').find('.wtm-default-list').off('click', 'li > a');
                $('#areaSelected').find('.wtm-default-list').on('click', 'li > a', function(){
                    ASID = $(this).attr('data-id');
                    eval("ASID_"+ASDEEP+"=$(this).attr('data-id')");
                    ASNAME = $(this).attr('data-name');
                    ASINFO += ASNAME + ' ';
                    var _li = $('#areaSelected').find('#filtrate_ul').find('li').eq(ASDEEP);
                    _li.prev().find('a').attr({'data-id':ASID, 'data-name':ASNAME}).html(ASNAME);
                    if (ASDEEP == 3) {
                        _finish();
                        return false;
                    }
                    _getAreaList();
                });
                $('#areaSelected').find('#filtrate_ul').off('click', 'li > a');
                $('#areaSelected').find('#filtrate_ul').on('click', 'li > a', function(){
                    if ($(this).parent().index() >= $('#areaSelected').find('#filtrate_ul').find('.selected').index()) {
                        return false;
                    }
                    ASID = $(this).parent().prev().find('a').attr('data-id');
                    ASNAME = $(this).parent().prev().find('a').attr('data-name');
                    ASDEEP = $(this).parent().index();
                    ASINFO = '';
                    for (var i=0; i<$('#areaSelected').find('#filtrate_ul').find('a').length; i++) {
                        if (i < ASDEEP) {
                            ASINFO += $('#areaSelected').find('#filtrate_ul').find('a').eq(i).attr('data-name') + ' ';
                        } else {
                            var text = '';
                            switch (i) {
                            case 0:
                                text = '一级地区'
                                break;
                            case 1:
                                text = '二级地区'
                                break;
                            case 2:
                                text = '三级地区';
                                break;
                            }
                            $('#areaSelected').find('#filtrate_ul').find('a').eq(i).html(text);
                        }
                    }
                    _getAreaList();
                });
            }

            function _finish() {
                var data = {area_id:ASID,area_id_1:ASID_1,area_id_2:ASID_2,area_id_3:ASID_3,area_name:ASNAME,area_info:ASINFO};
                options.success.call('success', data);
                if (!ASINIT) {
                    $('#areaSelected').find('.wtm-full-mask').addClass('right').removeClass('left');
                }
                return false;
            }

            function _close() {
                $('#areaSelected').find('.header-l').off('click', 'a');
                $('#areaSelected').find('.header-l').on('click', 'a',function(){
                    $('#areaSelected').find('.wtm-full-mask').addClass('right').removeClass('left');
                });
                return false;
            }

            return this.each(function() {
                return _init();
            })();
        },



        /**
         * 从右到左动态显示隐藏内容
         *
         */
        animationLeft: function(options) {
            var defaults = {
                    valve : '.animation-left',          // 动作触发
                    wrapper : '.wtm-full-mask',    // 动作块
                    scroll : ''     // 滚动块，为空不触发滚动
            }
            var options = $.extend({}, defaults, options);
            function _init() {
                $(options.valve).click(function(){
                    $(options.wrapper).removeClass('hide').removeClass('right').addClass('left');

                    if (options.scroll != '') {
                        if (typeof(myScrollAnimationLeft) == 'undefined') {
                            if (typeof(IScroll) == 'undefined') {
                                $.ajax({
                                    url: MUrl+'/js/iscroll.js',
                                    dataType: "script",
                                    async: false
                                });
                            }
                            myScrollAnimationLeft = new IScroll(options.scroll, {
								mouseWheel: true, click: true
							});
                        } else {
                            myScrollAnimationLeft.refresh();
                        }
                    }
                });
                $(options.wrapper).on('click', '.header-l > a', function(){
                    $(options.wrapper).addClass('right').removeClass('left');
                });

            }
            return this.each(function() {
                _init();
            })();
        },

        /**
         * 从下到上动态显示隐藏内容
         *
         */
        animationUp: function(options) {
            var defaults = {
                    valve : '.animation-up',          // 动作触发，为空直接触发
                    wrapper : '.wtm-bottom-mask',    // 动作块
                    scroll : '.wtm-bottom-mask-rolling',     // 滚动块，为空不触发滚动
                    start : function(){},       // 开始动作触发事件
                    close : function(){}        // 关闭动作触发事件
            }
            var options = $.extend({}, defaults, options);
            function _animationUpRun() {
                options.start.call('start');
                $(options.wrapper).removeClass('down').addClass('up');

                if (options.scroll != '') {
                    if (typeof(myScrollAnimationUp) == 'undefined') {
                        if (typeof(IScroll) == 'undefined') {
                            $.ajax({
                                url: MUrl+'/js/iscroll.js',
                                dataType: "script",
                                async: false
                              });
                        }
                        myScrollAnimationUp = new IScroll(options.scroll, {
                                mouseWheel: true, click: true
                        });
                    } else {
                        myScrollAnimationUp.refresh();
                    }
                }
            }
            return this.each(function() {
                if (options.valve != '') {
                    $(options.valve).on('click', function(){
                        _animationUpRun();
                    });
                } else {
                    _animationUpRun();
                }
                $(options.wrapper).on('click', '.wtm-bottom-mask-bg,.wtm-bottom-mask-close', function(){
                    $(options.wrapper).addClass('down').removeClass('up');
                    options.close.call('close');
                });
            })();
        }
    });
})(Zepto);

/**
 * 异步上传图片
 */
$.fn.ajaxUploadImage = function(options) {
    var defaults = {
        url : '',
        data : {},
        start : function(){},     // 开始上传触发事件
        success : function(){}
    }
    var options = $.extend({}, defaults, options);
    var _uploadFile;
    function _checkFile() {
          //文件为空判断
          if (_uploadFile === null || _uploadFile === undefined || _uploadFile === '') {
              alert("请选择您要上传的文件！");
              return false;
          }
          return true;
    };
    return this.each(function() {
        //$(this).on('change', function(){
		$(this).on('change', 'input', function() {
            var _element = $(this);
            options.start.call('start', _element);
            _uploadFile = _element.prop('files')[0];
            if (!_checkFile) return false;
            try {
                //执行上传操作
                var xhr = new XMLHttpRequest();
                xhr.open("post",options.url, true);
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        returnDate = $.parseJSON(xhr.responseText);
                        options.success.call('success', _element, returnDate);
                    };
                };
                //表单数据
                var fd = new FormData();
                for (k in options.data) {
                    fd.append(k, options.data[k]);
                }
                fd.append(_element.attr('name'), _uploadFile);
                //执行发送
                result = xhr.send(fd);
            } catch (e) {
                console.log(e);
                alert(e);
            }
        });
    });
}

function loadVercode(){
    $("#codekey").val('');
    //加载验证码
    $.ajax({
        type:'get',
        url:MapiUrl+"/index.php?w=vercode&t=makecodekey",
        async : false,
        dataType: 'json',
        success:function(result){
            $("#codekey").val(result.datas.codekey);
        }
    });
    $("#codeimage").attr('src',MapiUrl+'/index.php?w=vercode&k='+$("#codekey").val()+'&type=35x100'+'&c=' + Math.random());
}
/**
 * 收藏店铺
 */
function favoriteStore(store_id){
    var key = $api.getStorage('key');
    if (!key) {
        checkLogin(0);
        return;
    }
    if (store_id <= 0) {
        $.sDialog({skin: "green", content: '参数错误', okBtn: false, cancelBtn: false});
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: MapiUrl + '/index.php?w=member_favorites_store&t=favorites_add',
        data: {key: key, store_id: store_id},
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                // $.sDialog({skin: "green", content: "收藏成功！", okBtn: false, cancelBtn: false});
                return_val = true;
            } else {
                $.sDialog({skin: "red", content: result.datas.error, okBtn: false, cancelBtn: false});
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏店铺
 */
function dropFavoriteStore(store_id){
    var key = $api.getStorage('key');
    if (!key) {
        checkLogin(0);
        return;
    }
    if (store_id <= 0) {
        $.sDialog({skin: "green", content: '参数错误', okBtn: false, cancelBtn: false});
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: MapiUrl + '/index.php?w=member_favorites_store&t=favorites_del',
        data: {key: key, store_id: store_id},
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                // $.sDialog({skin: "green", content: "已取消收藏！", okBtn: false, cancelBtn: false});
                return_val = true;
            } else {
                $.sDialog({skin: "red", content: result.datas.error, okBtn: false, cancelBtn: false});
            }
        }
    });
    return return_val;
}
/**
 * 收藏商品
 */
function favoriteGoods(goods_id){
    var key = $api.getStorage('key');
    if (!key) {
        checkLogin(0);
        return;
    }
    if (goods_id <= 0) {
        $.sDialog({skin: "green", content: '参数错误', okBtn: false, cancelBtn: false});
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: MapiUrl + '/index.php?w=member_favorites&t=favorites_add',
        data:{key:key,goods_id:goods_id},
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                // $.sDialog({skin: "green", content: "收藏成功！", okBtn: false, cancelBtn: false});
                return_val = true;
            } else {
                $.sDialog({skin: "red", content: result.datas.error, okBtn: false, cancelBtn: false});
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏商品
 */
function dropFavoriteGoods(goods_id){
    var key = $api.getStorage('key');
    if (!key) { checkLogin(0); return; }
    if (goods_id <= 0) {
        $.sDialog({skin: "green", content: '参数错误', okBtn: false, cancelBtn: false}); return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: MapiUrl + '/index.php?w=member_favorites&t=favorites_del',
        data: {key: key, fav_id: goods_id},
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                // $.sDialog({skin: "green", content: "已取消收藏！", okBtn: false, cancelBtn: false});
                return_val = true;
            } else {
                $.sDialog({skin: "red", content: result.datas.error, okBtn: false, cancelBtn: false});
            }
        }
    });
    return return_val;
}
/**
 * 动态加载css文件
 * @param css_filename css文件路径
 */
function loadCss(css_filename) {
    var link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', css_filename);
    link.setAttribute('href', css_filename);
    link.setAttribute('rel', 'stylesheet');
    css_id = document.getElementById('auto_css_id');
    if (css_id) {
        document.getElementsByTagName('head')[0].removeChild(css_id);
    }
    document.getElementsByTagName('head')[0].appendChild(link);
}
/**
 * 动态加载js文件
 * @param script_filename js文件路径
 */
function loadJs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'auto_script_id');
    script_id = document.getElementById('auto_script_id');
    if (script_id) {
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}
//列表添加购物车
function isEmpty(obj)
{
    for (var name in obj)
    {
        return false;
    }
    return true;
}
