const puppeteer = require('puppeteer');
const fs = require('fs');

const config = {
  headless: 'new', // Set to false if you want to open and see the robot in action
  // headless: false,
  devtools: false, // Open the devtools panel in a non headless mode
  executablePath: "chromium-browser",
}

const doScrap = async () => {

  const colores = { verde: '\x1b[32m%s\x1b[0m', amarillo: '\x1b[33m%s\x1b[0m', rojo: '\x1b[31m%s\x1b[0m' };
  const browser = await puppeteer.launch(config);

  try {
    const page = await browser.newPage();

    const url = 'https://www.youtube.com/@galeriacima/live';

    console.log(await browser.userAgent());
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    console.log(colores.amarillo, `\nIngresando a ${url} \n`);

    await page.goto(url, { waitUntil: 'load', timeout: 50000 });

    console.log(colores.verde, `\nIngreso completado \n`);
    console.log(colores.amarillo, `\nEsperando scrap \n`);

    await new Promise(r => setTimeout(r, 5000));
    await page.click('#top-level-buttons-computed > ytd-button-renderer > yt-button-shape > button');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('#target');
    await new Promise(r => setTimeout(r, 1000));

    await page.waitForSelector('#mirror');
    let element = await page.$('#mirror');
    let iframe = await page.evaluate(el => el.textContent, element);
    iframe = iframe.toString().replace('width="560"', 'width="100%"').replace('height="315"', 'height="100%"');

    console.log(iframe);

    if (iframe !== undefined || iframe !== '') {

        fs.writeFileSync("/home/deltafoxtrot/plazabaquedano.txt", iframe);
        console.log(colores.verde, 'Scrap exitoso\n');

    }else{
      console.log(colores.verde, 'Algo pasa\n');
    }

  } catch (e) {
    console.log(colores.rojo, 'ERROR:');
    console.log(colores.rojo, e);
  }

  await browser.close();
}

doScrap();

