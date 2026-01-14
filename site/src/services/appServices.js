import { api } from './api';

export const userService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    list: () => api.get('/user'),
    create: (userData) => api.post('/user', userData),
    update: (id, userData) => api.put(`/user/${id}`, userData),
    getProfiles: () => api.get('/perfil'),
    upload: (file) => api.upload('/upload', file)
};

export const categoryService = {
    list: () => api.get('/categories'),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`)
};

export const signalService = {
    list: () => api.get('/signals'),
    create: (data) => api.post('/signals', data),
    update: (id, data) => api.put(`/signals/${id}`, data),
    delete: (id) => api.delete(`/signals/${id}`),
    upload: (file) => api.upload('/upload', file)
};

export const enterpriseService = {
    list: () => api.get('/enterprise'),
    create: (data) => api.post('/enterprise', data),
    update: (id, data) => api.put(`/enterprise/${id}`, data),
    delete: (id) => api.delete(`/enterprise/${id}`),
    upload: (file) => api.upload('/upload', file)

};

export const historyService = {
    getActions: () => api.get('/history/actions'),
    getLogins: () => api.get('/history/logins')
};

export const permissionService = {
    list: () => api.get('/permissions'),
    create: (data) => api.post('/permissions', data),
    update: (id, data) => api.put(`/permissions/${id}`, data),
    delete: (id) => api.delete(`/permissions/${id}`),

    listUserPermissions: () => api.get('/permissions/user'),
    getUserPermissions: (userId) => api.get(`/user/${userId}/permissions`),
    assignToUser: (data) => api.post('/permissions/user', data),
    updateUserPermission: (id, data) => api.put(`/permissions/user/${id}`, data),
    removeFromUser: (id) => api.delete(`/permissions/user/${id}`)
};

export const dashboardService = {
    getStats: (params) => {
        // Convert params object to query string
        const queryString = params 
            ? '?' + new URLSearchParams(params).toString() 
            : '';
        return api.get(`/dashboard/stats${queryString}`);
    }
};

export const systemService = {
    listBackups: () => api.get('/system/backups'),
    createBackup: () => api.post('/system/backups'), // Creates a new one
    downloadBackupFile: (filename) => api.download(`/system/backups/${filename}`)
};
