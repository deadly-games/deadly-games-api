// simple express app

const express = require("express");
const app = express();
const fetch = require("node-fetch");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
const API_ADDRESS = "https://api.ethplorer.io";
const CONTRACT_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const REFRESH_INTERVAL = 10_000;
const PORT = 3000;

let latestData = [];
async function getTopTokenHolders() {
  let data = await fetch(
    `${API_ADDRESS}/getTopTokenHolders/${CONTRACT_ADDRESS}?apiKey=${API_KEY}`
  );
  // check if request successfull
  if (data.status !== 200) {
    return console.log(`Error: ${data.status}`);
  }
  let json = await data.json();
  if (!json.holders) return;
  latestData = json.holders;
  for (const balanceData of latestData) {
    balanceData.balance = balanceData.balance / 1e18;
    balanceData.balance = Math.round(balanceData.balance);
    if (balanceData.balance > 999999) {
      balanceData.balance = balanceData.balance / 1e5;
      balanceData.balance = Math.round(balanceData.balance);
      balanceData.balance = balanceData.balance / 10;
      balanceData.balance = `${balanceData.balance}M`;
    }
  }

  setTimeout(getTopTokenHolders, REFRESH_INTERVAL);
}
getTopTokenHolders();

app.get("/", (req, res) => {
  res.json(latestData);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
