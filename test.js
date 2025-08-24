// apple distribution algorithm

function appleDistribution(days) {
  const people = ["1", "2", "3", "4"];
  let transactions = [];

  for (let i = 0; i < days; i++) {
    let dailyTransactions = {};

    for (let j = 0; j < people.length; j++) {
      let receiverIndex = (j + i + 1) % people.length;
      dailyTransactions[people[j]] = people[receiverIndex];
    }

    transactions.push(dailyTransactions);
  }

  return transactions;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleArrayInGroups(array, groupSize) {
  for (let i = 0; i < array.length; i += groupSize) {
    let end = Math.min(i + groupSize - 1, array.length - 1);
    for (let j = end; j > i; j--) {
      let k = i + Math.floor(Math.random() * (j - i + 1));
      [array[j], array[k]] = [array[k], array[j]];
    }
  }
  return array;
}

const transactions = appleDistribution(400);
console.log(shuffleArrayInGroups(transactions, 4));
// function appleDistribution(days) {
//   const people = ["Person1", "Person2", "Person3", "Person4"];
//   let transactions = [];
//   let previousTransactions = {};

//   for (let i = 0; i < days; i++) {
//     let dailyTransactions = {};

//     for (let j = 0; j < people.length; j++) {
//       let receiver;
//       do {
//         receiver = people[Math.floor(Math.random() * people.length)];
//       } while (
//         receiver === people[j] ||
//         receiver === previousTransactions[people[j]]
//       );

//       dailyTransactions[people[j]] = receiver;
//       previousTransactions[people[j]] = receiver;
//     }

//     transactions.push(dailyTransactions);
//   }

//   return transactions;
// }

// const transactions = appleDistribution(400);
// console.log(shuffleArray(transactions));
