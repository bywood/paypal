const express = require("express")
const fetch = require("node-fetch");
const { resolve } = require("path")

// const CLIENT_ID = 'AVgzJ5j6adTAjZHTRHCgzKdWXwOxaCcUc9tZWsdNWVe9WwNasAKWHbiuluX8nVBksz0hV9psUMGLQuWW'
const CLIENT_ID = 'alc_client1'
// const APP_SECRET = 'EDpHan08Jsq1bISzlG8jhU4kvYQHS-pdEGYGpxRnJmm5h2dQv046NMMuCGGzpTIpKBOsQP2I48dfbJlw'
const APP_SECRET = 'secret'
const base = "http://localhost.paypal.com:8000";

const app = express()

app.use(express.static(resolve(__dirname, "../client")))

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "../client/index.html"));
});

(async function () {

  async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  }

  app.post("/api/paypal/order/create/", async (req, res) => {
    // res.sendFile(resolve(__dirname, "../client/index.html"));
    // console.log('Request', req)
    // res.json({id: '123456789'})
    // paypalSDK.createOrder(res)
    console.log("Response", res.body)
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "100.00",
            },
          },
        ],
      }),
    });
    const data = await response.json();
    console.log('Data: ', data)
    res.json(data);
  });

})();

app.listen(8080)
