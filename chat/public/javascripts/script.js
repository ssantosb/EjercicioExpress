const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const author = document.getElementById("author");
  const message = document.getElementById("message");
  const time = new Date().getTime();
  ws.send(author.value + "-" + message.value + "-" + time);
  message.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
