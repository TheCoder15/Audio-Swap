// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";
    WinJS.Application.addEventListener("activated", AudioSwap.Platform.appActivated, false);
    WinJS.Application.addEventListener("checkpoint", AudioSwap.Platform.appCheckpoint, false);
    WinJS.Application.start();
})();
