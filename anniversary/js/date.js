var dv = document.getElementById("content");
dv.style.opacity = 0;
var val = 0;

function pad2(n) {
    if (n < 10) {
        return "0" + n;
    }
    return String(n);
}

function getNextJuly20(now) {
    var target = new Date(now.getFullYear(), 6, 20, 0, 0, 0, 0);
    if (now >= target) {
        target.setFullYear(target.getFullYear() + 1);
    }
    return target;
}

function updateTogetherTimer(now) {
    var start = new Date(2023, 10, 15, 20, 53, 0, 0);
    var t = now - start;
    var d = Math.floor(t / 1000 / 60 / 60 / 24);
    var h = Math.floor((t / 1000 / 60 / 60) % 24);
    var m = Math.floor((t / 1000 / 60) % 60);
    var s = Math.floor((t / 1000) % 60);

    document.getElementById("d").innerHTML = d;
    document.getElementById("h").innerHTML = pad2(h);
    document.getElementById("m").innerHTML = pad2(m);
    document.getElementById("s").innerHTML = pad2(s);
}

function updateMeetTimer(now) {
    var rd = document.getElementById("rd");
    var rh = document.getElementById("rh");
    var rm = document.getElementById("rm");
    var rs = document.getElementById("rs");
    if (!rd || !rh || !rm || !rs) {
        return;
    }

    var target = getNextJuly20(now);
    var diff = target - now;
    if (diff < 0) {
        diff = 0;
    }

    var d = Math.floor(diff / 1000 / 60 / 60 / 24);
    var h = Math.floor((diff / 1000 / 60 / 60) % 24);
    var m = Math.floor((diff / 1000 / 60) % 60);
    var s = Math.floor((diff / 1000) % 60);

    rd.innerHTML = d;
    rh.innerHTML = pad2(h);
    rm.innerHTML = pad2(m);
    rs.innerHTML = pad2(s);
}

function updateTimers() {
    var now = new Date();
    updateTogetherTimer(now);
    updateMeetTimer(now);
}

function fadein() {
    if (val < 1) {
        val += 0.025;
        dv.style.opacity = val;
    } else {
        clearInterval(fadeinInterval);
        if (ok == 2) {
            ok += 1;
        }
    }
}

var fadeInterval;
var fadeinInterval;

updateTimers();
setInterval(updateTimers, 1000);
fadeInterval = setInterval(function () {
    if (ok == 2) {
        clearInterval(fadeInterval);
        fadeinInterval = setInterval(fadein, 50);
    }
}, 50);
