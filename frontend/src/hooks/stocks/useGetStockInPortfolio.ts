import { useState, useCallback } from 'react';
import { portfolioService } from '../../services/portfolioService';
import type { PortfolioDetailDTO } from '../../types/portfolioType';

export default function useGetStockInPortfolio() {
  const [stockDetail, setStockDetail] = useState<PortfolioDetailDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockInPortfolio = useCallback(async (symbol: string, portfolioId: string) => {
    if (!symbol || !portfolioId) {
       setStockDetail(null);
       return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioService.getStockInPortfolio(symbol, portfolioId);
      // The API might return response directly or wrapped in data depending on axios config
      const data = response.data !== undefined ? response.data : response;
      setStockDetail(data as PortfolioDetailDTO);
    } catch (err: any) {
      setStockDetail(null);
      // It's possible the stock is not in the portfolio (e.g. 404/400).
      setError(err.response?.data?.error?.details || err.message || "Failed to fetch stock in portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetStockDetail = useCallback(() => {
    setStockDetail(null);
  }, []);

  return { stockDetail, loading, error, fetchStockInPortfolio, resetStockDetail };
}
