export enum StorageKeys {
    Email = 'email',
    Id = 'id',
    Name = 'name',
    Token = 'token'
}

export interface User {
    _id: string,
    email: string,
    token: string,
    name: string
}