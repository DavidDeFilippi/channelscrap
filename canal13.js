const puppeteer = require('puppeteer');
const fs = require('fs');

const config = {
  headless: 'new', // Set to false if you want to open and see the robot in action
  // headless: false,
  devtools: false, // Open the devtools panel in a non headless mode
  executablePath: "chromium",
}

const doScrap = async () => {

  const colores = { verde: '\x1b[32m%s\x1b[0m', amarillo: '\x1b[33m%s\x1b[0m', rojo: '\x1b[31m%s\x1b[0m' };
  const browser = await puppeteer.launch(config);

  try {
    const page = await browser.newPage();

    const url = 'https://www.13.cl/en-vivo';

    console.log(await browser.userAgent());
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/85.0.4182.0 Safari/537.36');

    await page.goto('https://us-central1-canal-13-stream-api.cloudfunctions.net/media/token', { waitUntil: 'load', timeout: 120000 });

    const n = await page.$("pre");
    let token = await (await n.getProperty('textContent')).jsonValue();
    token = JSON.parse(token);

    console.log(token.data.authToken);

    if (token !== undefined) {
      const urlFinal = 'https://origin.dpsgo.com/ssai/event/bFL1IVq9RNGlWQaqgiFuNw/master.m3u8?auth-token=' + token.data.authToken;

      console.log('\n');
      console.log(urlFinal);

      fs.writeFileSync("/home/deltafoxtrot/flytvtools/2d769b8820669674c9551a46fdfe2515.txt", urlFinal);
    }

    console.log(colores.verde, 'Scrap exitoso\n');

  } catch (e) {
    console.log(colores.rojo, 'ERROR:');
    console.log(colores.rojo, e);
  }

  await browser.close();
}

doScrap();

