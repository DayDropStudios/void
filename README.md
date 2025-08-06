void Discord Bot

An advanced Discord bot for user information retrieval and account tracking.


Features
• `/discord` - Get detailed information about a Discord user including IP address using their user ID
• `/username` - Find accounts across multiple platforms associated with any username
• `/xbox` - Get Xbox account information and gaming statistics


Installation
1. Clone this repository
2. Install dependencies:
```
npm install
```
3. Configure the bot:
- Open `bot.js` and replace the placeholder values in the config object:
  ```javascript
  const config = {
    token: 'YOUR_BOT_TOKEN_HERE', // Replace with your actual bot token
    clientId: 'YOUR_CLIENT_ID_HERE', // Replace with your bot's client ID
    guildId: 'YOUR_GUILD_ID_HERE', // Replace with your server ID for development
  };
  ```


Setting Up Your Discord Bot
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under the "Privileged Gateway Intents" section, enable:
- SERVER MEMBERS INTENT
- MESSAGE CONTENT INTENT
5. Copy the bot token and add it to your config
6. Go to the "OAuth2" tab, then "URL Generator"
7. Select the following scopes:
- `bot`
- `applications.commands`
8. Select the following bot permissions:
- `Send Messages`
- `Embed Links`
- `Read Message History`
- `Use Slash Commands`
9. Copy the generated URL and use it to invite the bot to your server


Running the Bot

npm start


For development with auto-restart on file changes:

npm run dev


Command Usage

Discord User Lookup

/discord userid:123456789012345678


Username Search

/username username:example_user


Xbox Account Lookup

/xbox gamertag:ExampleGamer


Security Notice

This bot provides access to potentially sensitive information. It is designed for educational purposes and authorized use only. Always:

1. Implement proper permission checks before deployment
2. Verify users have appropriate authorization to use commands
3. Follow all applicable laws and regulations regarding data privacy
4. Only use the bot in servers where such functionality is permitted


License

MIT License
