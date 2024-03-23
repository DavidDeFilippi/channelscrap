const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const config = {
  // headless: 'new', // Set to false if you want to open and see the robot in action
  headless: false,
  devtools: false, // Open the devtools panel in a non headless mode
  executablePath: "chromium",
}

const doScrap = async () => {

  const colores = { verde: '\x1b[32m%s\x1b[0m', amarillo: '\x1b[33m%s\x1b[0m', rojo: '\x1b[31m%s\x1b[0m' };
  const browser = await puppeteer.launch(config);

  try {
    const page = await browser.newPage();

    // Add Headers 
    // await page.setExtraHTTPHeaders({
    //   'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    //   'upgrade-insecure-requests': '1',
    //   'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    //   'accept-encoding': 'gzip, deflate, br, zstd',
    //   'accept-language': 'es-419,es-ES;q=0.9,es;q=0.8'
    // });

    const url = 'https://www.tvn.cl/tvchile/envivo';

    console.log(await browser.userAgent());
    // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    console.log(colores.amarillo, `\nIngresando a ${url} \n`);

    await page.setRequestInterception(true);

    let interceptedURL;

    page.on('request', (request) => {
      //https://estaticos.tvn.cl/epg/tvchile/2024/03/23/programacion.json
      if (request.url().includes("https://estaticos.tvn.cl/epg/tvchile/")) {
        interceptedURL = request.url();
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil: 'load', timeout: 120000 });

    console.log(colores.verde, `\nIngreso completado \n`);
    console.log(colores.amarillo, `\nEsperando scrap \n`);

    await new Promise(r => setTimeout(r, 10000));

    // console.log(interceptedURL);

    let json = await getJsonFromUrl(interceptedURL);

    console.log(json);

    // await page.goto(interceptedURL.toString(), { waitUntil: 'load', timeout: 120000 });

    // const n = await page.$("pre");
    // const JSONcontent = await (await n.getProperty('textContent')).jsonValue();

    // console.log(JSONcontent);

    // if (interceptedURL !== undefined) {
    //   fs.writeFileSync("/home/deltafoxtrot/3b9c2ebfbdd5a589c85d0e633c1f6ac8.txt", interceptedURL);
    // }

    console.log(colores.verde, 'Scrap exitoso\n');

  } catch (e) {
    console.log(colores.rojo, 'ERROR:');
    console.log(colores.rojo, e);
  }

  // await browser.close();
}

doScrap();

async function getJsonFromUrl(url) {
  let response;
  let httpGet = await getHttpRespnse(url);
  response = await httpGet;

  return response;
}

function getHttpRespnse(url) {
  if (url.includes('https')) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {

        res.on("end", () => {
          resolve(res);
        });

        res.on('error', (error) => {
          resolve(res);
        });
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        res.on("end", () => {
          resolve(res);
        });
        res.on('error', (error) => {
          resolve(res);
        });
      });
    });
  }
}