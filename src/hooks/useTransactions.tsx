import { createContext, ReactNode, useEffect, useState, useContext } from 'react'
import { api } from '../services/api'

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionsContextProviderProps {
    children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionContextProviderData {
    transactions: Transaction[];
    createTransaction: (transactionInput: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionContextProviderData>(
    {} as TransactionContextProviderData
)

export function TransactionsContextProvider({ children }: TransactionsContextProviderProps) {

    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction(transactionInput: TransactionInput) {
          const response = await api.post('/transactions', {
              ...transactionInput,
              createdAt: new Date()
          })
          const { transaction } = response.data

          setTransactions([
              ...transactions,
              transaction
          ])
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext)

    return context
}