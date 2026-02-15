chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "performSearch") {
    autoSearch(msg.keyword);
  }
});

let currentFieldIndex = 0;

function autoSearch(keyword) {
  const searchFields = document.querySelectorAll(".search-field");

  if (!searchFields.length) return;

  const field = searchFields[currentFieldIndex];

  typeLikeHuman(field, keyword);

  currentFieldIndex = (currentFieldIndex + 1) % searchFields.length;
}

async function typeLikeHuman(element, text) {
  element.value = "";

  for (let char of text) {
    element.value += char;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));
  }

  element.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    }),
  );
}
