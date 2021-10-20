export type eventNames = 'message' | 'command';
export type commandTypes = 'date' | 'map' | 'rate' | 'complete';
export type dateType = `${ number }-${ number }-${ number }T${ number }:${ number }:${ number }.${ number }Z`
export type completeTypes = 'Yes' | 'No';

export enum EventName {
    Message = 'message',
    Command = 'command'
}

export enum CommandType {
    Date = 'date',
    Map = 'map',
    Rate = 'rate',
    Complete = 'complete'
}

export enum CompleteType {
    Yes = 'Yes',
    No = 'No'
}