import { http } from "../lib/http";
import type { Company, CompanySummary, Establishment, EstablishmentRequest, UpdateCompanyRequest } from "../types/organization";

class OrganizationService {
  async listCompanies() {
    const { data } = await http.get<CompanySummary[]>("/companies");
    return data;
  }

  async getCompany() {
    const { data } = await http.get<Company>("/company");
    return data;
  }

  async updateCompany(payload: UpdateCompanyRequest) {
    const { data } = await http.patch<Company>("/company", payload);
    return data;
  }

  async listEstablishments() {
    const { data } = await http.get<Establishment[]>("/establishments");
    return data;
  }

  async createEstablishment(payload: EstablishmentRequest) {
    const { data } = await http.post<Establishment>("/establishments", payload);
    return data;
  }

  async updateEstablishment(id: string, payload: Partial<EstablishmentRequest>) {
    const { data } = await http.patch<Establishment>(`/establishments/${id}`, payload);
    return data;
  }

  async archiveEstablishment(id: string) {
    await http.delete(`/establishments/${id}`);
  }
}

export const organizationService = new OrganizationService();
