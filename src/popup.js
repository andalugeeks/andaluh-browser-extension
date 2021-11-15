'use strict';

import './popup.css';

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

chrome.tabs.getSelected(null, function (tab) {
  let domain = url_domain(tab.url);
  // Get extension options
  chrome.storage.local.get('andaluh', function (options) {
    options = options.andaluh || {};
    if (!options.urls) {
      options.urls = {};
    }

    if (!options.urls[domain]) {
      options.urls[domain] = false;
    }

    (async function () {
      let changeStatusButton = document.getElementById('change-status');

      if (options.urls[domain]) {
        changeStatusButton.innerText = 'Páhina traduçía automáticamente';
      } else {
        changeStatusButton.innerText = 'Páhina no traduçía automáticamente';
      }

      changeStatusButton.addEventListener('click', async function () {
        options.urls[domain] = !options.urls[domain];

        if (options.urls[domain]) {
          changeStatusButton.innerText = 'Páhina traduçía automáticamente';
        } else {
          changeStatusButton.innerText = 'Páhina no traduçía automáticamente';
        }

        // save options
        chrome.storage.local.set({'andaluh': options}, function() {
          chrome.tabs.reload(tab.id);
        });
      });
    })();
  });
});