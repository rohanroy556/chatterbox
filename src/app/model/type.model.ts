export type eventNames = 'message' | 'command';
export type chatTypes = 'message' | 'map';
export type commandTypes = 'date' | 'map' | 'rate' | 'complete';

export enum ChatType {
    Map = 'map',
    Message = 'message'
}

export enum CommandType {
    Date = 'date',
    Map = 'map',
    Rate = 'rate',
    Complete = 'complete'
}

export enum EventName {
    Message = 'message',
    Command = 'command'
}

export const DAYS: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday'];

export const markerSvg = `
    data:image/svg+xml;utf8,
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="50" width="50" viewBox="0 0 512 512">
        <g fill="red">
            <path d="M256,0C161.896,0,85.333,76.563,85.333,170.667c0,28.25,7.063,56.26,20.49,81.104L246.667,506.5c1.875,
                3.396,5.448,5.5,9.333,5.5s7.458-2.104,9.333-5.5l140.896-254.813c13.375-24.76,20.438-52.771,20.438-81.021C426.667,
                76.563,350.104,0,256,0z M256,256c-47.052,0-85.333-38.281-85.333-85.333c0-47.052,38.281-85.333,85.333-85.333s85.333,
                38.281,85.333,85.333C341.333,217.719,303.052,256,256,256z"/>
            <circle cx="256" cy="170" r="90" fill="transparent"/>
        </g>
    </svg>
`;