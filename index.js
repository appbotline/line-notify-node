var express = require("express");
const puppeteer = require('puppeteer');
const request = require('request');
var app = express(); //
var messageLine = "";
app.set('port', (process.env.PORT || 80));
app.get("/", (req, res) => {
    // server จะสามารถส่งทั้ง header ต่างๆหรือจะตัวหนังสือ json อะไรก็ได้กลับไป
    //res.send("Hello World");   
    var id = req.query.id;
    callAPI();


    async function callAPI () {
        (async () => {
            var browser = await puppeteer.launch();
            //var q = querystring.parse('year=2017&month=february');
            page = await browser.newPage();
            //await page.goto('https://glacial-spire-22413.herokuapp.com/write.php', { waitUntil: 'load' });
            await page.goto('https://www.jetsadabet.com/login', { waitUntil: 'load' });

            var newPage = await page.evaluate(() => {
                window.saveValue = document.body
                var listHTML = [];
                var findTable = document.querySelectorAll("th");
                listHTML = genArray();
                return listHTML;

                async function genArray () {
                    var data = [];
                    var round = "จับยี่กี รอบที่";
                    var three = "รอผล";
                    var two = "รอผล";
                    for (var i = 0; i < findTable.length; i++) {
                        if (findTable[i].innerHTML.includes("จับยี่กี รอบที่")) {
                            round = findTable[i].innerHTML.trim();
                            three = findTable[i].nextSibling.nextElementSibling.innerText.trim();
                            two = findTable[i].nextSibling.nextSibling.nextElementSibling.innerText.trim();
                            // retData = { round: round, three: three, two: two };
                            await data.push({id : round , value : round + "\r\n===============\r\n => 3 ตัว : " + three + " \r\n => 2 ตัว : " + two + "\r\n===============\r\n"});
                        }
                        if (findTable[i].innerHTML.includes("จับยี่กี VIP รอบที่")) {
                            round = findTable[i].innerHTML.trim();
                            three = findTable[i].nextSibling.nextElementSibling.innerText.trim();
                            two = findTable[i].nextSibling.nextSibling.nextElementSibling.innerText.trim();
                            // retData = { round: round, three: three, two: two };
                            await data.push({id : round , value : round + "\r\n===============\r\n => 3 ตัว : " + three + " \r\n => 2 ตัว : " + two + "\r\n===============\r\n"});
                        }
                    }
                    return await data;
                }
            });

            //console.log(newPage);
            messageLine = await genHTML(newPage);
            messageLine += await genHTML2(newPage);
            //console.log(messageLine);
            notifyLine(messageLine);
        })();
    }

    async function genHTML (array) {
        var round = "จับยี่กี รอบที่ " + id;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id.trim() == round.trim()) {
                return array[i].value;
            }
        }
    }
    async function genHTML2 (array) {
        var round = "จับยี่กี VIP รอบที่ " + id;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id.trim() == round.trim()) {
                return array[i].value;
            }
        }
    }
    function notifyLine (message) {
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
                message: message, //ข้อความที่จะส่ง
            },
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err)
            } else {
                console.log(body)
            }
        })
    }

    res.send("API");

});

// server จะรันที่ port 3000 หรือ port ใดๆก็ตามใจเราและ callback จะทำงานเมื่อ
app.listen(80, () => {
    console.log('Server Listen At 80')
});