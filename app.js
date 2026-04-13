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

app.event('app_mention', async ({ event, say }) => {
  // Strip the @mention to get just the question
  const question = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();

  if (!question) {
    await say({
      thread_ts: event.ts,
      text: "🎱 Ask me a question! e.g. *@magic8bot Will this deploy work?*",
    });
    return;
  }

  const answer = responses[Math.floor(Math.random() * responses.length)];

  await say({
    thread_ts: event.ts, // replies in thread to keep channels tidy
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Q: ${question}*` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `🎱 *${answer}*` },
      },
    ],
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Magic 8 Ball bot is running!');
})();
