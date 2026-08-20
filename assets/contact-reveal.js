let isVerifying = false;

const revealButton = document.getElementById('reveal-contact-button');
const revealedDetails = document.getElementById('revealed-contact-details');
const turnstileHint = document.getElementById('turnstile-hint');
const turnstileWidget = document.getElementById('turnstile-widget');

async function revealContact(token) {
    try {
        const formData = new FormData();
        formData.append('cf-turnstile-response', token);

        const response = await fetch('https://turnstile-verify.chferrier.workers.dev/verify', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const phoneDigits = String(result.phone || '').replace(/\D/g, '');
            const phoneLabel = phoneDigits.length === 10
                ? `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
                : result.phone;

            const emailLink = document.createElement('a');
            emailLink.className = 'revealed-contact';
            emailLink.href = `mailto:${result.email}`;
            emailLink.textContent = result.email;

            const phoneLink = document.createElement('a');
            phoneLink.className = 'revealed-contact';
            phoneLink.href = `tel:+1${phoneDigits}`;
            phoneLink.textContent = phoneLabel;

            revealedDetails.append('Email: ', emailLink, document.createElement('br'), 'Phone: ', phoneLink);
            revealedDetails.hidden = false;
            revealButton.setAttribute('aria-expanded', 'true');
            revealButton.textContent = 'Hide contact information';
            turnstileHint.textContent = '';
        } else {
            const errorMessage = result.error
                || (Array.isArray(result.errors) ? result.errors.join(', ') : '')
                || 'Something went wrong. Please try again.';
            turnstileHint.textContent = errorMessage;
        }
    } catch {
        turnstileHint.textContent = 'Something went wrong. Please try again.';
    } finally {
        isVerifying = false;
        revealButton.disabled = false;

        if (window.turnstile) {
            window.turnstile.reset(turnstileWidget);
        }
    }
}

window.onTurnstileVerified = (token) => {
    if (isVerifying) {
        revealContact(token);
    }
};

window.onTurnstileExpired = () => {
    if (isVerifying) {
        isVerifying = false;
        revealButton.disabled = false;
        turnstileHint.textContent = 'Verification expired. Please try again.';
    }
};

revealButton.addEventListener('click', () => {
    const isExpanded = revealButton.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        revealButton.setAttribute('aria-expanded', 'false');
        revealButton.textContent = 'Reveal contact information';
        revealedDetails.hidden = true;
        return;
    }

    if (revealedDetails.hasChildNodes()) {
        revealButton.setAttribute('aria-expanded', 'true');
        revealButton.textContent = 'Hide contact information';
        revealedDetails.hidden = false;
        return;
    }

    if (!window.turnstile) {
        turnstileHint.textContent = 'Verification is still loading. Please try again in a moment.';
        return;
    }

    isVerifying = true;
    revealButton.disabled = true;
    turnstileHint.textContent = 'Verifying…';
    window.turnstile.execute(turnstileWidget);
});
