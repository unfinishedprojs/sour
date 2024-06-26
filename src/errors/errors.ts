export class InviteInUseError extends Error {
    constructor() {
        super('Invite is already in use');
        this.name = 'InviteInUseError';
    }
}

export class PasswordNotValid extends Error {
    constructor() {
        super('Password is invalid');
        this.name = 'PasswordInvalid';
    }
}

export class BodyNotValid extends Error {
    constructor(key: string, item: string, type: string) {
        super(`${key} is not valid as ${type} (${item})`);
        this.name = 'BodyNotValid';
    }
}

export class ParameterNotValid extends Error {
    constructor(key: string) {
        super(key);
        this.name = 'ParameterNotValid';
    }
}