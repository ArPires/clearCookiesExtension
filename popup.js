const clearButton = document.getElementById("clearAndRefresh");

clearButton.addEventListener("click", async () => {
    const tabInfo = {
        "active": true,
        "currentWindow": true
    }
    
    await chrome.tabs.query(tabInfo, (tab) => {
        const currentURL = tab[0].url;
        const origin = currentURL.match(/^[\w-]+:\/{2,}\[?[\w\.:-]+\]?(?::[0-9]*)?/)[0];
        const details = {
            "url": origin
        }
        chrome.cookies.getAll(details, (cookies) => {
            for(cookie of cookies) {
                let cookieDetails = {
                    "url": origin,
                    "name": cookie.name
                }
                chrome.cookies.remove(cookieDetails)
            }
            chrome.tabs.executeScript({
                code: "localStorage.clear()"
            });

            chrome.tabs.reload();

            window.close();
        });
    });
});