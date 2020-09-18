var express = require("express");
var router = express.Router();

const Joi = require("joi");
const fs = require("fs");
const ws = require("../wslib");

//Get todos los mensajes
router.get("/chat/api/messages", (req, res) => {
  fs.readFile("messages.json", (err, data) => {
    res.send(JSON.parse(data));
  });
});

//Get de un mensaje con ts dado
router.get("/chat/api/messages/:id", (req, res) => {
  fs.readFile("messages.json", (err, data) => {
    const mens = JSON.parse(data).find(
      (element) => element.ts === parseInt(req.params.id)
    );
    if (!mens)
      return res
        .status(404)
        .send(
          "The message was not found. There is no message with the ts requested"
        );
    res.send(mens);
  });
});

//Post de un nuevo mensaje
router.post("/chat/api/messages", (req, res) => {
  const schema = Joi.object({
    author: Joi.string()
      .pattern(new RegExp("([a-zA-Z]+[ ][a-zA-Z]+)"))
      .required(),
    mensaje: Joi.string().min(5).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send("There is an error within the message");
  }

  const mensaje = {
    author: req.body.author,
    mensaje: req.body.mensaje,
    ts: new Date().getTime(),
  };

  ws.guardarMensajeJson(mensaje);
  ws.sendMessages();
  res.send(mensaje);
});

//Put de un mensaje con el id dado por url
router.put("/chat/api/messages/:id", (req, res) => {
  let messages = fs.readFileSync("messages.json");
  const ms = JSON.parse(messages).find((c) => c.ts === parseInt(req.params.id));
  if (!ms) return res.status(404).send("The message with the ts was not found");

  const schema = Joi.object({
    author: Joi.string()
      .required()
      .pattern(new RegExp("([a-zA-Z]+[ ][a-zA-Z]+)")),
    mensaje: Joi.string().min(5).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("There is an error within the message");
  }

  ms.author = req.body.author;
  ms.mensaje = req.body.mensaje;

  ws.guardarMensajeJson(ms);
  ws.sendMessages();
  res.send(ms);
});

router.delete("/chat/api/messages/:id", (req, res) => {
  let messages = fs.readFileSync("messages.json");
  let ms = JSON.parse(messages).find((e) => e.ts == parseInt(req.params.id));
  if (!ms) return res.status(404).send("The message was not found");

  let arr = JSON.parse(messages);
  const i = arr.indexOf(mensaje);
  arr.splice(i, 1);

  let cadenaJson = "[";
  arr.forEach((mens) => {
    if (cadenaJson.length === 1)
      cadenaJson += `{ "author": "${mens.author}", "message": "${mens.mensaje}" ,"ts": "${mens.ts}"}`;
    else
      cadenaJson += `,{ "author": "${mens.author}", "message": "${mens.mensaje}" ,"ts": "${mens.ts}"}`;
  });
  cadenaJson += "]";

  fs.writeFile("messages.json", cadenaJson, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
  ws.sendMessages();
  res.send(mensaje);
});

express().listen(3000, () => console.log("Escuchando en el puerto 3000"));
express().use(express.json());
module.exports = router;
