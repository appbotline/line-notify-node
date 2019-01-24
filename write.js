const puppeteer = require('puppeteer');
const request = require('request');
const http = require('http');
const port=process.env.PORT || 80
const server = http.createServer((req, res) => {
  
  (async () => {
    const browser = await puppeteer.launch();
    console.log("xxxxxxxxxxx");
    //var q = querystring.parse('year=2017&month=february');
    page = await browser.newPage();
    //await page.goto('https://glacial-spire-22413.herokuapp.com/write.php', { waitUntil: 'load' });
    await page.goto('https://www.jetsadabet.com/login', { waitUntil: 'load' });
  
    const newPage = await page.evaluate(() => {
        window.saveValue = document.body       
        var retData = "";
  
        var findTable = document.querySelectorAll("th");
        retData = test();
        return retData;
        //return document.body.innerHTML;//document.getElementById("wrapper").innerHTML;
  
        async function test () {
            var data = "";
            var round = "จับยี่กี รอบที่ 3";
            var three = "รอผล";
            var two = "รอผล";
            for (var i = 0; i < findTable.length; i++) {
                if (findTable[i].innerHTML.trim() == round.trim()) {
                    three = findTable[i].nextSibling.nextElementSibling.innerText.trim();
                    two = findTable[i].nextSibling.nextSibling.nextElementSibling.innerText.trim();
                    // retData = { round: round, three: three, two: two };
                    data = await round + " \r\n 3 ตัว : " + three + " \r\n 2 ตัว : " + two;
                    return data;
                }
            }       
        }
    });
  
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          bearer: 'O76bVtZeMQjCKAgGlmfT7hR43fZs9UAmyA1oNsgU2d6', //token
        },
        form: {
          message: newPage, //ข้อความที่จะส่ง
        },
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err)
        } else {
          console.log(body)
        }
      })
  
  })();


res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<script></script>');

});
server.listen(port,() => {
console.log(`Server running at port `+port);
});
//const url = require('url')
//const querystring = require('querystring');
