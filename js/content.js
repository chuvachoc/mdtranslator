
$(document).ready(function () {

    var translation_status = 'hide',    // hide, waiting, full
        time_promice = null,
        button_called = false;

    var sendToBG = function (options, callback) {
        var callback = callback || function () {};

        try{
            chrome.runtime.sendMessage(options, callback);
        }catch(err){}
    };

    var classes = ["ext_md_t_prehidden", "ext_md_t_hidden", "ext_md_t_waiting", "ext_md_t_preresult", "ext_md_t_show_result"],
        container = null,
        temp_t_promise = null,
        last_random = 2;

    var setClass = function (cl) {
        for(var k in classes){
            container.removeClass(classes[k]);
        }

        container.addClass(cl);
    }

    var beginWaitingAnimation = function (callback) {
            setClass("ext_md_t_waiting");

            if(callback) setTimeout(callback, 500);
        },
        beginResultAnimation = function () {
            $('#ext_md_t_result_container', container).css("display", 'block').css("width", $('body').width()+"px");

            var height1 = $('#ext_md_t_target', container).height(),
                height2 = $('#ext_md_t_translated', container).height();

            var height = height1 > height2 ? height1 : height2;

            height = ((height > 200 ? 200 : height)+40);


            setClass("ext_md_t_preresult");
            container.css({ width : height+"px", height : height+"px", 'border-radius' : (height/2)+"px" });

            temp_t_promise = setTimeout(function () {
                container.attr('style', "");
                setClass("ext_md_t_show_result");

                temp_t_promise = setTimeout(function () {
                    $('#ext_md_t_result_container').css("width", "100%");
                }, 310);
            }, 200);
        },
        beginHideAnimation = function () {
            clearTimeout(temp_t_promise);
            setClass("ext_md_t_hidden");
        };


    var showWaitingBlock = function (callback) {
        clearTimeout(temp_t_promise);
        beginWaitingAnimation(callback);
    }

    var showResult = function (req, res) {
        clearTimeout(temp_t_promise);
        $('#ext_md_t_target').html(req);
        $('#ext_md_t_translated').html(res);

        beginResultAnimation();
    }

    var hideBlock = function () {
        clearTimeout(time_promice);
        clearTimeout(temp_t_promise);

        setClass("ext_md_t_prehidden");

        temp_t_promise = setTimeout(function () {

            beginHideAnimation();

            $('#ext_md_t_target').html("");
            $('#ext_md_t_translated').html("");
            container.removeAttr('style');
        }, 400);
    }

    var createBlock = function () {
        var html = '<div class="ext_md_t_hidden" id="ext_md_t_main_wrapper">' +
            '<div class="ext_md_t_container" id="ext_md_t_preloader"></div>' +
            '<div class="ext_md_t_container" id="ext_md_t_result_container">' +
                '<div class="ext_md_t_float ext_md_t_text" id="ext_md_t_target"></div>' +
                '<div class="ext_md_t_float ext_md_t_mid"> - </div>' +
                '<div class="ext_md_t_float ext_md_t_text" id="ext_md_t_translated"></div>' +
                '<div class="ext_md_t_clear"></div>' +
            '</div>' +
            '</div>';

        $('body').eq(0).append(html);

        container = $('#ext_md_t_main_wrapper');

        /*setTimeout(function () {
            $('#ext_md_t_main_wrapper').removeClass('ext_md_t_hidden').addClass('ext_md_t_waiting');

            setTimeout(function () {
                $('#ext_md_t_result_container').css("display", 'block').css("width", $('body').width()+"px");
                $('#ext_md_t_target').html("Разнообразный");
                $('#ext_md_t_translated').html("Задача");


                var height1 = $('#ext_md_t_target').height(),
                    height2 = $('#ext_md_t_translated').height();

                var height = height1 > height2 ? height1 : height2;

                height = ((height > 200 ? 200 : height)+40);


                $('#ext_md_t_main_wrapper').removeClass('ext_md_t_waiting').addClass('ext_md_t_preresult');
                $('#ext_md_t_main_wrapper').css({ width : height+"px", height : height+"px", 'border-radius' : (height/2)+"px" });

                setTimeout(function () {
                    $('#ext_md_t_main_wrapper').attr('style', "");
                    $('#ext_md_t_main_wrapper').removeClass('ext_md_t_preresult').addClass('ext_md_t_show_result');

                    setTimeout(function () {
                        $('#ext_md_t_result_container').css("width", "100%");
                    }, 500);
                }, 200);
            }, 1000);
        }, 1000);*/
    }

    var sendRequest = function (text) {
        showWaitingBlock(function () {
            sendToBG({ action : 'translate', text : text }, function (result) {
                if(result && result.data && result.data.translations && result.data.translations.length) {
                    if(result.data.translations[0] && result.data.translations[0].translatedText) showResult(text, result.data.translations[0].translatedText);
                }
            });
        })
    }

    var initListener = function () {
        $(document).bind('keydown', function (event) {
            if(event.keyCode != 17 || event.altKey || event.shiftKey) {
                if(!button_called) return;
                button_called = false;

                hideBlock();
                return;
            }

            if(button_called) return;
            button_called = true;
            time_promice = setTimeout(function () {
                button_called = true;

                var select = $.selection().get();

                if(!select.rang.collapsed){
                    var text = select.html.replace(/\<+((\"+[^\"]*\"+)|(\'+[^\']*\'+)|[^\>])*\>+/g, "");
                    text = $("<div/>").html(text).text();
                    text = text.replace(/([\n]|[\t]|[\s])+/g, " ");

                    sendRequest(text);
                }
            }, 1000);

        });

        $(document).bind('keyup', function () {
            if(!button_called) return;
            button_called = false;

            hideBlock();
        });
    }


    createBlock();
    initListener();

    /*function sendToBG(options, callback) {
        var callback = callback || function () {};

        try{
            chrome.runtime.sendMessage(options, callback);
        }catch(err){}
    };





    var _this = this;

    _this.listener = function (request, re, cb) {
        if (request.action == "") {}
    }

    chrome.runtime.onMessage.addListener(_this.listener);

    chrome.runtime.onMessage.removeListener(this.listener);*/

});