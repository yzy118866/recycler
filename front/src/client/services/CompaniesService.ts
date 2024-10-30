/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from '../models/Company';
import type { CompanyShortRequest } from '../models/CompanyShortRequest';
import type { PaginatedCompanyList } from '../models/PaginatedCompanyList';
import type { PatchedCompanyShortRequest } from '../models/PatchedCompanyShortRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CompaniesService {

    /**
     * @returns PaginatedCompanyList 
     * @throws ApiError
     */
    public static companiesList({
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
}): CancelablePromise<PaginatedCompanyList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/companies/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'search': search,
            },
        });
    }

    /**
     * @returns Company 
     * @throws ApiError
     */
    public static companiesCreate({
requestBody,
}: {
requestBody: CompanyShortRequest,
}): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/companies/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Company 
     * @throws ApiError
     */
    public static companiesRetrieve({
id,
}: {
/**
 * A unique integer value identifying this Компания.
 */
id: number,
}): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/companies/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns Company 
     * @throws ApiError
     */
    public static companiesUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Компания.
 */
id: number,
requestBody: CompanyShortRequest,
}): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/companies/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Company 
     * @throws ApiError
     */
    public static companiesPartialUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Компания.
 */
id: number,
requestBody?: PatchedCompanyShortRequest,
}): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/companies/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Company 
     * @throws ApiError
     */
    public static companiesDestroy({
id,
}: {
/**
 * A unique integer value identifying this Компания.
 */
id: number,
}): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/companies/{id}/',
            path: {
                'id': id,
            },
        });
    }

}
