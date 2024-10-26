import api  from "./APIClient.js";
import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';

export default {
    checkSessionStatus: async () => {
        try {
            await api.getCurrentUser();
        } catch(error) {
            document.location = '/'
        }
    },

    getCurrentUser: async () => {
        let response = await HTTPClient.get(API_BASE + '/getCurrentUser');
        return response;
    },

    createUser: async (username, email, password, confirmPassword) => {
        let data = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };
        let response = await HTTPClient.post(API_BASE+'/createAccount', data);
        return response;
    },

    logIn: async (username, password) => {
        let data = {
            username: username,
            password: password
        }
        let response = await HTTPClient.post(API_BASE+'/login', data);
        return response;
    },

    logOut: async () => {
        let response = await HTTPClient.post(API_BASE+'/logout', {});
        return response;
    }
}