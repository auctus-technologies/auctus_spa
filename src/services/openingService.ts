import axios from '@/lib/axios';
import {
  Opening,
  OpeningCreatePayload,
  OpeningUpdatePayload,
  OpeningListResponse,
  FormChoicesResponse,
} from '@/types';

const BASE_URL = '/openings';

export const openingService = {
  async getFormChoices(): Promise<FormChoicesResponse> {
    const response = await axios.get<FormChoicesResponse>(`${BASE_URL}/form-choices`);
    return response.data;
  },

  async getOpenings(): Promise<Opening[]> {
    const response = await axios.get<OpeningListResponse>(BASE_URL);
    return response.data.openings;
  },

  async getOpeningById(id: number): Promise<Opening> {
    const response = await axios.get<Opening>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async createOpening(payload: OpeningCreatePayload): Promise<Opening> {
    const response = await axios.post<Opening>(BASE_URL, payload);
    return response.data;
  },

  async updateOpening(id: number, payload: OpeningUpdatePayload): Promise<Opening> {
    const response = await axios.put<Opening>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  async deleteOpening(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },
};
