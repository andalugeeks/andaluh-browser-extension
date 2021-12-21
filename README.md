# andaluh-browser-extension

A cross-browser extension to transliterate español (spanish) websites to andaluz proposals in real-time.

Compatible with Goolge Chrome, Firefox Desktop, Firefox Android and Microsoft Edge.

[![Alt text](https://img.youtube.com/vi/MkBKDv_2N2s/0.jpg)](https://www.youtube.com/watch?v=MkBKDv_2N2s)

More information on our website: https://andaluh.es/navegador-andaluz (spanish).

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Roadmap](#roadmap)
- [Support](#support)
- [Contributing](#contributing)

## Description

The **Andalusian varieties of [Spanish]** (Spanish: *andaluz*; Andalusian) are spoken in Andalusia, Ceuta, Melilla, and Gibraltar. They include perhaps the most distinct of the southern variants of peninsular Spanish, differing in many respects from northern varieties, and also from Standard Spanish. Further info: https://en.wikipedia.org/wiki/Andalusian_Spanish.

This package introduces transliteration functions to convert *español* (spanish) spelling to andaluz. As there's no official or standard andaluz spelling, andaluh-js is adopting the **EPA proposal (Estándar Pal Andaluz)**. Further info: https://andaluhepa.wordpress.com. Other andaluz spelling proposals are planned to be added as well.

## Installation

Install directly from the extension stores:

* <a href="https://chrome.google.com/webstore/detail/andaluh-for-web-browser/hgfhnijcbdidgdhheepmdgodjphcmfhc">Andaluh Browser for Google Chrome</a>
* <a href="https://microsoftedge.microsoft.com/addons/detail/andaluh-for-web-browser/logmeeenbhafjlddjajgpilmlbmhcekm">Andaluh Browser for Microsoft Edge</a>
* Andaluh Browser for Firefox (soon!)
* Andaluh Browser for Firefox Android (soon!)

## Development

For Chrome and Edge use `npm` to build and test:

```
$ npm run-script build
```

Then enable `Developer Mode` for extensions and click on `Load unpacked` (more info for <a href="https://developer.chrome.com/docs/extensions/mv3/getstarted/">chrome</a> and <a href="https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading">edge</a>). Select `build/` to load the unpacked extension.

For Firefox, run a build as described above, then use `web-ext` (<a href="https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/">more info</a>)

```
$ npm run-script build
$ cd build
$ web-ext run
```

For Firefox Android, please plug your Android device with Firefox installed first. Also <a href="https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/#set-up-your-computer-and-android-emulator-or-device">Set up your computer and Android emulator or device
Android Developer Mode</a>.

```
$ npm run-script build
$ cd build
$ web-ext run --target=firefox-android --android-device=<device ID>
```

You can run `web-ext run --target=firefox-android` first, to discover the `device ID`. Then you might have to allow the USB debugging on your device.

## Support

Please [open an issue](https://github.com/andalugeeks/andaluh-browser-extension/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a pull request.
