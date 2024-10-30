/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanyContract } from '../models/CompanyContract';
import type { CompanyContractRequest } from '../models/CompanyContractRequest';
import type { PaginatedCompanyContractList } from '../models/PaginatedCompanyContractList';
import type { PatchedCompanyContractRequest } from '../models/PatchedCompanyContractRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContractsService {

    /**
     * @returns PaginatedCompanyContractList 
     * @throws ApiError
     */
    public static contractsList({
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
}): CancelablePromise<PaginatedCompanyContractList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contracts/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'search': search,
            },
        });
    }

    /**
     * @returns CompanyContract 
     * @throws ApiError
     */
    public static contractsCreate({
formData,
}: {
formData: CompanyContractRequest,
}): CancelablePromise<CompanyContract> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/contracts/',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns CompanyContract 
     * @throws ApiError
     */
    public static contractsRetrieve({
id,
}: {
/**
 * A unique integer value identifying this Контракт.
 */
id: number,
}): CancelablePromise<CompanyContract> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contracts/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns CompanyContract 
     * @throws ApiError
     */
    public static contractsUpdate({
id,
formData,
}: {
/**
 * A unique integer value identifying this Контракт.
 */
id: number,
formData: CompanyContractRequest,
}): CancelablePromise<CompanyContract> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/contracts/{id}/',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns CompanyContract 
     * @throws ApiError
     */
    public static contractsPartialUpdate({
id,
formData,
}: {
/**
 * A unique integer value identifying this Контракт.
 */
id: number,
formData?: PatchedCompanyContractRequest,
}): CancelablePromise<CompanyContract> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/contracts/{id}/',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns void 
     * @throws ApiError
     */
    public static contractsDestroy({
id,
}: {
/**
 * A unique integer value identifying this Контракт.
 */
id: number,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/contracts/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns CompanyContract 
     * @throws ApiError
     */
    public static contractsParseFkkoRetrieve({
id,
}: {
/**
 * A unique integer value identifying this Контракт.
 */
id: number,
}): CancelablePromise<CompanyContract> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contracts/{id}/parse_fkko/',
            path: {
                'id': id,
            },
        });
    }

}
