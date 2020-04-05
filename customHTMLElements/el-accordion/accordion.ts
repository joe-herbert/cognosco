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
    let totalScrollHeight = getAccordionDivScrollHeight(accordionDiv);
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

function getAccordionDivScrollHeight(accordionDiv: HTMLDivElement): number {
    let clone: HTMLDivElement = <HTMLDivElement>accordionDiv.cloneNode(true);
    addClass(clone, "forTesting");
    document.getElementsByTagName("body")[0].appendChild(clone);
    let height:number = clone.scrollHeight + parseInt(getComputedStyle(clone).paddingTop);
    document.getElementsByTagName("body")[0].removeChild(clone);
    return height;
}