import { v4 as uuidv4 } from 'uuid';

// Result type used for data initialization
export type Result<T> = { ok: true, value: T } | { ok: false, error: string };

// Error classes
class ConstructorParameterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConstructorParameterError";
    }
}

// The user class
export class User {
    public id: string;
    public account_type: string;
    public role: string;
    public name: string;
    public mail: string;
    public phone_number: string;
    public bio: string;
    public address: string;
    public date_of_birth: string;
    public profile_picture_url: string;
    public password: string;
    public created_at: string;
    public supply_post_ids: string[];
    public demand_post_ids: string[];

    constructor(
        account_type: string,
        role: string,
        name: string,
        mail: string,
        phone_number: string,
        bio: string,
        address: string,
        date_of_birth: string,
        profile_picture_url: string,
        password: string,
    ) {
        this.id = uuidv4();

        this.account_type = account_type;

        this.role = role ? role : "user";

        this.name = name;
/*         if (this.checkName(name)) {
        } else {
            throw new ConstructorParameterError("Name parameter is of wrong format.");
        } */

        this.mail = mail;
/*         if (this.checkEmail(mail)) {
        } else {
            throw new ConstructorParameterError("Email is of wrong format.");
        } */

       this.phone_number = phone_number;
/*         if (this.checkPhoneNumber(phone_number)) {
        } else {
            throw new ConstructorParameterError("Phone number is of wrong format.")
        } */

        this.bio = bio ? bio : "";

        this.address = address;
/*         if (this.checkAddress(address)) {
        } else {
            throw new ConstructorParameterError("Address is of wrong format.")
        } */

       this.date_of_birth = date_of_birth;
/*         if (this.checkDateOfBirth(date_of_birth)) {
        } else {
            throw new ConstructorParameterError("Date of birth is of wrong format, or means user is too young.")
        } */

        this.profile_picture_url = profile_picture_url ? profile_picture_url : "";

        this.password = password;
/*         if (this.checkPassword(password)) {
        } else {
            throw new ConstructorParameterError("Password is of wrong format.")
        } */

        this.created_at = new Date().toISOString();

        this.supply_post_ids = [];
        this.demand_post_ids = [];
    }

    // Functions for controlling the format of attributes in class User

    // Asserts that name is of type string and that it is not an empty or to short string. 
    private checkName(name: string): boolean {
        return typeof name === 'string' && name.trim().length >= 2;
    }

    // Asserts that email consists of at least one character (not '@' or ' ') followed by '@' followed by at least one '.' followed by at least one character (not '@' or ' ').
    private checkEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof email === 'string' && emailRegex.test(email);
    }

    // Asserts that phone number can begin with '+' and can consist of numbers [0-9] and can be of length {5-8}.
    private checkPhoneNumber(phone: string): boolean {
        const phoneRegex = /^\+?[0-9]{5,8}$/;
        return typeof phone === 'string' && phoneRegex.test(phone);
    }

    // Ensures address is of format [Address name] [address number], [city]
    private checkAddress(address: string): boolean {
        const addressRegex = /^[a-zA-ZåäöÅÄÖ\s\-]+,\s*\d+,\s*[a-zA-ZåäöÅÄÖ\s\-]+$/;
        return typeof address === 'string' && addressRegex.test(address.trim());
    }

    // Validates format of dob (date of birth) [YYYY-MM-DD] and ensures user is above 18 years of age
    private checkDateOfBirth(dob: string): boolean {
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(dob)) return false;

        const birthDate = new Date(dob);
        const now = new Date();
        const age = now.getFullYear() - birthDate.getFullYear();
        const m = now.getMonth() - birthDate.getMonth();
        const d = now.getDate() - birthDate.getDate();
        const is18OrOlder = age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
        return is18OrOlder;
    }

    // Ensures that password is at least 6 characters long and contains letters and numbers
    private checkPassword(password: string): boolean {
        const lengthOk = password.length >= 6;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        return typeof password === 'string' && lengthOk && hasLetter && hasDigit;
    }

    //Functions for editing attributes of class User 

    public setName(newName: string) {
        if (this.checkName(newName)) {
            this.name = newName;
        } else {
            throw new Error("New name is too short or of wrong format.");
        }
    }

    public setEmail(newEmail: string) {
        if (this.checkEmail(newEmail)) {
            this.mail = newEmail
        } else {
            throw new Error("New email of wrong format.");
        }
    }

    public setPhoneNumber(newNumber: string) {
        if (this.checkPhoneNumber(newNumber)) {
            this.phone_number = newNumber;
        } else {
            throw new Error("New phone number is of wrong format.")
        }
    }

    public setBiography(newBio: string) {
        this.bio = newBio;
    }

    public setAddress(newAddress: string) {
        if (this.checkAddress(newAddress)) {
            this.address = newAddress;
        } else {
            throw new Error("New address is of wrong format.")
        }
    }

    public setDateOfBirth(newDate: string) {
        if (this.checkDateOfBirth(newDate)) {
            this.date_of_birth = newDate;
        } else {
            throw new Error("New date of birth is of wrong format, or means user is too young.")
        }
    }

    public setProfilePictureUrl(newUrl: string) {
        this.profile_picture_url = newUrl;
    }

    public setPassword(newPassword: string) {
        if (this.checkPassword(newPassword)) {
            this.password = newPassword;
        } else {
            throw new Error("New password is of wrong format");
        }
    }

    public addSupplyPostId(newPostId: string) {
        this.supply_post_ids.push(newPostId);
    }

    public removeSupplyPostId(removeId: string) {
        if (this.supply_post_ids.length == 0) {
            throw new Error("Can not remove post with id " + removeId + " due to user not having any active supply posts.")
        }

        const index = this.supply_post_ids.indexOf(removeId);
        if (index != -1) {
            this.supply_post_ids.splice(index, 1);
        } else {
            throw new Error("Requested id is not included in user's supply posts.")
        }
    }

    public addDemandPostId(newPostId: string) {
        this.demand_post_ids.push(newPostId);
    }

    public removeDemandPostId(removeId: string) {
        if (this.demand_post_ids.length == 0) {
            throw new Error("Can not remove post with id " + removeId + " due to user not having any active demand posts.")
        }

        const index = this.demand_post_ids.indexOf(removeId);
        if (index != -1) {
            this.demand_post_ids.splice(index, 1);
        } else {
            throw new Error("Requested id is not included in user's demand posts.")
        }
    }

    // Functions functions for deleting attributes of class User if possible

    public removeProfilePictureUrl() {
        this.profile_picture_url = "";
    }

    public removeAllSupplyPosts() {
        this.supply_post_ids = [];
    }

    public removeAllDemandPosts() {
        this.demand_post_ids = [];
    }

    // Getter functions for attributes of class User

    public getId(): string {

        return this.id;
    }

    public getRole(): string {
        return this.role;
    }

    public getName(): string {
        return this.name;
    }

    public getMail(): string {
        return this.mail;
    }

    public getPhoneNumber(): string {
        return this.phone_number;
    }

    public getBiography(): string {
        return this.bio;
    }

    public getAddress(): string {
        return this.address;
    }

    public getDateOfBirth(): string {
        return this.date_of_birth;
    }

    public getProfilePictureUrl(): string {
        return this.profile_picture_url;
    }

    public getPassword(): string {
        return this.password;
    }

    public getCreatedAt(): string {
        return this.created_at;
    }

    public getSupplyPostIds(): string[] {
        return this.supply_post_ids;
    }

    public getDemandPostIds(): string[] {
        return this.demand_post_ids;
    }

    public getSupplyPostId(index: number): string {
        if (index < 0 || index >= this.supply_post_ids.length) {
            throw new Error("Index out of bounds for supply post ids.");
        }
        return this.supply_post_ids[index];
    }

    public getDemandPostId(index: number): string {
        if (index < 0 || index >= this.demand_post_ids.length) {
            throw new Error("Index out of bounds for demand post ids.");
        }
        return this.demand_post_ids[index];
    }

    public getSupplyPostIdsLength(): number {
        return this.supply_post_ids.length;
    }

    public getDemandPostIdsLength(): number {
        return this.demand_post_ids.length;
    }
}

// The class for supply posts, i.e. posts/ads where users
// want to LEND stuff
export class Supply_post {

    public id: string;
    public owner_id: string;
    public owner_name: string;
    public title: string;
    public description: string;
    public price: string;
    public category_type: string;
    public category: string;
    public location: string;
    public post_picture_url: string;
    public created_at: string;

    constructor(
        owner_id: string,
        owner_name: string,
        title: string,
        description: string,
        price: string, 
        category: string,
        category_type: string,
        location: string,
        post_picture_url: string,
        created_at: string
    ) {
        this.id = uuidv4();
        this.owner_id = owner_id;
        this.owner_name = owner_name;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category_type = category_type;
        this.category = category;
        this.location = location;
        this.post_picture_url = post_picture_url;
        this.created_at = created_at;
    }
}

// The class for demand posts, i.e. posts/ads where users
// want to RENT stuff
export class Demand_post {
    public id: string;
    public owner_id: string;
    public owner_name: string;
    public title: string;
    public description: string;
    public price: string;
    public category_type: string;
    public category: string;
    public location: string;
    public created_at: string;

    constructor(
        owner_id: string,
        owner_name: string,
        title: string,
        description: string,
        price: string,
        category: string,
        category_type: string,
        location: string,
        created_at: string
    ) {
        this.id = uuidv4();
        this.owner_id = owner_id;
        this.owner_name = owner_name;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category_type = category_type;
        this.category = category;
        this.location = location;
        this.created_at = created_at;
    }
}