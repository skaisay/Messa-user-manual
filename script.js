// Получаем все секции
const sections = document.querySelectorAll("section");

// Функция для плавного появления секций
function fadeInSection() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            section.style.opacity = 1;
        }
    });
}

// При загрузке страницы и прокрутке
document.addEventListener("DOMContentLoaded", fadeInSection);
window.addEventListener("scroll", fadeInSection);
