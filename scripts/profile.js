const tabs = document.querySelectorAll(".tabs div");
const fields = document.querySelectorAll(".field");

tabs.forEach(element => {
    element.addEventListener('click', () => {
        deselectTabs();
        hideFields();
        element.dataset.selected = 'true';
        ind = parseInt(element.dataset.index);

        fields[ind].style.display='block';
    });
});

function deselectTabs() {
    tabs.forEach(element => {
        element.dataset.selected = 'false';
    });
}
function hideFields() {
    fields.forEach((e) => {
        e.style.display = 'none';
    });
}