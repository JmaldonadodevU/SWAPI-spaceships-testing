// Navigation functions for the app
export const Navigation = {
    // Navigate to a specific page
    navigateToPage(pageId) {
        const pages = document.querySelectorAll('.page');
        
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        document.getElementById(pageId).classList.add('active');
    },

    // Update active state on menu buttons
    updateMenuActiveState(buttons, activeCategory) {
        buttons.forEach(btn => {
            if (btn.dataset.page === activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
};