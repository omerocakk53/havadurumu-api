const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cities = require("../config/cities");
const { sleep } = require("../utils/helper");
const weatherData = require("../../data/weather.json");

const DATA_PATH = path.join(__dirname, "../../data/weather.json");

const fetchAllCities = async () => {
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    process.stdout.write(`[${i + 1}/${cities.length}] ${city}... `);

    const options = {
      method: "GET",
      url: "https://api.collectapi.com/weather/getWeather",
      params: {
        lang: "tr",
        city: city,
      },
      headers: {
        "content-type": "application/json",
        authorization: "apikey " + process.env.COLLECT_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      if (Array.isArray(response.data) && response.data.length > 0) {
        allData[city] = response.data;
        fs.writeFileSync(DATA_PATH, JSON.stringify(allData));
        console.log(`✅`);
      } else {
        console.log(`BOŞ GELDİ.`);
      }
      sleep(1000);
    } catch (error) {
      console.log(`HATA.`);

      if (error.response && error.response.status === 429) {
        console.log("Çok hızlandık! API dur dedi. 30 saniye soğutuluyor...");
        await sleep(30000);
      } else {
        await sleep(2000);
      }
    }
  }
  console.log(`\nTÜM EKSİKLER TAMAMLANDI!`);
};

const checkAndStart = async () => {
  const rawData = fs.readFileSync(DATA_PATH, "utf-8");
  const allData = JSON.parse(rawData);

  if (!fs.existsSync(DATA_PATH) || !allData) {
    console.log("Veri dosyası oluşturuluyor...");
    fetchAllCities();
  } else if (allData) {
    console.log("Veriler kontrol ediliyor...");
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      const options = {
        method: "GET",
        url: "https://api.collectapi.com/weather/getWeather",
        params: {
          lang: "tr",
          city: city,
        },
        headers: {
          "content-type": "application/json",
          authorization: "apikey " + process.env.COLLECT_API_KEY,
        },
      };
      if (!allData[city]) {
        try {
          const response = await axios.request(options);
          if (Array.isArray(response.data) && response.data.length > 0) {
            allData[city] = response.data;
            fs.writeFileSync(DATA_PATH, JSON.stringify(allData));
          }
          console.log(`[${i + 1}/${cities.length}] ${city}... ✅`);
          await sleep(1200);
        } catch (e) {
          console.log(e);
          if (e.response && e.response.status === 429) {
            console.log(
              "Çok hızlandık! API dur dedi. 30 saniye soğutuluyor..."
            );
            await sleep(30000);
          }
        }
      }
    }
    console.log(`\nTÜM EKSİKLER TAMAMLANDI!`);
  }
};

module.exports = { fetchAllCities, checkAndStart };
