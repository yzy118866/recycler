/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthToken } from '../models/AuthToken';
import type { AuthTokenRequest } from '../models/AuthTokenRequest';
import type { UserRegister } from '../models/UserRegister';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @returns UserRegister 
     * @throws ApiError
     */
    public static authRegisterCreate({
requestBody,
}: {
requestBody: UserRegisterRequest,
}): CancelablePromise<UserRegister> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns AuthToken 
     * @throws ApiError
     */
    public static authTokenCreate({
formData,
}: {
formData: AuthTokenRequest,
}): CancelablePromise<AuthToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/token/',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
        });
    }

}
