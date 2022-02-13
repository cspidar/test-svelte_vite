var express = require("express");

var app = express();
var client_id = "Q1hXkCUKxHcveLdSXV1t";
var client_secret = "nQUsCkkc3U";
var query = "번역할 문장을 입력하세요.";
let text;

app.get("/translate", function (req, res) {
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  var request = require("request");
  var options = {
    url: api_url,
    form: { source: "ko", target: "en", text: query },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  text = options;
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      res.end(body);
      // const tr = JSON.parse(res);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});
// console.log(request);
console.log(text);

// app.listen(3000, function () {
//   console.log("http://127.0.0.1:3000/translate app listening on port 3000!");
// });

// {"message":{"@type":"response","@service":"naverservice.nmt.proxy","@version":"1.0.0","result":{"srcLangType":"ko","tarLangType":"en","translatedText":"Enter the sentence you want to translate.","engineType":"N2MT","pivot":null}}}
