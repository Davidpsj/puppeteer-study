const puppeteer = require('puppeteer');
const url = 'https://www.infomoney.com.br/cotacoes/ibovespa/historico/';

function delay(time) {
  return new Promise(function(resolve){
    setTimeout(resolve, time);
  });
}

const getIbov = async (pupp, url, DEBUG, showBrowser) => {
  const browser = await pupp.launch({
    headless: showBrowser === true ? false : true, 
  });

  let result = [];
  try { 
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await page.goto(url);
    DEBUG && console.log(`Nav to '${url}'...`);
    DEBUG && console.log(`Wainting form input#dateMin...`);
    await page.waitFor('input#dateMin');
    DEBUG && console.log(`Wainting for input#dateMax`);
    await page.waitFor('input#dateMax');
    
    DEBUG && console.log(`cat inputs...`)
    await page.$('input#dateMin');    
    await page.$('input#dateMax');
    
    DEBUG && console.log(`Typing data in #dateMin...`);
    await page.type('input#dateMin', '18/04/2020');
    await page.keyboard.press("Tab");
    DEBUG && console.log(`Tab pressed...`)
    DEBUG && console.log(`Typing data in #dateMax...`);
    await page.type('input#dateMax', '29/07/2020');
    await page.keyboard.press("Tab");
    DEBUG && console.log(`Tab pressed...`)
    
    // await page.focus();
    let timeoutPopup;

    try {
      DEBUG && console.log(`Waiting for popup appears...`);
      timeoutPopup = await page.waitFor('button[title=Close]', { timeout: 3000});
      if(timeoutPopup) await page.click('button[title=Close]');
    } catch(e) {
      DEBUG && console.log('3s timeout popup, skipping popup click...');
    }
    
    // DEBUG && console.log(`1s delay...`);
    // await delay(1000);

    await page.on('response', async r => {
      const urlRequest = 'https://www.infomoney.com.br/wp-admin/admin-ajax.php';
      if (r.url() == urlRequest) {
        DEBUG && console.log(`Wait for response from '${urlRequest}'`)
          
        result = await r.json();
        // DEBUG && console.log(result);
        
        result = result.map(i => ({
          Data: i[0].display,
          Abertura: i[1],
          Fechamento: i[2],
          Variacao: i[3],
          Minimo: i[4],
          Maximo: i[5],
          Volume: i[6],
        }));

        // DEBUG && console.log(result);
        return result;
      }
    });
  
    await page.waitForSelector('#see_all_quotes_history');
    await page.click('#see_all_quotes_history');
    
    await page.waitForResponse('https://www.infomoney.com.br/wp-admin/admin-ajax.php');
    
        
    // await page.click('button.dt-button.buttons-csv.buttons-html5');

    await delay(500);

    return result;

  } catch (e) {
    DEBUG && console.error(e);
  } finally {
    await browser.close();
  }
}

const getBySymbol = async (symbol, pupp, url, DEBUG, showBrowser) => {
  const browser = await pupp.launch({
    headless: showBrowser === true ? false : true, 
  });

  let result = [];
  try { 
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await page.goto(url);
    DEBUG && console.log(`Nav to '${url}'...`);
    
    DEBUG && console.log(`Waiting for 'span.select2-selection__placeholder'...`);
    await page.waitForSelector('span.select2.select2-container');
    DEBUG && console.log(`Clicking on 'span.select2.select2-container'...`);
    await page.click('span.select2.select2-container');
    
    DEBUG && console.log(`Waiting to input 'input.select2-search__field[type=search][role=textbox]'...`);
    await page.waitForSelector('input.select2-search__field[type=search][role=textbox]');
    DEBUG && console.log(`Typing symbol ${symbol} on input 'input.select2-search__field[type=search][role=textbox]'...`);
    await page.type('input.select2-search__field[type=search][role=textbox]', symbol);

    const res = await page.waitForResponse('https://www.infomoney.com.br/wp-admin/admin-ajax.php');
    const stocks = await res.json();

    const historyStock = stocks.find(stock => /.*?([A-Z]{4,5}[0-9]{1,2})$/g.test(stock.text));

    DEBUG && console.log('historyStock', historyStock);

    const urlStock = `${historyStock.link}historico`;
    DEBUG && console.log('urlStock', urlStock);

    await page.goto(urlStock);

    try {
      DEBUG && console.log(`Waiting for popup appears...`);
      timeoutPopup = await page.waitFor('button[title=Close]', { timeout: 3000});
      if(timeoutPopup) await page.click('button[title=Close]');
    } catch(e) {
      DEBUG && console.log('3s timeout popup, skipping popup click...');
    }

    DEBUG && console.log(`Wainting form input#dateMin...`);
    await page.waitFor('input#dateMin');
    DEBUG && console.log(`Wainting for input#dateMax`);
    await page.waitFor('input#dateMax');
    
    DEBUG && console.log(`cat inputs...`)
    await page.$('input#dateMin');    
    await page.$('input#dateMax');
    
    DEBUG && console.log(`Typing data in #dateMin...`);
    await page.type('input#dateMin', '18/04/2020');
    await page.keyboard.press("Tab");
    DEBUG && console.log(`Tab pressed...`)
    DEBUG && console.log(`Typing data in #dateMax...`);
    await page.type('input#dateMax', '29/07/2020');
    await page.keyboard.press("Tab");
    DEBUG && console.log(`Tab pressed...`)
    
    let timeoutPopup;

    try {
      DEBUG && console.log(`Waiting for popup appears...`);
      timeoutPopup = await page.waitFor('button[title=Close]', { timeout: 3000});
      if(timeoutPopup) await page.click('button[title=Close]');
    } catch(e) {
      DEBUG && console.log('3s timeout popup, skipping popup click...');
    }
    
    // await delay(1000);

    await page.on('response', async r => {
      const urlRequest = 'https://www.infomoney.com.br/wp-admin/admin-ajax.php';
      if (r.url() == urlRequest) {
        DEBUG && console.log(`Wait for response from '${urlRequest}'`)
          
        result = await r.json();
        // DEBUG && console.log(result);
        
        result = result.map(i => ({
          Data: i[0].display,
          Abertura: i[1],
          Fechamento: i[2],
          Variacao: i[3],
          Minimo: i[4],
          Maximo: i[5],
          Volume: i[6],
        }));

        // DEBUG && console.log(result);
        return result;
      }
    });
  
    await page.waitForSelector('#see_all_quotes_history');
    await page.click('#see_all_quotes_history');
    
    await page.waitForResponse('https://www.infomoney.com.br/wp-admin/admin-ajax.php');

    await delay(500);

    return result;

  } catch (e) {
    DEBUG && console.error(e);
  } finally {
    await browser.close();
  }
}

const symbols = ['MGLU3', 'LINX3', 'ELET6', 'VLID3', 'OIBR3', 'BRKM3', 'CMIG3'];

symbols.forEach(async s => {
  try {
    console.log(`Getting '${s}'...`);
    const r = await getBySymbol(s, puppeteer, url, false, false);
    console.log(s, r && Array.isArray(r) && r.length !== 0 ? r[0]: 'Erro');
  } catch (e) {
    console.log(e);
  }
});

getIbov(puppeteer, url, false, false).then(r => {
  console.log(`Getting 'IBOV'...`);
  console.log('IBOV', r && Array.isArray(r) && r.length !== 0 ? r[0]: 'Erro');
}).catch(e => console.error(e));
