function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}
function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else if (!hasClass(el, className))
        el.className += ' ' + className;
}
function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}
function toggleClass(el, className) {
    if (hasClass(el, className)) {
        removeClass(el, className);
    }
    else {
        addClass(el, className);
    }
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function capitaliseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function getNextSibling(elem, selector) {
    var sibling = elem.nextElementSibling;
    if (!selector)
        return sibling;
    while (sibling) {
        if (sibling.matches(selector))
            return sibling;
        sibling = sibling.nextElementSibling;
    }
}
;
function getPreviousSibling(elem, selector) {
    var sibling = elem.previousElementSibling;
    if (!selector)
        return sibling;
    while (sibling) {
        if (sibling.matches(selector))
            return sibling;
        sibling = sibling.previousElementSibling;
    }
}
;
