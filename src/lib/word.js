import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
// import fetch from "sync-fetch";
import fetch from "node-fetch";

let text;
const readText = function (path) {
  try {
    return readFileSync(path, "utf-8");
  } catch (e) {
    console.log(e);
  }
};
text = readText("./asset/Avengers_Endgame.srt");

let arr = [];

// while (text.length > 0) {
//   arr.push(text.split("\n"));
// }
arr = text.split("\n");
// arr = arr.filter((t) => t !== "");

console.log(arr);

// let text = readText("./asset/Avengers_Endgame.srt");

// writeFileSync("./asset/text.txt", text, "utf-8");

// appendFileSync("./asset/word.txt", text, "utf-8");

// text 한줄씩, .split("\n") 후 배열로 push

// async function getTitle() {
//   const response = fetch(
//     "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
//   );
//   return response;
// }

// console.log(getTitle());
