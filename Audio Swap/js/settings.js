(function () {
    "use strict";
    WinJS.Namespace.define("AudioSwap.Settings", {
        defaultValues: {
            msPerPixel: 100
        },

        getSetting: function (settingKey) {
            if (Windows.Storage.ApplicationData.current.roamingSettings.values.hasKey(settingKey)) {
                return Windows.Storage.ApplicationData.current.roamingSettings.values.lookup(settingKey);
            }
            else {
                return AudioSwap.Settings.defaultValues[settingKey];
            }
        },

        saveSetting: function (settingKey, settingValue) {
            Windows.Storage.ApplicationData.current.roamingSettings.values.insert(settingKey, settingValue);
        }
    });
})();