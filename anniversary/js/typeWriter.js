let i = 0;
let text1 = "Hello my love";
let text2 = "Thank you for all the things we achieve together, cant wait to achieve more dreams together";
let endingTypeInterval;

function typeWriter(text, para) {
    if (ok == 2) {
        clearInterval(typeInterval);
    }

    if (i < text.length) {
        document.getElementById(para).innerHTML += text.charAt(i);
        i++;
    } else {
        if (ok == 0) {
            i = 0;
        }
        ok += 1;
    }
}

var typeInterval;

typeInterval = setInterval(function () {
    if (ok == 0) {
        typeWriter(text1, "txt1");
    } else if (ok == 1) {
        typeWriter(text2, "txt2");
    }
}, 100);

function showEndingTypewriterMessage(message) {
    clearInterval(typeInterval);
    clearInterval(endingTypeInterval);

    const txt1El = document.getElementById("txt1");
    const txt2El = document.getElementById("txt2");
    txt1El.innerHTML = "";
    txt2El.innerHTML = "";

    let endingIndex = 0;
    endingTypeInterval = setInterval(function () {
        if (endingIndex < message.length) {
            txt1El.innerHTML += message.charAt(endingIndex);
            endingIndex++;
        } else {
            clearInterval(endingTypeInterval);
        }
    }, 90);
}
