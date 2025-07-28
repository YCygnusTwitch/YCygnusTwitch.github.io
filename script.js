const characters = [
  { id: 1, name: "Perro caballo", image: "Perro Caballo.png", chance: 0.01 },
  { id: 2, name: "Anglertuga", image: "Anglertuga.png", chance: 0.10 },
  { id: 3, name: "AnglePrego", image: "AnglePrego.png", chance: 0.25 },
  { id: 4, name: "AnglemarLoLSwain", image: "AnglemarLoLSwain.png", chance: 0.29 },
  { id: 5, name: "Angle", image: "Angle.png", chance: 0.35 }
];

const STORAGE_KEY = "gachaData";

function getUserData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    obtained: {},
    lastRoll: null
  };
}

function saveUserData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function canRoll(lastRoll) {
  if (!lastRoll) return true;
  const last = new Date(lastRoll);
  const now = new Date();
  return now.toDateString() !== last.toDateString();
}

function rollGacha() {
  const roll = Math.random();
  let result = characters[characters.length - 1];
  let cumulative = 0;

  for (let char of characters) {
    cumulative += char.chance;
    if (roll <= cumulative) {
      result = char;
      break;
    }
  }

  const data = getUserData();
  if (data.obtained[result.id]) {
    data.obtained[result.id]++;
  } else {
    data.obtained[result.id] = 1;
  }
  data.lastRoll = new Date().toISOString();
  saveUserData(data);

  document.getElementById("roll-result").textContent =
    `Ten tu chingadera: ${result.name}! (Total: ${data.obtained[result.id]})`;

  updateUI();
}

function updateUI() {
  const data = getUserData();
  const albumDiv = document.getElementById("album");
  albumDiv.innerHTML = "";

  characters.forEach(char => {
    const img = document.createElement("img");
    img.src = char.image;

    if (data.obtained[char.id]) {
      img.title = `${char.name} x${data.obtained[char.id]}`;
    } else {
      img.classList.add("locked");
      img.title = "???";
    }

    albumDiv.appendChild(img);
  });

  const canUserRoll = canRoll(data.lastRoll);
  document.getElementById("roll-btn").disabled = !canUserRoll;
  if (!canUserRoll && !document.getElementById("roll-result").textContent) {
    document.getElementById("roll-result").textContent = "No seas atascado, ya tiraste hoy.";
  }
}

// Run when page loads
updateUI();
