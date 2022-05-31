// Saves options to chrome.storage
function save_options() {
  var dem_to_heg = document.getElementById('democracy-to-hegemony').checked;
  chrome.storage.sync.set({
    democracy_to_hegemony: dem_to_heg
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value democracy_to_hegemony = true.
  chrome.storage.sync.get({
    democracy_to_hegemony: true
  }, function(items) {
    document.getElementById('democracy-to-hegemony').checked = items.democracy_to_hegemony;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
