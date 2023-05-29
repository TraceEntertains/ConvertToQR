// content_script.js

// Listen for messages from the background script

browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message) {
        // Inject overlay HTML, CSS, and JavaScript dynamically
        const overlayHTMLpath = browser.runtime.getURL("./overlay/overlay.html");
        const overlayCSS = document.createElement("link");
        const overlayJS = await import(browser.runtime.getURL("./overlay/overlay.js"));

        // Create CSS stylesheet using link to file
        overlayCSS.setAttribute("rel", "stylesheet");
        overlayCSS.setAttribute("href", browser.runtime.getURL("./overlay/overlay.css"));
        overlayCSS.id = "qr-overlay-styles"

        // Load HTML from file
        const overlayHTML = await fetch(overlayHTMLpath).then(response => { return response.text(); });

        // Create overlay element
        const overlay = document.createElement("div");
        overlay.id = "qr-overlay";
        overlay.innerHTML = overlayHTML;

        // Append overlay CSS to the head element
        document.head.appendChild(overlayCSS);

        // Append overlay to the document body
        document.body.appendChild(overlay);

        // Execute overlay JS
        overlayJS.default();

        // Disable scrolling on the page
        document.body.style.overflow = "hidden";

        // Create QR code image element
        console.log(message);
        var qrcode = new QRCode(document.getElementById("qr-image"), {
            text: message.text,
            correctLevel: QRCode.CorrectLevel.L
        });

        // Disable scrolling on the page
        document.body.style.overflow = "hidden";
    }
});
