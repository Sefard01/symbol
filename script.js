const input = document.getElementById("chatInput");
const myNameInput = document.getElementById("myName");
const button = document.getElementById("renderBtn");
const chatContainer = document.getElementById("chatContainer");
const leftUserEl = document.getElementById("leftUser");
const rightUserEl = document.getElementById("rightUser");

button.addEventListener("click", renderChat);

function renderChat() {
  
  chatContainer.innerHTML = "";
  leftUserEl.innerText = "";
  rightUserEl.innerText = "";

  const rawText = input.value;
  const myName = myNameInput.value.trim();

  if (!rawText.trim() || !myName) return;

  const lines = rawText.split("\n");

  const regex =
    /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}\s?(?:am|pm|AM|PM))\s-\s(.*?):\s(.*)$/;

  const messages = [];

  lines.forEach(line => {
    const match = line.match(regex);
    if (!match) return;

    messages.push({
      date: match[1],
      time: match[2],
      sender: match[3],
      text: match[4]
    });
  });

  if (messages.length === 0) return;

  rightUserEl.innerText = myName;

  const otherUser = messages.find(m => m.sender !== myName);
  leftUserEl.innerText = otherUser ? otherUser.sender : "";

  let index = 0;
  let lastDate = null;
  const CHUNK_SIZE = 120;

  function renderChunk() {
    const slice = messages.slice(index, index + CHUNK_SIZE);

    slice.forEach(msg => {

      if (msg.date !== lastDate) {
        const dateDiv = document.createElement("div");
        dateDiv.className = "date-separator";
        dateDiv.innerText = msg.date;
        chatContainer.appendChild(dateDiv);
        lastDate = msg.date;
      }

      const side = msg.sender === myName ? "right" : "left";

      const div = document.createElement("div");
      div.className = `message ${side}`;

      div.innerHTML = `
        <div>${linkify(escapeHTML(msg.text))}</div>
        <div class="time">${msg.time}</div>
      `;

      chatContainer.appendChild(div);
    });

    index += CHUNK_SIZE;

    if (index < messages.length) {
      setTimeout(renderChunk, 40);
    }
  }

  renderChunk();
}

/* Helpers */

function escapeHTML(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, url => {
    const shortUrl =
      url.length > 30 ? url.slice(0, 30) + "..." : url;

    return `<a href="${url}" target="_blank">${shortUrl}</a>`;
  });
}
