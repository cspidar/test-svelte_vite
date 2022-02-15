import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
import voca from "voca";
// import fetch from "sync-fetch";
import fetch from "node-fetch";

//

// 텍스트 로드
let text;
const readText = function (path) {
  try {
    return readFileSync(path, "utf-8");
  } catch (e) {
    console.log(e);
  }
};
text = readText("./asset/Avengers_Endgame.srt");

//

// 객체 생성
let arr = [];
arr = text.split("\r\n");
// ["", "", ...]

let rarr = []; // 결과 객체 배열
// example: ["", ""];
// time: "";

let wordArr = {};
// let wordArr = {
//   'word': [[time1, ex1_1, ex1_2], [time2, ex2_1, ex2_2]]
// };

let trArr = [];
// word: a;
// example: ["", ""];
// exampleMean: ["", ""]; // papago
// time: "";

//

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

// example 텍스트 파일
// let r = "";
// for (let line of rarr) {
//   // r += line.time;
//   // r += "\r\n";

//   r += line.example[0];
//   if (line.example[1] !== undefined) {
//     r += "\r\n";
//     r += line.example[1];
//   }
//   r += "\r\n\r\n";
// }
// writeFileSync("./asset/en_example.txt", r, "utf-8");

// console.log(voca.words(rarr[312].example));

for (let line of rarr) {
  let tmpWords = voca.words(line.example[0]);
  if (line.example[1] !== undefined) {
    tmpWords = [...tmpWords, ...voca.words(line.example[1])];
  }
  let tmp = {};
  for (let word of tmpWords) {
    tmp.word = word;
    tmp.example = [];
    tmp.example = [...line.example, line.example[0]];
    if (line.example[1] !== undefined) {
      tmp.example = [...line.example, line.example[1]];
    }
    tmp.time = line.time;
    wordArr.push(tmp);
    tmp = {};
  }
}

// console.log(rarr);
console.log(wordArr);

//

//

// console.log(rtext);

// arr = arr.filter((t) => t !== "");

// writeFileSync("./asset/en.txt", rtext, "utf-8");

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
