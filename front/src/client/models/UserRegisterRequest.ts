/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserRegisterRequest = {
    first_name?: string;
    last_name?: string;
    /**
     * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
     */
    username: string;
    email?: string;
    password: string;
};
