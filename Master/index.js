// Open this file in terminal and run "node index.js"
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const open = require("open");
const convertFactory = require("electron-html-to");
const api = require("./api");
const generateHTML = require("./generateHTML");

const questions = [
    {
        type: "input",
        name: "github",
        message: "What is your github username?"
    },

    {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ["red", "blue", "green", "pink"]
    }
];

//process.cwd returns the current working directory
function writeToFile(fileName, data) {
    return fs.writeFile(path.join(process.cwd(), fileName), data);
}

function init() {
    inquirer.prompt(questions).then(({ github, color }) => {
        console.log("searching...");
        //re


        api
            .getUser(github)
            .then(response =>
                api.getTotalStars(github).then(stars => {
                    console.log(response.data)
                    return generateHTML({
                        stars,
                        color,
                        ...response.data
                    });
                })
            )
            .then(html => {
                const conversion = convertFactory({
                    converterPath: convertFactory.converters.PDF
                });

                conversion({ html }, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }

                    result.stream.pipe(
                        fs.createWriteStream(path.join(__dirname, "resume.pdf"))
                    );
                    conversion.kill();
                });

                open(path.join(process.cwd(), "resume.pdf"));
            });
    });
}

init();