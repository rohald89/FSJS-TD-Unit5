let employees = [];
const url = `https://randomuser.me/api/?lego&results=12&ginc=name, picture,
email, location, phone, dob &noinfo &nat=NL`;
let gallery = document.querySelector("#gallery");

let activeModal;

fetch(url)
    .then((response) => response.json())
    .then((data) => data.results)
    .then(generateEmployee)
    .catch((err) => console.log(err));

// loop through the data from the api and create the card for each employee
function generateEmployee(data) {
    employees = data;
    let employeeHTML = "";

    employees.forEach((employee, index) => {
        let image = employee.picture.large;
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;

        employeeHTML += `
                <div class="card" data-index="${index}">
                    <div class="card-img-container">
                        <img class="card-img" src="${image}" alt="profile image of ${name.first}">
                    </div>
                    <div class="card-info-container">
                        <h3 id="${name.first}" class="card-name cap">${name.first} ${name.last}</h3>
                        <p class="card-text">${email}</p>
                        <p class="card-text cap">${city}, ${state}</p>
                    </div>
                </div>
    `;
    });
    gallery.innerHTML = employeeHTML;
}

function createModal(index) {
    if (document.querySelector('.modal-container')) {
        document.querySelector('.modal-container').remove();
    }
    let {
        name,
        dob,
        phone,
        email,
        location: { city, street, state, postcode },
        picture,
    } = employees[index];

    let date = new Date(dob.date);

    const modal = document.createElement('DIV');
    modal.classList.add('modal-container');
    const modalHTML = `
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="${picture.large}" alt="profile image of ${name.first}">
                                <h3 id="${name.first}" class="modal-name cap">${name.first} ${name.last}</h3>
                                <p class="modal-text">${email}</p>
                                <p class="modal-text cap">${city}</p>
                                <hr>
                                <p class="modal-text">${phone}</p>
                                <p class="modal-text">${street.number} ${street.name
        }, ${state} ${postcode}</p>
                                <p class="modal-text">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
                            </div>
                        </div>
                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
    `;

    modal.innerHTML = modalHTML;
    activeModal = parseInt(index);
    document.body.append(modal);
}

// call createModal function upon clicking a card
gallery.addEventListener('click', e => {
    if (e.target.className !== 'gallery') {
        createModal(e.target.closest('.card').dataset.index);
    }
});

// navigate through employee cards in modal by checking the current open modal and increasing / decreasing the index
function changeModal(e) {
    if (e.target.getAttribute('id') === "modal-prev" && activeModal > 0) {
        createModal(activeModal - 1);
    } else if (
        e.target.getAttribute('id') === "modal-next" &&
        activeModal < employees.length - 1
    ) {
        createModal(activeModal + 1);
    } else return;
}

// global eventlistener for closing modal and calling changeModal function
document.addEventListener('click', e => {
    if (e.target.className === 'modal-close-btn') {
        document.querySelector('.modal-container').remove();
    }
    changeModal(e);
});

// add search input to the DOM
document.querySelector('.search-container').innerHTML = `
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>`;

// check the searchterm and see if this term is present in one of the names
// depending on the result either display or hide the card
document.querySelector('#search-submit').addEventListener('click', e => {
    e.preventDefault();
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const employeeCards = document.querySelectorAll('.card-name');
    employeeCards.forEach(card => {
        if (card.textContent.toLowerCase().indexOf(searchTerm) < 0) {
            card.parentNode.parentNode.style.display = 'none';
        } else {
            card.parentNode.parentNode.style.display = 'flex';
        }
    });
});