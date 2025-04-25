

// The user class
class User {
    private id: number;
    private role: string;
    private name: string;
    private mail: string;
    private phone_number: string;
    private biography: string;
    private address: string;
    private date_of_birth: string;
    private profile_picture_url: string;
    private password: string;
    private created_at: string;
    private supply_post_ids: string[];
    private demand_post_ids: string[];

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
class Supply_post {

    private id: number;
    private owner_id: number;
    private title: string;
    private description: string;
    private price: number;
    private category: string;
    private location: string;
    private post_picture_url: string;
    private created_at: string;

    constructor(
        id: number,
        owner_id: number,
        title: string,
        description: string,
        price: number,
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
    private id: number;
    private owner_id: number;
    private title: string;
    private description: string;
    private price: number;
    private category: string;
    private location: string;
    private created_at: string;

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