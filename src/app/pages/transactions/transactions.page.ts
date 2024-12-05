import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { take } from 'rxjs'

import AddTransactionComponent from '../../components/add-transaction/add-transaction.component'
import { Category, Transaction, TransactionsService, Type } from '../../services/transactions.service'

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './transactions.page.html',
  styleUrl: './transactions.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionsPage implements AfterViewInit {
  displayedColumns: string[] = ['name', 'date', 'amount', 'category', 'type', 'actions']
  dataSource = new MatTableDataSource<Transaction>()
  @ViewChild(MatSort, { static: false }) sort!: MatSort

  readonly dialog = inject(MatDialog)
  readonly transactionsService = inject(TransactionsService)

  public typesEnum = Type
  public types = Object.values(Type)
    .filter((key) => !isNaN(+key))
    .map((k) => +k)
  public categoryEnum = Category

  constructor() {
    this.dataSource.data = this.transactionsService.getTransactions()
    this.dataSource.filterPredicate = (data, filter) => {
      return +data.type === +filter
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
  }

  applyFilter(event: MatSelectChange) {
    this.dataSource.filter = event.value
  }

  getTotalBalance(): number {
    return this.dataSource.filteredData.reduce((acc, transaction) => {
      return transaction.type === this.typesEnum.Income ? acc + transaction.amount : acc - transaction.amount
    }, 0)
  }

  public addTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '600px',
      data: { transaction: null },
    })
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.transactionsService.addTransaction(dialogResult)
          this.dataSource._updateChangeSubscription()
        }
      })
  }

  public editTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '600px',
      data: { transaction: transaction },
    })
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.transactionsService.editTransaction(dialogResult)
          const index: number = this.dataSource.data.findIndex((x) => x.id === dialogResult.id)
          if (index !== -1) {
            this.dataSource.data[index] = dialogResult
            this.dataSource._updateChangeSubscription()
          }
        }
      })
  }
}
