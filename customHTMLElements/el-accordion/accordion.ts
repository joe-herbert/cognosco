window.addEventListener("load", () => {
    addAccordionEventListeners();
});

window.addEventListener("resize", () => {
    [].forEach.call(document.querySelectorAll(".el-accordion.active+div"), (div: HTMLDivElement) => {
        div.style.maxHeight = getAccordionDivScrollHeight(div) + "px";
    });
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
    let clone: HTMLDivElement = < HTMLDivElement > accordionDiv.cloneNode(true);
    let wrapper: HTMLDivElement = document.createElement("div");
    addClass(wrapper, "forTesting");
    wrapper.style.padding = "0 10px";
    wrapper.style.width = getComputedStyle(accordionDiv).width;
    wrapper.appendChild(clone);
    document.getElementsByTagName("body")[0].appendChild(wrapper);
    let height: number = clone.scrollHeight + parseInt(getComputedStyle(clone).paddingTop);
    document.getElementsByTagName("body")[0].removeChild(wrapper);
    return height;
}