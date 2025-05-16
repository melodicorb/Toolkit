// Ultimate Student Toolkit - Google AdSense Integration

/**
 * This file handles the initialization and placement of Google AdSense ads
 * throughout the Ultimate Student Toolkit website.
 */

// Initialize AdSense when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create and insert ad containers at strategic locations
    insertAdContainers();
});

/**
 * Creates and inserts ad containers at predefined locations in the page
 */
function insertAdContainers() {
    // Only proceed if we're not in a local development environment
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        // Insert sidebar ad if we're on a tool page
        if (document.querySelector('.tool-container')) {
            insertSidebarAd();
        }
        
        // Insert footer ad on all pages
        insertFooterAd();
        
        // Insert between-tools ad on the home page
        if (document.getElementById('tools') && document.querySelectorAll('#tools .grid > div').length > 0) {
            insertBetweenToolsAd();
        }
    }
}

/**
 * Inserts an ad in the sidebar of tool pages
 */
function insertSidebarAd() {
    const toolContainer = document.querySelector('.tool-container');
    if (!toolContainer) return;
    
    // Create ad container
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container sidebar-ad bg-white p-4 rounded-xl shadow-lg mb-8 text-center';
    adContainer.innerHTML = `
        <div class="text-sm text-gray-500 mb-2">Sponsored</div>
        <div class="ad-slot" id="sidebar-ad">
            <!-- AdSense code will be inserted here by Google's script -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    `;
    
    // Insert after the first element in the tool container
    const firstElement = toolContainer.children[0];
    if (firstElement && firstElement.nextSibling) {
        toolContainer.insertBefore(adContainer, firstElement.nextSibling);
    } else {
        toolContainer.appendChild(adContainer);
    }
}

/**
 * Inserts an ad at the footer of all pages
 */
function insertFooterAd() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Create ad container
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container footer-ad container mx-auto px-4 py-6 text-center';
    adContainer.innerHTML = `
        <div class="text-sm text-gray-500 mb-2">Sponsored</div>
        <div class="ad-slot" id="footer-ad">
            <!-- AdSense code will be inserted here by Google's script -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    `;
    
    // Insert before the footer
    footer.parentNode.insertBefore(adContainer, footer);
}

/**
 * Inserts an ad between tools on the home page
 */
function insertBetweenToolsAd() {
    const toolsGrid = document.querySelector('#tools .grid');
    if (!toolsGrid) return;
    
    const toolCards = toolsGrid.querySelectorAll(':scope > div');
    if (toolCards.length < 6) return; // Only insert if we have enough tools
    
    // Create ad container styled like a tool card
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container tools-ad bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-md overflow-hidden';
    adContainer.innerHTML = `
        <div class="p-6 text-center">
            <div class="text-sm text-gray-500 mb-2">Sponsored</div>
            <div class="ad-slot" id="tools-ad">
                <!-- AdSense code will be inserted here by Google's script -->
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="XXXXXXXXXX"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
    `;
    
    // Insert after the 6th tool card
    if (toolCards.length >= 6) {
        toolsGrid.insertBefore(adContainer, toolCards[6]);
    }
}