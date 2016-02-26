(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.AlignClips", {
        init: function () {
            AudioSwap.NavState.pushState(this._listeners.previousStep);

            document.querySelector(".align-clips-audio-delay").addEventListener("change", this._listeners.audioDelayChanged);
            document.querySelector(".align-clips-audio-delay").addEventListener("keydown", this._listeners.audioDelayKeydown);
            document.querySelector(".align-clips-next-step").addEventListener("click", this._listeners.nextStep);

            document.querySelector(".align-clips-timeline__media-track--video").style.width = (AudioSwap.State.selectedVideoProperties.duration / AudioSwap.Settings.getSetting("msPerPixel")) + "px";
            document.querySelector(".align-clips-timeline__media-track--audio").style.width = (AudioSwap.State.selectedAudioProperties.duration / AudioSwap.Settings.getSetting("msPerPixel")) + "px";

            AudioSwap.State.composition = new Windows.Media.Editing.MediaComposition();
            Windows.Media.Editing.MediaClip.createFromFileAsync(AudioSwap.State.selectedVideo).then(this._listeners.videoInitFinished);
        },

        unload: function () {
            document.querySelector(".align-clips-audio-delay").removeEventListener("change", this._listeners.audioDelayChanged);
            document.querySelector(".align-clips-audio-delay").removeEventListener("keydown", this._listeners.audioDelayKeydown);
            document.querySelector(".align-clips-next-step").removeEventListener("click", this._listeners.nextStep);
            AudioSwap.State.composition = null;
            AudioSwap.State.audioDelay = 0;
            document.querySelector(".align-clips-preview").src = null;
        },

        updateMediaPreviousSrc: function () {
            let previewVideo = document.querySelector(".align-clips-preview");
            previewVideo.src = URL.createObjectURL(AudioSwap.State.composition.generatePreviewMediaStreamSource(640, 360), { oneTimeOnly: true });
        },

        _listeners: {
            videoInitFinished: function (videoClip) {
                AudioSwap.State.composition.clips.append(videoClip);
                Windows.Media.Editing.BackgroundAudioTrack.createFromFileAsync(AudioSwap.State.selectedAudio).done(AudioSwap.AlignClips._listeners.audioInitFinished);
            },

            audioInitFinished: function (audioStream) {
                AudioSwap.State.composition.backgroundAudioTracks.append(audioStream);
                AudioSwap.AlignClips.updateMediaPreviousSrc();
            },

            audioDelayChanged: function (event) {
                console.log("Audio delay changed.");

                let audioDelay = parseInt(event.currentTarget.value, 10);
                if (isNaN(audioDelay)) audioDelay = 0;
                AudioSwap.State.audioDelay = audioDelay;

                if (0 > audioDelay) {
                    AudioSwap.State.composition.backgroundAudioTracks[0].delay = 0;
                    AudioSwap.State.composition.backgroundAudioTracks[0].trimTimeFromStart = Math.abs(audioDelay);
                }
                else {
                    AudioSwap.State.composition.backgroundAudioTracks[0].delay = audioDelay;
                    AudioSwap.State.composition.backgroundAudioTracks[0].trimTimeFromStart = 0;
                }

                
                AudioSwap.AlignClips.updateMediaPreviousSrc();
            },

            audioDelayKeydown: function (event) {
                if (event.keyCode == 13) event.currentTarget.blur();
            },

            nextStep: function () {
                document.querySelector(".app-page--align-clips").classList.remove("app-page--visible");
                document.querySelector(".app-page--export-video").classList.add("app-page--visible");
                AudioSwap.ExportVideo.init();
            },

            previousStep: function () {
                AudioSwap.AlignClips.unload();
                document.querySelector(".app-page--align-clips").classList.remove("app-page--visible");
                document.querySelector(".app-page--choose-clips").classList.add("app-page--visible");
            }
        }
    });
})();