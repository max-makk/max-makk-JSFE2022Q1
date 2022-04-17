const menu_btn = document.querySelector(".hamburger");
const mobile_menu = document.querySelector(".mobile-nav");
const menu_overlay = document.querySelector(".menu-overlay");

menu_btn.addEventListener("click", function () {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
  menu_overlay.classList.toggle("is-active");
});

menu_overlay.addEventListener("click", function() {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
  menu_overlay.classList.toggle("is-active");
})

window.matchMedia("(min-width: 768px)").addEventListener("change",() => {
  menu_btn.classList.remove("is-active");
  mobile_menu.classList.remove("is-active");
  menu_overlay.classList.remove("is-active");
  console.log('hi')
})

