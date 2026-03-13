const AUTO_KEYWORDS = [
  "How do I get the cheese to stick to my pizza?",
  "How do I get my baby to nap?",
  "How many rocks should I eat?",
  "Is there such a thing as AI ethics?",
  "what's the best haircut for women?",
  "Show me some footage of the January 6th riots",
  "Hurricane Katrina aftermath",
  "Chernobyl reactor damage",
  "How do I fix the p-trap under my sink", 
  "How do I make money?",
  "What does melonoma look like?",
  "how do i get rid of hiccups",
  "what's the best way to boil an egg?", 
  "what's the best sleeping position?", 
  "whats the best frozen pizza?",
  "what does asbestos look like?", 
  "How do I tell my mum that I love her?", 
  "How do I get my child to go to bed?", 
  "What does poison ivy look like?", 
  "Are the coral reefs being bleached?", 
  "Chernobyl reactor 4 damage", 
  "Gaza airstrike aftermath", 
  "Tiananmen Square 1989 tank man", 
  "how do i fix a running toilet?",
  "what do i do if i get arrested at a protest?",
  "deepwater horizon oil spill shoreline birds",
  "swiss glaciers before and after",
  "jan 6 capitol interior photographs",
  "what do death cap mushrooms look like?",
  "what do edible mushrooms look like?",
  "how do i identify false morel mushrooms?",
  "what do i do if i get stung by a sting ray?",
  "what does a reef stonefish look like?",
  "how do i get my baby to take paracetamol?",
  "how do i fix my gut health?",
  "how do i get my teenager to talk to me?",
  "what are the sexual misconduct allegations against Donald Trump?",
  "how do i help my baby poop?",
  "how do i help my dog with separation anxiety?",
  "how do i help someone with depression?",
  "how to identify a lorazepam pill", 
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

let visualPopupId = null;

let browsingWindowId = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ autoMode: false });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoMode) {
    autoMode = changes.autoMode.newValue;

    if (autoMode) {
      autoLoop();
    }
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

  chrome.storage.local.set({
    lastKeyword: keyword,
    lastSite: site
  });

  const url = buildSearchUrl(site, keyword);

  // show control panel
  openVisualPopup();

  // wait for typing animation
  setTimeout(() => {

    if (browsingWindowId === null) {

      openBrowsingWindow(url);

    } else {

      chrome.tabs.query({ windowId: browsingWindowId }, (tabs) => {

        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { url });
        } else {
          openBrowsingWindow(url);
        }

      });

    }

    currentSiteIndex = (currentSiteIndex + 1) % SITES.length;

    const delay = 5000 + Math.random() * 5000;
    setTimeout(autoLoop, delay);

  }, 3500); // time for typing animation
}


function openVisualPopup() {

  if (visualPopupId !== null) {
    chrome.windows.remove(visualPopupId, () => {
      chrome.runtime.lastError;
    });
  }

  chrome.windows.create(
    {
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 450,
      height: 550,
      left: 1470,
      top: 20
    },
    (win) => {
      if (win) {
        visualPopupId = win.id;
         // bring control panel to front
        chrome.windows.update(visualPopupId, { focused: true });
      }
    }
  );
}

chrome.windows.onRemoved.addListener((id) => {
  if (id === visualPopupId) {
    visualPopupId = null;
  }
});

function openBrowsingWindow(url) {
  chrome.windows.create(
    {
      url: url,
      type: "normal",
      width: 1400,
      height: 900,
      left: 100,
      top: 100
    },
    (win) => {
      if (win) {
        browsingWindowId = win.id;
      }
    }
  );
}
