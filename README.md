# Shop Agent — Render Deployment

Ye poora backend ready hai. Sirf 2 kaam Render pe khud karne honge (ye sirf tumhare account se ho sakta hai):

1. **Render.com pe free signup karo**, "New Web Service" banao, aur ye folder (ya GitHub repo) connect karo.
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment Variable add karo:** `ANTHROPIC_API_KEY` = tumhari Anthropic API key
   (Render dashboard → Environment tab mein)

Deploy hone ke baad tumhe ek live URL milega (jaisa `shop-agent.onrender.com`) — usi ko UptimeRobot mein naya monitor bana ke daal dena, aur client ke WhatsApp/website se link kar dena.

Naye client ke liye: sirf `server.js` mein `SHOP_KNOWLEDGE` array badal do, unki business ki jaankari daal do — baaki code same rahega.
