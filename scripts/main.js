//select element by click on it
function create_button() {
    var text = get_all_text();
    var readtime_count = read_time_estimate(text);

    var button = document.getElementsByClassName("d-none d-md-inline-flex btn btn-with-icon btn-light-gray h48 i24 px-3 js-post-dislike");

    //clone button
    var time_button = button[0].cloneNode(true);
    change_buttons_values(time_button, readtime_count);

    change_dislike_padding();
    //append first child button 
    document.getElementsByClassName("col-12 col-md-auto bPage__actions__right d-md-flex")[0].appendChild(time_button);
    time_button.addEventListener('click', function() {
        say(text);
    });
}

function findVoice(voices, lang) {
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang === lang) { return voices[i]; }
    }
    return null;
}

function say(m) {
    chrome.runtime.sendMessage({ toSay: m }, function() {});

    // background page
    chrome.runtime.onMessage.addListener(function(request) {
        chrome.tts.speak(request.toSay, { rate: 0.8, onEvent: function(event) {} }, function() {});
    });
}

function change_buttons_values(time_button, time) {
    time_button.className = "d-none d-md-inline-flex btn btn-with-icon btn-light-gray h48 i24 px-3 time_button";

    var icon = time_button.getElementsByTagName("span")[0];
    var value = time_button.getElementsByTagName("span")[1];

    console.log(icon);

    value.innerHTML = time;
    icon.className = "icon-book";
}

function change_dislike_padding() {
    var dislike = document.getElementsByClassName("d-none d-md-inline-flex btn btn-with-icon btn-light-gray h48 i24 px-3 js-post-dislike");
    //change dislike class
    dislike[0].className = "d-none d-md-inline-flex btn btn-with-icon btn-light-gray h48 i24 px-3 px-3 mr-3 js-post-dislike";
}

function get_all_text() {
    //get all text from divs editor-js-content, editor-js-block
    var text = document.getElementsByClassName("editor-js-content");
    var text_block = document.getElementsByClassName("editor-js-block");
    var text_array = [];
    for (var i = 0; i < text.length; i++) {
        text_array.push(text[i].innerText);
    }
    for (var i = 0; i < text_block.length; i++) {
        text_array.push(text_block[i].innerText);
    }
    var text_string = text_array.join(" ");
    return text_string;
}

function read_time_estimate(content) {
    var word_count = content.split(" ").length;
    var words_per_minute = 150;

    var minutes = Math.floor(word_count / words_per_minute);
    var seconds = Math.floor(word_count % words_per_minute / (words_per_minute / 60));

    var str_minutes = (minutes == 1) ? "m" : "m";
    var str_seconds = (seconds == 1) ? "s" : "s";

    if (minutes == 0) {
        return seconds + " " + str_seconds;
    } else {
        return minutes + " " + str_minutes;
    }
}

create_button();