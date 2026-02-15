document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("autoMode");

  chrome.storage.local.get("autoMode", (data) => {
    checkbox.checked = data.autoMode || false;
  });

  checkbox.addEventListener("change", (e) => {
    chrome.storage.local.set({
      autoMode: e.target.checked,
    });
  });
});
