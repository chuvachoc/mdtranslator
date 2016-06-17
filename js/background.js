
(function ($) {

    Storage.get('settings', function (data) {
        if(!data || typeof data != 'object' || Object.keys(data).length < 1) {
            Storage.set({ settings : {
                lang_from : 'en',
                lang_to : 'uk',
            } });
        }
    });

    /*var sendMessageToPopup = function (options, callback) {
        var callback = callback || function () {};

        try{
            chrome.runtime.sendMessage(options, callback);
        }catch(err){}
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request){
            if(request.action == '') {

            }
        }
    });*/

}(jQuery));