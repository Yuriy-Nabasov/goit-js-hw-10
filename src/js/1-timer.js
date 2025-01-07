`use strict`; // Код у суворому режимі

// Імпортуємо обидві бібліотеки
import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css'; // Стилі flatpickr підключив через імпорт в styles.css
import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css'; // Стилі iziToast підключив через імпорт в styles.css

// Отримуємо доступ до елементів HTML
const datePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('.js-flatpickr-btn');
const daysElement = document.querySelector('.js-value-days');
const hoursElement = document.querySelector('.js-value-hours');
const minutesElement = document.querySelector('.js-value-minutes');
const secondsElement = document.querySelector('.js-value-seconds');

startButton.disabled = true;

// Змінні для збереження вибраної дати і таймера
let userSelectedDate = null;
let countdownInterval = null;

// Опції для ініціалізації flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

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
  if (!userSelectedDate) return;

  // Блокуємо інпут і кнопку під час відліку
  datePicker.disabled = true;
  startButton.disabled = true;
  startButton.classList.add('button-disabled'); // Додаємо клас для стилю неактивної кнопки
  startButton.classList.remove('button-enabled'); // Видаляємо клас активної кнопки

  // Запускаємо зворотний відлік
  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

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
  }, 1000);
});

// Функція для оновлення інтерфейсу таймера
function updateTimerUI(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Функція для додавання провідного нуля до чисел
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини і секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Обчислюємо залишок днів, годин, хвилин і секунд
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
