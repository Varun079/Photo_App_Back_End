const { GoogleGenAI } = require("@google/genai");

const geminiAi = new GoogleGenAI({
    apiKey: 'AIzaSyCPmwVgFkSzShfVPoYa1yXS5BBjYPwpe7w'
});

module.exports = {geminiAi}