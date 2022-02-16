import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
import voca from "voca";
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
srt = readText("./asset/Avengers_Endgame.srt");

//

// 객체 생성
let arr = [];
arr = srt.split("\r\n");
// ["", "", ...]

let rarr = []; // 결과 객체 배열
// example: ["", ""];
// time: "";

let wordObj = {};
// let wordArr = {
//   word: [
//     [time1, ex1_1, ex1_2],
//     [time2, ex2_1, ex2_2],
//   ],
// };

let trObj = {};
// let trObj = {
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
// writeFileSync("./asset/en_example.txt", r, "utf-8");

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
let delWords = [
  "okay",
  "on",
  "don",
  "t",
  "you",
  "see",
  "where",
  "re",
  "going",
  //preposition
  "of",
  "with",
  "at",
  "from",
  "into",
  "during",
  "including",
  "until",
  "against",
  "among",
  "towards",
  "upon",
  "to",
  "in",
  "for",
  "on",
  "by",
  "about",
  "like",
  "over",
  "before",
  "between",
  "after",
  "since",
  "without",
  "under",
  "within",
  "along",
  "plus",
  "except",
  "but",
  "up",
  "out",
  "around",
  "down",
  "off",
  "near",
  // Modal verbs
  "can",
  "could",
  "may",
  "might",
  "shall",
  "should",
  "will",
  "would",
  "must",
  "ought",
  // Auxiliary verbs
  "am",
  "is",
  "are",
  "was",
  "were",
  "being",
  "been",
  "be",
  "has",
  "have",
  "had",
  "having",
  "does",
  "do",
  // personal pronouns
  "did",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "them",
  "us",
  "him",
  "her",
  "his",
  "hers",
  "its",
  "theirs",
  "our",
  "your",
  "mine",
  "yours",
  // relative pronoun
  "who",
  "whom",
  "that",
  "which",
  "whoever",
  "whomever",
  "whichever",
  // conjunctions
  "for",
  "and",
  "nor",
  "but",
  "or",
  "yet",
  "so",
  // q mark
  "what",
  "which",
  "when",
  "where",
  "who",
  "whose",
  "whom",
  "how",
  "why",
  // number
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  // 지시대명사
  "this",
  "these",
  "those",
  "there",
  "here",
  // glitch || easy
  "mm",
  "hmm",
  "now",
  "let",
  "s",
  "get",
  "move",
  "way",
  "yeah",
  "yes",
  "no",
  "sure",
  "all",
  "right",
  "go",
  "stop",
  "hey",
  "the",
  "a",
  "an",
  "sea",
  "sky",
  "some",
  "many",
  "few",
  "much",
  "thank",
  "thanks",
  "tonight",
  "air",
  "night",
  "guys",
  "guy",
  "boy",
  "boys",
  "girl",
  "girls",
  "want",
  "hot",
  "cold",
  "dog",
  "please",
  "plz",
  "got",
  "get",
  "too",
  "good",
  "bad",
  "job",
  "eye",
  "enough",
  "lila",
  "honey",
  "bebe",
  "laura",
  "need",
  "because",
  "just",
  "oh",
  "god",
  "tony",
  "try",
  "again",
  "feel",
  "fun",
  "ve",
  "congratulations",
  "won",
  "thing",
  "miss",
  "if",
  "only",
  "find",
  "gonna",
  "know",
  "ever",
  "even",
  "though",
  "wasn",
  "space",
  "tree",
  "d",
  "say",
  "m",
  "little",
  "better",
  "course",
  "back",
  "love",
  "very",
  "time",
  "dead",
  "years",
  "year",
  "ago",
  "tomorrow",
  "ll",
  "said",
  "more",
  "really",
  "well",
  "then",
  "my",
  "fine",
  "always",
  "couldn",
  "lightning",
  "jerry",
  "mungo",
  "bee",
  "gees",
  "open",
  "mail",
  "box",
  "yourself",
  "myself",
  "meet",
  "life",
  "everybody",
  "everyone",
  "look",
  "stones",
  "ask",
  "long",
  "tell",
  "people",
  "come",
  "bruce",
  "me",
  "new",
  "old",
  "cap",
  "weren",
  "as",
  "wanna",
  "give",
  "not",
  "loki",
  "didn",
  "lot",
];

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

writeFileSync("./asset/tmpText.txt", tmpText, "utf-8");

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
