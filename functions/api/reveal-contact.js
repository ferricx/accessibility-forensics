const CONTACT_DETAILS = {
    email: { label: 'cferrier@accessibilityforensics.com', href: 'mailto:cferrier@accessibilityforensics.com' },
    phone: { label: '720-260-4848', href: 'tel:+17202604848' },
};

function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    let payload;
    try {
        payload = await request.json();
    } catch {
        return jsonResponse(400, { ok: false, error: 'Invalid request body.' });
    }

    const turnstileToken = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';

    if (!turnstileToken) {
        return jsonResponse(400, { ok: false, error: 'Please complete the verification challenge.' });
    }

    let verificationResult;
    try {
        const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: env.TURNSTILE_SECRET_KEY,
                response: turnstileToken,
                remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
            }),
        });
        verificationResult = await verification.json();
    } catch {
        return jsonResponse(502, { ok: false, error: 'Verification service unavailable. Please try again.' });
    }

    if (!verificationResult.success) {
        return jsonResponse(400, { ok: false, error: 'Verification failed. Please try again.' });
    }

    return jsonResponse(200, { ok: true, contact: CONTACT_DETAILS });
}

export async function onRequestGet() {
    return new Response('Method Not Allowed', { status: 405 });
}
