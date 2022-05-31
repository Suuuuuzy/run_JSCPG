// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eljfnjdjgekejmdmdbcofecejjamhfld/content.js

var elements = document.getElementsByTagName('*');
var rp_options = {};


function replace_words()
{
    restore_options();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.textContent;
                var replacedText = rp_options.democracy_to_hegemony ? 
                text.replace(/our democracy/gi, "OUR HEGEMONY")
                : text;

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}


// Restores checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value democracy_to_hegemony = true.
  chrome.storage.sync.get({
    democracy_to_hegemony: true
  }, function(items) {
    rp_options["democracy_to_hegemony"] = items.democracy_to_hegemony;
  });
}



// Reference: http://www.html5rocks.com/en/tutorials/speed/animations/
// https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
let ticking = false;

document.addEventListener('scroll', function(e) {

  if (!ticking) {
    window.requestAnimationFrame(function() {
      replace_words();
      ticking = false;
    });

    ticking = true;
  }
});
restore_options();
replace_words();

setTimeout(replace_words, 500);

