const daysMap = { "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7 }
const UUID_ADDON = "b4312342-a6c0-4fff-aa09-1974877b7933";
var indexer = 0;

class ResultDialog extends HTMLDialogElement {
    constructor(result, record) {
        super();
        this.sentiment = result;
        this.record = record;

        this.open = true;
        this.style = "text-align: center; border: 0px; border-radius: 15px; background-color: #d8dee9; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; top: 0; right: 0;";
    }

    connectedCallback() {
        this.innerHTML = `<p style="font-family: Arial; margin: auto; margin-bottom: 10px;">Result: <strong style="font-family: inherit;">${this.sentiment}</strong></p>`;

        const correctButton = document.createElement("button");
        correctButton.style = "margin-right: 20px; border: 0px; border-radius: 5px; cursor: pointer; background-color: #a3be8c; color: #2e3440;";
        correctButton.textContent = "Correct";
        correctButton.addEventListener('click', () => {
            document.querySelector('dialog').removeAttribute('open');

            this.remove();
            this.parentElement.remove();
        });

        const incorrectButton = document.createElement("button");
        incorrectButton.style = "border: 0px; border-radius: 5px; cursor: pointer; background-color: #bf616a; color: #2e3440;";
        incorrectButton.textContent = "Incorrect";
        incorrectButton.addEventListener('click', () => {
            const xhttp = new XMLHttpRequest();

            xhttp.open("POST", "http://127.0.0.1:5000/api/update", false);
            xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

            var formRecord = JSON.parse(this.record);
            formRecord.target = (this.sentiment == "Happy") ? 0 : 4;

            xhttp.send(JSON.stringify({record: formRecord}));

            document.querySelector('dialog').removeAttribute('open');

            this.remove();
            this.parentElement.remove();
        });

        this.appendChild(correctButton);
        this.appendChild(incorrectButton);
    }
}

customElements.define("result-dialog", ResultDialog, { extends: "dialog" });

class Sentiment extends HTMLDivElement {
    constructor(content, hour, dayName) {
        super();
        this.index = indexer++;

        this.content = content.toLowerCase().replace(/(\r\n|\n|\r)/gm, " ").replace(/[^a-zA-Z\s]/g, "").trim().replace(/ +/g, " ");

        this.hour = parseInt(hour);
        this.dayName = dayName;

        this.style.margin = "10px";
        this.style.width = "50px";
        this.style.height = "50px";
        this.style.border = "0px";

        this.id = `sentiment-vis-${this.index}`;
        this.setAttribute("predicted", false);

        this.json = {
            id: this.id,
            content: this.content,
            hour: this.hour,
            day: this.dayName
        }
    }

    connectedCallback() {
        this.innerHTML = `<img src='moz-extension://${UUID_ADDON}/icons/analizer-48.png'>`;

        this.addEventListener('click', () => {
            if (this.getAttribute("predicted") === "true") {
                var sentiment = this.getAttribute("result");
                var record = this.getAttribute("record");

                this.insertAdjacentElement("afterend", new ResultDialog(sentiment, record));
                console.log(sentiment);
            } else {

                this.innerHTML = `<img width="48px" height="48px" src='moz-extension://${UUID_ADDON}/icons/loading.gif'>`;

                const xhttp = new XMLHttpRequest();

                xhttp.open("POST", "http://127.0.0.1:5000/api", false);
                xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 201) {
                        const resp = JSON.parse(this.responseText);
                        console.log(resp.id);

                        document.getElementById(resp.id).innerHTML = (resp.result > 0) ? `<img width="40px" height="40px" src='moz-extension://${UUID_ADDON}/icons/happy.png'>` : `<img width="40px" height="40px" src='moz-extension://${UUID_ADDON}/icons/sad.png'>`;
                        document.getElementById(resp.id).setAttribute("predicted", true);
                        document.getElementById(resp.id).setAttribute("result", (resp.result > 0) ? "Happy" : "Sad");
                        document.getElementById(resp.id).setAttribute("record", JSON.stringify(resp.content));
                    }
                };

                xhttp.send(JSON.stringify(this.json));
            }
        });
    }
}

customElements.define("sentiment-div", Sentiment, { extends: "div" });

var tweets = []

function findTweets() {
    tweets = document.querySelectorAll('[data-testid="tweet"]');

    tweets.forEach(tweet => {
        if (!tweet.getAttribute("clickable")) {
            try {
                tweet.setAttribute("clickable", true);

                content = "";
                Array.from(tweet.querySelector('[data-testid="tweetText"]').children).forEach(span => {
                    if (!span.innerHTML.includes("<span") && !span.innerHTML.includes("<img")) {
                        if (span.innerHTML.includes("<a "))
                            content += span.querySelector("a").textContent.substring(1) + " "
                        else
                            content += span.textContent + " "
                    }
                });

                datetime = tweet.querySelector("time").getAttribute("datetime")

                datetime = datetime.split("T")
                hour = datetime[1].substring(0, 2) //

                datetime = new Date(datetime[0])
                dayName = datetime.toLocaleDateString("en-US", { weekday: 'long' });

                dayName = daysMap[dayName.substring(0, 3)] //

                tweet.appendChild(new Sentiment(content, hour, dayName));
            } catch (error) { }
        }
    })
}

document.addEventListener("keypress", (event) => {
    if (event.key == "s") {
        findTweets()
        console.log("Ready")
    }
});

//setInterval(findTweets, 2000)