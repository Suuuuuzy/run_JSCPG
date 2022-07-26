// 1. Send the background a message requesting the user's data
chrome.runtime.sendMessage('get-user-data', (response) => {
  // 3. Got an asynchronous response with the data from the background
  console.log('received user data', response);
  // initializeUI(response);
});



chrome.runtime.sendMessage('get-user-data222', (response) => {
  // 3. Got an asynchronous response with the data from the background
  console.log('received 2', response);
  console.log('received 3', response);
  // initializeUI(response);
});