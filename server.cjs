const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 3000;

// 🎬 Render endpoint
app.post("/render", async (req, res) => {
  try {
    const conversation = req.body;
    
    console.log("Received request");
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });
    console.log("Puppeteer Launched");
    const page = await browser.newPage();
    console.log("Before sending request");
    const url = `http://localhost:${PORT}/?data=${encodeURIComponent(
      JSON.stringify(conversation)
    )}&speed=2`;

    await page.goto(url);
    console.log("Request sent to UI");
    await page.waitForFunction(() => window.__CHAT_READY__ === true);

    const recorder = new PuppeteerScreenRecorder(page);
    console.log("Before recording start");
    await recorder.start("./video.mp4");

    await page.waitForFunction(() => window.__CHAT_DONE__ === true, {
      timeout: 60000
    });
    console.log("Recording done");
    await recorder.stop();
    await browser.close();

    res.download("./video.mp4");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering video");
  }
});

app.listen(PORT, () => console.log("Server running on", PORT));
