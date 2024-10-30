/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileUploadResponse } from '../models/FileUploadResponse';
import type { PaginatedTicketList } from '../models/PaginatedTicketList';
import type { PatchedFileUploadRequest } from '../models/PatchedFileUploadRequest';
import type { PatchedTicketRequest } from '../models/PatchedTicketRequest';
import type { Ticket } from '../models/Ticket';
import type { TicketRequest } from '../models/TicketRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TicketsService {

    /**
     * @returns PaginatedTicketList 
     * @throws ApiError
     */
    public static ticketsList({
author,
company,
ordering,
page,
pageSize,
search,
status,
}: {
author?: number,
company?: number,
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
/**
 * * `cr` - Создан
 * * `pr` - В обработке
 * * `ar` - Архив
 * * `nc` - Несоответствие
 * * `er` - Ошибка
 */
status?: 'ar' | 'cr' | 'er' | 'nc' | 'pr',
}): CancelablePromise<PaginatedTicketList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tickets/',
            query: {
                'author': author,
                'company': company,
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'search': search,
                'status': status,
            },
        });
    }

    /**
     * @returns Ticket 
     * @throws ApiError
     */
    public static ticketsCreate({
requestBody,
}: {
requestBody: TicketRequest,
}): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tickets/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Ticket 
     * @throws ApiError
     */
    public static ticketsRetrieve({
id,
}: {
/**
 * A unique integer value identifying this Талон.
 */
id: number,
}): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tickets/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns Ticket 
     * @throws ApiError
     */
    public static ticketsUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Талон.
 */
id: number,
requestBody: TicketRequest,
}): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/tickets/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Ticket 
     * @throws ApiError
     */
    public static ticketsPartialUpdate({
id,
requestBody,
}: {
/**
 * A unique integer value identifying this Талон.
 */
id: number,
requestBody?: PatchedTicketRequest,
}): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/tickets/{id}/',
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
    public static ticketsDestroy({
id,
}: {
/**
 * A unique integer value identifying this Талон.
 */
id: number,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/tickets/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns FileUploadResponse 
     * @throws ApiError
     */
    public static ticketsUploadWasteImagePartialUpdate({
id,
formData,
}: {
/**
 * A unique integer value identifying this Талон.
 */
id: number,
formData?: PatchedFileUploadRequest,
}): CancelablePromise<FileUploadResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/tickets/{id}/upload_waste_image/',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
