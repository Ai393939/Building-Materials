const API_BASE = 'https://building-materials-98ep.onrender.com';

function getToken() {
    return localStorage.getItem('accessToken');
}

function setToken(token) {
    localStorage.setItem('accessToken', token);
}

function clearToken() {
    localStorage.removeItem('accessToken');
}

function toQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            search.set(key, String(value));
        }
    });
    const query = search.toString();
    return query ? `?${query}` : '';
}

function toStoreProduct(product) {
    return {
        ...product,
        name: product.title,
        image: Array.isArray(product.images) ? product.images[0] : '',
    };
}

function messageFromError(error) {
    const message = error.data?.message;
    if (Array.isArray(message)) return message[0];
    if (typeof message === 'string') return message;
    return error.message || 'Request failed';
}

function safeNextPage() {
    const next = new URLSearchParams(window.location.search).get('next');
    if (next && /^[a-z0-9.-]+\.html(\?.*)?$/i.test(next)) return next;
    return 'index.html';
}

async function apiRequest(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const text = await response.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (response.status === 401 && token && !path.startsWith('/api/auth/login')) {
        clearToken();
        const page = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}`;
        window.location.href = `login.html?next=${encodeURIComponent(page)}`;
    }

    if (!response.ok) {
        const error = new Error(messageFromError({ data, message: 'Request failed' }));
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

function apiGet(path) {
    return apiRequest(path);
}

function apiSend(path, method, body) {
    return apiRequest(path, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}
