export class Message {
    author!: string;
    message!: string;
    timestamp!: Date;
    coordinates?: { lat: number, lng: number }
}