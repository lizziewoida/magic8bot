
require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const responses = [
  // Positive
  "It is certain.", "It is decidedly so.", "Without a doubt.",
  "Yes, definitely.", "You may rely on it.", "As I see it, yes.",
  "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
  // Neutral
  "Reply hazy, try again.", "Ask again later.",
  "Better not tell you now.", "Cannot predict now.",
  "Concentrate and ask again.",
  // Negative
  "Don't count on it.", "My reply is no.",
  "My sources say no.", "Outlook not so good.", "Very doubtful.",
];

app.command('/8ball', async ({ command, ack, respond }) => {
  await ack(); // Must acknowledge within 3 seconds

  const question = command.text.trim();

  if (!question) {
    await respond({
      response_type: 'ephemeral', // Only visible to the user
      text: '🎱 Please ask me a question! Usage: `/8ball Will this deploy work?`',
    });
    return;
  }

  const answer = responses[Math.floor(Math.random() * responses.length)];

  await respond({
    response_type: 'in_channel', // Visible to the whole channel
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Q: ${question}*`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🎱 *${answer}*`,
        },
      },
    ],
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`⚡️ Magic 8 Ball is running on port ${process.env.PORT}`);
})();
