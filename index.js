const { App } = require('@slack/bolt');
const mongoose = require("mongoose");
const User = require("./userModel");

require('dotenv').config()

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken:process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});
//Database connection Mongo
mongoose.Promise = global.Promise;
const databaseConnection = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ssl: true
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      // we will not be here...
      console.error("App starting error:", err.stack);
      process.exit(1);
    });
};

databaseConnection();

app.event('app_mention', async ({ event, say }) => {
    const user = await User.findOne({slackId:event.user})
    const puntos = user.puntos === 1 ? "punto" : "puntos"
    await say(`Hola <@${user.slackId}>  tienes ${user.puntos} ${puntos}`);
});

app.message('++', async ({ message, say }) => {
  const saludos = ["Excelente","Excelso", "Maravilloro", "Supremo", "Fantástico", "Soberbio", "Muy bien", "Felicidades",
   "Muy buen trabajo", "Lo haces de maravilla", "Woow", "You are on fire", "Es neta?", "Alv", "No macayu", "A la bestia", "Orale!",
    "Ostia tio!", "Lo esta haciendo muy bien", "Naaaa te creo", "You got it!", "¡Felicidades!", "Encantador", "Exquisito", "Bien jugado", "Bravo :clap:"]

    let text =  message.text.split(" ");
    let textClean = text[0].replace("<", '')
    textClean =  textClean.replace(">", '')
    slackId =  textClean.replace("@", '')
    
    const user = await User.findOne({slackId:slackId})
    if(!user){
      const newUser = new User({slackId:slackId, puntos: 1})
      await newUser.save();
      console.log("usuario guardado")
      //console.log(user)
    }else{
      await User.findByIdAndUpdate(user.id,{ puntos: user.puntos+1})
      //console.log(user)
      console.log("usuario actualizado")
    }

    const userUpdated = await User.findOne({slackId:slackId})
    const puntos = userUpdated.puntos === 1 ? "punto" : "puntos"
    var saludo = saludos[Math.floor(Math.random()*saludos.length)];
    await say(`${saludo} <@${userUpdated.slackId}> ahora tienes ${userUpdated.puntos} ${puntos}!`);
});

app.message(/^(hi|hello|hey|hola|holi|gm|buenos|dias|días|buenas|morning).*/i, async ({ message, say }) => {
    // RegExp matches are inside of context.matches
    const saludos = ["Muy buenos días!", "Orale madrugaste :sunny:",
    "Aun no es hora o si?", "Creo que me quede dormido", "No manches ya es bien tarde",
    "Que horas son estas... :clock9:", "GM!", "lo bueno es que ya casi es viernes xD",
    "Serán buenos despues de un café", "Huy si el madrugador :yawning_face:", "Si bueno quien tiene hambre",
    "Creo que volvere a dormir :sleeping:", "Ufff que madrugador", "Ya estuvo?", ]
    var saludo = saludos[Math.floor(Math.random()*saludos.length)];
    await say(`${saludo} <@${message.user}>`);
  });

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();