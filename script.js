"use strict";

// SELECTING ELEMENTS
// login
const loginView = document.querySelector(".login-page");
const inputLoginUsername = document.querySelector(".login__input--username");
const inputLoginPin = document.querySelector(".login__input--pin");
const btnLogin = document.querySelector(".btn-login--login");

// account view
const accView = document.querySelector(".app");

// nav bar
const accName = document.querySelector(".username");
const btnLogout = document.querySelector(".logout");

// balance
const dateBalance = document.querySelector(".balance__date");
const accBalance = document.querySelector(".balance__value");

// movements
const movContainer = document.querySelector(".movements-container");
const movDate = document.querySelector(".movement-date");
const movValue = document.querySelector(".movement-value");

// summary
const summaryIn = document.querySelector(".summary-value--in");
const summaryOut = document.querySelector(".summary-value--out");
const btnSort = document.querySelector(".btn--sort");

// operations
// transfer
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const btnTransfer = document.querySelector(".btn--transfer");
// request loan
const inputLoanAmount = document.querySelector(".form__input--loan");
const btnLoan = document.querySelector(".btn--loan");
// close account
const inputCloseUsername = document.querySelector(".form__input--username");
const inputClosePin = document.querySelector(".form__input--pin");
const btnClose = document.querySelector(".btn--close");

// modal window
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal-window");
const btnModalLogin = document.querySelector(".btn-login--data");
const btnsModal = document.querySelectorAll(".btn--data");
const btnCloseModal = document.querySelector(".btn--close-window");

// timer
const accTimer = document.querySelector(".timer");

// ACCOUNTS DATA
const account1 = {
  owner: "Vanessa Ike",
  movements: [500, 200, -100, 3000, 900, -300],
  pin: 1111,
  movementsDates: [
    "2021-02-18T21:31:17.178Z",
    "2021-02-23T07:42:02.383Z",
    "2021-03-05T09:15:04.904Z",
    "2021-05-28T10:17:24.185Z",
    "2021-05-29T14:11:59.604Z",
    "2021-05-30T17:01:17.194Z",
  ],
  currency: "BRL",
  locale: "pt-BR",
};

const account2 = {
  owner: "John Smith Williams",
  movements: [600, 500, -100, -50, 300],
  pin: 2222,
  movementsDates: ["2019-11-18T21:31:17.178Z", "2019-11-20T21:31:17.178Z", "2019-12-23T07:42:02.383Z", "2020-02-15T09:15:04.904Z", "2021-04-06T10:17:24.185Z"],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Maria Santos",
  movements: [1200, 300, 650, -80],
  pin: 3333,
  movementsDates: ["2019-11-18T21:31:17.178Z", "2020-12-28T07:42:02.383Z", "2021-01-05T09:15:04.904Z", "2021-05-25T10:17:24.185Z"],
  currency: "MXN",
  locale: "es-MX",
};

const account4 = {
  owner: "Laura Johnson Rodriguez",
  movements: [100, 500, 1300],
  pin: 4444,
  movementsDates: ["2021-01-10T21:31:17.178Z", "2021-03-15T07:42:02.383Z", "2021-05-30T09:15:04.904Z"],
  currency: "GBP",
  locale: "en-GB",
};

const account5 = {
  owner: "Michael Oliver Davis",
  movements: [500, 60, 900, -300, 800, -150, 400, 590, -50],
  pin: 5555,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2021-05-20T14:43:26.374Z",
    "2021-05-22T18:49:59.371Z",
    "2021-05-26T12:01:20.894Z",
    "2021-05-28T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const accounts = [account1, account2, account3, account4, account5];

// MUTABLE VARIABLES
let currentUser, timer;
let sorted = false;

// FUNCTIONS
// creating username (the initials of the owner)
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

// format the currencies
const formatCurrencies = function (value, locale, currency) {
  const options = {
    style: "currency",
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

// format the dates
const formatDates = function (date, locale) {
  //calculate how many days have passed since the movement was made
  const calcDaysPassed = (day2, day1) => Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// opening and closing modal window
const openModal = function () {
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
};

const closeModal = function () {
  overlay.classList.add("hidden");
  modal.classList.add("hidden");
};

//timer
const startLogOutTimer = function () {
  //it will be executed right when we enter the page, if we put it in the setInterval right away it will only execute after 1 second
  const tick = function () {
    //converting to minutes and seconds
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    accTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop the timer and log user out
    if (time === 0) {
      clearInterval(timer);
      loggedOut();
    }

    //decrease 1s
    time--;
  };

  let time = 300;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// CALCULATIONS
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  accBalance.textContent = formatCurrencies(acc.balance, acc.locale, acc.currency);
};

const calcSummary = function (acc) {
  const accIn = acc.movements.filter((mov) => mov > 0).reduce((sum, mov) => sum + mov, 0);
  summaryIn.textContent = formatCurrencies(accIn, acc.locale, acc.currency);

  const accOut = acc.movements.filter((mov) => mov < 0).reduce((sum, mov) => sum + mov, 0);
  summaryOut.textContent = formatCurrencies(Math.abs(accOut), acc.locale, acc.currency);
};

// UI
const loggedIn = function () {
  loginView.style.display = "none";
  accView.style.display = "block";
};

const loggedOut = function () {
  loginView.style.display = "flex";
  accView.style.display = "none";
};

const updateUI = function (acc) {
  calcBalance(acc);
  calcSummary(acc);
  displayMov(acc);
};

const displayMov = function (acc, sort = false) {
  movContainer.innerHTML = "";

  //sorting movements (creating a copy of the original array and sorting it in ascending order)
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    //dates
    const dateOfMov = new Date(acc.movementsDates[i]);
    const displayDate = formatDates(dateOfMov, acc.locale);

    //currencies
    const formatMov = formatCurrencies(mov, acc.locale, acc.currency);

    //movements
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements-container__row">
      <p class="movement movement-type--${type}">${i + 1}- ${type}</p>
      <p class="movement-date">${displayDate}</p>
      <p class="movement-value">${formatMov}</p>
    </div>
    `;
    movContainer.insertAdjacentHTML("afterbegin", html);
  });
};

// EVENTS
// USER LOGS IN
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  //defining current user
  currentUser = accounts.find((acc) => acc.username === inputLoginUsername.value.trim());

  //checking credentials
  if (currentUser?.pin === +inputLoginPin.value) {
    //display UI and welcome message
    loggedIn();
    accName.textContent = currentUser.owner.split(" ")[0];

    //date
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    dateBalance.textContent = new Intl.DateTimeFormat(currentUser.locale, options).format(now);

    //cleaning input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentUser);
  } else {
    alert("Invalid username or PIN");
  }
});

// TRANSFER MONEY
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const recipient = accounts.find((acc) => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value;

  //checking if the amount is positive, if I have money to transfer, If the recipient exists and if the recipient is not me
  if (amount > 0 && amount <= currentUser.balance && recipient && inputTransferTo.value !== currentUser.username) {
    //add negative movement to current user
    currentUser.movements.push(-amount);

    //add positive movement to recipient
    recipient.movements.push(amount);

    //add transfer date
    currentUser.movementsDates.push(new Date().toISOString());
    recipient.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currentUser);

    //reset timer
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  } else {
    alert("Something went wrong. Check if all the data is valid.");
  }

  //clear input fields
  inputTransferTo.value = inputTransferAmount.value = "";
});

// LOAN REQUEST
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  //check if there's any deposit that is 10% the requested value
  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount / 10)) {
    //simulating the delay before accepting the loan
    setTimeout(function () {
      //add positive movement to current user
      currentUser.movements.push(amount);

      //add movement date
      currentUser.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentUser);
    }, 2500);
  } else {
    alert("Something went wrong! Check if there's any deposit equivalent to 10% of the requested value.");
  }

  inputLoanAmount.value = "";
});

// CLOSE ACCOUNT
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  //checking the credentials
  if (currentUser.username === inputCloseUsername.value && currentUser.pin === +inputClosePin.value) {
    //looping throught the accounts to find the index from the current account
    const index = accounts.findIndex((acc) => acc.username === currentUser.username);

    //deleting account from the accounts array
    accounts.splice(index, 1);

    //log user out
    loggedOut();
  } else {
    alert("Invalid username or PIN");
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.blur();
});

// SORTING MOVEMENTS
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  //when sorted is false we want to sort it, and when sort is true we want to unsort it
  sorted = !sorted;
  displayMov(currentUser, sorted);
});

// USER LOGS OUT
btnLogout.addEventListener("click", loggedOut);

// MODAL WINDOW
btnModalLogin.addEventListener("click", function (e) {
  e.preventDefault();
  openModal();
});

btnsModal.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });
});

[overlay, btnCloseModal].forEach((el) => el.addEventListener("click", closeModal));

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
