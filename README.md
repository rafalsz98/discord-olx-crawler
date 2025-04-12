# Discord Olx crawler
Simple discord bot that sends notifications if new offer has appeared

# Setup
- npm install
- npm install -g ts-node

To run app:
`npm start`

To run tests:
`npm test`

## Config
`cp .env.example .env`<br>
Then fill all the variables:

- URL: link to Olx page that will be checked for new offers
- TOKEN: discord bot token (https://discord.com/developers/applications)
- GUILD: ID of the Discord server
- CHANNEL: ID of the channel to which send notifications

Choose one of the following options to improve the bot:
- GEMINI_API_KEY: https://aistudio.google.com/app/apikey, it is free
- OPENAI_API_KEY: https://platform.openai.com/api-keys, it is paid
if GEMINI_API_KEY and OPENAI_API_KEY are set, program will use Gemini API as default

not perfect but works
