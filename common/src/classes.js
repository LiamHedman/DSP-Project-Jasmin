"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supply_post = exports.User = void 0;
// Error classes
var ConstructorParameterError = /** @class */ (function (_super) {
    __extends(ConstructorParameterError, _super);
    function ConstructorParameterError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ConstructorParameterError";
        return _this;
    }
    return ConstructorParameterError;
}(Error));
// The user class
var User = /** @class */ (function () {
    function User(
    // id: string,
    role, name, mail, phone_number, biography, address, date_of_birth, profile_picture_url, password) {
        this.id = "temp"; //Date.now().toString(); // Unique ID
        this.role = role ? role : "user";
        if (this.checkName(name)) {
            this.name = name;
        }
        else {
            throw new ConstructorParameterError("Name parameter is of wrong format.");
        }
        if (this.checkEmail(mail)) {
            this.mail = mail;
        }
        else {
            throw new ConstructorParameterError("Email is of wrong format.");
        }
        if (this.checkPhoneNumber(phone_number)) {
            this.phone_number = phone_number;
        }
        else {
            throw new ConstructorParameterError("Phone number is of wrong format.");
        }
        this.biography = biography ? biography : "";
        if (this.checkAddress(address)) {
            this.address = address;
        }
        else {
            throw new ConstructorParameterError("Address is of wrong format.");
        }
        if (this.checkDateOfBirth(date_of_birth)) {
            this.date_of_birth = date_of_birth;
        }
        else {
            throw new ConstructorParameterError("Date of birth is of wrong format, or means user is too young.");
        }
        this.profile_picture_url = profile_picture_url ? profile_picture_url : "";
        if (this.checkPassword(password)) {
            this.password = password;
        }
        else {
            throw new ConstructorParameterError("Password is of wrong format.");
        }
        this.created_at = new Date().toISOString();
        this.supply_post_ids = [];
        this.demand_post_ids = [];
    }
    // Functions for controlling the format of attributes in class User
    // Asserts that name is of type string and that it is not an empty or to short string. 
    User.prototype.checkName = function (name) {
        return typeof name === 'string' && name.trim().length >= 2;
    };
    // Asserts that email consists of at least one character (not '@' or ' ') followed by '@' followed by at least one '.' followed by at least one character (not '@' or ' ').
    User.prototype.checkEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof email === 'string' && emailRegex.test(email);
    };
    // Asserts that phone number can begin with '+' and can consist of numbers [0-9] and can be of length {5-8}.
    User.prototype.checkPhoneNumber = function (phone) {
        var phoneRegex = /^\+?[0-9]{5,8}$/;
        return typeof phone === 'string' && phoneRegex.test(phone);
    };
    // Ensures address is of format [Address name] [address number], [city]
    User.prototype.checkAddress = function (address) {
        var addressRegex = /^[a-zA-ZåäöÅÄÖ\s\-]+,\s*\d+,\s*[a-zA-ZåäöÅÄÖ\s\-]+$/;
        return typeof address === 'string' && addressRegex.test(address.trim());
    };
    // Validates format of dob (date of birth) [YYYY-MM-DD] and ensures user is above 18 years of age
    User.prototype.checkDateOfBirth = function (dob) {
        var dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(dob))
            return false;
        var birthDate = new Date(dob);
        var now = new Date();
        var age = now.getFullYear() - birthDate.getFullYear();
        var m = now.getMonth() - birthDate.getMonth();
        var d = now.getDate() - birthDate.getDate();
        var is18OrOlder = age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
        return is18OrOlder;
    };
    // Ensures that password is at least 6 characters long and contains letters and numbers
    User.prototype.checkPassword = function (password) {
        var lengthOk = password.length >= 6;
        var hasLetter = /[a-zA-Z]/.test(password);
        var hasDigit = /\d/.test(password);
        return typeof password === 'string' && lengthOk && hasLetter && hasDigit;
    };
    //Functions for editing attributes of class User 
    User.prototype.setName = function (newName) {
        if (this.checkName(newName)) {
            this.name = newName;
        }
        else {
            throw new Error("New name is too short or of wrong format.");
        }
    };
    User.prototype.setEmail = function (newEmail) {
        if (this.checkEmail(newEmail)) {
            this.mail = newEmail;
        }
        else {
            throw new Error("New email of wrong format.");
        }
    };
    User.prototype.setPhoneNumber = function (newNumber) {
        if (this.checkPhoneNumber(newNumber)) {
            this.phone_number = newNumber;
        }
        else {
            throw new Error("New phone number is of wrong format.");
        }
    };
    User.prototype.setBiography = function (newBiography) {
        this.biography = newBiography;
    };
    User.prototype.setAddress = function (newAddress) {
        if (this.checkAddress(newAddress)) {
            this.address = newAddress;
        }
        else {
            throw new Error("New address is of wrong format.");
        }
    };
    User.prototype.setDateOfBirth = function (newDate) {
        if (this.checkDateOfBirth(newDate)) {
            this.date_of_birth = newDate;
        }
        else {
            throw new Error("New date of birth is of wrong format, or means user is too young.");
        }
    };
    User.prototype.setProfilePictureUrl = function (newUrl) {
        this.profile_picture_url = newUrl;
    };
    User.prototype.setPassword = function (newPassword) {
        if (this.checkPassword(newPassword)) {
            this.password = newPassword;
        }
        else {
            throw new Error("New password is of wrong format");
        }
    };
    User.prototype.addSupplyPostId = function (newPostId) {
        this.supply_post_ids.push(newPostId);
    };
    User.prototype.removeSupplyPostId = function (removeId) {
        if (this.supply_post_ids.length == 0) {
            throw new Error("Can not remove post with id " + removeId + " due to user not having any active supply posts.");
        }
        var index = this.supply_post_ids.indexOf(removeId);
        if (index != -1) {
            this.supply_post_ids.splice(index, 1);
        }
        else {
            throw new Error("Requested id is not included in user's supply posts.");
        }
    };
    User.prototype.addDemandPostId = function (newPostId) {
        this.demand_post_ids.push(newPostId);
    };
    User.prototype.removeDemandPostId = function (removeId) {
        if (this.demand_post_ids.length == 0) {
            throw new Error("Can not remove post with id " + removeId + " due to user not having any active demand posts.");
        }
        var index = this.demand_post_ids.indexOf(removeId);
        if (index != -1) {
            this.demand_post_ids.splice(index, 1);
        }
        else {
            throw new Error("Requested id is not included in user's demand posts.");
        }
    };
    // Functions functions for deleting attributes of class User if possible
    User.prototype.removeProfilePictureUrl = function () {
        this.profile_picture_url = "";
    };
    User.prototype.removeAllSupplyPosts = function () {
        this.supply_post_ids = [];
    };
    User.prototype.removeAllDemandPosts = function () {
        this.demand_post_ids = [];
    };
    // Getter functions for attributes of class User
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getRole = function () {
        return this.role;
    };
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getMail = function () {
        return this.mail;
    };
    User.prototype.getPhoneNumber = function () {
        return this.phone_number;
    };
    User.prototype.getBiography = function () {
        return this.biography;
    };
    User.prototype.getAddress = function () {
        return this.address;
    };
    User.prototype.getDateOfBirth = function () {
        return this.date_of_birth;
    };
    User.prototype.getProfilePictureUrl = function () {
        return this.profile_picture_url;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.getCreatedAt = function () {
        return this.created_at;
    };
    User.prototype.getSupplyPostIds = function () {
        return this.supply_post_ids;
    };
    User.prototype.getDemandPostIds = function () {
        return this.demand_post_ids;
    };
    User.prototype.getSupplyPostId = function (index) {
        if (index < 0 || index >= this.supply_post_ids.length) {
            throw new Error("Index out of bounds for supply post ids.");
        }
        return this.supply_post_ids[index];
    };
    User.prototype.getDemandPostId = function (index) {
        if (index < 0 || index >= this.demand_post_ids.length) {
            throw new Error("Index out of bounds for demand post ids.");
        }
        return this.demand_post_ids[index];
    };
    User.prototype.getSupplyPostIdsLength = function () {
        return this.supply_post_ids.length;
    };
    User.prototype.getDemandPostIdsLength = function () {
        return this.demand_post_ids.length;
    };
    return User;
}());
exports.User = User;
// The class for supply posts, i.e. posts/ads where users
// want to LEND stuff
var Supply_post = /** @class */ (function () {
    function Supply_post(id, owner_id, title, description, price, category, location, post_picture_url, created_at) {
        this.id = id;
        this.owner_id = owner_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.post_picture_url = post_picture_url;
        this.created_at = created_at;
    }
    return Supply_post;
}());
exports.Supply_post = Supply_post;
// The class for demand posts, i.e. posts/ads where users
// want to RENT stuff
var Demand_post = /** @class */ (function () {
    function Demand_post(id, owner_id, title, description, price, category, location, created_at) {
        this.id = id;
        this.owner_id = owner_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.created_at = created_at;
    }
    return Demand_post;
}());
