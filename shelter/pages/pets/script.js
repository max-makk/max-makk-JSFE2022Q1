const body = document.body;
const menu_btn = document.querySelector(".hamburger");
const mobile_menu = document.querySelector(".mobile-nav");
const contacts = document.querySelector(".mobile-nav [href='#contacts']");
const help = document.querySelector(".mobile-nav [href*='#help']");
const menu_overlay = document.querySelector(".menu-overlay");

contacts.addEventListener("click", function () {
  menuToggler();
});

help.addEventListener("click", function () {
  menuToggler();
});

menu_btn.addEventListener("click", function () {
  menuToggler();
});

menu_overlay.addEventListener("click", function () {
  menuToggler();
});

window.matchMedia("(min-width: 768px)").addEventListener("change", () => {
  menu_btn.classList.remove("is-active");
  mobile_menu.classList.remove("is-active");
  menu_overlay.classList.remove("is-active");
  body.classList.remove("overflow");
});

function menuToggler() {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
  menu_overlay.classList.toggle("is-active");
  body.classList.toggle("overflow");
}

// **********************************************************

let screen = "";
let current = 0;
let maxPages = 0;
let currentPage = 1;
let size = 0;
let pets = [];
let randomPets = [];
let tablet = window.matchMedia("(min-width: 768px)");
let desktop = window.matchMedia("(min-width: 1280px)");

const cards = document.querySelector(".cards");
const pageNumber = document.querySelector(".page");
const btnFirstPage = document.querySelector(".btn-start");
const btnLastPage = document.querySelector(".btn-end");
const btnNextPage = document.querySelector(".btn-next");
const btnPrevPage = document.querySelector(".btn-prev");

btnFirstPage.addEventListener("click", toFirstPage);
btnLastPage.addEventListener("click", toLastPage);
btnNextPage.addEventListener("click", nextPage);
btnPrevPage.addEventListener("click", prevPage);

function checkScreenSize() {
  if (desktop.matches) {
    screen = "desktop";
    size = 8;
  } else if (tablet.matches) {
    screen = "tablet";
    size = 6;
  } else {
    screen = "mobile";
    size = 3;
  }
}
checkScreenSize();
current = size;

async function getPets() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/markups/level-2/shelter/pets.json"
    );
    const getData = await response.json();
    pets = getData;
    if (screen === "desktop") {
      for (let i = 0; i < 6; i++) {
        randomPets.push(...shuffle(pets));
      }
    } else if (screen === "tablet") {
      let arr = Array(6).fill(pets);
      arr = [].concat(...arr);
      for (let i = 0; i < 8; i++) {
        randomPets.push(...shuffle(arr.slice(0, 6)));
        arr.splice(0, 6);
      }
    } else if (screen === "mobile") {
      let arr = Array(6).fill(pets);
      arr = [].concat(...arr);
      for (let i = 0; i < 16; i++) {
        randomPets.push(...shuffle(arr.slice(0, 3)));
        arr.splice(0, 3);
      }
    }

    maxPages = Math.floor(randomPets.length / size);
    if (screen === "desktop") {
      populatePets(0, 8);
    } else if (screen === "tablet") {
      populatePets(0, 6);
    } else {
      populatePets(0, 3);
    }
  } catch (e) {
    alert(e);
  }
}

getPets();

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function populatePets(s, e) {
  cards.innerHTML = "";
  for (let i = s; i < e; i++) {
    const card = document.createElement("div");
    card.setAttribute("data-name", randomPets[i].name);
    card.addEventListener("click", (e) => showInfo(e));
    card.classList.add("card");
    const img = document.createElement("img");
    img.setAttribute("src", randomPets[i].img);
    img.setAttribute("alt", randomPets[i].name);
    const petName = document.createElement("h4");
    petName.textContent = randomPets[i].name;
    const btn = document.createElement("button");
    btn.classList.add("button");
    btn.classList.add("button-secondary");
    btn.textContent = "Learn more";
    card.append(img);
    card.append(petName);
    card.append(btn);
    cards.append(card);
  }
}

function toFirstPage() {
  currentPage = 1;
  current = size;
  populatePets(0, size);
  displayPage();
  btnLastPage.classList.remove("inactive");
  btnNextPage.classList.remove("inactive");
  btnFirstPage.classList.add("inactive");
  btnPrevPage.classList.add("inactive");
}

function toLastPage() {
  currentPage = maxPages;
  current = randomPets.length;
  populatePets(randomPets.length - size, randomPets.length);
  displayPage();
  btnLastPage.classList.add("inactive");
  btnNextPage.classList.add("inactive");
  btnFirstPage.classList.remove("inactive");
  btnPrevPage.classList.remove("inactive");
}

function nextPage() {
  if (currentPage === maxPages) {
    return;
  } else if (currentPage === maxPages - 1) {
    btnLastPage.classList.add("inactive");
    btnNextPage.classList.add("inactive");
  }
  currentPage += 1;
  populatePets(current, current + size);
  current = current + size;
  displayPage();
  btnPrevPage.classList.remove("inactive");
  btnFirstPage.classList.remove("inactive");
}

function prevPage() {
  if (currentPage === 1) {
    return;
  } else if (currentPage - 1 === 1) {
    btnFirstPage.classList.add("inactive");
    btnPrevPage.classList.add("inactive");
  }
  currentPage -= 1;
  populatePets(current - size - size, current - size);
  current = current - size;
  displayPage();
  btnNextPage.classList.remove("inactive");
  btnLastPage.classList.remove("inactive");
}

function displayPage() {
  pageNumber.textContent = currentPage;
}

tablet.addEventListener("change", () => {
  checkScreenSize();
  refresh();
  current = size;
});
desktop.addEventListener("change", () => {
  checkScreenSize();
  refresh();
  current = size;
});

function refresh() {
  currentPage = 1;
  pets = [];
  randomPets = [];
  getPets();
  displayPage();
  btnLastPage.classList.remove("inactive");
  btnNextPage.classList.remove("inactive");
  btnFirstPage.classList.add("inactive");
  btnPrevPage.classList.add("inactive");
}

// ***************************************** show modal

function showInfo(e) {
  const name = e.target.closest(".card").getAttribute("data-name");
  const pet = pets.find((e) => e.name === name);
  const container = document.querySelector(".modal");
  container.innerHTML = "";

  const modal = `<div class="modal-img">
        <img src=${pet.img} alt="${pet.name}" />
      </div>
      <div class="modal-info">
        <button class="button button-round close-modal">&times;</button>
        <h3 class="modal-name">${pet.name}</h3>
        <h4 class="modal-breed">${pet.type} - ${pet.breed}</h4>
        <p class="modal-descr">${pet.description}</p>
        <ul class="modal-list">
          <li><span>Age:</span> ${pet.age}</li>
          <li><span>Inoculations:</span> ${pet.inoculations.join(", ")}</li>
          <li><span>Diseases:</span> ${pet.diseases.join(", ")}</li>
          <li><span>Parasites:</span> ${pet.parasites}</li>
        </ul>
      </div>`;
  container.innerHTML += modal;
  container.style.display = "flex";
  const btn = document.querySelector(".close-modal");
  const overlay = document.querySelector(".modal-overlay");
  document.body.classList.add("overflow");
  overlay.classList.add("open");
  overlay.addEventListener("mouseenter", () => {
    document.querySelector(".close-modal").style.background = "#fddcc4";
    document.querySelector(".close-modal").style.borderColor = "#fddcc4";
  });
  overlay.addEventListener("mouseleave", () => {
    document.querySelector(".close-modal").style.background = "";
  });
  overlay.addEventListener("click", () => {
    overlay.classList.remove("open");
    container.style.display = "none";
    document.body.classList.remove("overflow");
  });
  btn.addEventListener("click", () => {
    container.style.display = "none";
    overlay.classList.remove("open");
    document.body.classList.remove("overflow");
  });
}
