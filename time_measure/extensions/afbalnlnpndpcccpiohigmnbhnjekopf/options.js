// Saves options to chrome.storage
function save_options() {
  var hoverPosition = document.getElementById('position').value;
  var hoverDisabled = document.getElementById('disabled').checked;
  chrome.storage.sync.set({
    hoverPosition: hoverPosition,
    hoverDisabled: hoverDisabled
  }, function() {
  	hoverDisabled.innerHTML = "\u2713";
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.sync.get({
    hoverPosition: 'bright',
    hoverDisabled: false
  }, function(items) {
    document.getElementById('position').value = items.hoverPosition;
    document.getElementById('disabled').checked = items.hoverDisabled;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);