const express = require("express");
const app = express();

const clientes = [
  { id: 1, name: "Jorge" },
  { id: 2, name: "Claudia" },
  { id: 3, name: "Jose" },
];

app.get("/api/clients", (req, res) => {
  res.send(clientes);
});

app.get("/api/clients/:id", (req, res) => {
  const cliente = clientes.find((c) => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).send("The client was not found");
  res.send(cliente);
});

app.post("/api/clients", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
  }
  console.log(valid.error);
  const client = {
    id: clientes.length + 1,
    name: req.body.name,
  };
  clientes.push(client);
  res.send(client);
});

app.put("/api/clients/:id", (req, res) => {
  const cliente = clientes.find((c) => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).send("The client was not found");

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  cliente.name = req.body.name;
  res.send(client);
});

app.delete("/api/clients/:id", (req, res) => {});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
