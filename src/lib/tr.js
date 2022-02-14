import request from "request";

const client_id = "Q1hXkCUKxHcveLdSXV1t";
const client_secret = "nQUsCkkc3U";

let query = "번역할 문장을 입력하세요.";

let result;
let arr = [];

let options = {
  url: "https://openapi.naver.com/v1/papago/n2mt",
  method: "POST",
  headers: {
    "X-Naver-Client-Id": "Q1hXkCUKxHcveLdSXV1t",
    "X-Naver-Client-Secret": "nQUsCkkc3U",
  },
  form: { source: "ko", target: "en", text: query },
  // json: true,
};

async function aa() {
  request
    .post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body);
      } else {
        console.log("error = " + response.statusCode, error);
      }
    })
    .on("data", (d) => {
      result += d;
    })
    .on("end", () => {
      // data is now ready
      // console.log(result);
      // arr.push(result);
    });
}
aa().then(console.log(arr));

//sync request
//https://www.npmjs.com/package/sync-request
//https://stackoverflow.com/questions/41437291/how-to-add-parameters-in-nodejs-sync-request
