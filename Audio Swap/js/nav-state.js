(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.NavState", {
        states: [],

        init: function () {
            Windows.UI.Core.SystemNavigationManager.getForCurrentView().addEventListener("backrequested", this._listeners.backRequested);
        },

        checkBackStates: function () {
            if (this.states.length > 0) {
                Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            }
            else {
                Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
            }
        },

        pushState: function (stateFun) {
            this.states.push(stateFun);
            this.checkBackStates();
        },

        popState: function () {
            let poppedState = this.states.pop();
            if (poppedState) poppedState();
            this.checkBackStates();
        },

        _listeners: {
            backRequested: function (event) {
                if (AudioSwap.NavState.states.length > 0) {
                    event.handled = true;
                    AudioSwap.NavState.popState();
                }
            }
        }
    });
})();