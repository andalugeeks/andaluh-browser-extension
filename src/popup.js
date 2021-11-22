'use strict';

import './popup.css';

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

// From https://stackoverflow.com/a/4196937
function getRadioValue(theRadioGroup)
{
    var elements = document.getElementsByName(theRadioGroup);
    for (var i = 0, l = elements.length; i < l; i++)
    {
        if (elements[i].checked)
        {
            return elements[i].value;
        }
    }
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

      // Restore preferences
      switch (options.vaf) {
        case 'epa': document.getElementById('epa').checked = true; break;
        case 's': document.getElementById('seseo').checked = true; break;
        case 'z': document.getElementById('zezeo').checked = true; break;
        case 'h': document.getElementById('heheo').checked = true; break;
      }

      switch (options.vvf) {
        case 'h': document.getElementById('aspirada').checked = true; break;
        case 'j': document.getElementById('jota').checked = true; break;
      }

      // Alternate button label
      if (options.urls[domain]) {
        changeStatusButton.innerText = 'Restaurar original';
      } else {
        changeStatusButton.innerText = 'Transcribir al Andalûh';
      }

      changeStatusButton.addEventListener('click', async function () {
        options.urls[domain] = !options.urls[domain];

        // Get new preferences
        options.vaf = getRadioValue('vaf');
        options.vvf = getRadioValue('vvf');

        if (options.urls[domain]) {
          changeStatusButton.innerText = 'Restaurar original';
        } else {
          changeStatusButton.innerText = 'Transcribir al Andalûh';
        }

        // Store new preferences
        chrome.storage.local.set({'andaluh': options}, function() {
          chrome.tabs.reload(tab.id);
        });
      });
    })();
  });
});