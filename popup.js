const clearButton = document.getElementById("clearAndRefresh");

clearButton.addEventListener("click", async () => {
    const tabInfo = {
        "active": true,
        "currentWindow": true
    }

    await chrome.tabs.query(tabInfo, (tab) => {

        const currentURL = tab[0].url;                                                  // current tab url

        chrome.tabs.executeScript({
            code: 'performance.getEntriesByType("resource").map(e => e.name)',          // fetch info about the navigation performance
        }, data => {                                                                    // in this case, the property "name" has URLs that this page utilizes
            if (chrome.runtime.lastError || !data || !data[0]) return;                  // Error case

            const urls = data[0].map(url => url.split(/[#?]/)[0]);                      // get url without hash
            urls.push(currentURL);                                                        

            const domains = urls.reduce((result, url) => {                              // filter http & https urls
                let match = url.match(/^[\w-]+:\/{2,}\[?[\w\.:-]+\]?(?::[0-9]*)?/);     // only origin
                if(match != null) {
                    result.push(match[0]);
                }
                return result;
            }, []);
            const uniqueUrls = [...new Set(domains).values()].filter(Boolean);          // filter to get unique origins
            uniqueUrls.push(origin);                                                    // push current tab origin to array

            chrome.browsingData.remove({                                                // remove all cookies and localStorage related to the origins
                "origins": uniqueUrls
              }, {
                "cookies": true,
                "localStorage": true
            });

            chrome.tabs.reload();                                                       // reload page
    
            window.close();                                                             // close popup
        });
    });
});