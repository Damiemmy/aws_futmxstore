import { api } from '../../api/client'
import type { Material, MaterialUploadPayload, Pagination } from '../../types/api'

export const materialService = {
  list: async (params: { course?: number; search?: string; page?: number }) =>
    (
      await api.get<Pagination<Material>>('/academics/materials/', {
        params: { ...params, page_size: 6 },
      })
    ).data,
  detail: async (id: number) => (await api.get<Material>(`/academics/materials/${id}/`)).data,
  upload: async (payload: MaterialUploadPayload) => {
    const body = new FormData()
    body.append('course', String(payload.course))
    body.append('title', payload.title)
    body.append('description', payload.description)
    body.append('file', payload.file)
    return (
      await api.post<Material>('/academics/materials/create/', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data
  },
  downloadUrl: (id: number) => `${api.defaults.baseURL}/academics/materials/${id}/download/`,

  download: async (id: number) => {
    const response = await api.get(`/academics/materials/${id}/download/`, {
      responseType: 'blob',
    })

    return response.data
  },
}
