const questionBoxes = Array.from(document.querySelectorAll(".question-box"));
const totalQuestions = questionBoxes.length;
let selections = new Map();
let score = 0;
let isLocked = false;
let isValidating = false;

const scoreDisplay = document.getElementById("scoreDisplay");
const completionMessage = document.getElementById("completionMessage");
const imperfectMessage = document.getElementById("imperfectMessage");
const victorySound = document.getElementById("victorySound");
const SUCCESS_POPUP_IMAGE_SRC = "assets/surprise.jpg";
const SUCCESS_POPUP_TEXT = "You are my favorite answer, always.";
const successPopup = document.getElementById("successPopup");
const successPopupDialog = document.getElementById("successPopupDialog");
const successPopupImage = document.getElementById("successPopupImage");
const successPopupText = document.getElementById("successPopupText");
const successPopupClose = document.getElementById("successPopupClose");
const successPopupFallback = document.getElementById("successPopupFallback");

scoreDisplay.textContent = `Score: 0/${totalQuestions}`;
bindSuccessPopupEvents();

function handleAnswer(selectedOption) {
    if (isLocked || isValidating) return;

    const questionBox = selectedOption.closest(".question-box");
    if (!questionBox) return;

    const options = questionBox.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.remove("selected", "correct", "incorrect");
    });

    selectedOption.classList.add("selected");
    selections.set(questionBox, selectedOption);

    if (selections.size === totalQuestions) {
        validateAnswers();
    }
}

function validateAnswers() {
    if (isLocked) return;

    isValidating = true;
    score = 0;

    selections.forEach(selected => {
        const isCorrect = selected.dataset.correct === "true";
        selected.classList.remove("selected");
        selected.classList.add(isCorrect ? "correct" : "incorrect");
        if (isCorrect) score++;
    });

    scoreDisplay.textContent = `Score: ${score}/${totalQuestions}`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (score === totalQuestions) {
        showCelebration();
        isLocked = true;
        isValidating = false;
    } else {
        showImperfectScoreMessage();
        setTimeout(resetQuiz, 5000);
    }
}

function resetQuiz() {
    score = 0;
    selections.clear();
    isValidating = false;

    scoreDisplay.textContent = `Score: 0/${totalQuestions}`;
    completionMessage.style.display = "none";
    imperfectMessage.style.display = "none";

    if (!victorySound.paused) {
        victorySound.pause();
    }
    victorySound.currentTime = 0;
    hideSuccessPopup();

    questionBoxes.forEach(box => {
        const options = box.querySelectorAll(".option");
        options.forEach(option => {
            option.classList.remove("selected", "correct", "incorrect", "disabled");
            option.style.pointerEvents = "";
        });
    });
}

function showCelebration() {
    completionMessage.style.display = "block";
    imperfectMessage.style.display = "none";
    victorySound.play().catch(() => {});
    showSuccessPopup();

    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ff6699", "#ff3366"]
        });

        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ff6699", "#ff3366"]
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        decay: 0.9
    });
}

function showImperfectScoreMessage() {
    completionMessage.style.display = "none";
    imperfectMessage.style.display = "block";
}

function showSuccessPopup() {
    if (!successPopup) return;
    successPopup.classList.add("popup-visible");
    successPopup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
}

function hideSuccessPopup() {
    if (!successPopup) return;
    successPopup.classList.remove("popup-visible");
    successPopup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
}

function showPopupImageFallback() {
    if (successPopupImage) {
        successPopupImage.hidden = true;
    }
    if (successPopupFallback) {
        successPopupFallback.hidden = false;
    }
}

function bindSuccessPopupEvents() {
    if (successPopupImage) {
        successPopupImage.src = SUCCESS_POPUP_IMAGE_SRC;
        successPopupImage.addEventListener("error", showPopupImageFallback, { once: true });
    }
    if (successPopupText) {
        successPopupText.textContent = SUCCESS_POPUP_TEXT;
    }
    if (successPopupClose) {
        successPopupClose.addEventListener("click", hideSuccessPopup);
    }
    if (successPopup) {
        successPopup.addEventListener("click", event => {
            if (event.target === successPopup) {
                hideSuccessPopup();
            }
        });
    }
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && successPopup && successPopup.classList.contains("popup-visible")) {
            hideSuccessPopup();
        }
    });
    if (successPopupDialog) {
        successPopupDialog.addEventListener("click", event => event.stopPropagation());
    }
}
