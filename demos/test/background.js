// Example of a simple user data object
const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  console.log(message);
  if (message === 'get-user-data') {
    console.log(1);
    sendResponse("response1");
  }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  console.log(message);
  if (message === 'get-user-data') {
    console.log(2);
    sendResponse("response2");
  }
});