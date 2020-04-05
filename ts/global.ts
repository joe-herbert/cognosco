//reusable useful functions
function hasClass(el:HTMLElement, className:string) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

function addClass(el: HTMLElement, className: string) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el: HTMLElement, className: string) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}

function toggleClass(el: HTMLElement, className: string) {
    if (hasClass(el, className)) {
        removeClass(el, className);
    } else {
        addClass(el, className);
    }
}

function escapeRegExp(string:string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function capitaliseFirst(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getNextSibling(elem:HTMLElement, selector:string) {
    var sibling = elem.nextElementSibling;

    if (!selector) return sibling;

    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.nextElementSibling;
    }
};

function getPreviousSibling(elem:HTMLElement, selector:string) {
    var sibling = elem.previousElementSibling;

    if (!selector) return sibling;

    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.previousElementSibling;
    }
};

let topicsObject: object = {
    "DIY": {
        "def": "Plumbing, plastering, fixings, anything you'd do when you're building something.",
        "topics": {
            "Plumbing": true,
            "Painting": true
        }
    },
    "Cars": {
        "def": "This covers every part of a car, from the wheels to the engine to actually driving.",
        "topics": {
            "Under the bonnet": {
                "def": "The maze of pipes and things under the bonnet are all described here, from engines to washer fluid.",
                "topics": {
                    "Engine": true,
                    "Other things": {
                        "def": "Other stuff",
                        "topics": {
                            "thing": true,
                            "thing2": true
                        }
                    }
                }
            },
            "Driving": true
        }
    },
    "Programming": {
        "def": "Many different languages, frameworks and more.",
        "topics": {
            "Git": true,
            "JS": true,
            "Python": true
        }
    }
};