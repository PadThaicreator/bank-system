import api from '../lib/axios'
import type { PortfolioDTO, PortfolioDetailDTO } from '../types/portfolioType';



const BASE = "/api/portfolios";


export const portfolioService = {

    
    getMyPortfolio : () => api.get<PortfolioDTO[]>(`${BASE}/user`),

    getStockInPortfolio : (symbol: string , portfolioId: string) => api.get<PortfolioDetailDTO>(`${BASE}/detail` , {
        params: {
            symbol,
            portfolioId
        }
    }),

}