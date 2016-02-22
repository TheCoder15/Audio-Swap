(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.ExportVideo", {
        init: function () {
            AudioSwap.NavState.pushState(this._listeners.previousStep);

            document.querySelector(".choose-destination-button").addEventListener("click", this._listeners.chooseDestinationButtonClicked);
            document.querySelector(".export-clips-start-render").addEventListener("click", this._listeners.exportButtonClicked);
        },

        unload: function () {
            document.querySelector(".choose-destination-button").removeEventListener("click", this._listeners.chooseDestinationButtonClicked);
            document.querySelector(".export-clips-start-render").removeEventListener("click", this._listeners.exportButtonClicked);
            AudioSwap.State.destinationFile = null;
            document.querySelector(".export-clips-start-render").setAttribute("disabled", "disabled");
            document.querySelector(".choose-destination-label").innerText = "";
        },

        checkDestinationFile: function () {
            if (AudioSwap.State.destinationFile == null) document.querySelector(".export-clips-start-render").setAttribute("disabled", "disabled");
            else document.querySelector(".export-clips-start-render").removeAttribute("disabled");
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

            exportButtonClicked: function () {
                console.info("Beginning the export...");
                AudioSwap.State.composition.renderToFileAsync(AudioSwap.State.destinationFile, Windows.Media.Editing.MediaTrimmingPreference.precise).then(AudioSwap.ExportVideo._listeners.exportDone, AudioSwap.ExportVideo._listeners.exportError, AudioSwap.ExportVideo._listeners.exportProgress);
            },

            exportDone: function () {
                let msgDialog = new Windows.UI.Popups.MessageDialog("Export complete!");
                msgDialog.showAsync();
            },

            exportError: function () {
                let msgDialog = new Windows.UI.Popups.MessageDialog("Error exporting.");
                msgDialog.showAsync();
            },

            exportProgress: function (val) {
                console.log("Progress: " + val);
            },

            previousStep: function (event) {
                AudioSwap.ExportVideo.unload();
                document.querySelector(".app-page--export-video").classList.remove("app-page--visible");
                document.querySelector(".app-page--align-clips").classList.add("app-page--visible");
            }
        }
    });
})();