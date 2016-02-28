(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.ExportVideo", {
        init: function () {
            AudioSwap.NavState.pushState(this._listeners.previousStep);

            document.querySelector(".app-page-title--export-video").classList.add("app-page-title--active");

            document.querySelector(".choose-destination-button").addEventListener("click", this._listeners.chooseDestinationButtonClicked);
            document.querySelector(".export-clips-start-render").addEventListener("click", this._listeners.exportButtonClicked);
            document.querySelector(".export-original-audio-muted").addEventListener("change", this._listeners.originalAudioMutedChanged);
        },

        unload: function () {
            document.querySelector(".app-page-title--export-video").classList.remove("app-page-title--active");
            document.querySelector(".choose-destination-button").removeEventListener("click", this._listeners.chooseDestinationButtonClicked);
            document.querySelector(".export-clips-start-render").removeEventListener("click", this._listeners.exportButtonClicked);
            document.querySelector(".export-original-audio-muted").removeEventListener("change", this._listeners.originalAudioMutedChanged);
            AudioSwap.State.destinationFile = null;
            document.querySelector(".export-clips-start-render").setAttribute("disabled", "disabled");
            document.querySelector(".choose-destination-label").innerText = "";
            document.querySelector(".export-video-progress").value = 0;
        },

        checkDestinationFile: function () {
            if (AudioSwap.State.destinationFile == null) document.querySelector(".export-clips-start-render").setAttribute("disabled", "disabled");
            else document.querySelector(".export-clips-start-render").removeAttribute("disabled");
        },

        disableExportControls: function () {
            document.querySelector(".choose-destination-button").setAttribute("disabled", "disabled");
            document.querySelector(".export-original-audio-muted").setAttribute("disabled", "disabled");
            document.querySelector(".export-clips-start-render").setAttribute("disabled", "disabled");
        },

        enableExportControls: function () {
            document.querySelector(".choose-destination-button").removeAttribute("disabled");
            document.querySelector(".export-original-audio-muted").removeAttribute("disabled");
            document.querySelector(".export-clips-start-render").removeAttribute("disabled");
        },

        _listeners: {
            chooseDestinationButtonClicked: function () {
                let savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.videosLibrary;
                savePicker.fileTypeChoices.insert("MP4 Video", [".mp4"]);
                savePicker.suggestedFileName = "Untitled Video";
                savePicker.pickSaveFileAsync().done(AudioSwap.ExportVideo._listeners.destinationFileSelected);
            },

            destinationFileSelected: function (file) {
                if (file) {
                    AudioSwap.State.destinationFile = file;
                    document.querySelector(".choose-destination-label").innerText = file.name;
                    AudioSwap.ExportVideo.checkDestinationFile();
                }
            },

            originalAudioMutedChanged: function (event) {
                AudioSwap.State.exportOriginalAudioMuted = event.currentTarget.checked;
            },

            exportButtonClicked: function () {
                console.info("Beginning the export...");
                
                AudioSwap.ExportVideo.disableExportControls();
                // add a back state to cancel the export

                AudioSwap.State.exportOriginalAudioMuted ? AudioSwap.State.composition.clips[0].volume = 0 : AudioSwap.State.composition.clips[0].volume = 1;
                AudioSwap.State.composition.renderToFileAsync(AudioSwap.State.destinationFile, Windows.Media.Editing.MediaTrimmingPreference.precise).then(AudioSwap.ExportVideo._listeners.exportDone, AudioSwap.ExportVideo._listeners.exportError, AudioSwap.ExportVideo._listeners.exportProgress);
            },

            exportDone: function () {
                AudioSwap.ExportVideo.enableExportControls();
                AudioSwap.State.composition.clips[0].volume = 1;
                Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title = "";
                let msgDialog = new Windows.UI.Popups.MessageDialog("Export complete!");
                msgDialog.showAsync();
            },

            exportError: function () {
                AudioSwap.ExportVideo.enableExportControls();
                AudioSwap.State.composition.clips[0].volume = 1;
                Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title = "";
                let msgDialog = new Windows.UI.Popups.MessageDialog("Error exporting.");
                msgDialog.showAsync();
            },

            exportProgress: function (val) {
                console.log("Progress: " + val);
                document.querySelector(".export-video-progress").value = val;
                Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title = "Exporting: " + val.toFixed(2) + "%";
            },

            previousStep: function (event) {
                AudioSwap.ExportVideo.unload();
                document.querySelector(".app-page--export-video").classList.remove("app-page--visible");
                document.querySelector(".app-page--align-clips").classList.add("app-page--visible");
            }
        }
    });
})();