import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    // Open Modal
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                
                // If this is an edit button, populate the form
                if (button.hasAttribute('data-record')) {
                    const record = JSON.parse(button.getAttribute('data-record'));
                    const form = modal.querySelector('form');
                    
                    // Update form action if there's a dynamic URL
                    if (button.hasAttribute('data-action-url')) {
                        form.action = button.getAttribute('data-action-url');
                    }
                    
                    // Populate inputs
                    for (const key in record) {
                        if (key === 'user' && record[key]) {
                            const emailInput = form.querySelector('[name="email"]');
                            if (emailInput) emailInput.value = record[key].email || '';
                            continue;
                        }
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input) {
                            input.value = record[key];
                        }
                    }
                }
            }
        });
    });

    // Close Modal
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.closest('.modal-overlay').classList.remove('active');
        });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
});
