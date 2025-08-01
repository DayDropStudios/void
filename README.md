Void IP Logger - Netlify Solution

This is an enhanced version of the Void IP Logger that uses Netlify Functions (serverless) instead of GitHub repositories for tracking. This approach is more efficient, scalable, and doesn't require creating multiple repositories.


Features
• **Serverless Architecture**: Uses Netlify Functions for IP logging and tracking
• **Discord Integration**: Sends notifications to Discord webhooks
• **Enhanced IP Information**: Uses ipinfo.io for detailed IP data
• **Sleek UI**: Clean, lowercase design with Inter Bold font
• **No GitHub Repository Spam**: Single deployment handles all tracking links


How It Works
1. When a user creates a tracking link, the system generates a URL with encoded parameters
2. When someone clicks the tracking link, they're directed to a Netlify Function
3. The function collects visitor information (IP, location, device, etc.)
4. The function sends this information to the specified Discord webhook
5. The visitor is redirected to the destination URL


Setup Instructions

1. Deploy to Netlify

The easiest way to deploy this project is directly through Netlify:

1. Fork or clone this repository
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Set the build command to `npm run build`
6. Set the publish directory to `public`
7. Click "Deploy site"


2. Manual Setup

If you prefer to set up manually:

1. Install dependencies:
```bash
npm install
```

2. Test locally:
```bash
netlify dev
```

3. Deploy to Netlify:
```bash
netlify deploy --prod
```


Using the IP Logger
1. Go to your deployed Netlify site
2. Enter a destination URL (where visitors will be redirected)
3. Optionally customize the tracking link path
4. Add your Discord webhook URL to receive notifications
5. Click "create tracking link" to generate your tracking link
6. Share the generated link with your target


Discord Bot Integration

This solution works seamlessly with the enhanced Discord bot. The bot provides additional commands for IP lookup, username lookup, email lookup, and more.


To set up the Discord bot:

1. Follow the instructions in the Discord bot setup guide
2. Use the enhanced Discord bot code for more features


Technical Details

Netlify Function

The core of this solution is the `track.js` Netlify Function, which:

1. Extracts parameters from the URL
2. Gets visitor information (IP, user agent, etc.)
3. Fetches detailed IP information from ipinfo.io
4. Sends the data to a Discord webhook
5. Redirects the visitor to the destination URL


Security Considerations
• All sensitive parameters (destination URL, webhook URL) are base64 encoded
• The function runs server-side, avoiding CORS issues with Discord webhooks
• No GitHub token is required, reducing security risks


Customization

You can customize this solution by:

1. Modifying the UI in `public/index.html` and `public/styles.css`
2. Enhancing the tracking function in `functions/track.js`
3. Adding additional Netlify Functions for more features


Legal Notice

This tool is for educational purposes only. Always use responsibly and ethically, and in compliance with all applicable laws and regulations.
