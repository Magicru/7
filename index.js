const express = require('express');
var bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const request = require('request')
const { MongoClient } = require('mongodb');

const app = express();

const port = 8080;

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const setHeaders = (res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain; charset=UTF-8'
    //'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
  });
};

const setHeaders1 = (res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-test,Content-Type,Accept,Access-Control-Allow-Headers',
    'Content-Type': 'text/html',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
  });
};

const setHeaders2 = (res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
'Access-Control-Allow-Headers': 'x-test,Content-Type,Accept,Access-Control-Allow-Headers',
    'Content-Type': 'application/json'
    //'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
  });
};

app.get("/", (_, res) => {
  setHeaders(res);
  res.setHeader('X-Author', "itmo333217")
  res.end("itmo333217");
});

app.use("/result4/", (req, res) => {
  setHeaders2(res);

  console.log(req.body);
  res.end(JSON.stringify({
    "message": "itmo333217",
    "x-result": req.get("x-test"),
    "x-body": req.body
  }));
});

app.get("/login/", (_, res) => {
  setHeaders(res);
  
  res.end("itmo333217");
});

function doRequest(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

app.get("/test/", async (req, res) => {
  setHeaders(res);

  let textHtml = await doRequest(req.query.URL)
  res.end(textHtml.substring(73, 73 + 18));
  // const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});

  // const page = await browser.newPage();
  // await page.goto(URL);
  // await page.waitForSelector('#inp');
  // await page.waitForSelector('#bt');
  // await page.click('#bt');

  // const value = await page.$eval('#inp', el => el.value);

  // browser.close();
  
  // res.end("0.8862481722945399");
});

app.all("/insert/", (req, res) => {
  setHeaders(res);

  const login = req.body.login;
  const password = req.body.password;
  const URL = req.body.URL;

  console.log({login, password, URL})
    
  const client = new MongoClient(URL);
  
client.connect().then(() => {
    const db = client.db('readusers')
  console.log(db.listCollections())
    const collection = db.collection('users');
    collection.insert({ login, password});

  console.log(db);
  console.log(collection);
  
  console.log(2)

  res.end();
}).catch((err) => {console.log(err); res.end()});
});

app.get("wordpress/wp-json/wp/v2/posts/1", (req, res) => {
    setHeaders2(res);
    res.end(`{"title": {"rendered": "itmo333217"}}`);
});

app.get("/wordpress/", (req, res) => {
    setHeaders2(res);
    res.end(`{"title": {"rendered": "itmo333217"}}`);
});

app.all("/render/", (req, res) => {
  setHeaders1(res);

  console.log(req.body)
  try {
   const {random2, random3} = req.body; 
     res.end(`<!DOCTYPE html> <html lang="en"> <head> <title></title> </head> <body> <h1>openedu</h1> <h2>${random2}</h2>
    <h3>${random3}</h3> </body> </html>`);
  } catch(err) {
    console.log(err);
    res.end('ok');
  }
});

app.get("/sample/", (req, res) => {
    const func = 'function task(x) {return x * this * this;}';
  
    setHeaders(res);
    res.end(func);
});

app.get("/promise/", (_, res) => {
  const func = `function task(x) { return new Promise((resolve, reject) => (x < 18) ? resolve('yes') : reject('no')); }`;
  
  setHeaders(res);
          
  res.end(func);
});

app.get("/fetch/", (_, res) => {
  const page = `<html><body><script> async function func() {const url = document.getElementById("inp").value;const response = await fetch(url);document.getElementById("inp").value = await response.text();}</script><input id="inp"/><button id="bt" onclick="func()"></button></body></html>`;
  
  setHeaders1(res);
          
  res.end(page);
});

app.listen(port, () => console.log(`Server running: ${port}`));