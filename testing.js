"use strict";

const account = {
  movements: [
    [500, "2021-07-25"],
    [200, "2021-07-26"],
    [800, "2022-05-29"],
  ],
};

for (const [movementValue, date] of account.movements) {
  console.log(movementValue);
}

const sorting = account.movements.sort(function (a, b) {
  if (a > b) return 1;
});
console.log(sorting);

const result = account.movements.reduce((a, b) => a.map((cur, i) => cur + b[i]));
console.log(result);

const transferMoney = function () {
  const value = +prompt("Value");
  if (!value) return;
  account.movements.push([-value, "2021-26-07"]);
  console.log(account.movements);
};
// transferMoney();

const request = function () {
  const value = +prompt("Value");
  if (!value) return;
  account.movements.push([value, "2021-26-07"]);
  console.log(account.movements);
};
// request();
