/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Landfill } from '../models/Landfill';
import type { LandfillRequest } from '../models/LandfillRequest';
import type { PaginatedLandfillList } from '../models/PaginatedLandfillList';
import type { PatchedLandfillRequest } from '../models/PatchedLandfillRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LandfillsService {

    /**
     * @returns PaginatedLandfillList 
     * @throws ApiError
     */
    public static landfillsList({
ordering,
page,
pageSize,
search,
}: {
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
 * A search term.
 */
search?: string,
}): CancelablePromise<PaginatedLandfillList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/landfills/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'search': search,
            },
        });
    }

    /**
     * @returns Landfill 
     * @throws ApiError
     */
    public static landfillsCreate({
requestBody,
}: {
requestBody: LandfillRequest,
}): CancelablePromise<Landfill> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/landfills/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Landfill 
     * @throws ApiError
     */
    public static landfillsRetrieve({
id,
}: {
/**
 * A unique integer value identifying this Наименование площадки.
 */
id: number,
}): CancelablePromise<Landfill> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/landfills/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns Landfill 
     * @throws ApiError
     */
    public static landfillsUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Наименование площадки.
 */
id: number,
requestBody: LandfillRequest,
}): CancelablePromise<Landfill> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/landfills/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Landfill 
     * @throws ApiError
     */
    public static landfillsPartialUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Наименование площадки.
 */
id: number,
requestBody?: PatchedLandfillRequest,
}): CancelablePromise<Landfill> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/landfills/{id}/',
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
    public static landfillsDestroy({
id,
}: {
/**
 * A unique integer value identifying this Наименование площадки.
 */
id: number,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/landfills/{id}/',
            path: {
                'id': id,
            },
        });
    }

}
