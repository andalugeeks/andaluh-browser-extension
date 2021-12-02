'use strict';

const andaluh = require('@andalugeeks/andaluh');
const EPA = new andaluh.EPA();

function getAllTextElements() {
  const texts = document.querySelectorAll("\
    sup:not(.andaluh-translated), \
    h1:not(.andaluh-translated), \
    h2:not(.andaluh-translated), \
    h3:not(.andaluh-translated), \
    h4:not(.andaluh-translated), \
    h5:not(.andaluh-translated), \
    h6:not(.andaluh-translated), \
    p:not(.andaluh-translated), \
    a:not(.andaluh-translated), \
    label:not(.andaluh-translated), \
    title:not(.andaluh-translated), \
    span:not(.andaluh-translated), \
    div:not(.andaluh-translated), \
    input:not(.andaluh-translated), \
    li:not(.andaluh-translated), \
    b:not(.andaluh-translated)");

  return texts;
}

const isAlreadyTranslated = (e) => {
  const { nodeType } = e
  const isNotTextNode = nodeType !== Node.TEXT_NODE 
  const isParentTranslated = isNotTextNode && e.parentElement && e.parentElement.classList && e.parentElement.classList.contains('andaluh-translated')
  return isNotTextNode ? isParentTranslated : e['andaluh']
}

function switchTextAndSetFlag(e, andaluh) {
  if (isAlreadyTranslated(e)) return
  const { nodeType } = e
  if (nodeType === Node.TEXT_NODE) {
    e['andaluh'] = true;
    e.parentElement.classList.add('andaluh-translated');
  } else if (e && e.classList) {
    e.classList.add('andaluh-translated');
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
    // automatically translate text
    function autoTranslateText(event) {
      // Wait for the user to stop typing
      if (event.target.value.length > 0) {
        // Get the textarea value
        const text = event.target.value;
        // Translate the text
        const translated = EPA.transcript(text, options.vaf, options.vvf, true);
        // Update the textarea value
        event.target.value = translated;
      }
    }

    // replace all text with translated text
    function replaceAllTextWithTranslated(elements) {
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
          replaceAllTextWithTranslated(childNodes);
        }
      }
    }

    // Iterate over all textarea and add a listener to each one
    const textboxes = document.querySelectorAll("textarea, input[type=text]");
    for (const textbox of textboxes) {
      textbox.addEventListener('dblclick', autoTranslateText);
    }

    const debounce = function(method, delay) {
      clearTimeout(method._tId);
      method._tId= setTimeout(function(){
          method();
      }, delay);
    }

    const runOnScroll = function() {
      const texts = getAllTextElements()
      replaceAllTextWithTranslated(texts);
    };

    function initScrollEvent() {
      window.addEventListener("scroll", function(event) {
        debounce(runOnScroll, 1000);
      }, true);
    }

    // Leave some space for elements that are not in the DOM yet
    setTimeout(() => {
      const texts = getAllTextElements()
      replaceAllTextWithTranslated(texts);
    }, 250)
    // Start listening scroll events
    // otherwise the elements loaded via infinite-scroll will not be in andaluh
    initScrollEvent()
  }
});