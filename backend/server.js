require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Weather backend is working!");
});

app.get("/weather", async (req, res) => {
    const city = req.query.city;

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);

        console.log(response.data);

        res.json(response.data);

    } catch (error) {
        console.log(error.response?.data || error.message);

        res.status(500).json({
            message: "Unable to get weather data"
        });
    }
});


app.get("/forecast", async (req, res) => {
    const city = req.query.city;

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);

        console.log(response.data);

        res.json(response.data);

    } catch (error) {
        console.log(error.response?.data || error.message);

        res.status(500).json({
            message: "Unable to get forecast data"
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});