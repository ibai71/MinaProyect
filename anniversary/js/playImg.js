var btn = document.getElementById("heartTxt");
btn.style.opacity = 0;
var btnVal = 0;
var storyCompleted = false;
var finishStoryTimeout;
var slideRequestId = 0;
var preloadedImages = [];

function preloadImages() {
    preloadedImages = imageArray.map(function (src) {
        var img = new Image();
        img.src = src;
        return img;
    });
}

function renderSlide(index) {
    var currentRequest = ++slideRequestId;
    var src = imageArray[index];
    var text = txtArray[index] || "";
    var cachedImage = preloadedImages[index];

    if (cachedImage && cachedImage.complete) {
        myImage.setAttribute("src", src);
        myTxt.textContent = text;
        return;
    }

    var loader = new Image();
    loader.onload = function () {
        if (currentRequest !== slideRequestId) return;
        myImage.setAttribute("src", src);
        myTxt.textContent = text;
    };
    loader.onerror = function () {
        if (currentRequest !== slideRequestId) return;
        myImage.setAttribute("src", src);
        myTxt.textContent = text;
    };
    loader.src = src;
}

function showImage() {
    if (imageIndex >= len) {
        return;
    }

    renderSlide(imageIndex);
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
        myTxt.textContent = "";
        imageIndex = 0;
        slideRequestId++;
        clearInterval(showImageInterval);
        clearTimeout(finishStoryTimeout);
    }

    flag = 1 - flag;
    document.getElementById("typeDiv").style.opacity = flag;
    document.getElementById("imgTxt").style.opacity = 1 - flag;

    if (t == 0) {
        showImage();
        showImageInterval = setInterval(showImage, 8000);
    }

    t++;
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
    document.getElementById("imgTxt").style.opacity = 0;
    myImage.setAttribute("src", "");
    myTxt.textContent = "";
    preloadImages();

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
