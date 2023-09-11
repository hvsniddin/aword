const sections = document.querySelectorAll(".profile-section");

let selected;
sections.forEach(item => {
    if (item.dataset.selected==true) {
        selected = item;
    }
});

console.log(selected);

function changeSection(e) {
    deselectAll();
    selected=e;
    console.log(e);
    e.setAttribute("data-selected", "true");
}

function deselectAll() {
    sections.forEach(item => {
        item.dataset.selected="false";
    });
}