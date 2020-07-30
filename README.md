# puppeteer-study

A simple wrapper to get Ibov and stocks using puppeteer and infomoney.com.br.

```javascript
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
```
