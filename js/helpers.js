function setStyle(element, styles) {
    Object.assign(element.style, styles);
};

function setStyleAll(selector, styles) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => Object.assign(el.style, styles));
};
