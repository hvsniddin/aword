var selectedFilter = document.querySelector('.stats-filter-item');
var selectedSort = selectedFilter.querySelector('.selected');

const foundwordsFilter = document.querySelectorAll(".stats-filter-item");
foundwordsFilter.forEach((e, i) => {
    e.addEventListener('click', () => {
        deselectAll(foundwordsFilter)
        e.setAttribute("data-selected", "true");
        selectedFilter = e;
        selectedSort = e.querySelector('.selected');
    })
});


// The JavaScript code to handle the behavior of the custom select box
const customSelect = document.querySelectorAll('.select');
const selectedOption = document.querySelectorAll('.select-icon');
const optionsList = document.querySelectorAll('.options-list');



// Show/hide the options list when the selected option is clicked
selectedOption.forEach((e, i) => {
    e.addEventListener('click', () => {
        optionsList[i].classList.toggle('show');
    });
});


// Update the selected option when an option is clicked
optionsList.forEach((element, i) => {
    element.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            // Remove the selected class from the previously selected option
            const selectedOption = optionsList[i].querySelector('.selected');
            if (selectedOption) {
                selectedOption.classList.remove('selected');
            }
    
            // Add the selected class to the clicked option
            event.target.classList.add('selected');
    
            // Hide the options list
            element.classList.remove('show');

            selectedSort = selectedFilter.querySelector('.selected');
            console.log(selectedSort);
        }
    });
});

// document.addEventListener('click', (event) => {
//     customSelect.forEach(element => {
//         if (!element.contains(event.target)) {
//             optionsList.forEach(element => {
//                 element.classList.remove('show');
//             });
//         }
//     });
// });
