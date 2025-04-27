const express = require('express');

const app = express();

app.use((req, res) => {
    res.send("Hi there!, Prachi here");
});

app.listen('5000', () => {
    console.log("Hello from server")
});