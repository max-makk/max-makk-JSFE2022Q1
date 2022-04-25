const body = document.body;
const menu_btn = document.querySelector(".hamburger");
const mobile_menu = document.querySelector(".mobile-nav");
const contacts = document.querySelector(".mobile-nav [href='#contacts']");
const help = document.querySelector(".mobile-nav [href*='#help']");
const menu_overlay = document.querySelector(".menu-overlay");
let cardIsOpen = false;

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
  if (!cardIsOpen) {
    body.classList.remove("overflow");
  }
});

function menuToggler() {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
  menu_overlay.classList.toggle("is-active");
  body.classList.toggle("overflow");
}

// *********************************************************

let screen = "";
let pets = [];
let randomPets = [];
let restCards = [];
let centerCards = [];
const itemLeft = document.querySelector(".item-left");
const itemCenter = document.querySelector(".item-center");
const itemRight = document.querySelector(".item-right");

async function getPets() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/markups/level-2/shelter/pets.json"
    );
    const getData = await response.json();
    pets = getData;
    randomPets.push(...shuffle(pets));
    initCards();
  } catch (e) {
    alert(e);
  }
}
getPets();

const cards = document.querySelector(".cards");

const SLIDER_LEFT_BTN = document.querySelector(".buttons .left");
const SLIDER_RIGHT_BTN = document.querySelector(".buttons .right");
const moveLeft = () => {
  cards.classList.add("transition-left");
  SLIDER_RIGHT_BTN.removeEventListener("click", moveRight);
  SLIDER_LEFT_BTN.removeEventListener("click", moveLeft);
};

const moveRight = () => {
  cards.classList.add("transition-right");
  SLIDER_RIGHT_BTN.removeEventListener("click", moveRight);
  SLIDER_LEFT_BTN.removeEventListener("click", moveLeft);
};

SLIDER_LEFT_BTN.addEventListener("click", moveLeft);
SLIDER_RIGHT_BTN.addEventListener("click", moveRight);

cards.addEventListener("animationend", (animationEvent) => {
  if (
    animationEvent.animationName === "move-left" ||
    animationEvent.animationName === "move-left-m" ||
    animationEvent.animationName === "move-left-l"
  ) {
    regroupCards();
    cards.classList.remove("transition-left");
  } else {
    regroupCards();
    cards.classList.remove("transition-right");
  }

  SLIDER_LEFT_BTN.addEventListener("click", moveLeft);
  SLIDER_RIGHT_BTN.addEventListener("click", moveRight);
});
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

function regroupCards() {
  itemCenter.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    itemCenter.append(createCard(restCards[i]));
  }
  itemLeft.innerHTML = "";
  itemRight.innerHTML = "";
  let temp = centerCards;
  centerCards = restCards.splice(0, 3);
  restCards.push(...temp);
  restCards.push(...shuffle(restCards));
  restCards.splice(0, 5);
  for (let i = 0; i < 3; i++) {
    itemRight.append(createCard(restCards[i]));
    itemLeft.append(createCard(restCards[i]));
  }
}

function initCards() {
  centerCards.push(...randomPets.slice(0, 3));
  restCards.push(...randomPets.slice(3));
  for (let i = 0; i < 3; i++) {
    itemCenter.append(createCard(centerCards[i]));
  }
  for (let i = 0; i < 3; i++) {
    itemLeft.append(createCard(restCards[i]));
    itemRight.append(createCard(restCards[i]));
  }
}

function createCard(item) {
  const card = document.createElement("div");
  card.setAttribute("data-name", item.name);
  card.classList.add("card");
  card.addEventListener("click", (e) => showInfo(e));
  const img = document.createElement("img");
  let pathImg = item.img;
  img.setAttribute("src", pathImg.slice(6));
  img.setAttribute("alt", item.name);
  const petName = document.createElement("h4");
  petName.textContent = item.name;
  const btn = document.createElement("button");
  btn.classList.add("button");
  btn.classList.add("button-secondary");
  btn.textContent = "Learn more";
  card.append(img);
  card.append(petName);
  card.append(btn);
  return card;
}

// ********************************************* show modal

function showInfo(e) {
  const name = e.target.closest(".card").getAttribute("data-name");
  const pet = pets.find((e) => e.name === name);
  const container = document.querySelector(".modal");
  container.innerHTML = "";
  cardIsOpen = true;

  const modal = `<div class="modal-img">
        <img src=${pet.img.slice(6)} alt="${pet.name}" />
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
    cardIsOpen = false;
  });
  btn.addEventListener("click", () => {
    container.style.display = "none";
    overlay.classList.remove("open");
    cardIsOpen = false;
    document.body.classList.remove("overflow");
  });
}
