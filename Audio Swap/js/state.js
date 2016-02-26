(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.State", {
        /// <summary>Provides tools for generating aspect ratio-proportional widths and heights.</summary>
        selectedVideo: null,
        selectedVideoProperties: null,
        selectedAudio: null,
        selectedAudioProperties: null,
        composition: null,
        destinationFile: null,
        audioDelay: 0,
        exportOriginalAudioMuted: true
    });
})();