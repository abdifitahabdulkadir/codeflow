const fromUser = ["React", "JS", "TS"];
const fromDatabase = ["React", "TS"];

const addedTags = fromUser.filter(
  (eachAdded) =>
    !fromDatabase.some(
      (eachOne) => eachOne.toLowerCase() === eachAdded.toLowerCase(),
    ),
);
console.log(addedTags);
