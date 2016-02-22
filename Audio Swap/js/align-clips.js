(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.AlignClips", {
        init: function () {
            AudioSwap.NavState.pushState(this._listeners.previousStep);

            document.querySelector(".align-clips-next-step").addEventListener("click", this._listeners.nextStep);

            AudioSwap.State.composition = new Windows.Media.Editing.MediaComposition();
            Windows.Media.Editing.MediaClip.createFromFileAsync(AudioSwap.State.selectedVideo).then(this._listeners.videoInitFinished);
        },

        unload: function () {
            document.querySelector(".align-clips-next-step").removeEventListener("click", this._listeners.nextStep);
            AudioSwap.State.composition = null;
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