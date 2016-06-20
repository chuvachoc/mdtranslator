
(function ($) {

    Storage.get('settings', function (data) {
        if(!data || typeof data != 'object' || Object.keys(data).length < 1) {
            Storage.set({ settings : {
                lang_from : 'en',
                lang_to : 'uk',
            } });
        }
    });


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request){
            if(request.action == 'translate') {
                var url = "https://www.googleapis.com/language/translate/v2?target=uk&cid=asdasd&format=text&source=en&key=AIzaSyAAfz5Pv7UOMSOpdDm-TRUNelxjjNSOegs&q=";

                url += encodeURIComponent(request.text);

                $.ajax({
                    method : "GET",
                    url : url,
                    success : function (resp) {
                        sendResponse(resp);
                    }
                });
            }
            else if(request.action == 'test') {
                sendResponse('asdasd')
            }
        }

        return true;
    });



    /*var sendMessageToPopup = function (options, callback) {
        var callback = callback || function () {};

        try{
            chrome.runtime.sendMessage(options, callback);
        }catch(err){}
    }

    */

}(jQuery));