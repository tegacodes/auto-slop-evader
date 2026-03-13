document.addEventListener("DOMContentLoaded", () => {

  const checkbox = document.getElementById("autoMode");

  // Restore auto mode checkbox
  chrome.storage.local.get("autoMode", (data) => {
    if (checkbox) {
      checkbox.checked = data.autoMode || false;
    }
  });

  // Toggle auto browsing
  if (checkbox) {
    checkbox.addEventListener("change", (e) => {
      chrome.storage.local.set({
        autoMode: e.target.checked
      });
    });
  }

  // Load last keyword + site for typing animation
  chrome.storage.local.get(["lastKeyword", "lastSite"], (data) => {

    if (!data.lastKeyword || !data.lastSite) return;

    const input = document.querySelector(
      `.search-input[data-site="${data.lastSite}"]`
    );

    if (!input) return;

    typeLikeHuman(input, data.lastKeyword);

  });

});

function typeLikeHuman(element, text) {

  element.value = "";
  element.focus();

  let i = 0;

  const interval = setInterval(() => {

    element.value += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
    }

  }, 80);
}