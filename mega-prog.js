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

    const url = 'https://tvdaldia.cl/cartelera-tv/mega/';

    console.log(await browser.userAgent());
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/85.0.4182.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'load', timeout: 50000 });

    await new Promise(r => setTimeout(r, 5000));

    const programas = await page.$$eval(
      "#programacion-hoy > div > div.ecm-table-cell.image-holder-cell > div.ecm-live-title-holder > span.ecm-live-title",
      els => els.map(e => e.textContent)
    );

    const horarios = await page.$$eval(
      "#programacion-hoy > div > div.ecm-table-cell.image-holder-cell > div.ecm-live-title-holder > span.ecm-live-time",
      els => els.map(e => e.textContent)
    );


    let programacion = [];

    for (let i = 0; i < programas.length; i++) {
      let d = new Date();
      const horaSplit = horarios[i].split(':');
      d.setHours(Number(horaSplit[0]));
      d.setMinutes(Number(horaSplit[1]));
      d.setSeconds(0);
      
      let n = new Date();
      n.setDate(n.getDate() + 1);
      n.setHours(0);
      n.setMinutes(0);
      n.setSeconds(0);

      if (d.getHours() >= n.getHours()) {
        n.setHours(4);
        if (d.getHours() < n.getHours()) {
          d.setDate(d.getDate() +1);
        }
      }

      programacion.push({id: 'mega', programa: programas[i], hora: d, updated: new Date().getTime()});
    }

    const jsonData = JSON.stringify(programacion);

    fs.writeFileSync("/home/deltafoxtrot/"+"pelota9.json", jsonData);

    console.log(colores.verde, 'Scrap exitoso\n');

  } catch (e) {
    console.log(colores.rojo, 'ERROR:');
    console.log(colores.rojo, e);
  }

  await browser.close();
}

doScrap();

function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}