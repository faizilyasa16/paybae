import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
<<<<<<< HEAD

// Minimal route helper for React pages
window.route = window.route || function(name, params = {}) {
    const routes = {
        'dashboard.index': '/dashboard',
        'transfer.index': '/transfer',
        'transfer.store': '/transfer',
        'transfer.success': '/transfer/success/{id}',
        'history.index': '/history',
        'scan.index': '/scan',
        'insight.index': '/insight',
        'profile.index': '/profile',
        'topup.index': '/topup',
        'topup.store': '/topup',
    };

    let url = routes[name] ?? '#';

    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });

    return url;
};
=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
