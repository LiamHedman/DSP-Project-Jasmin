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