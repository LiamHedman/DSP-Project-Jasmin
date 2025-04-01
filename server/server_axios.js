var express = require('express');
var _a = require('express'), Request = _a.Request, Response = _a.Response;
var app = express();
var PORT = 3000;
app.use(express.json());
var messages = [];
app.get('/', function (req, res) {
    res.send('Hello, World! The server is working.');
});
app.post('/send', function (req, res) {
    var message = req.body.message;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    console.log('Received from client:', message);
    messages.push(message);
    res.json({ status: 'Message received', message: message });
});
app.get('/messages', function (req, res) {
    res.json(messages);
});
// Start the server only if this is the main module
if (require.main === module) {
    app.listen(PORT, function () {
        console.log("Server is running on http://localhost:".concat(PORT));
    });
}
