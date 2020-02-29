const axios = require("axios");
require("dotenv").config();
//dotenv loads environment variables from a .env file to process.env

const api = {
    getUser(username) {
        return axios
            .get(
                `https://api.github.com/users/${username}?client_id=${
                process.env.CLIENT_ID
                }&client_secret=${process.env.CLIENT_SECRET}`
            )
            .catch(err => {
                console.log(`User not found`);
                //Node will end the process synchronously if no user is found
                process.exit(1);
            });
    },
    getTotalStars(username) {
        return axios
            .get(
                `https://api.github.com/users/${username}/repos?client_id=${
                process.env.CLIENT_ID
                }&client_secret= ${process.env.CLIENT_SECRET}&per_page=100`
            )
            //.reduce reduces the stars array down to just one value: the total number of repo stars
            .then(response => {
                //After getting the user response, count their repo stars. 
                return response.data.reduce((acc, curr) => {
                    acc += curr.stargazers_count;
                    return acc;
                }, 0);
            });
    }
};

module.exports = api;