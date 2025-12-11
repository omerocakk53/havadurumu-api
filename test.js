require('dotenv').config();
const axios = require('axios');

async function testApi() {
    console.log("------------------------------------------");
    console.log("🧪 KUTU AÇILIŞI TESTİ...");
    
    const options = {
        method: 'GET',
        url: 'https://api.collectapi.com/weather/getWeather',
        params: {
            'lang': 'tr',
            'city': 'ankara'
        },
        headers: {
            'content-type': 'application/json',
            'authorization': 'apikey ' + process.env.COLLECT_API_KEY
        }
    };

    try {
        const response = await axios.request(options);
        
        console.log("✅ SUNUCU CEVABI (Ham Veri):");
        console.log("------------------------------------------");
        // Gelen verinin tamamını, okunaklı şekilde yazdırıyoruz:
        console.log(JSON.stringify(response.data, null, 2)); 
        console.log("------------------------------------------");

    } catch (error) {
        console.log("❌ HATA:", error.message);
        if(error.response) console.log(error.response.data);
    }
}

testApi();