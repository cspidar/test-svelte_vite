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

let rarr = []; // 결과 객체 배열

let rtext = ""; // 결과 문자열

for (let i = 0; i < arr.length; i++) {
  let word = {};
  let example = [];
  if (arr[i].includes("-->")) {
    word.time = arr[i].replace("-->", "-").replaceAll(/,.../g, "");
    // rtext += arr[i].replace("-->", "-").replaceAll(/,.../g, ""); // 텍스트 파일 생성
    rtext += "\r\n"; // 텍스트 파일 생성
    i++;

    let tmp = "";
    while (arr[i] !== "") {
      if (arr[i].includes("- ")) {
        example.push(arr[i].replace("- ", ""));
        rtext += arr[i].replace("- ", ""); // 텍스트
        rtext += "\r\n"; // 텍스트
        i++;
      } else {
        tmp += `${arr[i]} `;
        i++;
      }
    }
    if (tmp !== "") {
      example.push(tmp);
      rtext += tmp; // 텍스트
      rtext += "\r\n"; // 텍스트
      tmp = "";
    }

    word.example = example;
    rarr.push(word);
    word = {};
  }
}

//

let r = "";
for (let line of rarr) {
  // r += line.time;
  // r += "\r\n";

  r += line.example[0];
  if (line.example[1] !== undefined) {
    r += "\r\n";
    r += line.example[1];
  }
  r += "\r\n\r\n";
}

writeFileSync("./asset/en_example.txt", r, "utf-8");

// console.log(rarr[55].example);

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
