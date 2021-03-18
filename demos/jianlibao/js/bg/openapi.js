function DayeeAPI(appKey, serverBaseUrl) {
	var self = this;
	self.appKey = appKey;
	self.serverBaseUrl = serverBaseUrl;
	self.commomServerBaseUrl = serverBaseUrl;
}

DayeeAPI.prototype = {

	"logOff":function(callback){
		var self=this;
		self.token=0;
		callback();
	},
	"checkLogin":function(callback){
		var self=this;
		if (self.token) {
			callback({
				code:true,
				data:{resumeWhereabouts:self.resumeWhereabouts,channellist:self.channellist,ischeckRepeatResume:self.ischeckRepeatResume,applyStatus:self.applyStatus,showRelatedResume:self.showRelatedResume}
			});
		} else {
			callback({code:false,data:{}});
		}
	},"changeDefaultChannel": function(args, callback) {
        var self=this;
        if (self.token && self.channellist) {
          var tar =  self.channellist[args.channelDicId]
			var flag = false
			$.each(tar,function (i, e) {
				if(e.key == args.channelId){
					e.select = true
					flag = true
				}
            })
			if(flag){
                $.each(tar,function (i, e) {
                    if(e.key != args.channelId) {
                        e.select = false
                    }
                })
			}

        }
	},"login": function(args, callback) {
		var self = this;
		//登录接口，使用用户身份登录
		var returnInfoList = "resumeWhereabouts,channellist,token,serverBaseUrl,ischeckRepeatResume,showRelatedResume,applyStatus".split(",");
		var keys = CryptoJS.enc.Utf8.parse(self.appKey.slice(0, 16));
		var pwd = CryptoJS.AES.encrypt(args.password, keys, {iv: keys,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}).toString();
		var parms = {
			corpCode: args.corpCode,
			userName: args.userName,
			password: pwd,
			returnInfoList:returnInfoList,
			autoFill:args.autoFill
		};
		$.each(returnInfoList,function(i,item){
			parms["returnInfoList["+i+"]"] = item;
		});

		$.each(args.channelDicIds,function(i,item){
			parms["channelDicIdList["+i+"]"] = item;
		});
		var settings= {
	         type:"post",
	         url:args.loginUrl,
	         dataType: "json",
			 data: parms,
	        success: function(result){
				if ('00' == result.code) {
					var content = JSON.parse(result.content);
					self.corpCode = args.corpCode;
					self.userName  = args.userName;
					$.each(returnInfoList,function(i,item){
						if (content[item]) {
							self[item] = content[item];
						} else if('serverBaseUrl' == item) {
							self[item] = self['commomServerBaseUrl'];
						} else {
							delete self[item];
						}
					});
					callback({code: 200,data: content});
				} else {
					callback({code: 500});
				}
	         },
	         error:function(result){
	         	callback({code: 500})
	         }
	    };
		$.ajax(settings);
	},"searchJobtitle":function(url, method, args, callback){
		var self = this;
		args.corpCode = api.corpCode;

		var settings={
	         type:method,
	         url:url,
	         dataType: "json",
			 data: args,
			 beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			 },
	         success: function(result){
				if ('00' == result.code) {
					callback({code:200,data:JSON.parse(result.content)});
	         	} else {
	         		callback({code:500,data:[]});
	         	}
	         },
	         error:function(result){
	         	callback({code: 500,data: result.content})
	         }
	    };
		$.ajax(settings);
	},"uploadResume":function(url,method,args,callback) {
		var self = this;
		args.corpCode = api.corpCode;

  		var settings={
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result){
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content});
	         	}
	        },
	        error:function(result){
	        	callback({code:500,data:result.content});
	        }
  		}
  		$.ajax(settings);
	},"checkRepeatResume":function(url,method,args,callback){
		var self = this;
		args.corpCode = api.corpCode;

  		var settings={
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result){
	        	console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"getChannelInfo":function(url,method,callback) {
		var settings = {type:method,url:url,dataType: "json",success: function(result) {
			console.log(result);
			if ('00' == result.code) {
				callback({code:200,data:result.content});
			} else {
		         callback({code:500,data:result.msg});
		    }
		 },error:function (result) {
			 callback({code:500,data:result});
		}};
	  	$.ajax(settings);
	},"getHtmlContent":function (url,method,dataType,args,callback) {
		if (typeof url == 'object') {
			var t = +new Date;
			var result = {};
			var requestArray = [];
			$.each(url,function(name,value) {
				requestArray.push($.ajax({type:method,url:value,dataType:dataType,data:args,async:false}));
			});
			var i=0;
			$.each(url,function(name,value) {
				requestArray[i].done(function(data) {
					result[name] = data;
				});
				i++
			});
			$.when(requestArray).done(function() {
				callback({code:200,data:result})
			});
		} else {
			var settings = {type:method,url:url,dataType: dataType,data:args,success: function(result) {
				callback({code:200,data:result});
			 },error:function (result) {
				 callback({code:500,data:result});
			}};
		  	$.ajax(settings);
	  	}
	},"getContentScript":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
		var settings = {type:method,url:url,dataType: "json",data:args,
		beforeSend:function(xhr) {
			xhr.setRequestHeader('token', api.token);
		},success: function(result) {
			if ('00' == result.code) {
				callback({code:200,data:result.content});
			} else {
				callback({code:500,data:result.msg});
			}
		 },error:function (result) {
			 callback({code:500,data:result});
		}};
	  	$.ajax(settings);
	},"getAdList":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"getAdDetail":function(url,method,args,callback) {
		args.corpCode = api.corpCode ;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"updatePublishTag":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},'getLastVersion':function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "text",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
				callback({code:200,data:result});
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},
	/*'getChannelListInfo':function(url,method,args,callback){
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        }
  		}
  		$.ajax(settings);
	},*/
	'updateRefreshTag':function(url,method,args,callback){
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        }
  		}
  		$.ajax(settings);
	}
	
}
