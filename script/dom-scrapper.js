function DOMScrapper(response) {
    const parser = new DOMParser();

    this.html = parser.parseFromString(response, "text/html");
    this.addListenerToDOM();
    return this;
}

DOMScrapper.prototype.addListenerToDOM = function () {
    // add sound onclick listener
    Array.from(this.getSoundButtons()).forEach(node =>
        node.addEventListener("click", OnclickFunction.playSound, false));

    // add collocation onclick listener
    Array.from(this.getCollapseButtons()).forEach(node =>
        node.addEventListener("click", OnclickFunction.collapseToggle, false));
}

DOMScrapper.prototype.getResponseForTooltip = function () {
    const word_info = Array.from(this.getWordContent());
    const pronun = Array.from(this.getPronunciation());
    while (pronun.length > 0 && pronun[pronun.length - 1].parentNode != pronun[0].parentNode) {
        pronun.pop();
    }

    if (this.isResponseError(word_info, pronun))
        return Content.outDate();

    return Content([word_info[0]], word_info.slice(1), pronun, "success");
}

DOMScrapper.prototype.isResponseError = function (word_info, pronun) {
    return (!word_info || !pronun || pronun.length < 1 || word_info.length < 2 || !this.isWordContainer(word_info[0]));
}

DOMScrapper.prototype.getSoundButtons = function () {
    return this.html.getElementsByClassName("audio_play_button");
}

DOMScrapper.prototype.getCollapseButtons = function () {
    return this.html.querySelectorAll(".unbox .heading");
}

DOMScrapper.prototype.getWordContent = function () {
    return this.html.querySelector("div.entry > .h-g").childNodes;
}

DOMScrapper.prototype.getPronunciation = function () {
    return this.html.querySelectorAll(".top-g>.pron-gs, .top-g>.collapse");
}

DOMScrapper.prototype.isWordContainer = function (node) {
    return node.classList.contains("top-container");
}