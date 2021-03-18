var appKey = "vuUJLULu4GGszgny";
var version = '1.24'; // 获取插件版本
var isOnline = true;
var serverBaseUrl = isOnline ? "http://api.wintalent.cn/wt":"http://localhost:8089/wt";
var requestUrlMap = {login:'/tds/auth/authorizelogin',searchJob:'/tds/post/channelDownloadJobList',uploadResume:'/tds/channel/importResume',checkRepeatResume:'/tds/channel/checkRepeatResume',checkRelevantPerson:'/tds/channel/checkRepeatResume!checkRelatedResume',channelInfo:'/tds/channel/getChannelInfo',getChannelScript:'/tds/channel/getChannelScript',getAdList:'/tds/channel/getAdList',getAdDetail:'/tds/channel/getAdDetail',updatePublishTag:'/tds/channel/updateChannelPublishTag',getLastVersion:'/tds/channel/pluginInfo!getPluginVersion',downloadPlugin:'/tds/channel/pluginInfo!downloadPlugin',updateRefreshTag:'/tds/channel/updateRefreshTag'};

var storage = window.localStorage;
var api = new DayeeAPI(appKey, serverBaseUrl);

var downloadScriptKey = 'downloadScript',adPublishScriptKey = 'adPublishScript';
var channelConfigInfo = {};// 域名、以及各种url
var delayed = true;//用来延时使用
//根据key获取channelInfo
function getChannelInfoByKey(tabId,dic,net,callback){
	var param =  {k:'channelDicId',v:dic}
	if($.trim(net).length>0){
		getChannelScript(adPublishScriptKey,dic,function(script){
			var jscode = "var _adInfo ={};\r\n"+script + "\r\n channelKeys.get("+dic+","+net+");"
			chrome.tabs.executeScript(tabId, {code: jscode}, function(res){
				if(res[0]){
					param = {k:'channelKey',v:res[0]}
				}
				getChannelInfo(param.k, param.v, function(channelInfo){
					callback(channelInfo)
				})
			});
		});
	}else {
		getChannelInfo(param.k, param.v, function(channelInfo){
					callback(channelInfo)
		})	
	}
}

//requestMsg . sender , response
function onMessage(requestMsg,sender,callback) {
	switchMessageHandle(requestMsg,callback,requestMsg.type);
	return true;
}
chrome.extension.onMessage.addListener(onMessage);

//监听页面变化（自动填充账号密码、职位信息）
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//if (changeInfo.status == "complete"）
	if (tab.status != 'complete') {
		return;
	}

	// 搜索简历
	/*var _currentUrl = tab.url;
	if (/\/wt\/talentPool\/channel\/(job|zhaopin|lietou)\/listResume\?channelDicId=/i.test(_currentUrl)) {
		console.log('dayee');
		$('#dySearch').show();
	}*/
	var _currentUrl = tab.url;
	var _old = _mapUtils.get('searchTabsInfo');
	var _preTabIdInfo = _old['searchTabId_'+tabId];
	if (_preTabIdInfo) {

		//_old['searchTabId_'+tabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
		getChannelInfoByKey(tabId,_preTabIdInfo.channelDicId,_preTabIdInfo.netRecruitment, function(channelInfo) {

			var _loginPageRegx = channelInfo['loginPageRegx'];
			if (_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl)) {
				var _jscode = "function _getAccountInfo(){var _info= $('#dySearchGetAccountUrl').attr('data-accountinfo');if(!_info){_info=top.window['data-accountInfo']} return _info;}\r\n;_getAccountInfo();";
				chrome.tabs.executeScript(_preTabIdInfo.preTabId, {code: _jscode}, function(resp) {
					if (resp && resp[0] != null) {
						var _searchAccountInfo = JSON.parse(resp[0]);
						getChannelScript(adPublishScriptKey,channelInfo.channelDicId,function(loginScript) {
							var jscode = "var _adInfo = " + JSON.stringify(_searchAccountInfo) + ";\r\n"+loginScript;
//							console.log(jscode);
							chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
								// 
							});
						});
					}
				});
			}
			// 登录成功到首页后，是否自动跳转到搜索页面
			var _homePageRegx = channelInfo['homePageRegx'];
			if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
				// 跳到搜索页面
				chrome.tabs.update(tabId,{url:channelInfo["searchAddr"]},function(res){
	
				});
			}
		});
	}//搜索 end

	// 发布相关
	if ($.inArray(tabId, _adTabUtils.get()) >= 0) {
		var publishInfo = _mapUtils.get('detail-'+tabId);
		if (publishInfo == null) {
			return;
		}
		getChannelInfoByKey(tabId,publishInfo.channelDicId,publishInfo.netRecruitment, function(channelInfo) {

			// 发布填充职位信息 （如果账号未登录，那么会调到登录页，需要自动填充账号信息；）
			var _publishFillPageRegx = channelInfo['publishFillPageRegx'];
			var _loginPageRegx = channelInfo['loginPageRegx'];
			if ((_isUseable(_publishFillPageRegx) && new RegExp(_publishFillPageRegx, 'i').test(_currentUrl)) ||
				(_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
				) {

				getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(publishInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
						// 
					});
				});
			}

			// 登录成功到首页后，是否自动跳转到发布页面
			var _homePageRegx = channelInfo['homePageRegx'];
			if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
				// 跳到发布页面
				chrome.tabs.update(tabId,{url:channelInfo["publishAddr"]},function(res){
	
				});
			}
			// 发布成功页 start
			// if(/(https|http):\/\/jobads\.zhaopin\.com\/Position\/Result/.test(pageUrl)) {// 发布成功页面
			var _publishSuccessPageRegx = channelInfo['publishSuccessPageRegx'];
			if (_isUseable(_publishSuccessPageRegx) && new RegExp(_publishSuccessPageRegx, 'i').test(_currentUrl)) {
	        	getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(publishInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode + ";\r\n_getChannelPublishSign();"}, function(resp) {
						if (resp && resp[0] != null) {
							_handlePublishSuccessPage(tabId,resp[0],channelInfo,publishInfo)
						} 
					});
				});
	        }
        });// 发布成功页 end
	}
	//去简历详情页
    var _resumeInfo = _mapUtils.get('resumeInfo_'+tabId);
    if(!$.isEmptyObject(_resumeInfo)) {
        var _loginPageRegx = _resumeInfo['loginPageRegx'];
        //登录
        if ((_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
        ) {
            getChannelScript(adPublishScriptKey,_resumeInfo.channelDicId,function(script) {
                var jscode = "var _adInfo = " + JSON.stringify(_resumeInfo) + ";\r\n" + script;
                chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
                })
            });
        }
        // 登录成功到首页后，是否自动跳转到发布页面
        var _homePageRegx = _resumeInfo['homePageRegx'];
        if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
            // 跳到发布页面
            chrome.tabs.update(tabId,{url:_resumeInfo.url},function(res){

            });
        }
    }
    //刷新，暂停，关闭，二次发布页面
	var _stopTabId = _mapUtils.get('stopTabsInfo');
	var _preStopTabIdInfo = _stopTabId['stopTabId_'+tabId];
	if(_preStopTabIdInfo){
		var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
		if (stopRefreshInfo == null) {
			return;
		}
		var refreshOrginIdArray =  _mapUtils.get('refreshOrginIdList_'+tabId);
//		var refreshTreatedResume = _mapUtils.get('treatedResumeId_'+tabId);
		getChannelInfoByKey(tabId,stopRefreshInfo.channelDicId,stopRefreshInfo.netRecruitment, function(channelInfo) {

			// 发布填充职位信息 （如果账号 登录，那么会调到登录页，需要自动填充账号信息；）
			var _stopPageRegx = channelInfo['stopOrRefreshPage'];
			var _loginPageRegx = channelInfo['loginPageRegx'];
			if ((_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
				) {
				getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(stopRefreshInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {

					})

				});

			}
            // 登录成功到首页后，跳转到职位列表页
            var _homePageRegx = channelInfo['homePageRegx'];
            if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
                chrome.tabs.update(tabId,{url:channelInfo["stopOrRefreshPage"]},function(res){

                });
            }
			//职位列表页面 获取职位唯一标识以及更新时间
			var _stopRefreshPageRegx = channelInfo['stopOrRefreshPageRegx'];
			if((_isUseable(_stopRefreshPageRegx) && new RegExp(_stopRefreshPageRegx, 'i').test(_currentUrl)) && !(new RegExp(_loginPageRegx, 'i').test(_currentUrl))){
				//目前只有刷新是更改标识，暂停，关闭等不回填系统状态
				var refreshType = stopRefreshInfo.refreshType;
				if(refreshType == 6||refreshType == 2){//刷新或者暂停
					var isOptRefresh = _mapUtils.get('isOptRefresh_'+tabId);//刷新，暂停时使用，用来判断当前页是搜寻还是刷新或暂停操作
					var isShowScuuceeTip = _mapUtils.get('isShowScuuceeTip_'+tabId);//是否展示刷新或暂停结果
					var isAutoRefresh = _mapUtils.get('isAutoRefresh_'+tabId);//是否自动刷新
					var originIds = JSON.parse(_mapUtils.get('optInfo_'+tabId));//需要自动处理的职位信息  json数组
					var totalNum = stopRefreshInfo.dytotalNum;//总处理数
					var optNum = _mapUtils.get('optNum_'+tabId);//剩余处理
					console.log(originIds[0]);
					var originLength = getHsonLength(originIds);
					if(isAutoRefresh){//自动刷新
						if(originLength>0){
							var originInfo = JSON.stringify(originIds[0]);//获取到你当前处理的职位信息
							optNum = totalNum -optNum +1;//正在处理第几个
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								/**
								 * 由于智联搜索职位是ajax，51，猎聘，拉钩搜索都会二次触发插件。所以分成两种情况进行处理。
								 * 如果是智联，插件会先执行搜索，然后根据搜索出来的内容，在进行刷新暂停等操作。
								 * 如果是其他渠道，则是根据一个标识判断当前是执行的操作是搜索还是刷新操作。如果执行的是搜索操作那么就触发搜索的脚本，如果是刷新等操作则触发相应的脚本。
								 * */
								if(stopRefreshInfo.channelDicId == 2){//搜索职位异步加载的
									//先搜到职位信息
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+false+","+refreshType+");"}, function(resp) {
										
									});
									//等待3000毫秒，待搜索到职位信息后，再进行自动刷新
									setTimeout(function(){
										chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+true+","+refreshType+");"}, function(resp) {
											if(true){
												delete originIds[0];
												changeJson(originIds,tabId);
											}
											if(resp && !resp[0]){//自动刷新失败
												var falseOriginInfo = JSON.parse(originInfo);
												var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
												var falseLength = getHsonLength(falseInfo);
												if(!isExisFalseOpt(falseInfo,falseOriginInfo)){
													falseInfo[falseLength] = falseOriginInfo;
													_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseInfo));
												}
											}else{//自动刷新成功
												var falseOriginInfo = JSON.parse(originInfo);
												var falseInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
												var falseLength = getHsonLength(falseInfo);
												falseInfo[falseLength] = falseOriginInfo;
												_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(falseInfo));
											}
										});
									},3000);
								}else{//搜索刷新页面触发插件的,由于每次搜索都触发插件，不能判定是搜索，还是刷新操作，所以isOptRefresh做了一个记录，true代码
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+isOptRefresh+","+refreshType+");"}, function(resp) {
										if(isOptRefresh){
											delete originIds[0];
											changeJson(originIds,tabId);
										}
										if(resp && !resp[0]){//自动刷新失败
											var falseOriginInfo = JSON.parse(originInfo);
											var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
											var falseLength = getHsonLength(falseInfo);
											if(!isExisFalseOpt(falseInfo,falseOriginInfo)){
												falseInfo[falseLength] = falseOriginInfo;
												_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseInfo));
											}
										}else{//自动刷新成功
											var falseOriginInfo = JSON.parse(originInfo);
											var falseInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
											var falseLength = getHsonLength(falseInfo);
											falseInfo[falseLength] = falseOriginInfo;
											_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(falseInfo));
										}
										_mapUtils.put('isOptRefresh_'+tabId, !isOptRefresh);
									});
								}
							})
						}else if(isShowScuuceeTip){//展示刷新结果
							var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
							var falseLength = getHsonLength(falseInfo);
							var successOptInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
							var successOptLength = getHsonLength(successOptInfo);
							if(successOptLength>0){
								var updateTag = {};
								$.each(successOptInfo,function(i,item){
									updateTag[i] = {"orginId":item.originId};
								})
								if(refreshType == 6){
									refresh(stopRefreshInfo,updateTag);
								}
								var successOpt = {};
								_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(successOpt));
							}
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								console.log("去除系统发布成功的渠道信息");
								var channelId = stopRefreshInfo.channelId;
								var refreshOldTabId = stopRefreshInfo.adStopTabId;
								var _dListCode = adPublishScript +'\r\n'+  "_refreshFinishCode("+channelId+")" ;
								chrome.tabs.executeScript(refreshOldTabId,{code:_dListCode},function(res) {
									console.log('remove %s',channelId);
								});
								//展示系统自动刷新的结果 全部刷新完成或者提示失败职位信息
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_showTips("+JSON.stringify(falseInfo)+","+totalNum+","+refreshType+");"}, function(resp) {
									if(resp && resp[0]){
										_mapUtils.put('isShowScuuceeTip_'+tabId, false);
									}
								});
							})
							_mapUtils.put('isAutoRefresh_'+tabId, false);
						}
					}else{//手动刷新
						if(isShowScuuceeTip){//展示刷新失败的职位信息。
							var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
							if(getHsonLength(falseInfo)>0){
								getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
									var jscode = "var _adInfo = {};\r\n" + adPublishScript;
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_showTips("+JSON.stringify(falseInfo)+","+totalNum+","+refreshType+");"}, function(resp) {
										if(resp && resp[0]){
											_mapUtils.put('isShowScuuceeTip_'+tabId, false);
										}
									});
								});
							}
						}
						//检测页面刷新的外网职位
						if (stopRefreshInfo && stopRefreshInfo.refreshType && stopRefreshInfo.refreshType == 6) {
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								var delayTime = 0;
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_getChannelPostInfoList();"}, function(resp) {
									if(resp != null && resp[0] != null){
										passiveRefresh(tabId,resp,refreshOrginIdArray,stopRefreshInfo);
									}
								});
							});
						}
					}
				}
			}
		});
	}
});

function _handlePublishSuccessPage(tabId,tag,channelInfo,publishInfo){
	var _channelKey = channelInfo['key'];
	if(_channelKey == 'zhaopin0' || _channelKey == 'zhaopin5'){
		_channelKey = 'zhaopin'
	}
	var _successKey = _channelKey+'_'+tag;
	if($.inArray(_successKey, _publishSuccessTagList)>=0){

	} else {
		_publishSuccessTagList.push(_successKey);
	
		// 维护发布标识；完成后清除缓存数据；刷新之前的页面，或修改标识
		console.log('职位%s发布成功，发布标识是%s',publishInfo['postCode'],tag);

		_adTabUtils.remove(tabId);
		_mapUtils.remove('detail-' + tabId);

		_messageNotice({channelKey:channelInfo['channelDicId']+'_logo',
						title:'职位发布成功！',
						message:'您的职位【'+publishInfo['postName']+'】已成功发布到'+channelInfo['channelName'],
						time:10000
		});
		var _adPublishTabId = publishInfo['adPublishTabId'];
		if (_adPublishTabId) {
			getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
				var _cid = publishInfo['channelId'];
				var type = publishInfo['refreshType'];
				var _dListCode = '$("tr.table-tr[data-index='+_cid+']").remove();';
				_dListCode += "try{$('#afterPluginOptFinish')[0].click();}catch(error){console.log('afterPluginOptFinish execte fail');}";
				if(type == 5){
					var postId = publishInfo['postid'];
					var uid = publishInfo['uid'];
					_dListCode = adPublishScript+ '\r\n' + "_postSuccessCode('"+postId+"','"+uid+"')" + '\r\n';
				}
				chrome.tabs.executeScript(_adPublishTabId,{code:_dListCode},function(res) {
					console.log('remove %s',publishInfo['channelId']);
				});
			})
		}

		var publishTagObj = {tag:tag,postId:publishInfo['postid'],uid:publishInfo['uid'],externalKey:publishInfo['externalKey']};

		api.updatePublishTag(getRequestUrl('updatePublishTag'),'post',publishTagObj,function(res) {
			if (res.code == 200) {
				_clearPublishSuccessTag(_successKey);
				console.log('职位%s发布成功，发布标识是%s，成功同步标识',publishInfo['postCode'],tag);
			} else {
				var toSynchObj = $.extend(publishTagObj,{postCode:publishInfo['postCode'],time:new Date(),corp:api.corpCode,postName:publishInfo['postName'],channelKey:channelInfo['key'],channelName:channelInfo['channelName']});
				_toSynPusblishTagList.push(toSynchObj);
			}
		});
	}
}
function _clearPublishSuccessTag(_successKey) {
	if (_isUseable(api.corpCode)) {
		$(_publishSuccessTagList).each(function(i,item){
			if(_successKey == item) {
				_publishSuccessTagList.splice(i,1);
			}
		});
	}
}

var _toSynPusblishTagList = [],_publishSuccessTagList=[];
var _isRunning = false;
setInterval(function() {
	if(_isRunning || !_isUseable(api.corpCode)) {
		
	} else if(_toSynPusblishTagList.length>0) {
		_isRunning = true;
		
		console.log('start interval publish tag:');

		$(_toSynPusblishTagList).each(function(i,item) {
			if (api.corpCode == item['corp']) {
				if ((+new Date - item['time'])<6*3600e3) {
					var publishTagObj = {tag:item['tag'],postId:item['postId'],uid:item['uid'],externalKey:item['externalKey']}; 
					api.updatePublishTag(getRequestUrl('updatePublishTag'),'post',publishTagObj,function(res) {
						if (res.code == 200) {
							_toSynPusblishTagList.splice(i,1);
							_clearPublishSuccessTag(item['channelKey'] +'_'+ item['tag']);
							console.log('职位%s发布成功，发布标识是%s，成功同步标识',item['postCode'],item['tag']);
						} else {
							item['time'] = new Date();
						}
					});
				} else {
					_toSynPusblishTagList.splice(i,1);
				}
			}
		});
		_isRunning = false;
	}
},10*1000);

// 监听tab关闭 （）
chrome.tabs.onRemoved.addListener(function (tabId,removeInfo) {
	// debugger;
	// {isWindowClosing:false,windowId:42}
	//console.log("tab %s closed！",tabId);
	// 移除 （发布成功还未取到标识的不删 TODO）
	_adTabUtils.remove(tabId);
	_mapUtils.remove('detail-' + tabId);
	_mapUtils.remove('stop_' + tabId);
	_mapUtils.remove('optInfo_' + tabId);
	_mapUtils.remove('optNum_' + tabId);
	_mapUtils.remove('falseOptInfo_'+tabId);
	_mapUtils.remove('successOptInfo_'+tabId);
	_mapUtils.remove('isOptRefresh_'+tabId);
	_mapUtils.remove('isShowScuuceeTip_'+tabId);
	_mapUtils.remove('isAutoRefresh_'+tabId);
	_mapUtils.remove('refreshOrginIdList_'+tabId);
	_mapUtils.remove('resumeInfo_' + tabId);
	var _old = _mapUtils.get('searchTabsInfo');
	delete _old['searchTabId_'+tabId];
	_mapUtils.put('searchTabsInfo',_old);
	//移除刷新，二次发布，暂停
	var _stopOld = _mapUtils.get('stopTabsInfo');
	delete _stopOld['stopTabId_'+tabId];
	_mapUtils.put('stopTabsInfo', _stopOld);
});

function switchMessageHandle(request,sendResponse,type) {
	var types= {
		"logOff":function() { //退出
			api.logOff(function(){
				sendResponse();
			});
		},"checkLogin":function() { //查看登录状态
			api.checkLogin(function(data) {
				if(request.corpCode != null && request.userName != null){
					chrome.storage.local.get([appKey],function(res) {
						var userData = res[appKey] ? JSON.parse(res[appKey]) : {};
						if(userData.corpCode && userData.userName){
							if(userData.corpCode != request.corpCode||userData.userName != request.userName){
								data.code = false;
							}
						}
						sendResponse(data);
					});
				}else{
					sendResponse(data);
				}
				
				/*if (data.code) {
					sendResponse(data);
				} else {
					chrome.storage.local.get([appKey],function(res) {
						var cacheData = {};
						if (res[appKey]) {
							cacheData = JSON.parse(res[appKey]);
						}
						if(cacheData.corpCode) {
							data.data.corpCode = cacheData.corpCode;
						}
						if(cacheData.userName) {
							data.data.userName = cacheData.userName;
						}
						sendResponse(data);
					});
					var localAccountInfo = storage[appKey];
					var cacheData = {};
					if (typeof(localAccountInfo)=="undefined") {
						cacheData= {};
					} else {
						cacheData = JSON.parse(localAccountInfo);
					}
					if(cacheData.corpCode)data.data.corpCode = cacheData.corpCode;
					if(cacheData.userName)data.data.userName = cacheData.userName;
				}*/
			});
		},"login":function() { // 登录
			request.loginUrl = serverBaseUrl + requestUrlMap['login'];
			api.login(request,function(data) {
				var keys = CryptoJS.enc.Utf8.parse(appKey.slice(0, 16));
				var pwd = CryptoJS.AES.encrypt(request.password, keys, {iv: keys,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}).toString();
				var storageData= {"corpCode":request.corpCode,"userName":request.userName,"password":pwd,"autoFill":request.autoFill};
				//storage[appKey] = JSON.stringify(storageData);
				chrome.storage.local.set({"vuUJLULu4GGszgny":JSON.stringify(storageData)}, function(items) {
					// set 不能用appKey
					console.log("用户名缓存成功！");
				});
				sendResponse(data);
			});
		},"setPeference":function() { //设置用户偏好
            chrome.storage.local.get(["peference"],function(res) {
                var peference = res["peference"] ? JSON.parse(res["peference"]) : {};
                var param = request.param
				for(k in param){
                    peference[k] = param[k]
				}
                console.log('---setPeference---')
                console.log('peference',peference)
            	chrome.storage.local.set({"peference":JSON.stringify(peference)},function () {})
            })
		},"getPeference":function() { //用户偏好
            chrome.storage.local.get(["peference"],function(res) {
                var peference = res["peference"] ? JSON.parse(res["peference"]) : {};
				var keylist = request.key
				var data = {}
				$.each(keylist,function (i,e) {
                    data[e] = peference[e]
                })
				console.log('---getPeference---')
                console.log('返回data',data)
                sendResponse(data)
			})
		},"searchJobList":function() { //搜索职位
			/*if($.trim(request.keyword)==""){
				var data=getLocalJobtitle();
				sendResponse(data);
				return;
			}*/
			var url = api.serverBaseUrl + requestUrlMap['searchJob'];
			var args={
				keyword:request.keyword,
				recruitType:2
			};
			api.searchJobtitle(url,"post",args,function(data) {
				sendResponse(data.data);
			});
		},"uploadResume":function() { //上传简历
			var url = api.serverBaseUrl + requestUrlMap['uploadResume'];
			
			var args = $.extend({}, request);
			/*var args = {
				channelId: request.channelId,
				channelDicId: request.channelDicId,
	           	resumeContent: request.resumeContent,
	           	encoding : request.encoding,
			  	language: request.language,
			  	postIdList: request.postIdList,
				resumeOriginalId: request.resumeOriginalId,
				applyStatus: request.applyStatus,
			  	resumeWhereabouts:request.resumeWhereabouts,
			  	key:request.key
			};

			if (args.files) {
				for (var i=0;i<args.files.length;i++) {
					var file = args.files[i];
					$.each(file,function(name,value) {
						args['files['+i+'].'+name] = value;
					})
				}
			}*/
			rebulidRequestParms(args);

			api.uploadResume(url,"post",args,function(data) {
				//saveLocalJobtitle(request);
				sendResponse(data);
				//var localResumeInfo={"syncId":data.data,"importState":2,"resumeTitle":request.resumeTitle,"channelImgUrl":request.channelImgUrl};
				//map.insert(localResumeInfo);
				//createNotification(localResumeInfo);
			});
		},"uploadAttachmentFile": function() { //http://www.thinksaas.cn/topics/0/603/603295.html、https://developer.chrome.com/extensions/downloads
            chrome.downloads.download({
                url: request.downloadurl,
                conflictAction: 'uniquify',//conflictAction的值只能为uniquify(在文件名后面添加带括号的序号，以保证文件名唯一)，overwrite(覆盖)或者prompt(给出提示，让用户自行决定是对文件进行重命名还是将其覆盖、)
                method: 'GET'
            }, function(downloadId) {
                chrome.downloads.onChanged.addListener(function(resp) {
                    if (downloadId == resp.id && typeof(resp.filename) != "undefined" && resp.filename.current != "") {
                        var file = resp.filename.current.split('\\').pop();
                        var fileType = file.split('.').pop();
                        
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', request.downloadurl, true);
                        xhr.responseType = "blob";
                        xhr.onload = function() {
                            if (this.status == 200) {
                                var blob = this.response;
                                var fileReader = new window.FileReader();
                                fileReader.readAsDataURL(blob);
                                fileReader.onloadend = function() {
                                    var fileContent = fileReader.result;
                                    fileContent = fileContent.replace(/data:[^,]*?base64,/i, "");
                                    var args = $.extend({}, request);
                                    args.files.push({
                                    	language:request.language,
                                    	base64:true,
                                    	filename:file,
                                    	content:fileContent
                                    });
                                    rebulidRequestParms(args);
                                    var url = api.serverBaseUrl + requestUrlMap['uploadResume'];
                                    api.uploadResume(url, "post", args, function(data) {
                                        sendResponse(data);
                                    });
                                }
                            }
                        }
                        xhr.send();
                    }
                })
            })
        },"checkRepeatResume":function() { // 简历查重
        	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
        		var tabid = tab[0].id;

				var contxt = request.context;
				var _channelInfo = $.extend({}, request.context,{contentScript:{}});
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(res) {
					if (res && res[0] != null) {
						var _res = res[0];

						var checkInfo = request.checkInfo;
						var args = {
							channelId: checkInfo.channelId,
							resumeWhereabouts: checkInfo.resumeWhereabouts,
							channelDicId: contxt.channelDicId,
							resumeOriginalId: _res.resumeOriginalId,
							content: (_res.files && _res.files[0] && _res.files[0]['content']) ? base64encode(utf16to8(_res.files[0]['content'])):'',
							base64:true
						};
						var url = api.serverBaseUrl + requestUrlMap['checkRepeatResume'];
						api.checkRepeatResume(url,"post",args,function(data){
							sendResponse(data);
						});
					} else {
						sendResponse({code:500,errorMsg:'检测失败！错误码：164'});
					}
				});
			});
		},"getChannelInfo":function() {
				if (request.channelDicId) {
					getChannelInfo('channelDicId',request.channelDicId,function(res) {
							sendResponse(res);
					});
				} else {
					getChannelInfo('url',request.url,function(res) {
						sendResponse(res);
					});
				}

		},"getHtmlContent":function() {

			api.getHtmlContent(request.url,request.method,request.dataType,function(data){
				sendResponse(data);
			});
		},"getDownloadScript":function() {
			
			var channelDicId = request.channelDicId;
			getChannelScript(downloadScriptKey,channelDicId,function(res){
				sendResponse(res);
			});
		},"getAdPublishScript":function() {
			
			var channelDicId = request.channelDicId;
			getChannelScript(adPublishScriptKey,channelDicId,function(res){
				sendResponse(res);
			});
		},"getResumeInfo":function() {

			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var tabid = tab[0].id;
				var downloadObj = request.downloadObj
				var contxt = request.context;
				if(downloadObj && 4 != downloadObj.resumeWhereabouts){
                    contxt.jsMethod = 'getResumeAndCheckDownload'
				}
				var _channelInfo = $.extend({}, request.context,{contentScript:{},_channelDicIds:{},resumeWhereabouts:downloadObj.resumeWhereabouts});
				delete _channelInfo.contentScript;
				delete _channelInfo._channelDicIds;
				
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				// TODO
				/*if (contxt.checkContactInfoJsMethod) {
					chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.checkContactInfoJsMethod + "();"}, function(res) {
						if (res && res[0] != null) {
							var _res = res[0];
							if (_res.code == 200) {
								chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(resp) {
									if (resp && resp[0] != null) {
										var uploadInfo = resp[0];
										uploadInfo.fileContentKey = contxt.fileContentKey;

										var check = uploadInfo['multiLanCheck'];
										if (check && check.mulitLan && check.url) { // 多语言简历
											if (contxt.channelDicId == 52) {
												var hash = md5(check.originalId);
												hash = hash.substring(0, 5) + hash.substring(0, 7);

												check['url']['workExp'] = check['url']['workExp'] + hash;
											}
											api.getHtmlContent(check.url,'get','html',{},function(response) {
												if (response.code == 200) {
													var otherLanResumeObject = $.extend(check, {content:response.data});
													chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + "var _otherLanResuem = " + JSON.stringify(otherLanResumeObject) +";\r\n"+ contxt.otherLanJsMethod + "();"}, function(result) {
														if (result && result[0]!=null) {
															uploadInfo.files.push(result[0]);
														}
														sendResponse(rebulidUploadInfo(uploadInfo));
													});
												} else {
													sendResponse(rebulidUploadInfo(uploadInfo));
												}
											});
										} else {
											sendResponse(rebulidUploadInfo(uploadInfo));
										}
									} else {
										sendResponse();
									}
								});
							} else {
								sendResponse({'errorMsg':_res.errorMsg});
							}
						} else {
							sendResponse();
						}
					});
				} else {*/
					chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(resp) {
						if (resp && resp[0] != null) {
							var uploadInfo = resp[0];
							uploadInfo.fileContentKey = contxt.fileContentKey;

							var check = uploadInfo['multiLanCheck'];
							if (check && check.mulitLan && check.url) { // 多语言简历
								if (contxt.channelDicId == 52) {
									var hash = md5(check.originalId);
									hash = hash.substring(0, 5) + hash.substring(0, 7);

									check['url']['workExp'] = check['url']['workExp'] + hash;
								}
								api.getHtmlContent(check.url,'get','html',{},function(response) {
									if (response.code == 200) {
										var otherLanResumeObject = $.extend(check, {content:response.data});
										chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + "var _otherLanResuem = " + JSON.stringify(otherLanResumeObject) +";\r\n"+ contxt.otherLanJsMethod + "();"}, function(result) {
											if (result && result[0]!=null) {
												uploadInfo.files.push(result[0]);
											}
											sendResponse(rebulidUploadInfo(uploadInfo));
										});
									} else {
										sendResponse(rebulidUploadInfo(uploadInfo));
									}
								});
							} else {
								sendResponse(rebulidUploadInfo(uploadInfo));
							}
						} else {
							sendResponse();
						}
					});
				//}
			 })
		},"getAdList":function() {
			var url = getRequestUrl('getAdList');
			api.getAdList(url,"post",{postId:request.postId,externalKey:request.externalKey,external:request.external},function(data) {
				sendResponse(data);
			});
		},"toPublishPage":function() {
			// 去发布广告页面
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _adTabId = tab[0].id;
				console.log('ad publish tab id:%s',_adTabId);
				// 获取参数 {k:'channelDicId',v:request.channelDicId}
				getChannelInfoByKey(_adTabId,request.channelDicId,request.netRecruitment,function(channelInfo){
						if (_isUseable(channelInfo)) {
	                    	// 获取新打开的tab、该职位的详细信息，存储tabId用来和detail信息在内存中做自动填充用
	                    	api.getAdDetail(getRequestUrl('getAdDetail'),'post',{postId:request.postid,externalKey:request.externalKey,uid:request.uid},function(res) {
	                    		// console.log(res);
	                    		if (res.code == 200) {
	                    			// 跳转到指定页面
	                				chrome.tabs.create({active: true,url:channelInfo["publishAddr"] }, function(newTab) { 
										var tabId = newTab.id;
	                    				var publishInfo = $.extend({},request,{'detail':res.data,'adPublishTabId':_adTabId});
		                    			delete publishInfo['type'];

									_adTabUtils.add(tabId);
	                    			_mapUtils.put('detail-' + tabId , publishInfo);

	                    			sendResponse(publishInfo);
								});
									
                    		} else {
                    			_messageNotice({channelKey:channelInfo['channelDicId']+'_logo',
													title:'渠道发布！',
													message:res.data,
													time:5000
									});
                    			console.log('发布信息获取失败，'+ res.data);
                    		}
                    	});
                    }
				});
			});
		},"getAccountInfo":function() {
			chrome.storage.local.get([appKey],function(res) {
				var data = res[appKey] ? JSON.parse(res[appKey]) : {};
				if (data.password) {
					var key = CryptoJS.enc.Utf8.parse(appKey.slice(0, 16));
					
					var decrypt = CryptoJS.AES.decrypt(data.password, key,{iv: key,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
					var pwd = decrypt.toString(CryptoJS.enc.Utf8); 
					data["password"] = pwd;
				}
				sendResponse(data);
			});
		},"checkVersionInfo":function () {
			var _verKey = appKey+"_version";
			chrome.storage.local.get([_verKey],function(res) {
				var _version = '';
				var data = res[_verKey] ? JSON.parse(res[_verKey]) : {};
				if (data && data['version'] && data['lastUpdateTime'] && ((+new Date - data['lastUpdateTime'])<2*3600e3)) {
					_version = data['version'];
				}
				if (_version) {
					getVersionInfo(function(cVersion) {
						var lastVersion = $.trim(_version);
						if (checkNeedUpdate(lastVersion,cVersion)) {
							sendResponse(serverBaseUrl + requestUrlMap['downloadPlugin']);
						} else {
							sendResponse('');
						}
					});
				} else {
					var url = serverBaseUrl + requestUrlMap['getLastVersion'];
					api.getLastVersion(url,"get",{},function(res) {
						if(res.code == 200) {
							getVersionInfo(function(cVersion) {
								var lastVersion = $.trim(res.data);
								
								var _obj = {};
								_obj[_verKey] = JSON.stringify({'version':lastVersion,'lastUpdateTime':+new Date()});
								chrome.storage.local.set(_obj, function(items) {});
								
								if (checkNeedUpdate(lastVersion,cVersion)) {
									sendResponse(serverBaseUrl + requestUrlMap['downloadPlugin']);
								} else {
									sendResponse('');
								}
							});
						}
					});
				}
			});
		},"channelDownload":function() {

			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var tabId = tab[0].id;
				getChannelInfoByKey(tabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (channelInfo && channelInfo.searchAddr) {
                        var defaultChannel = {'channelDicId':request.channelDicId};
							var searchAddr = channelInfo.searchAddr;
							var res = request['getAccountRequestUrl'];
							if (request['hasAccount'] && request['hasAccount'] == true) {
								if(request.chooseChannel){
                                    defaultChannel['channelId'] = request.chooseChannel;
                                    api.changeDefaultChannel(defaultChannel)
								}
								_storeChannelAccount(tabId,request['data-accountInfo']);
								var accountInfo = request['data-accountInfo'];
								chrome.tabs.create({active: true,url:channelInfo["searchAddr"]}, function(newTab) { 
									var newtabId = newTab.id;
									var _old = _mapUtils.get('searchTabsInfo');
									_old['searchTabId_'+newtabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
									_mapUtils.put('searchTabsInfo',_old);
					    			sendResponse({});
								});
							} else if (res) {
								//_jsCode = "function _getAccountUrl(){var _url = window.location.protocol + '//' + window.location.host + $('#dySearchGetAccountUrl').val();return _url;}\r\n_getAccountUrl();";
								//chrome.tabs.executeScript(tabId,{code:_jsCode},function(res) {
									
								//if (res) {
								var xhr = new XMLHttpRequest();
		                        xhr.open('GET', res, true);
		                        xhr.onload = function() {
		                            if (this.status == 200) {
		                                var _text = this.response;
		                                var _accountInfo={};
		                                if (_isUseable(_text)) {
		                                	_accountInfo = JSON.parse(_text);
		                                	_accountInfo['preTabId'] = tabId;
		                                	var _accountJsonInfo = JSON.stringify(_accountInfo);
		                                	sendResponse({'data-accountInfo':_accountJsonInfo,'data-netRecruitment':_accountInfo.netRecruitment});
		                                	_storeChannelAccount(tabId,_accountJsonInfo);
		                                	chrome.tabs.create({active: true,url:channelInfo["searchAddr"]}, function(newTab) { 
												var newtabId = newTab.id;
												var _old = _mapUtils.get('searchTabsInfo');
												_old['searchTabId_'+newtabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId,'netRecruitment':_accountInfo.netRecruitment};
												_mapUtils.put('searchTabsInfo',_old);
												//修改默认选择渠道
												defaultChannel['channelId'] = _accountInfo.channelId;
												api.changeDefaultChannel(defaultChannel);
											});
		                                }
		                            }
		                        }
		                        xhr.send();
							}
					}
				});				
			});
		/*'channelListInfo':function(){
			var url = getRequestUrl('channelListInfo');
			var args= {channelDicId:request.channelDicId};
			api.getChannelListInfo(url,"post",args,function(data) {
				sendResponse(data);
			});
		},*/
		},"toResumePage":function(){
			// zhangziye 去简历详情页
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _resumeTabId = tab[0].id;
				console.log('resume tab id:%s',_resumeTabId);
				getChannelInfoByKey(_resumeTabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (_isUseable(channelInfo)) {
						chrome.tabs.create({active: true,url:request.url }, function(newTab) {
							$.extend(channelInfo,request)
							delete channelInfo.type
                            _mapUtils.put('resumeInfo_' + newTab.id , channelInfo);
						})
					}
				})
			})	

		},'toRefresh':function(){//刷新，暂停等操作
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _adTabId = tab[0].id;
				console.log('ad stop tab id:%s',_adTabId);
				getChannelInfoByKey(_adTabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (_isUseable(channelInfo)) {
                			// 跳转到指定页面
            			var uri = channelInfo.stopOrRefreshPage;
						chrome.tabs.create({active: true,url:uri }, function(newTab) { 
							var tabId = newTab.id;
            				var stopRefreshInfo = $.extend({},request,{'detail':request.data,'adStopTabId':_adTabId});
                			delete stopRefreshInfo['type'];
                			var refreshOrginIdList = new Array();
//                			var refreshTreatedResume = new Array();
                			var _old = _mapUtils.get('stopTabsInfo');
							_old['stopTabId_'+tabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
							_mapUtils.put('stopTabsInfo',_old)
                			_mapUtils.put('stop_' + tabId , stopRefreshInfo);
							_mapUtils.put('refreshOrginIdList_'+tabId, refreshOrginIdList);
							_mapUtils.put('optInfo_'+tabId,stopRefreshInfo.originIds);
							_mapUtils.put('optNum_'+tabId,stopRefreshInfo.dytotalNum);
							var falseOpt = {};
							_mapUtils.put('successOptInfo_'+tabId,JSON.stringify(falseOpt))
							_mapUtils.put('falseOptInfo_'+tabId,JSON.stringify(falseOpt));
							_mapUtils.put('isOptRefresh_'+tabId, false);
							_mapUtils.put('isShowScuuceeTip_'+tabId, true);
							_mapUtils.put('isAutoRefresh_'+tabId,stopRefreshInfo.isAutoRefresh);
							_mapUtils.put('_adTabId_'+tabId,_adTabId);
                			sendResponse(stopRefreshInfo);
						});
                    }
				});
			});
		},'checkRelevantPerson':function(){
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
        		var tabid = tab[0].id;

				var contxt = request.context;
				var _channelInfo = $.extend({}, request.context,{contentScript:{}});
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(res) {
					if (res && res[0] != null) {
						var _res = res[0];

						var checkInfo = request.checkInfo;
						var args = {
							channelId: checkInfo.channelId,
							channelDicId: contxt.channelDicId,
							resumeOriginalId: _res.resumeOriginalId,
							content: (_res.files && _res.files[0] && _res.files[0]['content']) ? base64encode(utf16to8(_res.files[0]['content'])):'',
							base64:true
						};
						var url = api.serverBaseUrl + requestUrlMap['checkRelevantPerson'];
						api.checkRepeatResume(url,"post",args,function(data){
							sendResponse(data);
						});
					} else {
						sendResponse({code:500,errorMsg:'检测失败！错误码：164'});
					}
				});
			});
		},'getPublishResult': function(){
			//zhangziye 获取发布标识
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request)
				var _tabId = tab[0].id;
				var publishInfo = _mapUtils.get('detail-'+_tabId);
				var _postId = request.postId
				if (_postId && publishInfo ) {
					getChannelInfoByKey(_tabId,publishInfo.channelDicId,publishInfo.netRecruitment, function(channelInfo) {	
						_handlePublishSuccessPage(_tabId,_postId,channelInfo,publishInfo)
					})
				}
			})
		},'refreshSuccessOriginId':function(){//接受刷新成功的职位，自动刷新，智联是默认失败注入一个脚本到页面自动刷新，刷新成功时候返回一个职位信息，
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request);
				var tabId = tab[0].id;
				var originId = request.originId;
				var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
				updataRefresh(tabId,originId,stopRefreshInfo);
			});
		},'clearFalseOpt':function(){//清楚自动刷新的缓存记录，当用户点击去除失败内容的框的时候触发
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request);
				var tabId = tab[0].id;
				var falseOptInfo = {};
				_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseOptInfo));
				_mapUtils.put('isShowScuuceeTip_'+tabId, false);
			});
		},'passiveRefreshResult':function(){//这个是接收智联的刷新结果的，由于智联的页面是ajax的所以必须做一个脚本注入检测当前刷新的职位。
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				if(request != null){
					var tabId = tab[0].id;
					var refreshOrginIdArray =  _mapUtils.get('refreshOrginIdList_'+tabId);
					var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
					var res = request.resumeInfoList;
					passiveRefresh(tabId,res,refreshOrginIdArray,stopRefreshInfo);
				}
			});
		}
	}
	types[type]();
}

function _storeChannelAccount (tabId,data) {
	var _jsCode = "top.window['data-accountInfo']='"+data+"'";
	chrome.tabs.executeScript(tabId,{code:_jsCode},function(res) {
		// do nothing
	});
}

function checkNeedUpdate(lastVerion,currentVersion) {
	if(_isUseable(lastVerion) && _isUseable(currentVersion)) {
		console.log('lastVerion %s，currerntVersion %s',lastVerion,currentVersion);
		return getVersionNo(lastVerion) > getVersionNo(currentVersion);
	}
	return false;
}

//1.2
function getVersionNo(version) {
	var _array = version.split('.');
	var _no = 0;
	for (var _i=0,_j=_array.length;_i<_j;_i++) {
		_no+=_array[_i]*Math.pow(10,_j-_i-1);
	}
	return _no;
}

function getVersionInfo(callback) {
	$.get(chrome.extension.getURL('manifest.json'), function(info) {
	    callback(info.version);
	}, 'json');
}
function rebulidUploadInfo (uploadInfo) {
	var key = uploadInfo.fileContentKey;
	if (typeof (uploadInfo) != "undefined") {
		if (uploadInfo.files) {
			for (var i=0;i<uploadInfo.files.length;i++) {
				uploadInfo.files[i][key] = base64encode(utf16to8(uploadInfo.files[i][key]));
				uploadInfo.files[i]['base64'] = true;
			}
		}
	}
	return uploadInfo;
}

function rebulidRequestParms(args) {
	if (args) {
		delete args.multiLanCheck;
		if (args.files) {
			for (var i=0;i<args.files.length;i++) {
				var file = args.files[i];
				$.each(file,function(name,value) {
					args['files['+i+'].'+name] = value;
				})
			}
		}
		delete args.files;
	}
}

//获取简历下载、职位发布脚本 （type）
// 'contentScript_2':{downloadScript，adPublishScript，lastUpdateTime}
function getChannelScript(type,channelDicId,callback) {
	 var key = "contentScript_"+channelDicId;
	 chrome.storage.local.get([key], function(items) {
		 var script = JSON.parse(items[key] || '{}');
		 //if(!isOnline){
			//script = {};
		 //}
		 if (isValidContentScript(script)) {
			//sendResponse(contentScript['contentScript_'+channelDicId]);
			callback(script[type]);
		 } else {
		 	var url = serverBaseUrl + requestUrlMap['getChannelScript'];
			api.getContentScript(url,"post",{channelDic:channelDicId,version:version},function(result) {
				if (result.code == 200) {
					var script = JSON.parse(result.data);
					script['lastUpdateTime'] = +new Date();
					//contentScript['contentScript_'+channelDicId] =  {'lastUpdateTime':+new Date(),'data':result.data};
					var _obj = {};
					_obj[key] = JSON.stringify(script);
					chrome.storage.local.set(_obj, function(items) {});
					//sendResponse(contentScript['contentScript_'+channelDicId]);
					callback(script[type]);
				 } else {
					 console.log(result.data);
					 callback(null);
				 }
			 });
		 }
	 });	
}

// 获取渠道配置信息
function getChannelInfo(type, value, callback) {
	 chrome.storage.local.get(["channelConfigInfo"], function(items) {
		 var config = JSON.parse(items['channelConfigInfo'] || '{}');
		 //if (!isOnline) {
		 	//config = {};
		 //}
		 if (isValidChannelConfig(config)) {
			channelConfigInfo = config; 
			var channelinfo = getChannelInfoBy(type,value);
			callback(channelinfo[0]);
		 } else {
		 	var url = serverBaseUrl + requestUrlMap['channelInfo'] + '?version='+version;
			 api.getChannelInfo(url,"post",function(result) {
				if (result.code == 200) {
					channelConfigInfo =  {'lastUpdateTime':+new Date(),'data':JSON.parse(result.data)};
					var channelinfo = getChannelInfoBy(type,value);
					chrome.storage.local.set({ "channelConfigInfo": JSON.stringify(channelConfigInfo)}, function(items) {});
					callback(channelinfo[0]);
				 } else {
					 console.log(result.data);
					 callback(null);
				 }
			 });
		 }
	 });
}
function getChannelInfoBy(type,value) {
	var arr = $.grep(channelConfigInfo.data, function(obj, i) {
		if (type == "url") {
			var regx = new RegExp(obj["urlMatchRegx"], 'i');
			return regx.test(value);
		} else if (type == "channelName") {
			return obj["channelName"] == value;
		} else if (type == "channelDicId") {
			return obj["channelDicId"] == value;
		} else if(type == "channelKey") {
			return obj["key"] == value;
		}else{
			return null
		}
	});
	var channelDicIds = getChannelDicIds();
	$(arr).each(function(i,v) {
		arr[i]['_channelDicIds'] = channelDicIds;
	});
	return arr;
}

function getChannelDicIds() {
	var channelDicIds = [];
	$.each(channelConfigInfo.data, function(i,obj) {
		channelDicIds.push(obj["channelDicId"]);
	});
	return channelDicIds;
}

// 获取该企业对应的接口url
function getRequestUrl(key) {
	return api.serverBaseUrl + requestUrlMap[key];
}

// 简历下载、职位发布脚本（六小时有效）
//'contentScript_2':{downloadScript，adPublishScript，lastUpdateTime}
function isValidContentScript(con_script) {
 	if(con_script && (con_script[downloadScriptKey] || con_script[adPublishScriptKey]) && con_script['lastUpdateTime']) {
		if ((+new Date - con_script['lastUpdateTime'])<4*3600e3) {
	 		return true;
	 	}
 	}
	return false;
}

//当天有效 （url ……）
function isValidChannelConfig(info) {
	 if (info && info['data'] && info['lastUpdateTime']) {
	 	var now = new Date();
	 	var lastUpdateTime = new Date(info['lastUpdateTime']);
	 	if ((now.getMonth() == lastUpdateTime.getMonth()) && (now.getDate() == lastUpdateTime.getDate())) {
	 		return true;
	 	}
	 }
	 return false;
}

//存储新打开的切换页ID，
//tabids : [];
//detailInfo : {id:'detail'};

function _isUseable(key) {
	if (typeof(key) != 'undefined' && $.trim(key).length>0) {
		return true;
	}
	return false;
}

/***
 * <pre>>
 * 1、chrome.storage.local方式只能够将数据存储在当前登录的设备本地
 *   1）、content_scripts可以直接读取数据，而不必通过background页面；
 *   2）、在隐身模式下仍然可以读出之前存储的数据；
 *   3）、读写速度更快；
 *   4）、用户数据可以以对象的类型保存；
 * 2、window.localStorage生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在
 * </pre>
 */
var _mapUtils = {
	put:function(key,value) {
		if (_isUseable(key)) {
			storage[key] = JSON.stringify(value);
			/*chrome.storage.local.set({key: JSON.stringify(value)}, function(items) {
				console.log("保存完毕");
			});*/
		}
	},
	get:function(key) {
		if (_isUseable(key)) {
			var str = storage[key];
			if (_isUseable(str)) {
				return JSON.parse(str);
			} else {
				return {};
			}
			/*chrome.storage.local.get([key], function(str) {
				if (_isUseable(str)) {
					return JSON.parse(str);
				} else {
					return {};
				}
			});*/
		}
	},
	remove:function(key) {
		if (_isUseable(key)) {
			delete storage[key];
			//chrome.storage.local.remove([key], function(str) {});
		}
	}
}
//判断是否是当天日期
function isNowDay(time){
	if(time == null){
		return false;
	}
	var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var timearr=time.split(" ")[0];
    if(currentdate == timearr){
    	return true;
    }
    return false;
}

var _adTabUtils = {
	add:function(tabId) {
		if (_isUseable(tabId)) {
			//chrome.storage.local.get(['tabInfo'], function(res) {
			var tabInfoArray = storage['tabInfo'] ? JSON.parse(storage['tabInfo']) : [];
			tabInfoArray.push(tabId);
			//chrome.storage.local.set({'tabInfo': JSON.stringify(tabInfoArray)}, function(items) {});
			storage['tabInfo'] = JSON.stringify(tabInfoArray);
			//});
		}
	},
	remove:function(tabId) {
		if (_isUseable(tabId)) {
			var res = storage['tabInfo'];
			if (res) {
				var tabInfoArray = JSON.parse(res);
				var newTabInfoArray = [];
				$.each(tabInfoArray,function(i,item) {
					if (tabId == item) {
						// do nothing
					} else {
						newTabInfoArray.push(item);
					}
				});
				storage['tabInfo'] = JSON.stringify(newTabInfoArray);
			}
			/*chrome.storage.local.get(['tabInfo'], function(res) {
				if (res['tabInfo']) {
					var tabInfoArray = JSON.parse(res['tabInfo']);
					var newTabInfoArray = [];
					$.each(tabInfoArray,function(i,item) {
						if (tabId == item) {
							// do nothing
						} else {
							newTabInfoArray.push(item);
						}
					});
					chrome.storage.local.set({'tabInfo': JSON.stringify(newTabInfoArray)}, function(items) {
						console.log("ad tab 保存完毕");
					});
				}
			});*/
		}
	},
	get:function(){
		var res = storage['tabInfo'];
		if (res) {
			return JSON.parse(res);
		} else {
			return [];
		}
	}
};
//同步刷新标识
function refresh(stopRefreshInfo,item){
	var time = 0;
	if(delayed){
		delayed = false;
	}else{
		time = 1000;
		delayed = true;
	}
	 setTimeout(function(){
			var refreshTagObj = {channelId:stopRefreshInfo.channelId,channelDicId:stopRefreshInfo.channelDicId,positionInfo:JSON.stringify(item),type:6};
			api.updateRefreshTag(getRequestUrl('updateRefreshTag'),'post',refreshTagObj,function(res){
				if(res.code == 200){
					//如果更新成功就刷新职位列表页面
					var code = "$('#wt-search').click();"
					chrome.tabs.executeScript(stopRefreshInfo.adStopTabId,{code:code},function(res) {
						console.log("刷新成功");
					});
				}
			});
	},time);
}
//获取json数组的长度
function getHsonLength(json){
    var jsonLength=0;
    for (var i in json) {
        jsonLength++;
    }
    return jsonLength;
}

function changeJson(json,tabId){
	var optInfoJson = {};
	var count = 0
	$.each(json,function(i,item){
		optInfoJson[count++] = item;
	});
	_mapUtils.put("optInfo_"+tabId, JSON.stringify(optInfoJson));
	_mapUtils.put('optNum_'+tabId,count);
}
//自动刷新更新刷新标识 去除自动刷新失败的职位缓存
function updataRefresh(tabId,originId,stopRefreshInfo){
	//更新刷新标识，并且删除 操作失败的这个职位的缓存。
	var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
	var falseLength = getHsonLength(falseInfo);
	if(falseLength>0){
		$.each(falseInfo,function(k,info){
			if(info.originId == originId){
				delete falseInfo[k];
				refresh(stopRefreshInfo,{"0":{"orginId":info.originId}});
				getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = {};\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_removeTips('"+info.postName+"');"}, function(resp) {
						if(res&&res[0]){
							_mapUtils.put('isShowScuuceeTip_'+tabId, false);
						}
					});
				})
			}
		});
		_mapUtils.put('falseOptInfo_'+tabId,JSON.stringify(falseInfo));
	}
}
//手动刷新更新刷新标识 不会去除失败的缓存内容
function passiveRefresh(tabId,resp,refreshOrginIdArray,stopRefreshInfo){
	if(resp !=null && resp[0]!=null){
		var resumeList = JSON.parse(resp);
		var updateResume={};
		var count = 0;
		$.each(resumeList,function(i,item){
			var updateTime = item['updateTime'];
			if(isNowDay(updateTime)){
				if(!($.inArray(item['orginId'],refreshOrginIdArray)>-1)){
					refreshOrginIdArray.push(item['orginId']);
					updateResume[count++] = item;
				}
			}
		});
		if(!$.isEmptyObject(updateResume)){
			_mapUtils.put('refreshOrginIdList_'+tabId,refreshOrginIdArray);
			refresh(stopRefreshInfo,updateResume);
		}
	}
}
//是否包含刷新失败的职位
function isExisFalseOpt(falseInfo,falseOriginInfo){
	var isExis = false;
	if(getHsonLength(falseInfo)>0){
		var falseOriginId = falseOriginInfo['originId'];
		$.each(falseInfo,function(i,item){
			var originId = item.originId;
			if(falseOriginId == originId){
				isExis = true;
			}
		})
	}
	return isExis;
}

/*************task start**************/
/*function getDyuuid() {
	var _dyuuid = _mapUtils.get('dyuuid');
	if (_dyuuid && _dyuuid.length && _dyuuid.length==36) {
		
	} else {
		_dyuuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16)
		});
	}
	_mapUtils.put('dyuuid',_dyuuid);
	return _dyuuid;
}
var proxyUrl, callbackUrl,firstStepT=5,secondStepT=2;
function checkNeedStartUp() {
	getChannelInfo('channelKey', 'dayee', function(channelInfo) {
		var needStop = true;
		try {
			if (channelInfo && channelInfo['externalInfo']) {
				var externalJson = JSON.parse(channelInfo['externalInfo']);
				if (externalJson['getTodoListUrl'] && externalJson['saveTodoListUrl'] && externalJson['startHour'] && externalJson['endHour']) {
					var _uuid = getDyuuid();
					var hour = (new Date()).getHours();
					if (hour>=Number(externalJson['startHour']) && hour<=Number(externalJson['endHour'])) {
						if (externalJson['getTodoListUrl'].indexOf('?')>0) {
							proxyUrl = externalJson['getTodoListUrl'] +'&uuid='+_uuid;
						} else {
							proxyUrl = externalJson['getTodoListUrl'] +'?uuid='+_uuid;
						}
						if (externalJson['saveTodoListUrl'].indexOf('?')>0) {
							callbackUrl = externalJson['saveTodoListUrl'] +'&uuid='+_uuid;
						} else {
							callbackUrl = externalJson['saveTodoListUrl'] +'?uuid='+_uuid;
						}
						if (externalJson['firstStepT']) {
							firstStepT = Number(externalJson['firstStepT']);
						}
						if (externalJson['secondStepT']) {
							secondStepT = Number(externalJson['secondStepT']);
						}
						startTask();
						needStop = false;
					}
				}
			}
		} catch(err) {
			console.log('checkNeedStartUp->',err);
		} finally {
			needStop && stopTask(); 
		}
	});
}
var todoListLock = false,taskRunning = false,fetchTaskms = 5,execTaskms = 5;
function getTodoList() { //获取任务
	if (todoListLock) {
		return;
	}
	try {
		todoListLock = true;
		chrome.storage.local.get(["channelTodoList"], function(items) {
			var config = JSON.parse(items['channelTodoList'] || '[]');
			if (config.length >= 10) {
				
				resetSleepTime('fetch');sleepTask('fetch');
			} else {
				try {
					$.ajax({type:"get",async:false,timeout:2000,url:proxyUrl+"&corp="+(api['corpCode']||'')+"&size="+(10-config.length),complete:function (XMLHttpRequest, textStatus) {
						if("success" == textStatus) {
							var json = JSON.parse(XMLHttpRequest.responseText);
							if ('00' == json.code && json.data && json.data.length > 0) {
								$(json.data).each(function(i,item) {
									config.push(item);
								});
								chrome.storage.local.set({"channelTodoList":JSON.stringify(config)},function(){});
								resetSleepTime('fetch');sleepTask('fetch');
							} else {
								addSleepTime('fetch');sleepTask('fetch');
							}
						} else {
							addSleepTime('fetch');sleepTask('fetch');
						}
					}});
				} catch (err) {
					addSleepTime('fetch');sleepTask('fetch');
				} 
			}
		});
	} finally {
		todoListLock = false;
	}
}
// 做任务
//{'taskId':1,'url':'','status':0}
function execTodoList() {
	if (todoListLock) {
		return;
	}
	try {
		todoListLock = true;
		chrome.storage.local.get(["channelTodoList"], function(items) {
			var configArray = JSON.parse(items['channelTodoList'] || '[]');
			try {
				// debugger;
				if (configArray.length == 0) {
					
					addSleepTime('exec');sleepTask('exec');
				} else {
					for (var i=0;i<configArray.length;i++) {
						var item = configArray[i];
						var httpurl = item['url'],taskId = item['taskId'];
						if (item['result']) {
							// 忽略已经请求成功过并缓存的结果
							pushTodoList(taskId,httpurl,item['result']);
							if (i == (configArray.length-1)) {
								addSleepTime('exec');sleepTask('exec');
							}
						} else if (httpurl) {
							$.ajax({type:'get',timeout:2000,url:httpurl,complete:function(XMLHttpRequest, textStatus) {
								if ("success" == textStatus) {
									pushTodoList(taskId,httpurl,XMLHttpRequest.responseText);
								} else {
									addSleepTime('exec');sleepTask('exec');
								}
							}});
							break;
						}
					} 
				}
			} catch(err) {
				addSleepTime('exec');sleepTask('exec');
			}
		});
	} finally {
		todoListLock = false;
	}
}
function pushTodoList(taskId,httpurl,dataStr) {
	$.ajax({
		type:'post',async:false,timeout:2000,url:callbackUrl+"&corp="+(api['corpCode']||''),data:{content:dataStr,url:httpurl,taskId:taskId},
		complete:function(XMLHttpRequest1, textStatus1) {
			if ("success" == textStatus1) {
				// 成功（00）：清除；异常（05）：暂存data到item里；失败（数据不对01）：清空缓存
				var json = JSON.parse(XMLHttpRequest1.responseText);
				chrome.storage.local.get(["channelTodoList"], function(items) {
					var configArray = JSON.parse(items['channelTodoList'] || '[]');
					var newConfigArray = [];
					$(configArray).each(function(i,item) {
						if (taskId == item['taskId']) {
							if ('00' == json['code']) {
								
							} else if ('01' == json['code']) {
								delete item['result'];
								newConfigArray.push(item);
							} else if ('05' == json['code']) {
								item['result'] = dataStr;
								newConfigArray.push(item);
							}
						} else {
							newConfigArray.push(item);
						}
					});
					chrome.storage.local.set({"channelTodoList":JSON.stringify(newConfigArray)},function(){});
					if ('00' == json['code']) {
						resetSleepTime('exec');sleepTask('exec');
					} else {
						addSleepTime('exec');sleepTask('exec');
					}
				});
			} else {
				addSleepTime('exec');sleepTask('exec');
			}
		}
	});
}
function resetSleepTime(op) {
	'fetch' == op ? (fetchTaskms = 5) : (execTaskms = 5);
}
function addSleepTime(op) {
	if ('fetch' == op) {
		fetchTaskms < 50 ? (fetchTaskms += firstStepT) : fetchTaskms > 200 ? resetSleepTime(op) : (fetchTaskms += secondStepT);
	} else {
		execTaskms < 50 ? (execTaskms += firstStepT) : execTaskms > 200 ? resetSleepTime(op) : (execTaskms += secondStepT);
	}
}
async function sleepTask(op) {
	if (taskRunning) {
		if ('fetch' == op) {
			//console.log('fetch start sleep~', fetchTaskms, '~locked:' + todoListLock,+new Date());
			await sleep(fetchTaskms * 1000);
			//console.log('fetch finish sleep~',+new Date());
			getTodoList();
		} else {
			//console.log('exec start sleep~', execTaskms, '~locked:' + todoListLock,+new Date());
			await sleep(execTaskms * 1000);
			//console.log('exec finish sleep~',+new Date());
			execTodoList();
		}
	}
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function startTask() {
	if (taskRunning) {
		console.log('startTask->',+new Date(),'->isRunnig');
	} else {
		console.log('startTask->',+new Date());
		taskRunning = true;
		sleepTask('fetch'),sleepTask('exec');
	}
}
function stopTask () {
	console.log('stopTask->',+new Date());
	taskRunning = false;
}
setInterval(function() { checkNeedStartUp();},5*60*1000);// 定时获取配置判断任务是否需要开启或关闭
checkNeedStartUp();*/
/*************task end**************/

//_messageNotice({'title':'ddd','channelKey':'1_logo','message':'dasd'})
function _messageNotice(data) {  

    //显示一个桌面通知  
    if (window.webkitNotifications) {  
        var notification = window.webkitNotifications.createNotification(  
            'images/'+data.channelKey+'.png',  // icon url - can be relative  
            data.title,  // notification title  
            data.message  // notification body text  
        );  
        notification.show();          
        // 设置3秒后，将桌面通知dismiss  
        setTimeout(function(){notification.cancel();}, data.time?data.time:3000);  
   
    } else if (chrome.notifications) {  
        var opt = {  
            type: 'basic',  
            title: data.title,  
            message: data.message,  
            iconUrl: 'images/'+data.channelKey+'.png',  
        }  
        chrome.notifications.create('', opt, function(id){  
            setTimeout(function(){  
            chrome.notifications.clear(id, function(){});  
            }, data.time?data.time:3000);  
        });  
      
    } else {  
        console.log('亲，你的浏览器不支持啊！');  
    }
}
