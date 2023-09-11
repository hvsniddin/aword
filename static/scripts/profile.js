const sidebar = document.querySelectorAll(".sidebar-item");
const pages = document.querySelectorAll(".section");

sidebar.forEach((e, i) => {

    e.addEventListener('click', () => {
        deselectAll(sidebar);
        hideAll(pages);
        e.setAttribute("data-selected", "true");
        pages[i].style.display = 'block';
    })
});

function deselectAll(l) {
    l.forEach(item => {
        item.dataset.selected="false";
    });
}

function hideAll(p) {
    p.forEach(element => {
        element.style.display="none";
    });
}


const statsMenu = document.querySelectorAll(".stats-menu-item");
const statsPages = document.querySelectorAll(".stats-page");

statsMenu.forEach((e, i) => {
    e.addEventListener('click', () => {
        deselectAll(statsMenu)
        hideAll(statsPages)
        e.setAttribute("data-selected", "true");
        statsPages[i].style.display = 'block';
    })
});




const leaderboardFilter = document.querySelectorAll(".leaderboard-filter-item");
leaderboardFilter.forEach((e, i) => {
    e.addEventListener('click', () => {
        deselectAll(leaderboardFilter)
        e.setAttribute("data-selected", "true");
    })
});

