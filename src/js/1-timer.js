`use strict`; // Код у суворому режимі

// console.log(`Timer`);

// Імпортуємо необхідні бібліотеки
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо доступ до елементів HTML
const datePicker = document.getElementById('datetime-picker'); // Інпут для вибору дати
const startButton = document.querySelector('button[data-start]'); // Кнопка старту таймера
const daysElement = document.querySelector('[data-days]'); // Поле для відображення днів
const hoursElement = document.querySelector('[data-hours]'); // Поле для відображення годин
const minutesElement = document.querySelector('[data-minutes]'); // Поле для відображення хвилин
const secondsElement = document.querySelector('[data-seconds]'); // Поле для відображення секунд

// Початковий стан кнопки "Start" — неактивний
startButton.disabled = true;

// Змінні для збереження вибраної дати і таймера
let userSelectedDate = null;
let countdownInterval = null;

// Опції для ініціалізації flatpickr
const options = {
  enableTime: true, // Дозволяє вибирати час
  time_24hr: true, // Формат часу 24 години
  defaultDate: new Date(), // Поточна дата за замовчуванням
  minuteIncrement: 1, // Крок вибору хвилин
  onClose(selectedDates) {
    const selectedDate = selectedDates[0]; // Отримуємо обрану дату

    // Перевіряємо, чи вибрана дата в майбутньому
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true; // Деактивуємо кнопку
      startButton.classList.add('button-disabled'); // Додаємо клас для стилю неактивної кнопки
      startButton.classList.remove('button-enabled'); // Видаляємо клас активної кнопки
    } else {
      userSelectedDate = selectedDate; // Зберігаємо вибрану дату
      startButton.disabled = false; // Активуємо кнопку
      startButton.classList.add('button-enabled'); // Додаємо клас для стилю активної кнопки
      startButton.classList.remove('button-disabled'); // Видаляємо клас неактивної кнопки
    }
  },
};

// Ініціалізуємо flatpickr на інпуті
flatpickr(datePicker, options);

// Обробник події для кнопки "Start"
startButton.addEventListener('click', () => {
  if (!userSelectedDate) return; // Якщо дата не вибрана, нічого не робимо

  // Блокуємо інпут і кнопку під час відліку
  datePicker.disabled = true;
  startButton.disabled = true;
  startButton.classList.add('button-disabled'); // Додаємо клас для стилю неактивної кнопки
  startButton.classList.remove('button-enabled'); // Видаляємо клас активної кнопки

  // Запускаємо зворотний відлік
  countdownInterval = setInterval(() => {
    const now = new Date(); // Поточний час
    const timeRemaining = userSelectedDate - now; // Різниця між вибраною і поточною датами

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval); // Зупиняємо таймер
      updateTimerUI(0, 0, 0, 0); // Очищаємо інтерфейс
      datePicker.disabled = false; // Розблоковуємо інпут
      iziToast.success({
        title: 'Success',
        message: 'Countdown completed!',
        position: 'topRight',
      });
      return;
    }

    // Конвертуємо мілісекунди у дні, години, хвилини, секунди
    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    updateTimerUI(days, hours, minutes, seconds); // Оновлюємо інтерфейс
  }, 1000); // Оновлення кожну секунду
});

// Функція для оновлення інтерфейсу таймера
function updateTimerUI(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days); // Додаємо 0 до днів, якщо їх менше 10
  hoursElement.textContent = addLeadingZero(hours); // Додаємо 0 до годин
  minutesElement.textContent = addLeadingZero(minutes); // Додаємо 0 до хвилин
  secondsElement.textContent = addLeadingZero(seconds); // Додаємо 0 до секунд
}

// Функція для додавання провідного нуля до чисел
function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // Форматуємо число до двох символів
}

// Функція для конвертації мілісекунд у дні, години, хвилини і секунди
function convertMs(ms) {
  const second = 1000; // Кількість мілісекунд у секунді
  const minute = second * 60; // Кількість мілісекунд у хвилині
  const hour = minute * 60; // Кількість мілісекунд у годині
  const day = hour * 24; // Кількість мілісекунд у дні

  // Обчислюємо залишок днів, годин, хвилин і секунд
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds }; // Повертаємо об'єкт з розрахунками
}
