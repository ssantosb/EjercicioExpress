const WebSocket = require("ws");
const fs = require("fs");

const clients = [];
const mensajesJson = [];
const messages = [];

let guardarMensajesJson = () => {
  let mensTemp = [];

  mensajesJson.forEach((element) => {
    mensTemp.push(element);
  });

  fs.readFileSync("messages.json", (err, data) => {
    let texto = data.toString();
    let mensGuardados = JSON.parse(texto);

    if (mensGuardados.length > 0) {
      for (let i = 0; i < mensGuardados; i++) {
        let mens = {
          author: mensGuardados[i].author,
          mensaje: mensGuardados[i].mensaje,
          ts: mensGuardados[i].ts,
        };
        mensTemp.push(mens);
      }
    }
  });

  fs.writeFileSync("messages.json", JSON.stringify(mensTemp), (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
};

function guardarMensajeJson(paramMensaje) {
  let mensTemp = [];

  mensajesJson.forEach((element) => {
    mensTemp.push(element);
  });

  fs.readFileSync("messages.json", (err, data) => {
    let texto = data.toString();
    let mensGuardados = JSON.parse(texto);

    if (mensGuardados.length > 0) {
      for (let i = 0; i < mensGuardados; i++) {
        let mens = {
          author: mensGuardados[i].author,
          mensaje: mensGuardados[i].mensaje,
          ts: mensGuardados[i].ts,
        };
        mensTemp.push(mens);
      }
    }
  });

  mensTemp.push(paramMensaje);
  messages.push(paramMensaje.mensaje);

  fs.writeFileSync("messages.json", JSON.stringify(mensTemp), (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
}

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      let ar = message.split("-");
      let mensajeJs = { author: ar[0], mensaje: ar[1], ts: ar[2] };
      mensajesJson.push(mensajeJs);
      messages.push(message);
      guardarMensajesJson();
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => {
      client.send(JSON.stringify(messages));
    });
  };
};

exports.wsConnection = wsConnection;
