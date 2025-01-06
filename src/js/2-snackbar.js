`use strict`; // Код у суворому режимі

console.log(`Snackbar`);

// Імпортуємо бібліотеку iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо посилання на елементи форми
const form = document.querySelector('.form');

// Додаємо обробник події сабміту форми
form.addEventListener('submit', event => {
  event.preventDefault(); // Відміняємо перезавантаження сторінки

  // Отримуємо значення з форми
  const formData = new FormData(form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  // Створюємо проміс
  createPromise(delay, state)
    .then(delay => {
      // Якщо проміс виконався успішно
      iziToast.success({
        title: 'Success',
        message: `\u2705 Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Якщо проміс був відхилений
      iziToast.error({
        title: 'Error',
        message: `\u274C Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});

/**
 * Функція для створення промісу
 * @param {number} delay - Затримка у мілісекундах
 * @param {string} state - Стан промісу (fulfilled або rejected)
 * @returns {Promise<number>} - Проміс із затримкою
 */
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // Виконуємо проміс
      } else {
        reject(delay); // Відхиляємо проміс
      }
    }, delay);
  });
}
