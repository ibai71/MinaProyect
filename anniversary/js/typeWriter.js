let i = 0;
let text1 = "Hello my love";
let text2 = "Thank you for all the things we achieve together, cant wait to see everything we will achive together";

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
