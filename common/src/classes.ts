

// The user class
export class User {
    public id: number;
    public role: string;
    public name: string;
    public mail: string;
    public phone_number: string;
    public biography: string;
    public address: string;
    public date_of_birth: string;
    public profile_picture_url: string;
    public password: string;
    public created_at: string;
    public supply_post_ids: string[];
    public demand_post_ids: string[];

    constructor(
        id: number,
        role: string,
        name: string,
        mail: string,
        phone_number: string,
        biography: string,
        address: string,
        date_of_birth: string,
        profile_picture_url: string,
        password: string,
        created_at: string,
        supply_post_ids: string[],
        demand_post_ids: string[]
    ) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.mail = mail;
        this.phone_number = phone_number;
        this.biography = biography;
        this.address = address;
        this.date_of_birth = date_of_birth;
        this.profile_picture_url = profile_picture_url;
        this.password = password;
        this.created_at = created_at;
        this.supply_post_ids = supply_post_ids;
        this.demand_post_ids = demand_post_ids;
    }
}

// The class for supply posts, i.e. posts/ads where users
// want to LEND stuff
export class Supply_post {

    public id: number;
    public owner_id: number;
    public title: string;
    public description: string;
    public price: string;
    public category: string;
    public location: string;
    public post_picture_url: string;
    public created_at: string;

    constructor(
        id: number,
        owner_id: number,
        title: string,
        description: string,
        price: string,
        category: string,
        location: string,
        post_picture_url: string,
        created_at: string
    ) {
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
}

// The class for demand posts, i.e. posts/ads where users
// want to RENT stuff
class Demand_post {
    public id: number;
    public owner_id: number;
    public title: string;
    public description: string;
    public price: number;
    public category: string;
    public location: string;
    public created_at: string;

    constructor(
        id: number,
        owner_id: number,
        title: string,
        description: string,
        price: number,
        category: string,
        location: string,
        created_at: string
    ) {
        this.id = id;
        this.owner_id = owner_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.created_at = created_at;
    }
}