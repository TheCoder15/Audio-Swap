(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.AlignClips", {
        timerActive: false,

        init: function () {
            AudioSwap.NavState.pushState(this._listeners.previousStep);

            document.querySelector(".app-page-title--align-clips").classList.add("app-page-title--active");

            document.querySelector(".align-clips-playpause-button").addEventListener("click", this._listeners.playpauseButtonClicked);

            let previewVideo = document.querySelector(".align-clips-preview");
            previewVideo.addEventListener("pause", this._listeners.previewPlayStateChanged);
            previewVideo.addEventListener("play", this._listeners.previewPlayStateChanged);
            previewVideo.addEventListener("playing", this._listeners.previewPlayStateChanged);
            previewVideo.addEventListener("ended", this._listeners.previewPlayStateChanged);

            document.querySelector(".align-clips-audio-delay").addEventListener("change", this._listeners.audioDelayChanged);
            document.querySelector(".align-clips-audio-delay").addEventListener("keydown", this._listeners.audioDelayKeydown);
            document.querySelector(".align-clips-next-step").addEventListener("click", this._listeners.nextStep);

            document.querySelector(".align-clips-timeline__media-track--video").style.width = (AudioSwap.State.selectedVideoProperties.duration / AudioSwap.Settings.getSetting("msPerPixel")) + "px";
            document.querySelector(".align-clips-timeline__media-track--audio").style.width = (AudioSwap.State.selectedAudioProperties.duration / AudioSwap.Settings.getSetting("msPerPixel")) + "px";

            AudioSwap.State.composition = new Windows.Media.Editing.MediaComposition();
            Windows.Media.Editing.MediaClip.createFromFileAsync(AudioSwap.State.selectedVideo).then(this._listeners.videoInitFinished);
        },

        unload: function () {
            document.querySelector(".app-page-title--align-clips").classList.remove("app-page-title--active");

            document.querySelector(".align-clips-playpause-button").removeEventListener("click", this._listeners.playpauseButtonClicked);

            let previewVideo = document.querySelector(".align-clips-preview");
            previewVideo.removeEventListener("pause", this._listeners.previewPlayStateChanged);
            previewVideo.removeEventListener("play", this._listeners.previewPlayStateChanged);
            previewVideo.removeEventListener("playing", this._listeners.previewPlayStateChanged);
            previewVideo.removeEventListener("ended", this._listeners.previewPlayStateChanged);

            document.querySelector(".align-clips-audio-delay").removeEventListener("change", this._listeners.audioDelayChanged);
            document.querySelector(".align-clips-audio-delay").removeEventListener("keydown", this._listeners.audioDelayKeydown);
            document.querySelector(".align-clips-next-step").removeEventListener("click", this._listeners.nextStep);
            AudioSwap.State.composition = null;
            AudioSwap.State.audioDelay = 0;
            document.querySelector(".align-clips-preview").src = null;
            this.timerActive = false;
        },

        updateMediaPreviousSrc: function () {
            let previewVideo = document.querySelector(".align-clips-preview");
            previewVideo.src = URL.createObjectURL(AudioSwap.State.composition.generatePreviewMediaStreamSource(640, 360), { oneTimeOnly: true });
        },

        startTimer: function () {
            this.timerActive = true;
            requestAnimationFrame(AudioSwap.AlignClips._listeners.timerUpdate);
        },

        stopTimer: function () {
            this.timerActive = false;
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

            playpauseButtonClicked: function (event) {
                let previewVideo = document.querySelector(".align-clips-preview");
                if (previewVideo.paused) {
                    previewVideo.play();
                }
                else {
                    previewVideo.pause();
                }
            },

            previewPlayStateChanged: function (event) {
                let previewVideo = document.querySelector(".align-clips-preview");
                if (previewVideo.paused) {
                    document.querySelector(".align-clips-playpause-button").winControl.icon = "play";
                    AudioSwap.AlignClips.stopTimer();
                }
                else {
                    document.querySelector(".align-clips-playpause-button").winControl.icon = "pause";
                    AudioSwap.AlignClips.startTimer();
                }
            },

            timerUpdate: function (event) {
                // update time
                document.querySelector(".align-clips-playback-time").innerText = AudioSwap.TimeConverter.convertTime(document.querySelector(".align-clips-preview").currentTime * 1000, true);
                if (AudioSwap.AlignClips.timerActive) requestAnimationFrame(AudioSwap.AlignClips._listeners.timerUpdate);
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