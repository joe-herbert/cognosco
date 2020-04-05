declare let topicsObject:object;
declare function addAccordionEventListeners():Function;
declare function addClass(el: HTMLElement, className: string): Function;

window.addEventListener("load", () => {
    document.getElementById("topicsWrapper").innerHTML = generateTopics(topicsObject, "./");
    addAccordionEventListeners();
});

function generateTopics(topicParam:any, currentDir:string): string {
    let wrapper:HTMLDivElement = document.createElement("div");
    for (let topicName in topicParam) {
        let topic:any = topicParam[topicName];
        if (topic.topics) {
            let accordion:HTMLButtonElement = document.createElement("button");
            addClass(accordion, "el-accordion");
            accordion.innerText = topicName;
            let accordionDiv:HTMLDivElement = document.createElement("div");
            accordionDiv.innerHTML = topic.def + "<div class=\"nestedTopicsWrapper\">" + generateTopics(topic.topics, currentDir + topicName + "/") + "</div>";
            wrapper.appendChild(accordion);
            wrapper.appendChild(accordionDiv);
        } else {
            let link:HTMLAnchorElement = document.createElement("a");
            addClass(link, "el-full-width-a");
            link.innerText = topicName;
            if (topic === true) {
                link.href = (currentDir + topicName).toLowerCase();
            }
            wrapper.appendChild(link);
        }
    }
    return wrapper.innerHTML;
}