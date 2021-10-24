import { commandTypes } from "./type.model";

export class Command {
    author!: string;
    command: null | CommandPayload = null;
}

export class CommandPayload {
    type!: commandTypes;
    data!: string | Array<number> | { lat: number, lng: number } | Array<string>;
}