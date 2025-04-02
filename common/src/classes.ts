/* 

User:
Funktionaliteter:
Skapa
Ta bort
Redigera

Data:
Namn
ID
aktivt konto
Password
mail
telefon
biografi
address
skapad när
redigerad när

 */

class User {
    private id: number;
    private name: string;
    private active_account: boolean;
    private password: string;
    private mail: string;
    private phone_number: number;
    private biography: string;
    private address: string;
    
    private created_at: number;
    private edit_at: number;

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}

//TODO: make abstract later
class Post {
    
    private title: string;
    private post_id: string;
    private owner_d: string;
    private ad_message: string;
    private active_ad: boolean;
    private price: number;
    private nr: number;
    private category: string;
    private location: string;
    private adCreated: number;
    private adChanged: number;

    
    constructor(title: string) {
        this.title = title;
    }
}

/* 
 
Post: (ABSTRAKT, så att vi kan ha Olika posts)
Funktionaliteter:
Skapa
Ta bort
Redigera

Data:
Titel
ID
Aktiv annons
Bio - "adMessage"
pris (sek)
antal
Kategori
sellerID -> user info/contact info - !!!
Vart prod. finns
skapad när
redigerad när
Betalningsmetod
leveransmetod */