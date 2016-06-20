var Storage = { //AIzaSyAAfz5Pv7UOMSOpdDm-TRUNelxjjNSOegs
    get : function (keys, callback) {
        chrome.storage.local.get(keys, callback);
    },
    set : function (data, callback) {
        chrome.storage.local.set(data, callback);
    },
    remove : function (keys, callback) {
        chrome.storage.local.remove(keys, callback);
    }
}