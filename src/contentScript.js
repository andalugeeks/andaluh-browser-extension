'use strict';

const andaluh = require('@andalugeeks/andaluh');
const EPA = new andaluh.EPA();

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
    function replaceAllTextWithTranslated() {
      const texts = document.querySelectorAll("\
        h1:not(.andaluh-translated), \
        h2:not(.andaluh-translated), \
        h3:not(.andaluh-translated), \
        h4:not(.andaluh-translated), \
        h5:not(.andaluh-translated), \
        p:not(.andaluh-translated), \
        a:not(.andaluh-translated), \
        title:not(.andaluh-translated), \
        span:not(.andaluh-translated), \
        div:not(.andaluh-translated)\
        b:not(.andaluh-translated)");

      for (const text of texts) {
        // If innerText contains any HTML tags, ignore it
        if (text.innerHTML.indexOf('<') === -1) {
          // Translate the text
          const translated = EPA.transcript(text.innerHTML, options.vaf, options.vvf, true);
          // Update the text
          text.innerHTML = translated;
          text.classList.add('andaluh-translated');
        }
      }
    }

    // Iterate over all textarea and add a listener to each one
    const textboxes = document.querySelectorAll("textarea, input[type=text]");
    for (const textbox of textboxes) {
      textbox.addEventListener('dblclick', autoTranslateText);
    }

    replaceAllTextWithTranslated();

    // Update divs generated by javascript.
    setInterval(replaceAllTextWithTranslated, 1000);
  }
});