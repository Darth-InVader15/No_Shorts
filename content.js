function removeShorts() {
    // 1. Remove Shorts Shelf from Home Feed
    const shortsShelves = document.querySelectorAll('ytd-rich-section-renderer');
    shortsShelves.forEach(shelf => {
        // structural check to confirm it's a shorts shelf
        if (shelf.querySelector('ytd-rich-shelf-renderer[is-shorts]')) {
            shelf.style.display = 'none'; // secondary hide mechanism
            shelf.remove(); // Remove from DOM
        }
    });

    // 2. Remove Sidebar/Navigation "Shorts" Button
    // We use more generic selectors looking for the text or href to be robust
    const buttons = document.querySelectorAll('a[href^="/shorts"], ytd-guide-entry-renderer a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
    buttons.forEach(btn => {
        // find the container to remove to avoid empty gaps
        const container = btn.closest('ytd-guide-entry-renderer') || btn.closest('ytd-mini-guide-entry-renderer');
        if (container) {
            container.style.display = 'none';
        }
    });
}

// 3. Redirect if user lands on a Shorts URL explicitly
if (window.location.pathname.startsWith('/shorts/')) {
    window.location.replace('https://www.youtube.com/');
}

// Initial cleanup
removeShorts();

// Observer to handle dynamic loading (YouTube is a SPA)
const observer = new MutationObserver((mutations) => {
    // Throttling could be added here if performance is an issue, 
    // but lightweight DOM checks are usually fine.
    removeShorts();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also check on URL changes since it's a SPA
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        if (location.pathname.startsWith('/shorts/')) {
            window.location.replace('https://www.youtube.com/');
        }
        // Re-run cleanup on navigation
        setTimeout(removeShorts, 500);
    }
}).observe(document, { subtree: true, childList: true });
