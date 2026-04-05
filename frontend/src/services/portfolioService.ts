import api from '../lib/axios'
import type { PortfolioDTO } from '../types/portfolioType';



const BASE = "/api/portfolios";


export const portfolioService = {

    
    getMyPortfolio : () => api.get<PortfolioDTO[]>(`${BASE}/user`),

    

}