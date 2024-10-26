import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';

export default {


    getScore: async  () => {
        let response = await HTTPClient.get(API_BASE+'/getScore');
        console.log(response);
        return response;
    },
    
    postScore: async  (username, score) => {
        let data = {
            username: username,
            highscore: score
        }
        let response = await HTTPClient.put(API_BASE+'/postScore', data);
        console.log(response);
        return response;
    },

    getLeaderBoard: async (username) => {
        let response = await HTTPClient.get(API_BASE + `/leaderboard/${username}`);
        console.log(response);
        return response;
    },

    getCurrentUser: async  () => {
        let response = await HTTPClient.get(API_BASE + '/getCurrentUser');
        console.log(response);
        return response;
    }
}