import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  public transactions: Transaction[] = []

  constructor() {
    const str = localStorage.getItem('transactions')
    if (str) this.transactions = JSON.parse(str)
  }

  getTransactions(): Transaction[] {
    return this.transactions
  }

  public addTransaction(transaction: Transaction): void {
    transaction.id = this.getNewId()
    this.transactions.push(transaction)
    localStorage.setItem('transactions', JSON.stringify(this.transactions))
  }

  public editTransaction(transaction: Transaction): void {
    const index: number = this.transactions.findIndex((x) => x.id === transaction.id)
    if (index !== -1) {
      this.transactions[index] = transaction
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    }
  }

  private getNewId(): number {
    if (this.transactions.length) {
      return this.transactions.reduce((a, b) => (a.id > b.id ? a : b)).id + 1
    }
    return 0
  }

}

export interface Transaction {
  id: number
  name: string
  date: Date
  amount: number
  category: Category
  type: Type
}
export enum Category{
  Groceries,
  Salary,
  Entertainment
}
export enum Type {
  Income,
  Expense,
}
