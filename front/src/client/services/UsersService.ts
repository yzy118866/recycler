/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedUserList } from '../models/PaginatedUserList';
import type { PatchedUserRequest } from '../models/PatchedUserRequest';
import type { StatusOk } from '../models/StatusOk';
import type { User } from '../models/User';
import type { UserRequest } from '../models/UserRequest';
import type { UserSetPasswordRequest } from '../models/UserSetPasswordRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * @returns PaginatedUserList 
     * @throws ApiError
     */
    public static usersList({
isActive,
ordering,
page,
pageSize,
role,
search,
}: {
isActive?: boolean,
/**
 * Which field to use when ordering the results.
 */
ordering?: string,
/**
 * A page number within the paginated result set.
 */
page?: number,
/**
 * Number of results to return per page.
 */
pageSize?: number,
/**
 * * `admin` - Админ
 * * `buh_inn` - Бухгалтер свой
 * * `buh_ext` - Бухгалтер заказчика
 * * `outlen` - Отходообразователь
 * * `disp` - Диспетчер
 * * `otv` - Отвальщик
 * * `man` - Мастер участка
 */
role?: 'admin' | 'buh_ext' | 'buh_inn' | 'disp' | 'man' | 'otv' | 'outlen' | null,
/**
 * A search term.
 */
search?: string,
}): CancelablePromise<PaginatedUserList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/',
            query: {
                'is_active': isActive,
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'role': role,
                'search': search,
            },
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static usersCreate({
requestBody,
}: {
requestBody: UserRequest,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static usersRetrieve({
id,
}: {
/**
 * A unique integer value identifying this пользователь.
 */
id: number,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static usersUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this пользователь.
 */
id: number,
requestBody: UserRequest,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static usersPartialUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this пользователь.
 */
id: number,
requestBody?: PatchedUserRequest,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns void 
     * @throws ApiError
     */
    public static usersDestroy({
id,
}: {
/**
 * A unique integer value identifying this пользователь.
 */
id: number,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns StatusOk 
     * @throws ApiError
     */
    public static usersSetPasswordCreate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this пользователь.
 */
id: number,
requestBody: UserSetPasswordRequest,
}): CancelablePromise<StatusOk> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/{id}/set_password/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static usersCurrentRetrieve(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/current/',
        });
    }

}
