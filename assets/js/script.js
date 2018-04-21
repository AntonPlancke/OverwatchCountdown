document.addEventListener("DOMContentLoaded", init);
let container;

function init() {
    container = document.getElementsByClassName("container")[0];
    createCountdownElements();
    startCountdown();
    setInterval(startCountdown, 1000);
}

function getCountdownsJson() {
    let request = new XMLHttpRequest();
    request.open("GET", "assets/countdowns.json", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function createCountdownElements() {
    let countdowns = getCountdownsJson();

    for (let i = 0; i < countdowns.Countdowns.length; i++) {
        let countdown = countdowns.Countdowns[i];
        container.innerHTML += `<li class="countdown" data-type="${countdown.type}" data-start="${countdown.start}" data-end="${countdown.end}"><h1 class="title">${countdown.name}</h1><p class="timer"></p></li>`;
    }
}

function startCountdown() {
    let countdowns = document.getElementsByClassName("countdown");

    for (let i = 0; i < countdowns.length; i++) {
        let active = isActive(countdowns[i]);
        let overdue = isOverdue(countdowns[i]);
        updateTimer(countdowns[i], active, overdue);
    }
}

function isActive(element) {
    let now = new Date().getTime();
    let countdownDate = new Date(element.dataset.start);
    return (countdownDate - now < 0)
}

function isOverdue(element) {
    let now = new Date().getTime();
    let countdownDate = new Date(element.dataset.end);
    return (countdownDate - now < 0)
}

function updateTimer(element, active, overdue) {
    let countdownDate;
    if (active) {
        countdownDate = addDateOffset(new Date(element.dataset.end));
        element.lastElementChild.innerHTML = "ends in ";
        if (overdue) element.lastElementChild.innerHTML = "is overdue by ";
    }
    else {
        countdownDate = addDateOffset(new Date(element.dataset.start));
        element.lastElementChild.innerHTML = "starts in ";
    }
    let now = new Date().getTime();
    let distance = countdownDate - now;
    if (overdue) distance = distance * -1;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    element.lastElementChild.innerHTML += days + " days, " + hours + " hours, " + minutes + " min, " + seconds + " sec";
}

function addDateOffset(uctDate) {
    return new Date(uctDate.toString());
}