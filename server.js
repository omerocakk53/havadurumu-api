require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const weatherRoutes = require("./src/routes/weatherRoutes");
const {
  fetchAllCities,
  checkAndStart,
} = require("./src/services/weatherFetcher");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/weather", weatherRoutes);

cron.schedule("0 3 * * *", () => {
  console.log("⏰ Günlük güncelleme zamanı geldi!");
  fetchAllCities();
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
  checkAndStart();
});
