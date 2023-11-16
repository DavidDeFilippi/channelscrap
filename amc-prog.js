const puppeteer = require('puppeteer');
const fs = require('fs');

const config = {
  // headless: 'new', // Set to false if you want to open and see the robot in action
  headless: false,
  devtools: false, // Open the devtools panel in a non headless mode
  // executablePath: "chromium-browser",
}

const doScrap = async () => {

  const colores = { verde: '\x1b[32m%s\x1b[0m', amarillo: '\x1b[33m%s\x1b[0m', rojo: '\x1b[31m%s\x1b[0m' };
  const browser = await puppeteer.launch(config);

  try {
    const page = await browser.newPage();

    await page.setGeolocation({ latitude: 26, longitude: -80.3 });

    // const url = 'https://maps.google.com';
    const url = 'https://therokuchannel.roku.com';

    console.log(await browser.userAgent());
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/85.0.4182.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    // await new Promise(r => setTimeout(r, 5000));

    // const programas = await page.$$eval(
    //   ".pelicula > div > div > span, td.pelicula > div > div > a > span, .caricatura > div > div > span, .caricatura > div > div > a > span",
    //   els => els.map(e => e.textContent)
    // );

    // if (programas.length > 0) {
    //   programas.shift();
    // }

    // const horarios = await page.$$eval(
    //   "table.tbl_EPG > tbody > tr > td:nth-child(1) > div > time",
    //   els => els.map(e => e.textContent)
    // );

    // if (horarios.length > 0) {
    //   horarios.shift();
    // }

    // let programacion = [];

    // for (let i = 0; i < programas.length; i++) {
    //   let d = new Date();
    //   const horaSplit = horarios[i].split(':');
    //   d.setHours(Number(horaSplit[0]));
    //   d.setMinutes(Number(horaSplit[1]));
    //   d.setSeconds(0);
    //   // d = addHours(d, -1);

    //   // let n = new Date();
    //   // n.setDate(n.getDate() + 1);
    //   // n.setHours(0);
    //   // n.setMinutes(0);
    //   // n.setSeconds(0);

    //   // if (d.getHours() >= n.getHours()) {
    //   //   n.setHours(6);
    //   //   if (d.getHours() < n.getHours()) {
    //   //     d.setDate(d.getDate() +1);
    //   //   }
    //   // }

    //   programacion.push({id: 'goldenplus', programa: programas[i].replace(/(\r\n|\n|\r|\t)/gm,""), hora: d, updated: new Date().getTime()});
    // }

    // console.log(programacion);

    // const jsonData = JSON.stringify(programacion);

    // fs.writeFileSync("/home/deltafoxtrot/"+"goldenplus.json", jsonData);

    console.log(colores.verde, 'Scrap exitoso\n');

  } catch (e) {
    console.log(colores.rojo, 'ERROR:');
    console.log(colores.rojo, e);
  }

  // await browser.close();
}

doScrap();

function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}