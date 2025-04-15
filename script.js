let allFalsehoods = [];

async function loadFacts() {
  const response = await fetch('falsehoods2.0.txt');
  const text = await response.text();
  allFalsehoods = text.split('\n').map(line => line.trim()).filter(Boolean);
}

function generateFact() {
  const input = document.getElementById('topicInput').value.trim();
  let result = "";

  if (allFalsehoods.length === 0) {
    alert("Facts are still loading. Try again shortly.");
    return;
  }

  if (input) {
    const topicFacts = allFalsehoods.filter(f => f.includes('[TOPIC]'));
    if (topicFacts.length > 0) {
      const chosen = topicFacts[Math.floor(Math.random() * topicFacts.length)];
      result = chosen.replace(/\[TOPIC\]/gi, input);
    } else {
      result = `No facts found for topic: ${input}`;
    }
  } else {
    const noTopicFacts = allFalsehoods.filter(f => !f.includes('[TOPIC]'));
    result = noTopicFacts[Math.floor(Math.random() * noTopicFacts.length)];
  }

  document.getElementById('factDisplay').textContent = result;

  // Save to recent
  let recent = JSON.parse(localStorage.getItem("recentFalsehoods") || "[]");
  if (!recent.includes(result)) {
    recent.unshift(result);
    if (recent.length > 50) recent.pop();
    localStorage.setItem("recentFalsehoods", JSON.stringify(recent));
  }
}

function toggleMenu() {
  document.getElementById('menu').classList.toggle('hidden');
}

function loadFactsToProfile() {
  const recent = JSON.parse(localStorage.getItem("recentFalsehoods") || "[]");
  const favorites = JSON.parse(localStorage.getItem("favoriteFalsehoods") || "[]");

  const recentList = document.getElementById("recentList");
  const favoriteList = document.getElementById("favoriteList");

  // Load recent
  recentList.innerHTML = "";
  recent.forEach(fact => {
    const li = document.createElement("li");
    li.textContent = fact;

    const star = document.createElement("span");
    star.innerHTML = "★";
    star.className = "star";
    if (favorites.includes(fact)) star.classList.add("favorited");

    star.onclick = () => {
      if (!favorites.includes(fact)) {
        favorites.unshift(fact);
      } else {
        const index = favorites.indexOf(fact);
        if (index > -1) favorites.splice(index, 1);
      }
      localStorage.setItem("favoriteFalsehoods", JSON.stringify(favorites));
      loadFactsToProfile();
    };

    li.appendChild(star);
    recentList.appendChild(li);
  });

  // Load favorites
  favoriteList.innerHTML = "";
  favorites.forEach(fact => {
    const li = document.createElement("li");
    li.textContent = fact;
    favoriteList.appendChild(li);
  });
}

// Automatically run functions depending on which page is loaded
window.onload = () => {
  if (document.getElementById('topicInput')) {
    loadFacts();
  }

  if (document.getElementById('recentList') && document.getElementById('favoriteList')) {
    loadFactsToProfile();
  }
};