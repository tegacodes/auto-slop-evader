const AUTO_KEYWORDS = [
  "climate change",
  "machine learning",
  "cybernetics",
  "data art",
  "AI ethics",
  "blockchain",
  "neural networks",
];

const SITES = [
  "google",
  "duckduckgo",
  "reddit",
  "quora",
  "stackexchange",
  "pinterest",
  "youtube",
];

let autoMode = false;
let currentSiteIndex = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ autoMode: false });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoMode) {
    autoMode = changes.autoMode.newValue;
    if (autoMode) autoLoop();
  }
});

function getRandomKeyword() {
  return AUTO_KEYWORDS[Math.floor(Math.random() * AUTO_KEYWORDS.length)];
}

function buildSearchUrl(site, query) {
  const encoded = encodeURIComponent(query);

  switch (site) {
    case "google":
      return `https://www.google.com/search?q=${encoded}&tbs=cdr:1,cd_max:11/30/2022`;

    case "duckduckgo":
      return `https://duckduckgo.com/?q=${encoded}&df=1990-01-01..2022-11-30`;

    case "reddit":
      return `https://www.google.com/search?q=site:reddit.com+${encoded}&tbs=cdr:1,cd_max:11/30/2022`;

    case "quora":
      return `https://www.google.com/search?q=site:quora.com+${encoded}&tbs=cdr:1,cd_max:11/30/2022`;

    case "stackexchange":
      return `https://www.google.com/search?q=site:stackexchange.com+${encoded}&tbs=cdr:1,cd_max:11/30/2022`;

    case "pinterest":
      return `https://www.google.com/search?q=site:pinterest.com+${encoded}&tbs=cdr:1,cd_max:11/30/2022`;

    case "youtube":
      return `https://www.google.com/search?q=site:youtube.com+${encoded}&tbs=cdr:1,cd_max:11/30/2022`;
  }
}

function autoLoop() {
  if (!autoMode) return;

  const keyword = getRandomKeyword();
  const site = SITES[currentSiteIndex];

  // Save for popup display
  chrome.storage.local.set({
    lastKeyword: keyword,
    lastSite: site,
  });

  // Open theatrical popup window
  openVisualPopup();

  const url = buildSearchUrl(site, keyword);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { url });
    }
  });
  currentSiteIndex = (currentSiteIndex + 1) % SITES.length;

  setTimeout(autoLoop, 15000);
}

function openVisualPopup() {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 420,
    height: 700,
  });
}

//TO DO
// CONTROL FOR POPUP WINDOW SIZE AND PLACEMENT
//PUT AUTOTYPING THE KEYWORD BACK IN
