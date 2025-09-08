import  apiClient  from "./client"
import type { Transaction, TransactionItem } from "./types"

interface CreateTransactionDto {
    items: {
        id: string;
        type: 'service' | 'product';
        quantity: number;
    }[];
    paymentMethod: 'cash' | 'card';
}

export const transactionsApi = {
  async create(data: CreateTransactionDto): Promise<Transaction> {
    return apiClient.post("/transactions", data)
  },
}
