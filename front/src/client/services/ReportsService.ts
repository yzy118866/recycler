/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NonComplianceReport } from '../models/NonComplianceReport';
import type { NonComplianceReportRequest } from '../models/NonComplianceReportRequest';
import type { PaginatedNonComplianceReportList } from '../models/PaginatedNonComplianceReportList';
import type { PatchedNonComplianceReportRequest } from '../models/PatchedNonComplianceReportRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReportsService {

    /**
     * @returns PaginatedNonComplianceReportList 
     * @throws ApiError
     */
    public static reportsList({
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
}): CancelablePromise<PaginatedNonComplianceReportList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'search': search,
            },
        });
    }

    /**
     * @returns NonComplianceReport 
     * @throws ApiError
     */
    public static reportsCreate({
requestBody,
}: {
requestBody: NonComplianceReportRequest,
}): CancelablePromise<NonComplianceReport> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/reports/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns NonComplianceReport 
     * @throws ApiError
     */
    public static reportsRetrieve({
id,
}: {
/**
 * A unique integer value identifying this non compliance report.
 */
id: number,
}): CancelablePromise<NonComplianceReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns NonComplianceReport 
     * @throws ApiError
     */
    public static reportsUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this non compliance report.
 */
id: number,
requestBody: NonComplianceReportRequest,
}): CancelablePromise<NonComplianceReport> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/reports/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns NonComplianceReport 
     * @throws ApiError
     */
    public static reportsPartialUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this non compliance report.
 */
id: number,
requestBody?: PatchedNonComplianceReportRequest,
}): CancelablePromise<NonComplianceReport> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/reports/{id}/',
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
    public static reportsDestroy({
id,
}: {
/**
 * A unique integer value identifying this non compliance report.
 */
id: number,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/reports/{id}/',
            path: {
                'id': id,
            },
        });
    }

}
