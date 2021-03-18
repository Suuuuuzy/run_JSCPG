var template = {
		'icon':'<!--start@@@@@@@@--><img class="dyIcon run"><div class="dylogin"><div class="dylogin-triangle"></div><div class="dylogin-cancel"><span class="dylogin-title-content"></span><a href="#" class="dyicon-close"><img alt="最小化" title="最小化" src="'+chrome.extension.getURL("images/narrow.png")+'"></a><a class="dyicon-logout" href="#"><img alt="退出" title="退出" src="'+chrome.extension.getURL("images/cancel.png")+'"></a></div></div><!--@@@@@@@@end-->',
		'login':'<!--登录--><div class="dylogin-content dylogin-input"><input type="text" placeholder="请输入企业名" class="dyinput_01 dyuser-corp" autocomplete="new-password"><input type="text" placeholder="请输入用户名" class="dyinput_02 dyuser-name" autocomplete="new-password"><input type="password" placeholder="请输入密码" class="dyinput_03 dyuser-password" autocomplete="new-password"><input type="hidden" id="autoFill" value="1"/><input type="button" value="登录" class="dyinput_04 dylogin-btn"><div class="dytip"><span></span></div></div>',
		'uploadResume':'<!-- 下载简历 --><div class="dysearch-content dylogin-input">'+
						'<div class="dybutton-top">'+
							'<input type="button" value="简历查重" class="dyinput_04 dycheckrepeatresume-btn" data-info="repeat" style="width: 46%;margin-right: 20px;background-color: transparent;border: 1px solid #5ca9f7;color: #5ca9f7;">'+
							'<input type="button" value="看看谁与他有关" class="dyinput_04 dycheckrepeatresume-btn" data-info="relevant" style="width: 46%;background-color: transparent;border: 1px solid #5ca9f7;;color: #5ca9f7;">'+
							'<div style="display:none;border-radius:3px;border: 1px dashed #ee7e5b;line-height: 24px;font-size: 12px;color: #ed754f;position: relative;margin-top: 10px;float: left;text-align: left;padding:5px 16px 5px 30px;width:212px;">'+
								'<span style="display: block;background-color:#fff; display: block;height:7px;width: 7px;line-height: 0;position: absolute;left: 46px;top: -5px;border:1px dashed ;border-image: initial;border-color: #ee7e5b #ee7e5b transparent transparent;border-style: solid solid dashed dashed;transform: rotate(-45deg);"></span>'+
								'<img src="'+chrome.extension.getURL("images/hint.png")+'" style="position:absolute;left: 10px;top: 11px;">'+
								'<span class="repeatTips"></span>'+
							'</div>'+
						'</div>'+
						'<div class="dydropdown"><select title="简历去向" class="dydropdown-select resumeWhereabouts"><option value="">简历去向</option></select></div>'+
						'<div class="dydropdown2"><select title="应聘状态" class="dydropdown-select2 applyStatus"><option value="">请选择应聘状态</option></select></div>'+
						'<div class="dydropdown" style="width:260px;"><select title="请选择渠道" class="dydropdown-select channelId"><option value="">请选择渠道</option></select></div>'+
						'<div class="dywidth260"><input type="text" placeholder="请输入职位名称或编号" class="dyinput_05 dyjob-info" autocomplete="new-password"></div>'+
						'<div class="dywidth260"><input type="button" value="下载并导入到招聘系统" class="dyinput_04 dyupload-btn"></div>'+
						'<div class="dytip"><span></span></div>'+
					'</div>',
		'toResumePage':'<div class="dy2resume-content dylogin-input" style="display: none" >' +
						'<div class="dywidth260"><input type="button" value="去下载"class="dyinput_04 dy2resume-btn"></div>',
		'result':'<div class="dyresult-content dylogin-input" style="display: none" >' +
					'<div class="dywidth260 result-tip" ><img /></div>'+
					'<div class="dywidth260 result-loading" ><input type="button" class="dyinput_04 dyloading-btn" value="系统正在导入中请稍候..."/></div>'+
					'<div class="dywidth260 result-tip" ><div class="dyresult-msg"><span></span></div><input type="button" class="dyinput_04 dyclosePage-btn" value="关闭页面" onclick="window.close()" ></div></div>',
		'pluginAdList':'<div style="padding-top: 15px;margin-left:5px;" class="dylogin-input" id="dyPlugin-AdList-content-item"><!-- 渠道发布 -->{items}</div>',
		'versionUpdate':'<!-- 版本更新 --><div style="padding-top: 15px;margin-left:5px;" class="dyupdate-content"><div><img style="margin-right: 5px;" src="'+chrome.extension.getURL("images/hint.png")+'">提醒：插件有更新，<a target="_blank" href="javascirpt:void(0)" class="dy-download-release" style="color: #ed754f;">去升级</a></div></div>',
		'optPostionTip':'<div class="dypop_window2"> <span class="dypop_window2_img"> <img src="'+chrome.extension.getURL("images/icon1.png")+'" alt=""/></span><span class="dypop_window2_text"><p class="dytext_top">正在<b class="dyoptName">刷新</b>第 <b class="dynum" id="dynum">1</b> /<b id="dyTotalNum">dyReplaceTotalNum</b>  个职位。</p><p class="dytext_bottom">目前正在帮助您自动<b class="dyoptName">刷新</b>职位中~请耐心等待~</p></span></div>',
		'falseOptTip':'<div class="dypop_window"><div class="dypop_title2"> <i class="dypop_close" ><img src="'+chrome.extension.getURL("images/dyclose.png")+'" alt=""/></i><div class="dypop_title2_con"><img src= "'+chrome.extension.getURL("images/icon1.png")+'"  alt=""/>已经为您<b class="dyoptName">刷新</b> <b class="dynum" id="dyOptNum">22</b> /<b id="dyTotalOptNum">10</b>  个职位。</div></div><div class="dypop_hint2">以下职位需要您手动<b class="dyoptName">刷新</b>：</div><div class="dypop_list dypop_list2"><div class="dylist_demo"><ul class="dyposition_list" id="dypositon_list"></ul></div></div></div>',
		'successOptTip':'<div class="dypop_window3"><span class="dypop_window2_img"><img src="'+chrome.extension.getURL("images/icon2.png")+'" alt=""/></span><span class="dypop_window2_text"><p class="dytext_top">您勾选的职位已经全部完成<b class="dyoptName">刷新</b>。</p><p class="dytext_bottom">您可以回到系统继续完成其他渠道职位<b class="dyoptName">刷新</b></p></span></div>',
};

var isDayee = false,isDayeePosition = false,isRefresh = false,isWebSearch = false;
var autoLogin = true; var autoRefresh = true;
var isTempFolder = false
var downloadObj = {
	begin:function () {
        showPanel('result')
        $('.result-loading').show()
        $('.result-tip').hide()
    },
	fail:function (errorMsg) {
		showResult(true,errorMsg)
    },
	success:function (msg) {
        showResult(false,msg)
    },
	needDownload:function () {
		showPanel('uploadResume')
        $('.dysearch-content .dyupload-btn').css({"background-color":'#26b064'});
		showTips(true,'请先下载该简历')
    },
	isNeedDownload:false,
}
function showResult(isError,msg) {
	if(!msg){
		msg = isError?'导入失败！':'导入成功！'
	}
    showPanel('result')
    $('.result-loading').hide()
    $('.result-tip').show()
	var imgName = isError?'fail.png':'success.png'
	$('.dyresult-content img').attr('src',chrome.extension.getURL("images/"+imgName))
    var color = isError ? "#cb3838" :"#FFD7AA";
    $(".dyresult-msg span").css('color',color).text(msg);
}
function showResult2(isError,msg) {
    if(!msg){
        msg = isError?'导入失败！':'导入成功！'
    }
    showPanel('uploadResume')
    $('.dysearch-content .dyupload-btn').css({"background-color":'#26b064'});
    showTips(true,msg)
}

function showTips(isError,info,showTime) {
    showTime = showTime || 5000
	var tipClass = isError ? "dyerror-tip" :"dysuccess-tip";
	var tip = $(".dytip");
	tip.removeClass("dyerror-tip");
	tip.removeClass("dysuccess-tip");
	tip.addClass(tipClass);

	var tipSpan = tip.find("span");
	tipSpan.text('').text(info);
    tipSpan.fadeIn();
    if (showTime>0) {
	    setTimeout(function(){
	        tipSpan.fadeOut();
	        if (!isError) {
	        	$("input[type=text]").val("");
	        };
	    },showTime);
    }
}
//<option value="1" selected="selected">应聘状态-待处理</option><option value="3">应聘状态-推荐复筛</option><option value="7">应聘状态-初试待安排</option>
var defaultAbouts = [{'key':1,'name':'候选人管理'},{'key':2,'name':'企业人才库'},{'key':3,'name':'高级人才库'},{'key':4,'name':'我的暂存夹'}];
function checkLogin(callback) {
	var corpCode = null;
	var userName = null;
	//如果是大易系统检测当前登录账号是否是同一个企业和用户名
	if (isDayeePosition ||isRefresh||isWebSearch) {
		corpCode = $("#userInfo").val();
		userName = $("#userInfo").attr("data-name");
	}
	chrome.extension.sendMessage({type:"checkLogin",corpCode:corpCode,userName:userName},function(data) {
		if (data.code) {
			$(".dyIcon").attr("src",chrome.extension.getURL("images/dy.png")).attr("title","已登录");
			// initDownloadCondition(data.data);
		} else {
			$('.dyIcon').attr("src",chrome.extension.getURL("images/dyUnlogin.png")).attr("title","未登录");
			//如果是大易系统页面自动获取当前系统登录信息进行自动填充以及登录，否则从缓存获取登录信息
			if (isDayeePosition ||isRefresh||isWebSearch) {
				var userUrl = $("#loginUserInfo").attr("value");
				if(userUrl!=null&&userUrl!=undefined){
					var xhr = new XMLHttpRequest();
					xhr.open('GET', userUrl, true);
					xhr.onload = function(res) {
						var _text = this.response;
						var result  = JSON.parse(_text);
						if(result.code='00'){
							var data = JSON.parse(result['content']);
							if(data.isAutoFillInfo){
								fillLoginInfo(data,"0")
							}
						}
					}
					xhr.send();
				}
			} else {
				chrome.extension.sendMessage({type:'getAccountInfo'},function(data) {			
					fillLoginInfo(data,data.autoFill);
				});
			}
		}
		if (callback) {
			callback(data);
		}
	});
}

// 初始化简历去向、应聘状态、渠道列表等；（事件等）
function initDownloadCondition(data) {
	var abouts = $(".dysearch-content select.resumeWhereabouts");
	$(abouts).empty();
	$("<option value=''>简历去向</option>").appendTo(abouts);
	var resumeWhereabouts = data.resumeWhereabouts || defaultAbouts;
    $.each(resumeWhereabouts,function(i,item){
		if(item.checked){
			$("<option value='"+item.key+"' selected>"+item.name+"</option>").appendTo(abouts);
		}else{
			$("<option value='"+item.key+"'>"+item.name+"</option>").appendTo(abouts);
		}
	});
	// 应聘状态
	if(data && data.applyStatus){
		var applyStatusSelect = $(".dysearch-content select.applyStatus");
		$(applyStatusSelect).empty();
		$("<option value=''>请选择应聘状态</option>").appendTo(applyStatusSelect);
		$.each(data.applyStatus,function(i,item) {
			if (item.checked) {
				$("<option value='"+item.key+"' selected>"+item.name+"</option>").appendTo(applyStatusSelect);
			} else {
				$("<option value='"+item.key+"'>"+item.name+"</option>").appendTo(applyStatusSelect);
			}
		});
	}
	// 渠道
	// var channelInfo = getChannelSetting();
	var cid = currentChannelInfo.channelDicId;
	if(data && data.channellist && data.channellist[cid]){
		var channelSelect = $(".dysearch-content select.channelId");
		$(channelSelect).empty();
		$("<option value=''>请选择渠道</option>").appendTo(channelSelect);
		var isSelect = false;
		$.each(data.channellist[cid],function(i,item){

			var $option = $("<option netRecruitment='"+item.netRecruitment+"' value='"+item.key+"' >"+item.name+"</option>")
            $option.appendTo(channelSelect);
			if(item.select){
                $option.attr('selected',true)
				isSelect = true
			}
		});
		if($(".dysearch-content select.channelId option").length >= 2 && !isSelect){
			$(".dysearch-content select.channelId")[0].selectedIndex = 1;
		}
	}
	
	// 是否显示简历查重 "0"否，"1"是
	var chkRepeat = data && data.ischeckRepeatResume && "1"==data.ischeckRepeatResume;
	if (chkRepeat == true) {// 是
		$('.dysearch-content').find('[data-info=repeat]').show();
	} else {
		$('.dysearch-content').find('[data-info=repeat]').hide();
	}
	
	//开启看看谁与他有关功能
	var chkRelate = data && data.showRelatedResume && "0"==data.showRelatedResume;
	if (chkRelate) {
		$('.dysearch-content').find('[data-info=relevant]').show();
	} else {
		$('.dysearch-content').find('[data-info=relevant]').hide();
	}
	
	initSearch();
}

/**简历去向*/
function initSearch() {
	var about = $(".dysearch-content select.resumeWhereabouts").val();
	$resumeWhere = $(".dysearch-content .resumeWhereabouts").parent();
	$('.dydropdown-select.channelId').parent().show();
	$postSearch = $(".dysearch-content input.dyjob-info")
	$applyStatus = $(".dysearch-content .dydropdown2")
	$btn = $('.dyupload-btn')

	$postSearch.attr('placeholder','请输入职位名称或编号')
	if ('1'==about) { //候选库
		$resumeWhere.css({width:'100px'});
		$applyStatus.show();
		$postSearch.show();
	} else if('4'==about){//暂存夹
		$resumeWhere.css({width:'260px'});
		$applyStatus.hide();
		$postSearch.show();
        $postSearch.attr('placeholder','请输入暂存职位')
	} else {
		$resumeWhere.css({width:'260px'});
		$applyStatus.hide();
		$postSearch.hide();
	}

	if('4'!=about && '52'== currentChannelInfo.channelDicId){
		$btn.val('下载并导入到招聘系统')
	}else {
		$btn.val('导入到招聘系统')
	}
}

/**点击图标*/
function dyIconClick() {
	$(".dyIcon").click(function() {
        !isDayee && chrome.extension.sendMessage({type:"setPeference",param:{minimize:false}},function(response) {})
		checkLogin(function(data) {
			dyHandleLoginResult(data);
		});
	});
}

function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function dyHandleLoginResult(data,auto) {
	
	$(".dylogin").hide();
	if (data.code) {
		if (isDayee) {
			// 加载待发布的职位
			if (isDayeePosition) {
				dyLoadAds(auto);
			} else if (isRefresh) {
				$(".plugin_publish_btn").show();
				//$("#dyPlugin-AdList-content").show().animate({top:'-55px',right:'10px'})
				$("#installPlugin").attr("value","0");
				$(document).on('click','.dyPlugin-publishAd',function(){
					var postInfo = {};
					var dytotalNum = 0;
					var pluginChannelInfo = $(this).attr("data-info");
					var optChannelInfo = JSON.parse(pluginChannelInfo);
					var isAutoRefresh = false;
					if(autoRefresh){
						var items = $(this).parents(".list_demo").find("li");
						dytotalNum = items.length;
						if(items.length>0){
							$.each(items,function(i,tem){
								var origin = {"originId":$(tem).attr("originId"),"postName":$(tem).attr("postName")};
								postInfo[i] = origin;
							})
							isAutoRefresh = true;
						}
					}
					optChannelInfo = $.extend({"originIds":JSON.stringify(postInfo),"dytotalNum":dytotalNum,"isAutoRefresh":isAutoRefresh},optChannelInfo);
			 		chrome.extension.sendMessage(optChannelInfo, function (result) {
			 			
			 		});
			 		return false;
		 		});
				showPanel("versionUpdate");
				$(document).on('click','.pluginPostPosition',function(){
					var pluginInfo = $(this).attr("data-info");
					var optChannelInfo = JSON.parse(pluginInfo);
					var uid = $(this).closest("li").attr("data-info");
					var postId = $(this).attr("post-info")
					optChannelInfo =$.extend({"uid":uid,"postid":postId},optChannelInfo);
					chrome.extension.sendMessage(optChannelInfo, function (result) {
			 			
			 		});
			 		return false;
				})
			}else if(isTempFolder){
                showPanel("toResumePage");
			}else {
				var channelDicId = _getQueryString('channelDicId');
				$('#dySearch').show().unbind("click").click(function() {
					var channelDownloadInfo = {type:'channelDownload',channelDicId:channelDicId};

					var _accInfo = $('#dySearchGetAccountUrl').attr('data-accountInfo');
					channelDownloadInfo['hasAccount'] = $.trim(_accInfo).length>0;

					channelDownloadInfo['data-accountInfo'] = _accInfo;
					var _netInfo = $('#dySearchGetAccountUrl').attr('data-netRecruitment');
					channelDownloadInfo['netRecruitment'] = _netInfo;
					
					channelDownloadInfo['chooseChannel'] = $('#dySearchGetAccountUrl').attr('chooseChannel');

					var _url = window.location.protocol + '//' + window.location.host + $('#dySearchGetAccountUrl').val();
					channelDownloadInfo['getAccountRequestUrl'] = _url;
					
			 		chrome.extension.sendMessage(channelDownloadInfo, function (result) {
			 			// console.log(result);
			 			if (result) {
			 				for(var key in result) {
			 					$('#dySearchGetAccountUrl').attr(key,result[key]);
			 				}
			 			}
			 		});
				});
				showPanel("versionUpdate");
			}
		} else {
            chrome.extension.sendMessage({type:"getPeference",key:["minimize"]},function(response) {
            	var minimize
                if (typeof (response) != "undefined" && response) {
                    minimize = response["minimize"]
                }
				showPanel("uploadResume",'',minimize);
				initDownloadCondition(data.data);
            })
		}
	} else {
		showPanel("login");
	}
}

function showPanel(type,title,minimize) {
    $(".dylogin").removeClass("dylogin-ad")
    !minimize && $(".dylogin").show().animate({top: '-55px',right: '10px'});
	$(".dylogin-title-content").attr("style","").removeClass("dyPlugin-checkVersion").removeClass("dylogin-title").removeClass("dylogin-ad").removeClass("dy-ad-title").html("");
	$('.dyicon-close').show();
	//$('.dyupdate-content').remove();
	$("#dyPlugin-AdList-content-item,.dysearch-content,.dylogin-content,.dydownloading-content,.dyresult-content,.dy2resume-content").hide();
	
	if ("login" == type) {
		$(".dylogin-title-content").addClass("dylogin-title").html("登录DAYEE");
		$(".dylogin-content").show();
		$(".dylogin-title-content").attr("style","margin-left: 25px !important;");
		dyCssSepcial();
	} else if ("uploadResume" == type) {
		$(".dysearch-content").show();
		$(".dylogin-title-content").attr("style","margin-left: 25px !important;");
	} else if ("pluginAdList" == type) {
		$(".dylogin").addClass("dylogin-ad");
		$("#dyPlugin-AdList-content-item").show();
	} else if ("toResumePage" == type) {
		$(".dy2resume-content").show();
    }else if ("result" == type) {
        $(".dyresult-content").show();
    }
	
	dyCheckVersion(title,function() {
		if ("versionUpdate" == type) {
			$('.dyicon-logout').hide();
			//$(".dylogin-title-content").addClass("dy-ad-title").addClass("dylogin-title").html("提示");
		}
	},function() {
		if ("versionUpdate" == type) { //无新版本，无需显示主面板
			$(".dylogin").hide();
		}
	});
}

function dyCssSepcial() {
	if (isDayee) {
		$('.dyinput_01').addClass('dyinput-sepcial');
		$('.dyinput_02').addClass('dyinput-sepcial');
		$('.dyinput_03').addClass('dyinput-sepcial');
	}
}
/**点击登录按钮*/
function dylogin() {
	$(".dylogin-content .dylogin-btn").click(function() {

		var corpCode = $.trim($('.dylogin-content .dyuser-corp').val());
		if(!corpCode){
            showTips(true,"企业名不能为空！",5000);
            return;
		}

		var user=$.trim($('.dylogin-content .dyuser-name').val());
		if (!user) {
			showTips(true,"用户名不能为空！",5000);
			return;
		}

		var pasword=$.trim($('.dylogin-content .dyuser-password').val());
        if(!pasword){
            showTips(true,"密码不能为空！",5000);
            return;
        }
        if(isDayeePosition ||isRefresh||isWebSearch){
        	var corp = $("#userInfo").val();
        	var name = $("#userInfo").attr("data-name");
        	if(corp != null && name != null){
        		if(corpCode != corp||name != user){
        			showTips(true,"请登录当前系统账号",5000);
        			return;
        		}
        	}
        }
        var autoFill = $.trim($("#autoFill").val());
		var logInfo = {
			type:'login',
			corpCode:corpCode,
			userName:user,
			password:pasword,
			autoFill:autoFill
		};
		var channelDicIds = currentChannelInfo._channelDicIds;//getChannelDicIds();
		logInfo.channelDicIds = channelDicIds;

		$('.dylogin-content .dylogin-btn').attr('disabled',true).val("正在登录");
		chrome.extension.sendMessage(logInfo,function(response) {
			$('.dylogin-content .dylogin-btn').attr('disabled',false).val("登录");
			if (response.code==200) { //登录成功 
				checkLogin(function (data) {
					dyHandleLoginResult(data);
					autoLogin = true;
				});
			} else {
            	showTips(true,"用户名密码错误！",5000);
			}
		});
	});
}

function dyCheckVersion(_title,_successCallback,_failCallback) {
	chrome.extension.sendMessage({type:'checkVersionInfo'},function(response) {
		
		if ($.trim(response).length>0) {// 下载最新版
			var html = '<img style="margin-right: 5px;" src="'+chrome.extension.getURL("images/hint1.png")+'">提醒：插件有更新，<a href="#" class="dy-download-release" style="color: #ed754f;">去升级</a>';
			$('.dylogin-title-content').removeClass('dylogin-title').addClass('dyPlugin-checkVersion').html(html);
			$('.dy-download-release').show().unbind("click").on('click', function() {
				window.open($.trim(response));
			});
			_successCallback && _successCallback();
		} else {
			$('.dy-download-release').hide().unbind("click");
			if(_title) {
				var _co = _title['title'];
				if (_co) {
					$(".dylogin-title-content").html(_co);
				}
				_co = _title['class'];
				if (_co) {
					$(_co.split(',')).each(function(j,itemj){
						$(".dylogin-title-content").addClass(itemj);
					});
				}
			}
			_failCallback && _failCallback();
		}
	});
}

/**点击关闭*/
function dyClose() {
	$(".dyicon-close").click(function() {
        !isDayee && chrome.extension.sendMessage({type:"setPeference",param:{minimize:true}},function(response) {})
		$(this).parent().parent().animate({top:'-100px',right:'-10px'});
		$(this).parent().parent().hide();
		return false;
	});
}

/**点击退出*/
function dyLogout() {
	$(".dyicon-logout").click(function() {
		$(this).parent().parent().hide();
		$(this).parent().parent().animate({top:'-100px',right:'-10px'});
		chrome.extension.sendMessage({type:"logOff"},function(){
			checkLogin();
			showPanel("login");
			$(".dyuser-password").val("");
    		autoLogin = false;
		});
		return false;
	});
}

/*职位搜索*/
function dySearch() {
	$.widget("ui.autocomplete", $.ui.autocomplete, {
		_renderItem: function(ul, item) {
			return $("<li>").html(item.label).appendTo(ul);
		}
	});
	$(".dysearch-content .dyjob-info").autocomplete({
		appendTo:".dysearch-content",
		source: function(request, response) {
			var term = request.term;
			chrome.extension.sendMessage({type: "searchJobList",keyword: term}, function(resp) {
				response($.map(resp, function(item) {
					return {label: item,value: item.name}
				}));
			});
		},
		minLength: 0,
		select: function(event, ui) {
			var itemEl = $(ui.item.label);
			jobInfo = {
				jobTitle : itemEl.find(".w1").text(),
				jobId : itemEl.find(".w1").attr("data-jobId")
			}
		},
		focus: function(){
			var jobInfoAP = $(".dyjob-info");
			if(jobInfoAP.val() == ""){
				jobInfoAP.keydown();
			}
		},
		response: function(event, ui) {
			var contents = ui.content;
			for (i in contents) {
				//console.log(contents[i].recruiter);
				var _dySearchHtml = '<div class="auto-complete-job-info" style=" "><span style="display: inline-block;height:25px;line-height:25px;width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" class="w1" data-jobid="'+contents[i].label.key+'">'+(contents[i].label.name ? contents[i].label.name :' ')+'</span><span style="float: right;">'+(contents[i].label.recruiter ? contents[i].label.recruiter :' ')+'</span><br>';
				if(contents[i].label.workPlace && contents[i].label.orgName){
					_dySearchHtml+= '<span style="display: inline-block;color:#999; line-height:12px;" class="dyw2">'+(contents[i].label.orgName ? contents[i].label.orgName :' ')+'</span>'+'<span style="display: inline-block;color:#999; line-height:12px;" class="dyw2">' + contents[i].label.workPlace+'</span></div>';
				}else if(contents[i].label.orgName){
					_dySearchHtml +='<span style="display: inline-block;color:#999; line-height:12px;">'+(contents[i].label.orgName ? contents[i].label.orgName :' ')+'</span></div>';
				} else if(contents[i].label.workPlace){
					_dySearchHtml +='<span style="display: inline-block;color:#999; line-height:12px;">'+(contents[i].label.workPlace ? contents[i].label.workPlace :' ')+'</span></div>';
				}else{
					_dySearchHtml += '</div>';
				}
				contents[i].label =_dySearchHtml;
			}
		}
	});
}

/**简历下载校验*/
function dyUploadResume() {
	$(".dysearch-content .dyupload-btn").click(function(){
		var resumeWhereabouts = $.trim($(".dysearch-content select.resumeWhereabouts").val());
		if (!resumeWhereabouts) {
            showTips(true,"简历去向不能为空！",5000);
			$(".dysearch-content select.resumeWhereabouts").focus();
            return;
        }
		var applyStatus;
		if ('1'==resumeWhereabouts) {
			applyStatus = $.trim($(".dysearch-content select.applyStatus").val());
			if(!applyStatus) {
				showTips(true,"应聘状态不能为空！",5000);
				$(".dysearch-content select.applyStatus").focus();
				return;
			}
			job = $.trim($(".dysearch-content .dyjob-info").val());
			if (!job) {
				showTips(true,"职位信息不能为空！",5000);
				return;
			}
			if (typeof(jobInfo)=='undefined' || job!=$.trim(jobInfo.jobTitle)) {
				showTips(true,"请选择有效的职位信息！",5000);
				return;
			}
		}
		var channel =  $.trim($(".dysearch-content select.channelId").val());
		if (!channel) {
            showTips(true,"渠道不能为空！",5000);
			$(".dysearch-content select.channelId").focus();
            return;
        }
        downloadObj.resumeWhereabouts = resumeWhereabouts;
		downloadObj.netRecruitment = $(".dysearch-content select.channelId :selected").attr('netRecruitment')
		if (applyStatus) {
            downloadObj.applyStatus = applyStatus;
		}
        downloadObj.channelId = channel;
		if (typeof(jobInfo)!="undefined") {
            downloadObj.postIdList = jobInfo.jobId;
		}


		chrome.extension.sendMessage({type:'getDownloadScript',channelDicId:currentChannelInfo.channelDicId},function(response) {
			if (typeof (response) == "undefined" || response == null) {
				// showTips(true,'导入失败！错误码：305',5000);
                downloadObj.fail('导入失败！错误码：305')
			} else {
				currentChannelInfo['contentScript'] = response;
				_dyUploadResume();
			}
		});
	});
}

/**下载简历*/
function _dyUploadResume() {
	chrome.extension.sendMessage({type:'getResumeInfo',context:currentChannelInfo,downloadObj:downloadObj},function(uploadInfo) {
		console.log('content.js:',uploadInfo);
		var errorMsg = "导入失败，无简历信息！"
        if (typeof (uploadInfo) == "undefined" || uploadInfo == null || uploadInfo.errorMsg) {
            if(uploadInfo && uploadInfo.errorMsg) {
            	errorMsg = uploadInfo.errorMsg
            }
            downloadObj.fail(errorMsg)
				// $('.dysearch-content .dyupload-btn').attr('disabled',false).css({"background-color":'#26b064'});
				// showTips(true,uploadInfo.errorMsg || "导入失败，无简历信息！",5000)
		}else if(uploadInfo.isNeedDownload){
			downloadObj.needDownload()
        } else{
        	//去除智联帐号类型的判断
            // if((currentChannelInfo.channelDicId == 2 || currentChannelInfo.channelDicId == -2) ) {
				//智联渠道选择  5.0帐号为一类  5.5和ATS帐号为一类，两者不能互相导入
                // var choosed_net = downloadObj.netRecruitment
				// var real_net = uploadInfo.netRecruitment
				// if((real_net == 0 && choosed_net != 0)
				// 	|| (real_net != 0 && choosed_net == 0)){
                 //    showResult2(true, '该简历的实际账号类型与暂存的账号类型不符')
				// 	return;
				// }
			// }
			/*uploadInfo.resumeWhereabouts = resumeWhereabouts;
			if (applyStatus) {
				uploadInfo.applyStatus = applyStatus;
			}
			uploadInfo.channelId = channel;
			if (typeof(jobInfo)!="undefined") {
				uploadInfo.postIdList = jobInfo.jobId;
			}*/
            downloadObj.begin()
			uploadInfo = $.extend(uploadInfo, downloadObj);
			chrome.extension.sendMessage(uploadInfo, function (response) {
				// $('.dysearch-content .dyupload-btn').attr('disabled',false).css({"background-color":'#26b064'});
				if (response.code==200) {
					downloadObj.success()
				} else {
                    downloadObj.fail(response.data)
				}
			});
        }
	});
}

/**点击简历查重*/
function dyCheckRepeat() {
	$(".dysearch-content .dycheckrepeatresume-btn").click(function() {
		var channel =  $.trim($(".dysearch-content select.channelId").val());
		if (!channel) {
            //showTips(true,"渠道不能为空！",5000);
			showCheckRepeatTips("渠道不能为空！");
			$(".dysearch-content select.channelId").focus();
            return;
        }
		var checkInfo = {};// getResumeInfo();
		if (typeof(jobInfo)!="undefined") {
			checkInfo.postIdList = jobInfo.jobId;
		}
		checkInfo.channelId = channel;

		var channelDicId = currentChannelInfo.channelDicId;
		$(this).attr('disabled',true).css({"background-color":'#D5DEEA'});
		var dataInfo = $(this).attr("data-info");
		var optUrl = "checkRepeatResume";
		if(dataInfo != null && dataInfo == 'relevant'){
			optUrl="checkRelevantPerson";
		}
		chrome.extension.sendMessage({type:'getDownloadScript',channelDicId:channelDicId},function(response) {
			if (typeof (response) == "undefined" || response == null) {
				$('.dysearch-content .dycheckrepeatresume-btn').attr('disabled',false).css({"background-color":'transparent'});
				showTips(true,'检测失败！错误码：369',5000);
				showCheckRepeatTips('检测失败！错误码：369');
			} else {
				currentChannelInfo['contentScript'] = response;
				checkInfo['contentScript'] = response;
				checkInfo['resumeWhereabouts']=$('.resumeWhereabouts').val()

				var args = {type:optUrl,context:currentChannelInfo,checkInfo:checkInfo};
				_dyCheckRepeat(args);
			}
		});
	});
}

function _dyCheckRepeat(args) {
	chrome.extension.sendMessage(args,function(response) {
		if (response.code==200) {
			showCheckRepeatTips(response.data);
			//showTips(false,response.data,'',true)
		} else {
			showCheckRepeatTips(response.errorMsg || "网络异常,请联系管理员！");
			//showTips(true,response.errorMsg || "网络异常,请联系管理员！",5000)
		}
		$('.dysearch-content .dycheckrepeatresume-btn').attr('disabled',false).css({"background-color":'transparent'});
	});
}
function showCheckRepeatTips(msg){
	$(".dysearch-content .repeatTips").html(msg).parent().show();
	$(".dysearch-content .dybutton-top").css({"border-bottom":"1px solid #eee"});
	$(".dysearch-content .repeatTips").parent().parent().css('padding-bottom','10px');
}

function dyInitView() {
	$(document.body).append(template['icon']);
	
	if ($(".dylogin").find(".dylogin-content").length<=0) {
		$(".dylogin").append(template['login']);
	}
	if ($(".dylogin").find(".dysearch-content").length<=0) {
		$(".dylogin").append(template['uploadResume']);
	}
	if ($(".dylogin").find(".dy2resume-content").length<=0) {
        $(".dylogin").append(template['toResumePage'])
    }
    if ($(".dylogin").find(".dydownloading-content").length<=0) {
        $(".dylogin").append(template['downloading'])
    }
    if ($(".dylogin").find(".dyresult-content").length<=0) {
        $(".dylogin").append(template['result'])
    }
	$(".dylogin-content .dyinput_01").css("background-image","url("+chrome.extension.getURL("images/enterprise.png")+")");
	$(".dylogin-content .dyinput_02").css("background-image","url("+chrome.extension.getURL("images/user.png")+")");
	$(".dylogin-content .dyinput_03").css("background-image","url("+chrome.extension.getURL("images/password.png")+")");
	$(".dysearch-content .dyinput_05").css("background-image","url("+chrome.extension.getURL("images/search.png")+")");
}

function dyInitEventLoginBind() {
	dyIconClick(),dylogin(),dyClose(),dyLogout();
	$('.dyuser-corp,.dyuser-name,.dyuser-password').bind('keypress',function(event){
    	if(event.keyCode ==13) {
        	$(".dylogin-btn").click();
        }
    });
}

/**简历下载相关的event*/
function dyInitDownloadEvenBind() {
	dySearch(),dyUploadResume(),dyCheckRepeat();
	$(".dysearch-content select.resumeWhereabouts").change(function() {
    	initSearch();
    });
}

function dy2resumePage() {
	var req,
		operateStr = $('#operateObjStr').val(),
        accountInfo = $('#accountInfo').val()
	if(operateStr){
		var resumeInfoArr = operateStr.split('#@#')
		if(resumeInfoArr.length>3){
            req = { channelDicId:resumeInfoArr[0],
					channelId:resumeInfoArr[1],
					resumeOrignalId:resumeInfoArr[2],
					url: decodeURIComponent(resumeInfoArr[3].replace(/\$/g,'%')),
					type: 'toResumePage',
			}
		}
		if(accountInfo){
			var accountArr = accountInfo.split('#@#')
			req.account = accountArr[0]
			req.password = accountArr[1]
		}
	}
	if(req){
        $('.dy2resume-btn')[0].onclick=function () {
            chrome.extension.sendMessage(req,function (){})
        }
	}else{
        $('.dy2resume-btn')[0].value = '简历信息未知'
	}

}

function fillLoginInfo(data,autoFill){
	var code = data.corpCode || data.compCode;
	if (code) {
		$('.dylogin-content .dyuser-corp').val(code);
	}
	if (data.userName) {
		$('.dylogin-content .dyuser-name').val(data.userName);
	}
	if (data.password) {
		$('.dylogin-content .dyuser-password').val(data.password);
	}
	$('#autoFill').attr("value",autoFill);
	$('.dylogin-content .dyuser-corp').change(function(){
		$('.dylogin-content .dyuser-password').val(null)
	});
	$('.dylogin-content .dyuser-name').change(function(){
		$('.dylogin-content .dyuser-password').val(null)
	});
	$('.dylogin-content .dyuser-password').change(function(){
		$('#autoFill').attr("value",null);
	});
	if(autoLogin){
		if(code && data.userName != null && data.password != null){
			$(".dylogin-content .dylogin-btn").click();
		}
	}
}

function dyOptInitView() {
	$(document.body).append(template['optPostionTip']);
	$(document.body).append(template['falseOptTip']);//
	$(document.body).append(template['successOptTip']);
	$(".dypop_window2").hide();
	$(".dypop_window3").hide();
	$(".dypop_window").hide();
}

//初始化加载插件
$(function() {
	chrome.extension.sendMessage({type:'getChannelInfo',url:window.location.href},function(response) {
		$("#pluginId").val(chrome.i18n.getMessage("@@extension_id"));
		
		if (typeof (response) == "undefined" || response == null || response.length <=0) {
			return;
		} else {
			var localUrl = window.location.href;
			currentChannelInfo = response;
			isDayee = 'dayee' == response.key ? true : false;
			isDayeePosition = localUrl.indexOf('listPostChannel')>-1 || $('input[data-ref="listPostChannel"]').length>0;
            isTempFolder = /talentPool\/channel\/showTempResume/.test(localUrl)
            var isPluginOpt = false
			var referRegx = $.trim(currentChannelInfo.stopOrRefreshPageRegx);
			if(referRegx){
                isPluginOpt = new RegExp(referRegx,'i').test(localUrl);
                isRefresh = new RegExp(referRegx,'i').test(localUrl);
			}
            var searchWebRegx = $.trim(currentChannelInfo.searchAddr);
            if(searchWebRegx&&isDayee){
            	isWebSearch = new RegExp(searchWebRegx,'i').test(localUrl);
            }
    		if (isPluginOpt && !isDayee) {
    			dyOptInitView();
    		} else {
				dyInitView();
				dyInitEventLoginBind();
				checkLogin(function(data) {
					dyHandleLoginResult(data,true);
				});
				!isDayee && dyInitDownloadEvenBind();
                isTempFolder && dy2resumePage()
			}
		}
	});
});
