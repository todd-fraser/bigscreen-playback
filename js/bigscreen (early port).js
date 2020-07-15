
var player;
var fadeInOutTime = 500;
var loadAttempt = 0;
var loads3Attempt = 0;
var timeout;
var name;

var i = 0;

if (vol == undefined) {
    var vol = 1.0;
    }

// $.ajax({
//     url: "/bigscreen/api/name.html"
// }).done(function( data ) {
//     name = data;
// });

playNextSlide()

// function startTicker(v) {
//     ver = "#scroller";
//     verName = "scroller";
//     $(ver).css("transition", "left " + $(ver).width()/250 + "s");
//     $(ver).css("transition-timing-function", "linear");
//     $(ver).css("left", "-" + $(ver).width() + "px");
//     document.getElementById("scroller").addEventListener( 'transitionend', function( event ) {
//         ver = "#scroller";
//         verName = "scroller";
//         $(ver).css("transition", "none");
//         $(ver).css("left", "1280px");
//         $(ver).css("transition", "left " + $(ver).width()/250 + "s");
//         $(ver).css("transition-timing-function", "linear");
//         $(ver).css("left", "-" + $(ver).width() + "px");
//     }, false );
// }

// startTicker();



function showBillboard(data) {
    if (data.hasOwnProperty('src')) {
        localImage = data.src.match(/[^\/]*$/);
        $("#screen").html("<img onerror='showLiveBillboard("+data.duration+", \""+data.src+"\", \""+data.title+"\", \""+data.content+"\");' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(data.duration*1000)+"-fadeInOutTime); trackView(\""+data.content+"\", \""+data.title+"\", "+data.duration+");' style='width: 100%;' src='./screen/ads/"+localImage[0]+"' />");
    }
}

function showLiveBillboard(duration, imgsrc, title, content) {
    $("#screen").html("<img onerror='playNextSlide();' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(duration*1000)+"-fadeInOutTime); trackView(\""+content+"\", \""+title+"\", "+duration+");' style='width: 100%;' src='"+imgsrc+"' />");
}

function showFrontPage(data) {
    if (data.hasOwnProperty('paperSection') && data.hasOwnProperty('paperDate') && data.hasOwnProperty('headlines')) {
        $("#screen").html("<div class='paperWrapper'><img class='newspaper' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(data.duration*1000)+"-fadeInOutTime); trackView(\""+data.content+"\", \""+data.title+"\", "+data.duration+"); $(this).addClass(\"newspaperTransition\");' src='./screen/images/"+data.paperSection+"-"+data.paperDate+".jpg' onerror='loadLiveFrontPage("+data.duration+", \""+data.src+"\", \""+data.title+"\", \""+data.content+"\", \""+data.paperSection+"\", \""+data.paperDate+"\", \""+data.headlines+"\");' /><table class='paperHeadlines'><tr><td valign='middle'>"+data.headlines+"</td></tr></table></div>");
    } else {
        playNextSlide();
    }
}

function showLeadStory(data) {
    if (data.hasOwnProperty('title') && data.hasOwnProperty('byLine') && data.hasOwnProperty('tagLine')) {
        if (data.hasOwnProperty('photoSrc') && data.photoSrc != "https://cdn2.newsok.biz/cache/sq280-0.jpg" && data.photoSrc != "https://cdn2.newsok.biz/cache/sq280-.jpg") {
            localImage = data.photoSrc.match(/[^\/]*$/);
            imageHtml = "<img width='240' onerror='this.src=\""+data.photoSrc+"\"' class='photo' src='./screen/ads/"+localImage+"'/>";
        } else {
            imageHtml = "";
        }
        $("#screen").html("<div class='leadStoryWrapper "+data.tagLine.toLowerCase()+"'><div class='leadStory'><div class='tagLine "+data.tagLine+"'>"+data.tagLine+"<div class='shadow'></div></div>"+imageHtml+"<div class='title'>"+data.title+"</div><div class='byLine'><div>"+data.byLine+"</div></div></div></div>");
        $("#fade").fadeOut(fadeInOutTime);
        timeout = setTimeout(fadeOut, (data.duration*1000)-fadeInOutTime);
        trackView(data.content, data.title, data.duration);
    } else {
        playNextSlide();
    }
}

function trackView(content, title, duration) {
    if (typeof ga == 'function') {
        ga('send', 'event', 'Big Screen', content, title + " - " + duration + " seconds - " + name);
        message = encodeURIComponent(title + " - " + duration + " seconds");
        $.ajax({
            url: "/bigscreen/api/status.php?no_cache="+Math.floor(Date.now()/1000)+"&slide="+message
        });
    }
}

function fadeOut() {
    $(player).animate({
        volume: 0
    }, fadeInOutTime, function() {
    });
    $("#fade").fadeIn(fadeInOutTime, function() {
        $("#bumper").hide();
        if (i == playlist.length-1) {
            $("#canvas").fadeOut(fadeInOutTime, function() {
                //location.reload();
                if (typeof previewOnly != "undefined") {
                } else {
                    timeInSeconds = Math.floor(Date.now() / 1000);
                    location.href = location.origin+location.pathname+"?utm_source=downtown_bigscreen_"+timeInSeconds+"&utm_medium=digital_billboard&utm_campaign=bigscreen_playlist&utm_content="+timeInSeconds;
                }
            });
            return;
        } else {
            playNextSlide();
        }
    });
}

function playNextSlide() {
    console.log(`i is currently: "${i}"`)
    console.log(playlist[i].type)
    clearTimeout(timeout);
    i++;
    if (i > playlist.length-1) {
        timeInSeconds = Math.floor(Date.now() / 1000);
        location.href = location.origin+location.pathname+"?utm_source=downtown_bigscreen_"+timeInSeconds+"&utm_medium=digital_billboard&utm_campaign=bigscreen_playlist&utm_content="+timeInSeconds;
    }
    switch(playlist[i].type) {
        case "brightcove_video":
            playBrightcoveVideo(playlist[i]);
            break;
        case "s3_video":
        	playS3Video(playlist[i]);
            break;
        case "billboard":
            showBillboard(playlist[i]);
            break;
        case "tweet":
            showTweet(playlist[i]);
            break;
        case "gallery":
            showGallery(playlist[i]);
            break;
        case "weather":
            showWeather(playlist[i]);
            break;
        case "front_page":
            showFrontPage(playlist[i]);
            break;
        case "instagram":
            showInstagram(playlist[i]);
            break;
        case "stocks":
            showStocks(playlist[i]);
            break;
        case "scoreboard":
            showScoreboard(playlist[i]);
            break;
        case "lead_story":
            showLeadStory(playlist[i]);
            break;
        case "schedule":
            showSchedule(playlist[i]);
            break;
        case "dfp_billboard":
            showDfpBillboard(playlist[i]);
            break;
        case "election":
            showElection(playlist[i]);
            break;
        default:
            fadeOut();
    }
}


window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(e) {
    if (e.keyCode == "39") {
        clearTimeout(timeout);
        if (i == playlist.length-1) {
            i = -1;
        }
        fadeOut();
        $("#slideCounter").html("Slide #"+ (i+2));
        $("#slideCounter").fadeIn( function() {
            $("#slideCounter").delay(2000).fadeOut();
        });
    }
    if (e.keyCode == "37") {
        clearTimeout(timeout);
        i = i-2;
        if (i < -1) {
            i = playlist.length-2;
        }
        fadeOut();
        $("#slideCounter").html("Slide #"+ (i+2));
        $("#slideCounter").fadeIn( function() {
            $("#slideCounter").delay(2000).fadeOut();
        });
    }
    if (e.keyCode == "38") {
        clearTimeout(timeout);
        i = -1;
        fadeOut();
        $("#slideCounter").html("Slide #"+ (i+2));
        $("#slideCounter").show( function() {
            $("#slideCounter").delay(2000).fadeOut();
        });
    }
}