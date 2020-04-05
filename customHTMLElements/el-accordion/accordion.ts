window.addEventListener("load", () => {
    addAccordionEventListeners();
});

function addAccordionEventListeners() {
    let acc = document.getElementsByClassName("el-accordion");
    for (var i = 0; i < acc.length; i++) {
        let accThis: HTMLButtonElement = < HTMLButtonElement > acc[i];
        accThis.addEventListener("click", () => {
            let panel: HTMLElement = < HTMLElement > accThis.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                resizeAccordionDiv( < HTMLDivElement > accThis.nextElementSibling);
            }
            accThis.classList.toggle("active");
        });
    }
}

function resizeAccordionDiv(accordionDiv: HTMLDivElement) {
    let totalScrollHeight = getAccordionDivScrollHeight(accordionDiv) + getAccordionDivChildrenHeight(accordionDiv);
    accordionDiv.style.maxHeight = totalScrollHeight + "px";
    let parent: HTMLElement = accordionDiv;
    let brk: boolean = false;
    while (parent.parentElement.id !== "topicsWrapper" && !brk) {
        parent = < HTMLElement > parent.parentElement;
        if (parent.previousElementSibling && hasClass( < HTMLElement > parent.previousElementSibling, "el-accordion")) {
            resizeAccordionDiv( < HTMLDivElement > parent);
            brk = true;
        }
    }
}

function getAccordionDivChildrenHeight(accordionDiv: HTMLDivElement): number {
    let height = 0;
    [].forEach.call(accordionDiv.querySelectorAll(":scope > .nestedTopicsWrapper > .el-accordion"), (acc: HTMLButtonElement) => {
        let accDiv = < HTMLDivElement > acc.nextElementSibling;
        if (!hasClass(acc, "active")) {
            height += getAccordionDivScrollHeight(accDiv);
        }
        getAccordionDivChildrenHeight(accDiv);
    })
    return height;
}

function getAccordionDivScrollHeight(accordionDiv: HTMLDivElement): number {
    return accordionDiv.scrollHeight + parseInt(getComputedStyle(accordionDiv).paddingTop);
}