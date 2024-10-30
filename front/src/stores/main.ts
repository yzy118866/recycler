import { defineStore } from "pinia"
import { storeShortcut } from "src/Modules/StoreCrud"
import {
  CompaniesService,
  PaginatedTicketList,
  TicketsService,
  CompanyContract,
  PatchedCompanyContractRequest,
  CompanyContractRequest,
  ContractsService,
  Company,
  PaginatedCompanyList,
  Ticket,
  TicketRequest,
  CompanyShort,
  ReportsService,
  NonComplianceReportRequest,
  NonComplianceReport,
  PaginatedNonComplianceReportList,
  LandfillsService,
  PaginatedLandfillList,
  Landfill,
  PatchedFileUploadRequest,
  FileUploadResponse,
} from "src/client"

export const useMainStore = defineStore("main", {
  state: () => ({
    company: null as Company | null,
    companySelected: null as Company | CompanyShort | null,
    companies: null as Company[] | null,
    landfills: null as Landfill[] | null,
    ticket: null as Ticket | null,
    tickets: null as Ticket[] | null,
    reports: null as NonComplianceReport[] | null,
    report: null as NonComplianceReport | null,
  }),

  getters: {},

  actions: {
    // Company
    async loadCompanies(payload: object): Promise<PaginatedCompanyList> {
      return storeShortcut({
        promise: CompaniesService.companiesList(payload),
        setValue: (resp: PaginatedCompanyList) => {
          this.companies = resp.results as Company[]
        },
      })
    },
    async companyCreate(payload: Company): Promise<Company> {
      return storeShortcut({
        promise: CompaniesService.companiesCreate({ requestBody: payload }),
        setValue: (resp: Company) => {
          this.company = resp
        },
      })
    },
    async companyLoad(id: number): Promise<Company> {
      return storeShortcut({
        promise: CompaniesService.companiesRetrieve({ id }),
        setValue: (resp: Company) => {
          this.company = resp
        },
      })
    },
    async companyUpdate(id: number, payload: Company): Promise<Company> {
      return storeShortcut({
        promise: CompaniesService.companiesUpdate({ id, requestBody: payload }),
        setValue: (resp: Company) => {
          this.company = resp
        },
      })
    },
    async companyDelete(id: number): Promise<void> {
      return storeShortcut({
        promise: CompaniesService.companiesDestroy({ id }),
        setValue: () => {
          this.company = null
        },
      })
    },
    // Company contracts
    async contractUpload(payload: CompanyContractRequest): Promise<CompanyContract> {
      return storeShortcut({
        promise: ContractsService.contractsCreate({ formData: payload }),
      })
    },
    async contractUpdate(id: number, payload: PatchedCompanyContractRequest): Promise<CompanyContract> {
      return storeShortcut({
        promise: ContractsService.contractsPartialUpdate({ id, formData: payload }),
      })
    },
    async contractDelete(id: number): Promise<void> {
      return storeShortcut({
        promise: ContractsService.contractsDestroy({ id }),
      })
    },
    async contractParseFkko(id: number): Promise<void> {
      return storeShortcut({
        promise: ContractsService.contractsParseFkkoRetrieve({ id }),
      })
    },
    // Tickets
    async ticketsLoad(payload: object): Promise<PaginatedTicketList> {
      return storeShortcut({
        promise: TicketsService.ticketsList(payload),
        setValue: (resp: PaginatedTicketList) => {
          this.tickets = resp.results as Ticket[]
        },
      })
    },
    async ticketLoad(id: number): Promise<Ticket> {
      return storeShortcut({
        promise: TicketsService.ticketsRetrieve({ id }),
        setValue: (resp: Ticket) => {
          this.ticket = resp
        },
      })
    },
    async ticketUpdate(id: number, payload: TicketRequest): Promise<Ticket> {
      return storeShortcut({
        promise: TicketsService.ticketsUpdate({ id, requestBody: payload }),
        setValue: (resp: Ticket) => {
          this.ticket = resp
        },
      })
    },
    async ticketCreate(payload: TicketRequest): Promise<Ticket> {
      return storeShortcut({
        promise: TicketsService.ticketsCreate({ requestBody: payload }),
        setValue: (resp: Ticket) => {
          this.ticket = resp
        },
      })
    },
    async uploadWasteImage(id: number, payload: PatchedFileUploadRequest): Promise<FileUploadResponse> {
      return storeShortcut({
        promise: TicketsService.ticketsUploadWasteImagePartialUpdate({ id, formData: payload }),
      })
    },
    //
    async landfillsLoad(payload: object): Promise<PaginatedLandfillList> {
      return storeShortcut({
        promise: LandfillsService.landfillsList(payload),
        setValue: (resp: PaginatedLandfillList) => {
          this.landfills = resp.results as Landfill[]
        },
      })
    },
    //
    async nonComplianceReportsLoad(payload: object): Promise<PaginatedNonComplianceReportList> {
      return storeShortcut({
        promise: ReportsService.reportsList(payload),
        setValue: (resp: PaginatedNonComplianceReportList) => {
          this.reports = resp.results as NonComplianceReport[]
        },
      })
    },
    async nonComplianceReportLoad(id: number): Promise<NonComplianceReport> {
      return storeShortcut({
        promise: ReportsService.reportsRetrieve({ id }),
        setValue: (resp: NonComplianceReport) => {
          this.report = resp
        },
      })
    },
    async nonComplianceReportsUpdate(id: number, payload: NonComplianceReportRequest): Promise<NonComplianceReport> {
      return storeShortcut({
        promise: ReportsService.reportsUpdate({ id, requestBody: payload }),
        setValue: (resp: NonComplianceReport) => {
          this.report = resp
        },
      })
    },
    async nonComplianceReportCreate(payload: NonComplianceReportRequest): Promise<NonComplianceReport> {
      return storeShortcut({
        promise: ReportsService.reportsCreate({ requestBody: payload }),
      })
    },
  },
})
