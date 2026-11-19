const form = document.getElementById('authForm');
const errorEl = document.getElementById('authError');

if (getToken()) {
    window.location.href = safeNextPage();
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
        const result = await apiSend('/api/auth/login', 'POST', { email, password });
        setToken(result.accessToken);
        window.location.href = safeNextPage();
    } catch (error) {
        errorEl.textContent = messageFromError(error);
    }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
    errorEl.textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
        await apiSend('/api/auth/register', 'POST', { email, password });
        const result = await apiSend('/api/auth/login', 'POST', { email, password });
        setToken(result.accessToken);
        window.location.href = safeNextPage();
    } catch (error) {
        errorEl.textContent = messageFromError(error);
    }
});
