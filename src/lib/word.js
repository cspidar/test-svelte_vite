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
arr = text.split("\r\n");

let rarr = [];

let tempText = "";

for (let i = 0; i < arr.length; i++) {
  let word = {};
  let example = [];
  if (arr[i].includes("-->")) {
    word.time = arr[i].replace("-->", "-").replaceAll(/,.../g, "");
    // tempText += arr[i].replace("-->", "-").replaceAll(/,.../g, ""); // 텍스트 파일 생성
    // tempText += "\r\n"; // 텍스트 파일 생성
    i++;
    while (arr[i] !== "") {
      example.push(arr[i]);
      tempText += arr[i] += "\r\n"; // 텍스트
      i++;
    }
    word.example = example;
    tempText += "\r\n"; // 텍스트
    rarr.push(word);
    word = {};
  }
}

// console.log(tempText);

// arr = arr.filter((t) => t !== "");

// writeFileSync("./asset/en.txt", tempText, "utf-8");

// let text = readText("./asset/Avengers_Endgame.srt");

// appendFileSync("./asset/word.txt", text, "utf-8");

// text 한줄씩, .split("\n") 후 배열로 push

// async function getTitle() {
//   const response = fetch(
//     "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
//   );
//   return response;
// }

// console.log(getTitle());
