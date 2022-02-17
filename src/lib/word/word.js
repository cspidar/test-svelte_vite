import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
import voca from "voca";
import { delWords } from "./delWords.js";
// import fetch from "sync-fetch";
import fetch from "node-fetch";

// 텍스트 생성용 임시 객체
let tmpText = "";

// 텍스트 로드
let srt;
const readText = function (path) {
  try {
    return readFileSync(path, "utf-8");
  } catch (e) {
    console.log(e);
  }
};
srt = readText("../asset/Avengers_Endgame.srt");

//

// 객체 생성
let arr = [];
arr = srt.split("\r\n");
// ["", "", ...]

let rarr = []; // 결과 객체 배열
// example: ["", ""];
// time: "";

let trarr = []; // 번역 결과 포함 객체 배열
// let trarr = [
//   {
//     en: ["", ""],
//     ko: ["", ""],
//     time: "",
//   },
// ];

let wordObj = {}; // 단어별 시간, 예문 정리
// let wordObj = {
//   word: [
//     [time1, ex1_1, ex1_2],
//     [time2, ex2_1, ex2_2],
//   ],
// };
// Tobe
// let wordObj = {
//   word: {
//     en: [
//       [time1, ex1_1, ex1_2],
//       [time2, ex2_1, ex2_2],
//     ],
//     ko: [
//       [time1, ex1_1, ex1_2],
//       [time2, ex2_1, ex2_2],
//     ],
//   },
// };

//

// rarr
for (let i = 0; i < arr.length; i++) {
  let word = {};
  let example = [];
  if (arr[i].includes("-->")) {
    word.time = arr[i].replace("-->", "-").replaceAll(/,.../g, "");
    i++;

    let tmp = "";
    while (arr[i] !== "") {
      if (arr[i].includes("- ")) {
        example.push(arr[i].replace("- ", ""));
        i++;
      } else {
        tmp += `${arr[i]} `;
        i++;
      }
    }
    if (tmp !== "") {
      example.push(tmp);
      tmp = "";
    }

    word.example = example;
    rarr.push(word);
    word = {};
  }
}

//

// rarr 출력
// let r = "";
// for (let line of rarr) {
//   r += line.time;
//   r += "\r\n";

//   r += line.example[0];
//   if (line.example[1] !== undefined) {
//     r += "\r\n";
//     r += line.example[1];
//   }
//   r += "\r\n\r\n";
// }
// writeFileSync("./en_example.txt", r, "utf-8");

//

// wordObj
for (let raw of rarr) {
  let rawWords = voca.words(voca.lowerCase(raw.example[0]));
  if (raw.example[1]) {
    let others = voca.words(voca.lowerCase(raw.example[1]));
    rawWords = [...rawWords, ...others];
  }
  let tmp = new Set(rawWords); // 중복 제거
  let uniqueWords = [...tmp];

  for (let word of uniqueWords) {
    if (!wordObj[word]) wordObj[word] = [];
    let wordExample = [raw.time, raw.example[0]];
    if (raw.example[1] !== undefined) {
      wordExample = [...wordExample, raw.example[1]];
    }
    wordObj[word].push(wordExample);
  }
}

for (let word in wordObj) {
  if (!isNaN(Number(word))) delete wordObj[word];
  if (word.length === 1) delete wordObj[word];
  // if (Object.keys(wordObj[word]).length > 9) delete wordObj[word];

  for (let delWord of delWords) {
    delete wordObj[delWord];
  }
}
// console.log(wordObj["long"]);

// wordObj 출력
for (let obj in wordObj) {
  tmpText += `${obj}\r\n`;
  for (let example of wordObj[obj]) {
    tmpText += `${example[1]}\r\n`;
    if (example[2]) tmpText += `${example[2]}\r\n`;
  }
  tmpText += `\r\n`;
}

writeFileSync("./tmpText.txt", tmpText, "utf-8");

//

//

// console.log(rtext);

// arr = arr.filter((t) => t !== "");

// writeFileSync("./en.txt", rtext, "utf-8");

// let text = readText("./Avengers_Endgame.srt");

// appendFileSync("./word.txt", text, "utf-8");

// text 한줄씩, .split("\n") 후 배열로 push

// async function getTitle() {
//   const response = fetch(
//     "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
//   );
//   return response;
// }

// console.log(getTitle());
