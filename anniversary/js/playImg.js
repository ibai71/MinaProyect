var btn = document.getElementById("heartTxt");
btn.style.opacity = 0;
var btnVal = 0;
var storyCompleted = false;
var finishStoryTimeout;

function showImage() {
    myImage.setAttribute("src", imageArray[imageIndex]);
    myTxt.innerHTML = txtArray[imageIndex];
    imageIndex++;

    if (imageIndex >= len) {
        clearInterval(showImageInterval);
        clearTimeout(finishStoryTimeout);
        finishStoryTimeout = setTimeout(function () {
            flag = 1;
            storyCompleted = true;
            document.getElementById("typeDiv").style.opacity = 1;
            document.getElementById("imgTxt").style.opacity = 0;
            showEndingTypewriterMessage("Our story is just beginning");
        }, 2200);
    }
}

function play() {
    if (storyCompleted) {
        clearTimeout(finishStoryTimeout);
        storyCompleted = false;
        t = 0;
    }

    if (t == 0) {
        myImage.setAttribute("src", "");
        myTxt.innerHTML = "";
        imageIndex = 0;
        clearInterval(showImageInterval);
        clearTimeout(finishStoryTimeout);
    }

    flag = 1 - flag;
    document.getElementById("typeDiv").style.opacity = flag;
    document.getElementById("imgTxt").style.opacity = 1 - flag;

    if (t == 0) {
        showImage();
        showImageInterval = setInterval(showImage, 7000);
    }

    t++;
}

function preshowImage() {
    document.getElementById("imgTxt").style.opacity = 0;
    myImage.setAttribute("src", imageArray[imageIndex]);
    myTxt.innerHTML = txtArray[imageIndex];
    imageIndex++;
    if (imageIndex >= len) {
        imageIndex = 0;
    }
}

function buttonFadeIn() {
    if (btnVal < 1) {
        btnVal += 0.025;
        btn.style.opacity = btnVal;
    } else {
        clearInterval(buttonInterval);
        if (ok == 3) {
            ok += 1;
        }
    }
}

function event() {
    showImageInterval = setInterval(preshowImage, 100);

    imgInterval = setInterval(function () {
        if (ok == 3) {
            setTimeout(function () {
                buttonInterval = setInterval(buttonFadeIn, 50);
            }, 1500);
            clearInterval(imgInterval);
        }
    }, 50);
}

var showImageInterval;
var imgInterval;
var buttonInterval;

event();
