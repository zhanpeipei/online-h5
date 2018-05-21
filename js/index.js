"use strict";

~function (pro) {
    function queryURL() {
        var reg = /([^?#&]+)=([^?#&]+)/g,
            result = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return result;
    }

    pro.queryURL = queryURL;
}(String.prototype);

var start = function () {
    var $start = $(".start").eq(0),
        $run = $start.find(".run").eq(0),
        srcList = ["img/cubeBg.jpg","img/cubeTip.png","img/example1.png","img/exaxple2.png","img/ipad.png","img/messageArrow1.png","img/messageArrow2.png","img/messageChat.png","img/messageKeyboard.png","img/phoneBg.jpg","img/phoneDetail.png","img/phoneListen.png","img/self.gif","img/white_brick_wall.png","img/wx-boss.png","img/wx-zpp.jpg","img/zpp_cube1.png","img/zpp_cube2.png","img/zpp_cube3.png","img/zpp_cube4.png","img/zpp_cube5.png","img/zpp_cube6.png"],
        _ref = [srcList.length, 0],
        total = _ref[0],
        cur = _ref[1];


    function progress() {
        srcList.forEach(function (item) {
            var img = new Image;
            img.src = item;
            img.onload = function () {
                img = null;
                cur++;
                computer(cur);
            }
        })
    }

    function computer(cur) {
        var current = cur / total * 100 + "%";
        $run.css("width", current);
        if (cur >= total) {
            var timer = setTimeout(function () {
                $start.remove();
                answer.init();
                clearTimeout(timer);
            }, 1000);
        }
    }

    return {
        init: function init() {
            $start.css("display", "block");
            progress();
        }
    }
}();

var answer = function () {
    var $answer = $(".answer").eq(0),
        $listen = $answer.find(".listen").eq(0),
        $timeCount = $answer.find(".title-time").eq(0),
        $listenA = $listen.find("a").eq(0),
        $listening = $answer.find(".listening").eq(0),
        $listeningA = $listening.find("a").eq(0),
        answerBell = $answer.find("audio")[0],
        answerIntro = $answer.find("audio")[1],
        answerTimer = null;

    //标题上面的计时器
    var count = function count() {
        $timeCount.css("display", "block");

        var duration = answerIntro.duration,
            cur = answerIntro.currentTime;
        answerTimer = setInterval(function () {
            cur = answerIntro.currentTime;
            var m = Math.floor(cur / 60),
                s = Math.floor(cur % 60);
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            $timeCount.html(m + ":" + s);
            if (answerIntro.ended) {
                clearTimeout(answerTimer);
                answerIntro.pause();
                listeningAF();
            }
        }, 1000);
    };
    // 接听中点击事件
    var listeningAF = function listeningAF() {
        $answer.remove();
        message.init();
    };
    // 接听页面点击事件
    var listenAF = function listenAF() {
        $listen.remove();
        answerBell.pause();
        answerIntro.play();
        $listening.css({"transform": "translateY(0)", "display": "block"});
        count();
    };
    return {
        init: function init() {
            $answer.css("display", "block");
            answerBell.play();
            $listen.css("transform", "translateY(0)");
            $listenA.click(listenAF);
            $listeningA.click(listeningAF);
        }
    };
}();

var message = function () {
    var $message = $(".message").eq(0),
        $messageBox = $message.find(".message-box").eq(0),
        $liList = $messageBox.find("li"),
        $keyboard = $message.find(".message-keyboard").eq(0),
        talkText = $keyboard.find("span")[0],
        $btn = $keyboard.find("a"),
        audio = $message.find("audio")[0],
        messageTimer = null,
        step = 0;
    var talkRun = function talkRun() {
        var translateY = 0;
        messageTimer = setInterval(function () {
            step !== 3 ? $liList.eq(step).css({"opacity": "1", "transform": "translateY(0)"}) : null;
            step === 3 ? talking() : null;
            step++;

            if (step > 4) {
                translateY -= 2;
                $messageBox.css("transform", "translateY(" + translateY + "rem)");
            }
            if (step >= $liList.length) {
                clearTimeout(messageTimer);
                var timer = setTimeout(function () {
                    $message.remove();
                    cube.init();
                    clearTimeout(timer);
                }, 3000);
            }
        }, 1000);
    };

    //第三幅图出现后的动作
    var talking = function talking() {
        clearInterval(messageTimer);
        $keyboard.css("transform", "translateY(0)");
        var text = talkText.dataset.talk,
            curStep = 0;
        var talkTimeout = setTimeout(function () {
            clearTimeout(talkTimeout);
            var talkTimer = setInterval(function () {
                talkText.innerHTML += text.charAt(curStep);
                curStep++;
                if (!text.charAt(curStep)) {
                    clearInterval(talkTimer);
                    $btn.css("display", "block");
                }
            }, 100);
        }, 500);
    };
    //点击发送按钮
    $btn.click(function () {
        talkText.style.display = "none";
        $keyboard.css("transform", "translateY(3.7rem)");
        step--;
        $liList.eq(step).css({"opacity": "1", "transform": "translateY(0)"});
        step++;
        talkRun();
    });
    return {
        init: function init() {
            $message.css("display", "block");
            audio.play();
            talkRun();
        }

    };
}();

var cube = function () {
    var $cube = $(".cube"),
        $box = $cube.find("ul");

    var start = function start(e) {
        $box.attr({"startX": e.pageX, "startY": e.pageY});
        $(this).on("mousemove",move)
        e.preventDefault();
    };
    var move = function move(e) {
        var changeX = e.pageX - $box.attr("startX"),
            changeY = e.pageY - $box.attr("startY");
        $box.attr({"changeX": changeX, "changeY": changeY});
        e.preventDefault();
    };
    var end = function end(e) {
        e.preventDefault();
        $(this).off("mousemove",move);
        var changeX = $box.attr("changeX"),
            changeY = $box.attr("changeY"),
            rotateX = $box.attr("rotateX"),
            rotateY = $box.attr("rotateY");

        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            rotateX = rotateX - 0 - changeY / 3, rotateY = rotateY - 0 + changeX / 3;
            $box.attr({
                "rotateX": rotateX,
                "rotateY": rotateY
            });
            $box.css("transform", "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) ");
        }
    };
    return {
        init: function init() {
            $cube.css("display", "block");
            // $box.attr({
            //     "rotateX": 25,
            //     "rotateY": -20
            // }).on({"touchstart": start, "touchmove": move, "touchend": end});
             $box.attr({
                "rotateX": 25,
                "rotateY": -20
            });
            $(window).on("touchstart touchmove touchend", function (e) {
                e.preventDefault();
            })
            $box.find("li").dblclick(function () {
                var index = $(this).index();
                $cube.css("display", "none");
                details.init(index);
            });
            $box.on({"mousedown":start,"mouseup":end})
            $box.find("li").singleTap(function () {
                var index = $(this).index();
                $cube.css("display", "none");
                details.init(index);
            });
        }
    };
}();

var details = function () {
    var $details = $(".details"),
        $comeBack = $details.find(".come-back"),
        $bottom=$(".bottom"),
        $bigImg=$bottom.find(".big_img"),
        slideExamples = null,
        scale=1500/$bottom.width(),
        totalLeft=null,
        totalTop=null;
    var comeBack = function comeBack() {
        cube.init();
        $details.css("display", "none");
    };

    var nodes  = $details.find(".page1 li"),
        _nodes = [].slice.call(nodes, 0);

    var getDirection = function (ev, obj) {
        var w = obj.offsetWidth,
            h = obj.offsetHeight,
            x = (ev.pageX - obj.offsetLeft-340 - (w / 2) * (w > h ? (h / w) : 1)),
            y = (ev.pageY - obj.offsetTop -20-(h / 2) * (h > w ? (w / h) : 1)),
            d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;
        return d;
    };

    var addClass = function ( ev, obj, state ) {
        var direction = getDirection( ev, obj ),
            class_suffix = "";

        obj.className = "";

        switch ( direction ) {
            case 0 : class_suffix = '-top';    break;
            case 1 : class_suffix = '-right';  break;
            case 2 : class_suffix = '-bottom'; break;
            case 3 : class_suffix = '-left';   break;
        }

        obj.classList.add( state + class_suffix );
    };

// bind events
    _nodes.forEach(function (el) {
        el.addEventListener('mouseover', function (ev) {
            addClass( ev, this, 'in' );
        }, false);

        el.addEventListener('mouseout', function (ev) {
            addClass( ev, this, 'out' );
        }, false);
    });
var move=function (e) {
    var x,y;
    x=e.pageX-totalLeft;
    y=e.pageY-totalTop;
    $bigImg.css({"background-position-x": "-"+(x*scale-$bigImg.width()/2)+"px","background-position-y":"-"+(y*scale-$bigImg.height()/2-100)+"px",left:x-$bigImg.width()/2+"px",top:y-$bigImg.height()/2+"px"})
}
var show=function (e) {
    scale=1500/$bottom.width();
    totalLeft=$bottom.offset().left;
    totalTop=$bottom.offset().top;
    $bigImg.css("display","block");
    $(this).on("mousemove",move);

}

    var change = function change(example) {
        var slides = example.slides,
            activeIndex = example.activeIndex;
        $(slides[activeIndex]).addClass("active").siblings().removeClass("active")
    };
    return {
        init: function init() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            $details.css("display", "block");
            if (!slideExamples) {
                $comeBack.click(comeBack);

                 slideExamples = new Swiper(".swiper-container", {
                    slidesPerView: "auto",
                    centeredSlides: !0,
                    watchSlidesProgress: !0,
                    pagination: ".swiper-pagination",
                    paginationClickable: !0,
                    paginationBulletRender: function (a, b) {
                        switch (a) {
                            case 0:
                                name = "德";
                                break;
                            case 1:
                                name = "智";
                                break;
                            case 2:
                                name = "体";
                                break;
                            case 3:
                                name = "美";
                                break;
                            case 4:
                                name = "劳";
                                break;
                            case 5:
                                name = "我";
                                break;
                            default:
                                name = ""
                        }
                        return '<span class="' + b + '"><i>' + name + "</i></span>"
                    },
                    onProgress: function (a) {
                        var b, c, d,scale,es;
                        for (b = 0; b < a.slides.length; b++) c = a.slides[b], d = c.progress, scale = 1 - Math.min(Math.abs(.2 * d), 1), es = c.style, es.opacity = 1 - Math.min(Math.abs(d / 2), 1), es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = "translate3d(0,0," + -Math.abs(150 * d)/100+ "rem)"
                    },
                    onSetTransition: function (a, b) {
                        var es;
                        for (var c = 0; c < a.slides.length; c++) es = a.slides[c].style, es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + "ms"
                    }
                });
            }
            slideExamples.slideTo(index, 0);
            $bottom.on({"mouseenter":show,"mouseleave":function () {
                $bigImg.css("display","none")
            }})
        }
    };
}();
start.init();
