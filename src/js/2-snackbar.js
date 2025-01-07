`use strict`; // Код у суворому режимі

// Підключаємо бібліотеку iziToast
import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';  // Стилі iziToast підключив через імпорт в styles.css

// Знаходимо елементи форми
const form = document.querySelector('.form');

// Слухаємо події сабміту форми
form.addEventListener('submit', event => {
  event.preventDefault(); // Відміняю перезавантаження сторінки

  // Зчитуємо значення з форми
  const formData = new FormData(form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  //  Функція для створення промісу
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

  // Створюємо проміс
  createPromise(delay, state)
    .then(delay => {
      // Якщо проміс виконався успішно `✅ Fulfilled promise in ${delay}ms`
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Якщо проміс був відхилений `❌ Rejected promise in ${delay}ms`
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});
