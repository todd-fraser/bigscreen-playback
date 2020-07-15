
var player;
var fadeInOutTime = 500;
var loadAttempt = 0;
var loads3Attempt = 0;
var timeout;
var name;

let loadVideoAttempt = 0;

let canvas = document.getElementById('canvas');
let screen = document.getElementById('screen');
let fader = document.getElementById('fade');
let slideCounter = document.getElementById('slideCounter');
let bumper = document.getElementById('bumper');


if (vol == undefined) {
    var vol = 1;
    }

// $.ajax({
//     url: "/bigscreen/api/name.html"
// }).done(function( data ) {
//     name = data;
// });

var i = -1;
// playNextSlide()

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
        // console.log("show billbaord triggered")
        screen.innerHTML = `<img onerror='console.log("there was an error, skipping slide"); playNextSlide();' onload='console.log(" show billboard triggered, ${data.title} loaded"); faderOut(); timeout = setTimeout(() => { faderIn() }, ${data.duration*1000-fadeInOutTime}); logDev("onLoad"); console.log("title = ${data.title}"); console.log("duration = ${data.duration}");' style='width: 100%;' src='${data.src}' />");`
        // screen.innerHTML = `<img onload='console.log(" show billboard triggered, ${data.title} loaded"); faderOut(); timeout = setTimeout(faderIn, ${data.duration*1000-fadeInOutTime}); logDev("onLoad"); console.log("title = ${data.title}"); console.log("duration = ${data.duration}");' style='width: 100%;' src='${data.src}' />");`
    }
}

function logDev(place) {
    console.log("Log Dev triggered at " + place);
    console.log(`timeout = ${timeout}`);
    // console.log(`fadeInOutTime = ${fadeInOutTime}`);
}


function showBillboardOLD(data) {
    if (data.hasOwnProperty('src')) {
        localImage = data.src.match(/[^\/]*$/);
        $("#screen").html("<img onerror='showLiveBillboard("+data.duration+", \""+data.src+"\", \""+data.title+"\", \""+data.content+"\");' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(data.duration*1000)+"-fadeInOutTime); trackView(\""+data.content+"\", \""+data.title+"\", "+data.duration+");' style='width: 100%;' src='./screen/ads/"+localImage[0]+"' />");
    }
}

// function showLiveBillboard(duration, imgsrc, title, content) {
//     $("#screen").html("<img onerror='playNextSlide();' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(duration*1000)+"-fadeInOutTime); trackView(\""+content+"\", \""+title+"\", "+duration+");' style='width: 100%;' src='"+imgsrc+"' />");
// }

// function showFrontPage(data) {
//     if (data.hasOwnProperty('paperSection') && data.hasOwnProperty('paperDate') && data.hasOwnProperty('headlines')) {
//         $("#screen").html("<div class='paperWrapper'><img class='newspaper' onload='$(\"#fade\").fadeOut(fadeInOutTime); timeout = setTimeout(fadeOut, "+(data.duration*1000)+"-fadeInOutTime); trackView(\""+data.content+"\", \""+data.title+"\", "+data.duration+"); $(this).addClass(\"newspaperTransition\");' src='./screen/images/"+data.paperSection+"-"+data.paperDate+".jpg' onerror='loadLiveFrontPage("+data.duration+", \""+data.src+"\", \""+data.title+"\", \""+data.content+"\", \""+data.paperSection+"\", \""+data.paperDate+"\", \""+data.headlines+"\");' /><table class='paperHeadlines'><tr><td valign='middle'>"+data.headlines+"</td></tr></table></div>");
//     } else {
//         playNextSlide();
//     }
// }

function showLeadStory(data) {
    if (data.hasOwnProperty('title') && data.hasOwnProperty('byLine') && data.hasOwnProperty('tagLine')) {
        if (data.hasOwnProperty('photoSrc') && data.photoSrc != "https://cdn2.newsok.biz/cache/sq280-0.jpg" && data.photoSrc != "https://cdn2.newsok.biz/cache/sq280-.jpg") {
            localImage = data.photoSrc.match(/[^\/]*$/);
            imageHtml = "<img width='240' onerror='this.src=\""+data.photoSrc+"\"' class='photo' src='./screen/ads/"+localImage+"'/>";
        } else {
            imageHtml = "";
        }
        screen.innerHTML = "<div class='leadStoryWrapper "+data.tagLine.toLowerCase()+"'><div class='leadStory'><div class='tagLine "+data.tagLine+"'>"+data.tagLine+"<div class='shadow'></div></div>"+imageHtml+"<div class='title'>"+data.title+"</div><div class='byLine'><div>"+data.byLine+"</div></div></div></div>";
        faderOut();
        timeout = setTimeout(faderIn, (data.duration*1000)-fadeInOutTime);
        // trackView(data.content, data.title, data.duration);
    } else {
        playNextSlide();
    }
}

function playVideo(data) {
    console.log("Play Video Function Triggered");
    loadVideoAttempt = 0;
    player = document.createElement('VIDEO');
    console.log("Video element created");
    let filename = data.video_url.split('/').pop();
    console.log(`filename: ${filename}`);
    player.setAttribute('src', `./published_assets/video/${filename}`);
    player.setAttribute('autoplay', 'autoplay');
    player.classList.add('video');
    if (data.hasOwnProperty('branding')) {
        player.classList.add(data.branding);
    }
    screen.innerHTML = '';
    screen.appendChild(player);
    player.volume = vol;
    // player.play();
    player.onerror = function() {
        if (loadVideoAttempt == 0) {
            loadVideoAttempt = 1;
            player.setAttribute("src", data.video_url);
            player.setAttribute("type", "video/mp4");
            player.setAttribute("autoplay", "autoplay");
            player.volume = vol;
            //player.play();
        } else {
            // ErrorLog('video error skipping slide', 'video url: ' + data.video_url, '');
            playNextSlide();
        }
    };
    player.onplaying = function() {
        console.log('onplaying function triggered');
        faderOut();
        if (data.hasOwnProperty("bumper")) {
            timeout = setTimeout(function(){ showBumper(data.bumper) }, (data.duration*1000)-fadeInOutTime-5000);
            // timeout = setTimeout(faderIn, (data.duration*1000)-fadeInOutTime);
        } else {
            timeout = setTimeout(faderIn, (data.duration*1000)-fadeInOutTime);
        }
        // trackView(data.content, data.title, data.duration);
    };
}

function showBumper(name) {
    console.log("show bumper triggered");
    bumper.style.cssText = `display: block; background-color: rgba(0,0,0,0.85); background-image: url(./static_assets/images/bumper_${name}.png); background-repeat: no-repeat; background-position: center;`
    timeout = setTimeout(faderIn, 3000);
}

function showBumperScratch(name) {
    bumper.style.cssText = "background-color: rgba(0,0,0,0.85); background-image: url(./static_assets/images/bumper_"+name+".png; background-repeat: no-repeat; background-position: center;".fadeIn(fadeInOutTime, function() {
        timeout = setTimeout(faderIn(), 3000);
    });
}

function playS3Video(data) {
    loads3Attempt=0;
    player = document.createElement("VIDEO");
    var filename = data.video_url.split('/').pop();
    console.log('fileanem : '+filename);
    //player.setAttribute("controls", "true");
    player.setAttribute("src", "./screen/video/"+filename);
    player.setAttribute("autoplay", "autoplay");
    $(player).addClass("video");
    if (data.hasOwnProperty('branding')) {
        $(player).addClass(data.branding);
    }
    $("#screen").html("");
    $("#screen").append(player);
    player.volume = vol;
    //player.play();
    player.onerror = function() {
        if (loads3Attempt == 0) {
            loads3Attempt = 1;
            player.setAttribute("src", data.video_url);
            player.setAttribute("type", "video/mp4");
            player.setAttribute("autoplay", "autoplay");
            player.volume = vol;
            //player.play();
        } else {
            ErrorLog('video error skipping slide', 'video url: ' + data.video_url, '');
            playNextSlide();
        }
    };
    player.onplaying = function() {
        $("#fade").fadeOut(fadeInOutTime);
        if (data.hasOwnProperty("bumper")) {
            timeout = setTimeout(function(){ showBumper(data.bumper) }, (data.duration*1000)-fadeInOutTime-5000);
        } else {
            timeout = setTimeout(fadeOut, (data.duration*1000)-fadeInOutTime);
        }
        trackView(data.content, data.title, data.duration);
    };
}

// function trackView(content, title, duration) {
//     if (typeof ga == 'function') {
//         ga('send', 'event', 'Big Screen', content, title + " - " + duration + " seconds - " + name);
//         message = encodeURIComponent(title + " - " + duration + " seconds");
//         $.ajax({
//             url: "/bigscreen/api/status.php?no_cache="+Math.floor(Date.now()/1000)+"&slide="+message
//         });
//     }
// }



function faderOut() {
    //fade player volume out to 0?
    fader.classList.remove('faderIn');
    fader.classList.add('faderOut');
}

function faderIn() {
    fader.classList.add('faderIn');
    fader.classList.remove('faderOut');
    timeout = setTimeout(() => playNextSlide(), fadeInOutTime);
}

function fadeOutOLD() {
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
    clearTimeout(timeout);
    bumper.style.cssText = `display: none;`
    i++;
    if (i > playlist.length-1) { //if no more slides, refresh
        timeInSeconds = Math.floor(Date.now() / 1000);
        location.href = location.origin+location.pathname+"?utm_source=downtown_bigscreen_"+timeInSeconds+"&utm_medium=digital_billboard&utm_campaign=bigscreen_playlist&utm_content="+timeInSeconds;
    }
    switch(playlist[i].type) {
        case "video":
        	playVideo(playlist[i]);
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
            faderIn();
    }
}


window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(e) {
    if (e.keyCode == "39") {
        clearTimeout(timeout);
        if (i == playlist.length-1) {
            i = -1;
        }
        faderIn();
        slideCounter.innerHTML = `Slide #${i+2}`;
        // slideCounter.classList.add('visible');
        setTimeout(() => { slideCounter.innerHTML = ""; }, 2000);
        // slideCounter.fadeIn( function() {
        //     $("#slideCounter").delay(2000).fadeOut();
        // });
    }
    if (e.keyCode == "37") {
        clearTimeout(timeout);
        i = i-2;
        if (i < -1) {
            i = playlist.length-2;
        }
        faderIn();
        slideCounter.innerHTML = `Slide #${i+2}`;
        // $("#slideCounter").fadeIn( function() {
        //     $("#slideCounter").delay(2000).fadeOut();
        // });
    }
    if (e.keyCode == "38") {
        clearTimeout(timeout);
        i = -1;
        faderIn();
        slideCounter.innerHTML = `Slide #${i+2}`;
        // $("#slideCounter").show( function() {
        //     $("#slideCounter").delay(2000).fadeOut();
        // });
    }
}