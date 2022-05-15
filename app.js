const http = require("http");
const Express = require("express");

const app = new Express();

app.get("/block-me", async (req, res) => {
    try {

        await blockForTwoMinutes();
        res.status(200).json({
            isActionSuccess: true
        });

    } catch (error) {
        res.status(500).json({
            code: 123
        });
    }
});
app.get("/block-me-2 ", async (req, res) => {
    try {

        asyncAvg(9e10, function (avg) {
            console.log('avg of 1-n: ' + avg);
            res.status(200).json({
                isActionSuccess: true,
                avg: avg
            });
        });

    } catch (error) {
        res.status(500).json({
            code: error,
            error
        });
    }
});
app.get("/browser", async (req, res) => {
    try {
        res.status(200).json({
            isActionSuccess: true
        });

    } catch (error) {
        res.status(500).json({
            code: 456
        });
    }
});

function asyncAvg(n, avgCB) {
    try {
        // Save ongoing sum in JS closure.
        var sum = 0;
        function help(i, cb) {
            sum += i;
            if (i == n) {
                cb(sum);
                return;
            }

            // "Asynchronous recursion".
            // Schedule next operation asynchronously.
            setImmediate(help.bind(null, i + 1, cb));
        }

        // Start the helper, with CB to call avgCB.
        help(1, function (sum) {
            var avg = sum / n;
            avgCB(avg);
        });
    } catch (error) {
        console.log(error);
    }
}



async function blockForTwoMinutes2(n) {
    try {
        let sum;
        for (let i = 0; i < n; i++) {
            sum += i;
        }
        let avg = sum / n;
        console.log('avg: ' + avg);

        return avg;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function blockForTwoMinutes() {
    try {
        let currentTime = Date.now();

        /* add two minutes to current time */
        currentTime += 10000;

        /* block the event loop for two minutes */
        setTimeout(() => {
            while (Date.now() < currentTime) {

            }
        }, 0)

        return;
    } catch (error) {
        throw error;
    }
}

/* create server */

let __server = http.createServer(app);
// __server.listen(3001);

__server.on("listening", () => {
    console.log(`Application server started at http://localhost:3001`);
})

__server.on("error", (ex) => {
    console.log(`Unable to start server ${ex.toString()}`);
})
