# FreeCodeCamp
#### Information Security & Quality Assurance Projects
---

All tests passed. Both client and server working as expected.

#### Try it out!

If you want to try the converter, open [this link on Glitch](https://yagoestevez-stock-price-checker.glitch.me/).

#### Test the app

To test the app, just run ```npm test``` (after ```npm i```, of course).

##### User Stories

1. Set the content security policies to only allow loading of scripts and css from your server.
2. I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
3. In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
4. I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
5. If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference betwwen the likes) on both.
6. A good way to recieve current price is the following external API(replacing 'GOOG' with your stock): https://finance.google.com/finance/info?q=NASDAQ%3aGOOG
7. All 5 functional tests are complete and passing.

##### API Usage
Get GOOG stock price: ```/api/stock-prices?stock=goog```
Get GOOG stock price: ```/api/stock-prices?stock=goog&like=true```
```
/api/stock-prices?stock=goog
/api/stock-prices?stock=goog&like=true
/api/stock-prices?stock=goog&stock=msft
/api/stock-prices?stock=goog&stock=msft&like=true
```



---

[Yago Estévez](https://twitter.com/yagoestevez)





1) SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2) Complete the project in `routes/api.js` or by creating a handler/controller
3) You will add any security features to `server.js`
4) You will create all of the functional tests in `tests/2_functional-tests.js`


