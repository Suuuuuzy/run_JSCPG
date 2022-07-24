// original file:/media/data2/jianjia/extension_data/unzipped_extensions/negapfpjjmdponkgidhikmddpnonfjpg/knobhead.js

/**
 * Created by Dafz on 22/08/2017.
 */

const words = ["trump", "nazi", "Trump", "Nazi", "TRUMP", "NAZI"];
const awesomeWord = "Knob-head";
const elements = document.getElementsByTagName("*");

let replaceDocumentWords = function () {
    let regex = new RegExp('\\b' + words.join('\\b|\\b') + '\\b', 'g');

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        element.childNodes.forEach(function (node) {
            if (node.nodeType === 3) {
                let text = node.nodeValue;
                let replacedText = text.replace(regex, awesomeWord);

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        });
    }
};

let cleanup = word => {
    document.title = document.title.split(' ').map(word => {
            return words.indexOf(word.toLowerCase()) !== -1 ? awesomeWord.repeat(word.length) : word
        }).join(' ')
};

// Set up a mutation observer to listen for title changes
// Will fire if framework AJAX stuff switches page title
let createObserver = function() {
    let observer = new MutationObserver((mutations) => {
        observer.disconnect();
        observer = null;
        cleanup();
        createObserver();
    });

    observer.observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    )
};
createObserver();

// Kick off initial page load check
cleanup();
replaceDocumentWords();


