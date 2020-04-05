window.addEventListener("load", () => {
    addAccordionEventListeners();
});

function addAccordionEventListeners() {
    let acc = document.getElementsByClassName("el-accordion");
    for (var i = 0; i < acc.length; i++) {
        let accThis: HTMLButtonElement = < HTMLButtonElement > acc[i];
        accThis.addEventListener("click", () => {
            accThis.classList.toggle("active");
            let panel: HTMLElement = < HTMLElement > accThis.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                resizeAccordionDiv( < HTMLDivElement > accThis.nextElementSibling);
            }
        });
    }
}

function resizeAccordionDiv(accordionDiv: HTMLDivElement) {
    accordionDiv.style.maxHeight = getAccordionDivScrollHeight(accordionDiv) + "px";
    let parent: HTMLElement = accordionDiv;
    let brk: boolean = false;
    setTimeout(() => {
        while (parent.parentElement.id !== "topicsWrapper" && !brk) {
            parent = < HTMLElement > parent.parentElement;
            if (parent.previousElementSibling && hasClass( < HTMLElement > parent.previousElementSibling, "el-accordion")) {
                resizeAccordionDiv( < HTMLDivElement > parent);
                brk = true;
            }
        }
    }, 200);
}

function getAccordionDivScrollHeight(accordionDiv:HTMLDivElement):number {
    return accordionDiv.scrollHeight + parseInt(getComputedStyle(accordionDiv).paddingTop);
}