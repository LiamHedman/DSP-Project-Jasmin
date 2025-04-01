"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('http://localhost:3000/send', { message });
            console.log('Server response:', response.data);
        }
        catch (error) {
            console.error('Error sending message:', error.message);
        }
    });
}
process.stdin.on('data', (input) => {
    const message = input.toString().trim();
    if (message) {
        sendMessage(message);
    }
});
function pollMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('http://localhost:3000/messages');
            console.log('Received from server:', response.data);
        }
        catch (error) {
            console.error('Polling error:', error.message);
        }
    });
}
setInterval(pollMessages, 2000);
