(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.ChooseClips", {
        init: function () {
            let browseButtons = document.querySelectorAll(".app-page--choose-clips .choose-clip-button"),
                buttonCount = browseButtons.length;
            
            for (let i = 0; i < buttonCount; i++) {
                browseButtons[i].addEventListener("click", this._listeners.chooseClipButtonClicked);
            }

            document.querySelector(".choose-clip-next-step").addEventListener("click", this._listeners.nextStep);
        },

        checkClips: function () {
            if (AudioSwap.State.selectedVideo == null || AudioSwap.State.selectedAudio == null) {
                document.querySelector(".choose-clip-next-step").setAttribute("disabled", "disabled");
            }
            else document.querySelector(".choose-clip-next-step").removeAttribute("disabled");
        },

        _listeners: {
            chooseClipButtonClicked: function (event) {
                let openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;

                switch (event.currentTarget.dataset.chooseClipButton) {
                    case "video":
                        console.log("Browse for videos.");
                        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.videosLibrary;
                        openPicker.fileTypeFilter.replaceAll(AudioSwap.Platform.supportedVideoTypes);
                        openPicker.pickSingleFileAsync().then(AudioSwap.ChooseClips._listeners.pickedVideo);
                        break;
                    case "audio":
                        console.log("Browse for audio.");
                        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.videosLibrary;
                        openPicker.fileTypeFilter.replaceAll(AudioSwap.Platform.supportedAudioTypes);
                        openPicker.pickSingleFileAsync().then(AudioSwap.ChooseClips._listeners.pickedAudio);
                        break;
                }
            },

            pickedVideo: function (file) {
                if (file) {
                    console.log("Picked video file.");
                    AudioSwap.State.selectedVideo = file;
                    file.properties.getVideoPropertiesAsync().done(AudioSwap.ChooseClips._listeners.retrievedVideoProperties);
                    
                }
            },

            pickedAudio: function (file) {
                if (file) {
                    console.log("Picked audio file.");
                    AudioSwap.State.selectedAudio = file;
                    file.properties.getMusicPropertiesAsync().done(AudioSwap.ChooseClips._listeners.retrievedAudioProperties);
                }
            },

            retrievedVideoProperties: function (properties) {
                AudioSwap.State.selectedVideoProperties = properties;
                document.querySelector(".choose-clip-label--video").innerText = AudioSwap.State.selectedVideo.name;
                AudioSwap.ChooseClips.checkClips();
            },

            retrievedAudioProperties: function (properties) {
                AudioSwap.State.selectedAudioProperties = properties;
                document.querySelector(".choose-clip-label--audio").innerText = AudioSwap.State.selectedAudio.name;
                AudioSwap.ChooseClips.checkClips();
            },

            nextStep: function () {
                document.querySelector(".app-page--choose-clips").classList.remove("app-page--visible");
                document.querySelector(".app-page--align-clips").classList.add("app-page--visible");
                AudioSwap.AlignClips.init();
            }
        }
    });
})();