const questionBoxes = Array.from(document.querySelectorAll(".question-box"));
const totalQuestions = questionBoxes.length;
let selections = new Map();
let score = 0;
let isLocked = false;
let isValidating = false;

const scoreDisplay = document.getElementById("scoreDisplay");
const validateButton = document.getElementById("validateButton");
const completionMessage = document.getElementById("completionMessage");
const imperfectMessage = document.getElementById("imperfectMessage");
const victorySound = document.getElementById("victorySound");
const SUCCESS_POPUP_IMAGE_SRC = "pictereMina.jpeg";
const SUCCESS_POPUP_TEXT = "You are my favorite answer, always.";
const successPopup = document.getElementById("successPopup");
const successPopupDialog = document.getElementById("successPopupDialog");
const successPopupImage = document.getElementById("successPopupImage");
const successPopupText = document.getElementById("successPopupText");
const successPopupClose = document.getElementById("successPopupClose");
const rootStyles = getComputedStyle(document.documentElement);

const IMPERFECT_DEFAULT_MESSAGE = imperfectMessage ? imperfectMessage.textContent : "";
const INCOMPLETE_MESSAGE = "You need answer all the questions babyyy.";

function getThemeVar(variableName, fallback) {
    const value = rootStyles.getPropertyValue(variableName).trim();
    return value || fallback;
}

const confettiColors = [
    getThemeVar("--rom-brand", "#7A1E3A"),
    getThemeVar("--rom-brand-dark", "#5A1129"),
    getThemeVar("--rom-accent-dust", "#C7A2AB"),
    getThemeVar("--rom-accent-champagne", "#D8C39A")
];

scoreDisplay.textContent = `Score: 0/${totalQuestions}`;
bindSuccessPopupEvents();

if (validateButton) {
    validateButton.addEventListener("click", validateAnswers);
}

function getLockedCount() {
    return questionBoxes.filter(questionBox => questionBox.dataset.locked === "true").length;
}

function updateScoreDisplay() {
    score = getLockedCount();
    scoreDisplay.textContent = `Score: ${score}/${totalQuestions}`;
}

function handleAnswer(selectedOption) {
    if (isLocked || isValidating) return;

    const questionBox = selectedOption.closest(".question-box");
    if (!questionBox || questionBox.dataset.locked === "true") return;

    const options = questionBox.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.remove("selected", "correct", "incorrect");
    });

    selectedOption.classList.add("selected");
    selections.set(questionBox, selectedOption);

    completionMessage.style.display = "none";
    imperfectMessage.style.display = "none";
    imperfectMessage.textContent = IMPERFECT_DEFAULT_MESSAGE;
}

function validateAnswers() {
    if (isLocked || isValidating) return;

    isValidating = true;
    let unansweredCount = 0;

    questionBoxes.forEach(questionBox => {
        if (questionBox.dataset.locked === "true") {
            return;
        }

        const options = questionBox.querySelectorAll(".option");
        const selected = questionBox.querySelector(".option.selected") || selections.get(questionBox);

        if (!selected) {
            unansweredCount++;
            return;
        }

        selections.set(questionBox, selected);

        options.forEach(option => {
            option.classList.remove("correct", "incorrect");
        });

        const correctOption = questionBox.querySelector('.option[data-correct="true"]');
        const isCorrect = selected.dataset.correct === "true";

        selected.classList.remove("selected");

        if (isCorrect) {
            selected.classList.add("correct");
            lockQuestion(questionBox);
        } else {
            selected.classList.add("incorrect");
            if (correctOption) {
                correctOption.classList.add("correct");
            }
            unlockQuestion(questionBox);
        }
    });

    updateScoreDisplay();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (score === totalQuestions) {
        showCelebration();
        isLocked = true;
        if (validateButton) {
            validateButton.disabled = true;
            validateButton.textContent = "Completed";
        }
    } else if (unansweredCount > 0) {
        showImperfectScoreMessage(INCOMPLETE_MESSAGE);
    } else {
        showImperfectScoreMessage(IMPERFECT_DEFAULT_MESSAGE);
    }

    isValidating = false;
}

function lockQuestion(questionBox) {
    questionBox.dataset.locked = "true";
    const options = questionBox.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.add("locked");
        option.style.pointerEvents = "none";
    });
}

function unlockQuestion(questionBox) {
    questionBox.dataset.locked = "false";
    const options = questionBox.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.remove("locked");
        option.style.pointerEvents = "";
    });
}

function showCelebration() {
    completionMessage.style.display = "block";
    imperfectMessage.style.display = "none";
    victorySound.play().catch(() => {});
    showSuccessPopup();

    if (typeof confetti === "function") {
        const duration = 5000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: confettiColors
            });

            confetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: confettiColors
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
}

function showImperfectScoreMessage(message) {
    completionMessage.style.display = "none";
    imperfectMessage.textContent = message;
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

function bindSuccessPopupEvents() {
    if (successPopupImage) {
        successPopupImage.src = SUCCESS_POPUP_IMAGE_SRC;
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
