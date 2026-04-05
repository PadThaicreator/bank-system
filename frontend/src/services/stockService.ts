import api from '../lib/axios'
import type { PaginatedStockResponse, StockPriceDTO } from '../types/stockType';



const BASE = "/api/stocks";


export const stockService = {

    
    getAllStocks: (page: number = 0, size: number = 10) => api.get<PaginatedStockResponse>(`${BASE}`, { params: { page, size } }),

    getStockPrice : (symbol : string) => api.get<StockPriceDTO>(`${BASE}/price/${symbol}`),

    

}