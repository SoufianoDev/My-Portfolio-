import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

// Hero section animations
gsap.to("#heroTitle", {
    opacity: 1,
    y: -10,
    duration: 1.5,
    ease: "power2.out",
});
gsap.to("#heroSubtitle", {
    opacity: 1,
    y: -10,
    duration: 1.5,
    ease: "power2.out",
    delay: 1,
});

// Update copyright
document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.querySelector('.text-gray-400');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
});
// Display "Scroll for More" after 3 seconds
setTimeout(() => {
    const scrollText = document.querySelector(
        ".scroll-text-container"
    );
    scrollText.style.visibility = "visible";
}, 7000);

// Smooth scroll to About section
const scrollForMore = document.getElementById("scrollForMore");
scrollForMore.addEventListener("click", () => {
    document
        .getElementById("about")
        .scrollIntoView({ behavior: "smooth" });
});

// Contact form logic
const form = document.getElementById("contact-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you for reaching out! I'll get back to you soon.");
    form.reset();
});



const certificatesContainer = document.getElementById(
    "certificates-container"
);

const imgs = document.getElementsByClassName("imgrandom");
var i = 0;
var intervalId = window.setInterval(function () {
    imgs[i].style.opacity = "0";
    var options = [];
    for (let index = 0; index < imgs.length; index++) {
        index != i && options.push(i);
    }
    // la mab9itich baghiha tb9a random ->
    // i += 1;
    // O7yad hadi li lt7t
    i = Math.floor(Math.random() * options.length);
    imgs[i].style.opacity = "1";
}, 3000);
// clearInterval(intervalId);
console.log(imgs);