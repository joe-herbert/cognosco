window.addEventListener("load", () => {
    addAccordionEventListeners();
});
window.addEventListener("resize", () => {
    [].forEach.call(document.querySelectorAll(".el-accordion.active+div"), (div) => {
        div.style.maxHeight = getAccordionDivScrollHeight(div) + "px";
    });
});
function addAccordionEventListeners() {
    let acc = document.getElementsByClassName("el-accordion");
    for (let accThis of acc) {
        accThis.addEventListener("click", () => {
            accThis.classList.toggle("active");
            let panel = accThis.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            else {
                resizeAccordionDiv(accThis.nextElementSibling);
            }
        });
    }
}
function resizeAccordionDiv(accordionDiv) {
    let totalScrollHeight = getAccordionDivScrollHeight(accordionDiv);
    accordionDiv.style.maxHeight = totalScrollHeight + "px";
    let parent = accordionDiv;
    let brk = false;
    while (parent.parentElement.id !== "topicsWrapper" && !brk) {
        parent = parent.parentElement;
        if (parent.previousElementSibling && hasClass(parent.previousElementSibling, "el-accordion")) {
            resizeAccordionDiv(parent);
            brk = true;
        }
    }
}
function getAccordionDivScrollHeight(accordionDiv) {
    let clone = accordionDiv.cloneNode(true);
    let wrapper = document.createElement("div");
    addClass(wrapper, "forTesting");
    wrapper.style.padding = "0 10px";
    wrapper.style.width = getComputedStyle(accordionDiv).width;
    wrapper.appendChild(clone);
    document.getElementsByTagName("body")[0].appendChild(wrapper);
    let height = clone.scrollHeight + parseInt(getComputedStyle(clone).paddingTop);
    document.getElementsByTagName("body")[0].removeChild(wrapper);
    return height;
}
