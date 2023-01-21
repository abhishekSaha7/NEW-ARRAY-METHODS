"use strict";
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //   containerMovements.innerHTML = "";
  movs.forEach(function (mov, i) {
    // containerMovements.innerHTML = "";
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

const calcdisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  //   acc.balance=balance
  labelBalance.textContent = `${acc.balance}€`;
};
// calcdisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(incomes);
  labelSumIn.textContent = `${incomes}€`;
  const outGoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  console.log(outGoing);
  labelSumOut.textContent = `${Math.abs(outGoing)}€`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  console.log(interest);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);
const updateUI = function (acc) {
  // Display movements:
  displayMovements(acc.movements);
  // Display balance:
  calcdisplayBalance(acc);
  // Display summary:
  calcDisplaySummary(acc);
};
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    // return username;
  });
  //   const username = user
  //     .toLowerCase()
  //     .split(" ")
  //     .map((name) => name[0])
  //     .join("");
  //   return username;
};
createUsername(accounts);
console.log(accounts);

// Event Handlers:

let currrentAccount;

btnLogin.addEventListener("click", function (e) {
  //Prevent form from submitting:
  e.preventDefault();
  //   console.log("Log-in");

  currrentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currrentAccount);
  if (currrentAccount?.pin === Number(inputLoginPin.value)) {
    // document.querySelector(".app").style.opacity = 1;
    // Display UI and a Welcome message:
    labelWelcome.textContent = `Welcome back ${
      currrentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Empty the input fields:
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    // // Display movements:
    // displayMovements(currrentAccount.movements);
    // // Display balance:
    // calcdisplayBalance(currrentAccount);
    // // Display summary:
    // calcDisplaySummary(currrentAccount);
    updateUI(currrentAccount);
  }
});

// Implementing Transfer:

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  ); //inputTransferTo.value
  //   console.log(amount, receiverAccount);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAccount &&
    currrentAccount.balance > amount &&
    receiverAccount?.username !== currrentAccount.username
  ) {
    // console.log("Transfer valid!");
    // Doing the transfer:
    currrentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // Update UI:
    updateUI(currrentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  //   if (movements.some((mov) => mov * 0.01 >= amount)) {
  //     console.log(`Loan passed`);
  //   } else {
  //     console.log(`Loan amount more!`);
  //   }
  // if(amount>0.01*a){}
  //   console.log(loanAmountOk);
  if (
    amount > 0 &&
    currrentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    //   Add the current movement here:
    currrentAccount.movements.push(amount);
    // Update the UI:
    updateUI(currrentAccount);
    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //   inputCloseUsername.value=inputClosePin.value=''
  if (
    inputCloseUsername.value === currrentAccount.username &&
    Number(inputClosePin.value) === currrentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currrentAccount.username
    );
    //   accounts.splice(index,1);
    console.log(index);
    // Delete account:

    accounts.splice(index, 1);

    //  Hide UI:
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currrentAccount.movements, !sorted);
  sorted = !sorted;
});

// const calcdisplayBalance=function(movements){
// const balance=movements.reduce(function(acc,mov){
//     return acc+mov;
// },0)
// labelBalance.textContent=`${balance}EUR`
// }
// printBalance();
// console.log(createUsername("Steven Thomas Williams"));
// const user = "Steven Thomas Williams"; //stw

// const userName = user
//   .toLowerCase()
//   .split(" ")
//   .map((name) => name[0])
//   .join("");
// console.log(userName);

// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Slice:

// const arr = ["a", "b", "c", "d", "e"];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// Splice:

// console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1, 2);
// console.log(arr);

// Reverse:

// const arr = ["a", "b", "c", "d", "e"];
// const arr2 = ["j", "i", "h", "g", "f"];
// console.log();
// console.log(arr2.reverse());
// console.log(arr2);

// Concat:
// const letters = arr.concat(arr2);
// console.log(letters);
// // Join:
// console.log(letters.join("-"));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-2));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}:You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}:You have withdrawn ${Math.abs(movement)}`);
//   }
// }
// console.log("------FOREACH------");

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movements ${i + 1}:You deposited ${mov}`);
//   } else {
//     console.log(`Movements ${i + 1}:You have withdrawn ${Math.abs(mov)}`);
//   }
// });

// // Map:

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// currencies.forEach(function (value, key, Map) {
//   console.log(`${key}:${value}`);
// });

// // Set:

// const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}:${value}`);
// });
//  CODING CHALLENGE:

// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];
// const julia = [9, 16, 6, 8, 3];
// const kate = [3, 5, 2, 12, 7];

// const checkDogs = function (arr) {
//   arr.forEach(function (age) {
//     const type1 = age > 3 ? "Dog" : "Puppy";

//     console.log(`Its a ${type1}`);
//   });
// };
// checkDogs(julia);
// checkDogs(kate);

// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyJulia = dogsJulia.slice();
//   const onlyDogsJulia = copyJulia.slice(1, -2);
//   console.log(onlyDogsJulia);
//   console.log(dogsKate);
//   onlyDogsJulia.forEach(function (age, i) {
//     const type1 = age > 3 ? "dog" : "puppy";
//     console.log(`Dog number ${i + 1}:This is a ${type1}`);
//   });
//   kate.forEach(function (age, i) {
//     const type1 = age > 3 ? "dog" : "puppy";
//     console.log(`Dog number ${i + 3}:This is a ${type1}`);
//   });
// };
// checkDogs(julia, kate);

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  console.log(dogsJuliaCorrected);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1}: is an adult and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1}: is still puppy`);
    }
  });
};
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const calcAverageHumanAge = function (arr2) {
//   const dogToHumanYears = arr2.map(function (mov, i) {
//     if (mov <= 2) return 2 * mov;
//     else return 16 + mov * 4;
//   });
//   console.log(dogToHumanYears);
//   const below18Humanyears = dogToHumanYears.filter(function (years1, i) {
//     return years1 > 18;
//   });
//   console.log(below18Humanyears);
//   const averageDogsToHumanAge = below18Humanyears.reduce(function (
//     acc,
//     cur,
//     i,
//     arr3
//   ) {
//     return acc + cur / arr3.length;
//   },
//   0);
//   return averageDogsToHumanAge;
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(
//   calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]),
//   calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
// );

const calcAverageHumanAge = (ages) => {
  const average2 = ages
    .map((mov) => (mov <= 2 ? mov * 2 : 16 + mov * 4))
    .filter((mov) => mov > 18)
    .reduce((acc, mov, i, arry) => acc + mov / arry.length, 0);
  return average2;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);

// Map method in arrays:

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroTOUSD = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroTOUSD;
// });
const movementsUSD = movements.map((mov) => mov * euroTOUSD);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * euroTOUSD);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(
  (movement, i) =>
    `Movement ${i + 1}:You ${
      movement > 0 ? "deposited" : "withdrew"
    } ${Math.abs(movement)}`
);

//   if (movement > 0) {
//     return `Movement ${i + 1}:You deposited ${movement}`;
//   } else {
//     return `Movement ${i + 1}:You have withdrawn ${Math.abs(movement)}`;
//   }

console.log(movementsDescriptions);

// const str = "sjahjs";
// console.log(str.length);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

// const withdrawals=[];

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);

const withdrawalsFor = [];
for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);
console.log(withdrawalsFor);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}:Accumulater ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// const maxValue = movements.reduce(function (acc, mov) {
//   return mov > acc ? mov : acc;
// }, 0);
// console.log(maxValue);

const max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

// Pipeline:

const totaldepositUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * euroTOUSD)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totaldepositUSD);

const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
const account = accounts.find((acc) => acc.owner === "Jessica Davis");
console.log(account);
const nextOne = accounts.find((acc) => acc.pin === 1111);
console.log(nextOne);

for (const [i, mov] of accounts.entries()) {
  // if(mov.owner==="Jonas Schmedtmann")
  if (mov.owner === "Jonas Schmedtmann") console.log(mov);
}
for (const [i, mov] of accounts.entries()) {
  // if(mov.owner==="Jonas Schmedtmann")
  if (mov.owner === "Jessica Davis") console.log(mov);
}

// Condition:
console.log(movements.some((mov) => mov === -130));
console.log(movements);
console.log(movements.includes(-130));
const anyDeposits = movements.some((mov) => mov > 1500);
console.log(anyDeposits);

// EVERY:
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

// Separate callback:
const deposits1 = (mov) => mov > 0;

console.log(movements.some(deposits1));
console.log(movements.every(deposits1));
console.log(movements.filter(deposits1));

// Flat method:

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

const overAllBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

// Flat map method:

const overAllBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

// String:

const owners = ["Jonas", "Zach", "Adam", "Martha"];
console.log(owners.sort());
console.log(owners);

// Numbers:
//
console.log(movements);

// return<0,A,B (keep order)

// return>0,B,A (switch order)

// Assending:

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

// movements.sort((a, b) => a - b);
// console.log(movements);
// Decending:

// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);

// Empty array+fill method:

console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

// x.fill(1);
x.fill(1, 3, 5);
console.log(x);
const arr23 = [1, 2, 3, 4, 5, 6, 7];
arr23.fill(23, 2, 6);
console.log(arr23);

// Array.from:
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// const movementsUI=Array.from(document.querySelectorAll('.movemenst_value'));

// labelBalance.addEventListener("click", function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value")
//   );
//   console.log(movementsUI.map((el) => el.textContent.replace("€", "")));
// });

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );
  console.log(movementsUI);
});

// Exsecise 1:

// const bankDepositSum = accounts.map((acc) => acc.movements).flat();
// console.log(bankDepositSum);
const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((accu, mov) => accu + mov, 0);
console.log(bankDepositSum);

// Exercise 2:
// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 1000);
// // console.log(numDeposits1000);
// console.log(numDeposits1000.length);

const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);
let a = 10;
console.log(++a);
console.log(a);

// Exercise 3:
const { deposit, withdrawals1 } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      //   cur > 0 ? (sums.deposit += cur) : (sums.withdrawals1 += cur);
      sums[cur > 0 ? "deposit" : "withdrawals1"] += cur;
      return sums;
    },
    { deposit: 0, withdrawals1: 0 }
  );
console.log(deposit, withdrawals1);

// Exercise 4:

// this is a nice title=>This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];
  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
    .join(" ");
  return capitalize(titleCase);
};
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but not too long"));
console.log(convertTitleCase("and here is another title with an EXAMPLE"));

// Coding challenge 4:

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];
// 1
dogs.forEach(
  (dogs) => (dogs.recommandedFood = Math.trunc(dogs.weight * 0.75 * 28))
);
console.log(dogs);

// 2
const dogSarah = dogs.find((dogs) => dogs.owners.includes("Sarah"));
console.log(dogSarah);

console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommandedFood ? "much" : "little"
  }`
);

const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recommandedFood)
  .flatMap((dog) => dog.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recommandedFood)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooLittle);
// const recommandation1 = function (accs) {
//   accs.forEach(function (acc) {
//     acc.recommandedFood = acc.weight * 0.75 * 28;
//   });
// };
// recommandation1(dogs);
// console.log(dogs);

// const sarahDog = function (accs) {
//   accs.forEach(function (acc) {
//     if (acc.owners.find((mov) => "Sarah") && acc.curFood > acc.recommandedFood)
//       console.log("Eating more");
//     if (acc.owners.find((mov) => "Sarah") && acc.curFood < acc.recommandedFood)
//       console.log("Eating less");
//   });
// };
// sarahDog(dogs);

// const arr56 = [1, 2, 3, 4];
// console.log(...arr56);

// "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.join(" and ")} eats too much`);
console.log(`${ownersEatTooLittle.join(" and ")} eats too little`);

console.log(dogs.some((dog) => dog.curFood === dog.recommandedFood));
const checkEatingOkay = (dog) =>
  dog.curFood > dog.recommandedFood * 0.9 &&
  dog.curFood < dog.recommandedFood * 1.1;
console.log(dogs.some(checkEatingOkay));
console.log(dogs.filter(checkEatingOkay));

const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommandedFood - b.recommandedFood);
console.log(dogsCopy);
