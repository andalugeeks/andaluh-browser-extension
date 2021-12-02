'use strict';

const andaluh = require('@andalugeeks/andaluh');
const EPA = new andaluh.EPA();

const CSS_CLASS = '.andaluh-transliterated'
function getAllTextElements() {
  const texts = document.querySelectorAll(`\
    sup:not(${CSS_CLASS}), \
    h1:not(${CSS_CLASS}), \
    h2:not(${CSS_CLASS}), \
    h3:not(${CSS_CLASS}), \
    h4:not(${CSS_CLASS}), \
    h5:not(${CSS_CLASS}), \
    h6:not(${CSS_CLASS}), \
    p:not(${CSS_CLASS}), \
    a:not(${CSS_CLASS}), \
    label:not(${CSS_CLASS}), \
    title:not(${CSS_CLASS}), \
    span:not(${CSS_CLASS}), \
    div:not(${CSS_CLASS}), \
    input:not(${CSS_CLASS}), \
    li:not(${CSS_CLASS}), \
    b:not(${CSS_CLASS})`);

  return texts;
}

const isAlreadyTransliterated = (e) => {
  const { nodeType } = e
  const isNotTextNode = nodeType !== Node.TEXT_NODE 
  const isParentTransliterated = isNotTextNode && e.parentElement && e.parentElement.classList && e.parentElement.classList.contains(`${CSS_CLASS}`)
  return isNotTextNode ? isParentTransliterated : e['andaluh']
}

function switchTextAndSetFlag(e, andaluh) {
  if (isAlreadyTransliterated(e)) return
  const { nodeType } = e
  if (nodeType === Node.TEXT_NODE) {
    e['andaluh'] = true;
    e.parentElement.classList.add(`${CSS_CLASS}`);
  } else if (e && e.classList) {
    e.classList.add(`${CSS_CLASS}`);
  }

  if (e.nodeName === 'INPUT') {
    e.placeholder = andaluh;
  } else {
    e.textContent = andaluh;
  }
}

chrome.storage.local.get('andaluh', function (options) {
  options = options.andaluh || {};
  let currentPageUrl = location.hostname;
  let currentPageStatus = options.urls[currentPageUrl];

  if (currentPageStatus) {
    // automatically transliterated text
    function autoTransliterateText(event) {
      // Wait for the user to stop typing
      if (event.target.value.length > 0) {
        // Get the textarea value
        const text = event.target.value;
        // Transliterate the text
        const transliterated = EPA.transcript(text, options.vaf, options.vvf, true);
        // Update the textarea value
        event.target.value = transliterated;
      }
    }

    // replace all text with transliterated text
    function replaceAllTextWithTransliterated(elements) {
      if (!elements) return
      for (const element of elements) {
        if (element.nodeName === 'STYLE' || element.nodeName === 'SCRIPT') continue;
        const { childNodes, nodeType } = element;
        
        const noChildren = childNodes.length === 0
        const isInput = nodeType === Node.ELEMENT_NODE && element.nodeName === 'INPUT'
        const hasPlaceholder = isInput && element.placeholder
        const textContent = hasPlaceholder ? element.placeholder : element.textContent.replace("\u200B","")
        const isTranslatableElement = nodeType === Node.TEXT_NODE && element.nodeName !== 'STYLE' && element.nodeName !== 'SCRIPT'
        const isNotEmpty = textContent !== '' && textContent.trim() !== ''
        
        if (noChildren && (isInput || isTranslatableElement) && isNotEmpty) {
          // setTimeout is done so that it updates the DOM with elements one by one instead of all at the end of the process
          setTimeout(() => {
            switchTextAndSetFlag(element, EPA.transcript(textContent, options.vaf, options.vvf, true));
          })
        } else if (!noChildren) {
          replaceAllTextWithTransliterated(childNodes);
        }
      }
    }

    // Iterate over all textarea and add a listener to each one
    const textboxes = document.querySelectorAll("textarea, input[type=text]");
    for (const textbox of textboxes) {
      textbox.addEventListener('dblclick', autoTransliterateText);
    }

    const debounce = function(method, delay) {
      clearTimeout(method._tId);
      method._tId= setTimeout(function(){
          method();
      }, delay);
    }

    const runOnScroll = function() {
      const texts = getAllTextElements()
      replaceAllTextWithTransliterated(texts);
    };

    function initScrollEvent() {
      window.addEventListener("scroll", function(event) {
        debounce(runOnScroll, 1000);
      }, true);
    }

    // Leave some space for elements that are not in the DOM yet
    setTimeout(() => {
      const texts = getAllTextElements()
      replaceAllTextWithTransliterated(texts);
    }, 250)
    // Start listening scroll events
    // otherwise the elements loaded via infinite-scroll will not be in andaluh
    initScrollEvent()
  }
});