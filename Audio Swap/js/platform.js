(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.Platform", {
        /// <summary>Provides tools for generating aspect ratio-proportional widths and heights.</summary>
        supportedVideoTypes: [".3g2", ".3gp2", ".3gp", ".3gpp", ".m4v", ".mp4v", ".mp4", ".mov", ".m2ts", ".asf", ".wm", ".wmv", ".avi"],
        supportedAudioTypes: [".m4a", ".wma", ".aac", ".adt", ".adts", ".mp3", ".wav", ".ac3", ".ec3"],
        supportedImageTypes: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],

        appActivated: function (args) {
            /// <summary>Called by Windows when the application is being activated (launched).</summary>
            console.info("Audio Swap started!");

            // Perform general setup tasks here:
            AudioSwap.NavState.init();
            AudioSwap.ChooseClips.init();

            // Additional launch tasks that depend on how Audio Swap was launched:
            switch (args.detail.kind) {
                case Windows.ApplicationModel.Activation.ActivationKind.file:
                    // Audio Swap was launched because the user double-clicked a project file in the Windows File Explorer.
                    break;
                case Windows.ApplicationModel.Activation.ActivationKind.launch:
                    // Audio Swap has been freshly launched. Perform any setup tasks here.
                    break;
            }
        },

        appCheckpoint: function (args) {
            /// <summary>Called by Windows when the application is being suspended.</summary>
            console.info("Audio Swap is being suspended.");
        }
    });
})();