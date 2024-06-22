export class InviteNotFoundError extends Error {
    constructor() {
        super('Invite does not exist');
        this.name = 'InviteNotFoundError';
    }
}

export class InviteInUseError extends Error {
    constructor() {
        super('Invite is already in use');
        this.name = 'InviteInUseError';
    }
}