const fs = require("fs");
const path = require("path");
const DATA_PATH = path.join(__dirname, "../../data/weather.json");

const getWeatherData = (req, res) => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return res
        .status(503)
        .json({ success: false, message: "Veri henüz oluşmadı." });
    }
    const rawData = fs.readFileSync(DATA_PATH, "utf-8");
    const allData = JSON.parse(rawData);
    const requestedCity = req.params.city;
    if (requestedCity === "all") {
      return res.json({
        success: true,
        source: "file",
        data: allData,
      });
    }
    const cityKey = requestedCity.toLowerCase();
    if (allData[cityKey]) {
      return res.json({
        success: true,
        source: "file",
        data: allData[cityKey],
      });
    } else {
      res.status(404).json({ success: false, message: "Şehir bulunamadı." });
    }
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};

module.exports = { getWeatherData };
