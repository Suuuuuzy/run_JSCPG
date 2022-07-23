// Saves options to chrome.storage
function save_options() {
  var linkType = document.getElementById('link_type').value;
  var changeImage = document.getElementById('change_image').checked;
  var animationSpeed = document.getElementById('animation_speed').value;
  var animateOnlyOnArrive = document.getElementById('animate_only_on_arrive').checked;
  var moduleToUse = chrome
  if (typeof moduleToUse === 'undefined') {
    moduleToUse = browser
  }
  moduleToUse.storage.sync.set({
    linkType: linkType,
    changeImage: changeImage,
    animationSpeed: animationSpeed,
    animateOnlyOnArrive: animateOnlyOnArrive
  }, function() {
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
  // Use default value color = 'red' and changeImage = true.
  var moduleToUse = chrome
  if (typeof moduleToUse === 'undefined') {
    moduleToUse = browser
  }
  moduleToUse.storage.sync.get({
    linkType: 'DEFAULT',
    changeImage: true,
    animationSpeed: 1000,
    animateOnlyOnArrive: true
  }, function(items) {
    document.getElementById('link_type').value = items.linkType;
    document.getElementById('change_image').checked = items.changeImage;
    document.getElementById('animation_speed').value = items.animationSpeed;
    document.getElementById('animate_only_on_arrive').checked = items.animateOnlyOnArrive;
  })
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);