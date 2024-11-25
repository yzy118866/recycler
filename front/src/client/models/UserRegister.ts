/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserRegister = {
    first_name?: string;
    last_name?: string;
    /**
     * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
     */
    username: string;
    email?: string;
    password: string;
    readonly token: string;
    
};
