const { App } = require("@slack/bolt");
const connection = require("./connection");
const User = require("./userModel");
const saludos = require("./saludos.json");
const bdias = require("./dbias.json");
require("dotenv").config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

connection.databaseConnection();

app.event("app_mention", async ({ event, say }) => {
  const user = await User.findOne({ slackId: event.user });
  const puntos = user.puntos === 1 ? "punto" : "puntos";
  await say(`Hola <@${user.slackId}>  tienes ${user.puntos} ${puntos}`);
});

app.message("++", async ({ message, say }) => {
  let text = message.text.split(" ");
  let textClean = text[0].replace("<", "");
  textClean = textClean.replace(">", "");
  slackId = textClean.replace("@", "");

  const user = await User.findOne({ slackId: slackId });
  if (user.id === slackId) {
    await say(`Lo siento no te puedes asignar puntos a ti mismo!`);
  } else {
    if (!user) {
      const newUser = new User({ slackId: slackId, puntos: 1 });
      await newUser.save();
    } else {
      await User.findByIdAndUpdate(user.id, { puntos: user.puntos + 1 });
    }

    const userUpdated = await User.findOne({ slackId: slackId });
    const puntos = userUpdated.puntos === 1 ? "punto" : "puntos";
    var saludo = saludos[Math.floor(Math.random() * saludos.length)];
    await say(
      `${saludo} <@${userUpdated.slackId}> ahora tienes ${userUpdated.puntos} ${puntos}!`
    );
  }
});

app.message(
  /^(hi|hello|hey|hola|holi|gm|buenos|dias|días|buenas|morning).*/i,
  async ({ message, say }) => {
    var bdia = bdias[Math.floor(Math.random() * bdias.length)];
    await say(`${bdia} <@${message.user}>`);
  }
);

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
