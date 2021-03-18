//加载待使用插件发布的渠道
var jobchannels = {};
function dyLoadAds(auto) {
	var postId = $("[name='uniqueKey']").val() || '',externalKey = $("[name='externalKey']").val() || '',externalVal = $("[name='external']").val() || '';
	chrome.extension.sendMessage({type:'getAdList',postId:postId,externalKey:externalKey,external:externalVal},function(response) {
		var _html = '',_title='',_hasContent=false;
		if (response.code==200) {
			//console.log(response);
			_hasContent = true;
			console.log(response.data);
			var data = JSON.parse(response.data);
			var jobInfo = {postName:data.postName,postCode:data.postCode,postid:data.postid,externalKey:externalKey};
		
			var html = [];
			$.each(data.channel,function(i,item) {
				var _opt = item['opt'] || 'toPublishPage';
				var _optText = item['optText'] || "去发布";
				if (item['originIds']) {
					item['originIds'] = JSON.stringify(item['originIds']);
				}
				jobchannels[i] = $.extend({type:_opt},jobInfo,item);
				//html.push(item.name + '<a data-index="'+i+'" class="dyPlugin-publishAd" href="#">&nbsp;&nbsp;&nbsp;&nbsp;去发布</a>');
				html.push('<tr class="table-tr" data-index="'+item['channelId']+'">'
						+'<td class="dytable-td-1"> <div>'
						+'<img width="64px" heigth="64px" src="'+chrome.extension.getURL("images/"+item['channelDicId']+"_logo.png")+'"/> </div> </td>'
					//+'<td class="table-td-1"><img width="80px" heigth="80px" src="/wt/v8/static/images/channel/blogo/'+item['channelDicId']+'_logo.png"/></td>'
						+'<td class="dytable-td-2">'
							+'<p class="td-p-1">'+item['fullName']+'</p>'
						  	+'<p class="td-p-2"><span>用户名：'+item['account']+'</span></p>'
						+'</td>'
						+'<td class="dytable-td-3">'
							+'<a data-index="'+i+'" class="dyPlugin-publishAd wt-button-5">'+_optText+'</a>'
						+'</td>'
					+'</tr>');					
			});
			_html = '<div class="dysearch">请点击“去发布”进入相应的招聘网站进行后续操作！'
					+'</div>'
					+'<div class="dymain-content">'
						+'<table>'
							+html.join(' ')
						+'</table>'
					+'</div>';
			_title = data.postName+'-'+data.postCode;
		} else {
			// do nothing	
			_html = '<div class="dysearch">' + response.data + '</div>';
			_title = '提示';
		}
		$("#dyPlugin-AdList-content-item").remove();
		$(".dylogin").append(template['pluginAdList'].replace(/\{items}/gi,_html));
		
		if (_hasContent || !auto) {
			showPanel("pluginAdList",{'title':_title,'class':'dylogin-title,dy-ad-title'});
		} else {
			showPanel("versionUpdate");
		}
		dyInitToPublishPage();
	});
}
function _isUseable(key) {
	if (typeof(key) != 'undefined' && $.trim(key).length>0) {
		return true;
	}
	return false;
}
function dyInitToPublishPage() {
	$(".dyicon-close").click(function() {
		$(this).parent().parent().animate({top:'-100px',right:'-10px'});
		return false;
    });

	// 发布
	$(".dyPlugin-publishAd").click(function() {
		var index = $(this).attr("data-index");
 		chrome.extension.sendMessage(jobchannels[index], function (result) {
            //console.log(result);
        });
	});
}

function dyInitToStopPage() {
	$(".dyicon-close").click(function() {
		$(this).parent().parent().animate({top:'-100px',right:'-10px'});
		$(this).parent().parent().remove();
		return false;
    });

	// 发布
	$(".dyPlugin-publishAd").click(function() {
		var index = $(this).attr("data-index");
 		chrome.extension.sendMessage(jobchannels[index], function (result) {
 			
        });
	});
}

window.addEventListener("message", function(event) {
		if(event.data.getPublishResult) {
			var req = event.data.getPublishResult
				req = JSON.parse(req)
				chrome.extension.sendMessage(req, function (d) {})
		}
		if(event.data.refreshSuccessOriginId){
			var req = event.data.refreshSuccessOriginId
			req = JSON.parse(req)
			chrome.extension.sendMessage(req, function (d) {})
		}
		if(event.data.clearFalseOpt){
			var req = event.data.clearFalseOpt;
			req = JSON.parse(req);
			chrome.extension.sendMessage(req, function (d) {})
		}//clearFalseOpt
		if(event.data.downloadResume){
			console.log('content_post.js监听到')
            $(".dysearch-content .dyupload-btn").click()
		}
		if(event.data.passiveRefreshResult){
			var req = event.data.passiveRefreshResult;
			req = JSON.parse(req);
			chrome.extension.sendMessage(req, function (d) {})
		}
}, false);

