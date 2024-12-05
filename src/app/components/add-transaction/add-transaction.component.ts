import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'

import { Category, Transaction, TransactionsService, Type } from '../../services/transactions.service'

export interface DialogData {
  transaction: Transaction
}

@Component({
  selector: 'app-add-transaction.component',
  standalone: true,
  providers: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddTransactionComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddTransactionComponent>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  readonly transactionsService = inject(TransactionsService)

  public form: FormGroup

  public typesEnum = Type
  public types = Object.values(Type)
    .filter((key) => !isNaN(+key))
    .map((k) => +k)
  public categoryEnum = Category
  public categories = Object.values(Category)
    .filter((key) => !isNaN(+key))
    .map((k) => +k)

  constructor() {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^\d*\.?\d{0,2}$/)]),

      category: new FormControl(null),
      type: new FormControl(Type.Expense),
      date: new FormControl(new Date()),
    })
  }

  ngOnInit(): void {
    if (this.data.transaction) {
      this.form.patchValue({
        id: this.data.transaction.id,
        name: this.data.transaction.name,
        category: this.data.transaction.category,
        type: this.data.transaction.type,
        date: this.data.transaction.date,
        amount: this.data.transaction.amount,
      })
    }
  }

  public onCancel(): void {
    this.dialogRef.close()
  }

  public saveTransaction(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.dialogRef.close({
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      category: this.form.get('category')?.value,
      type: this.form.get('type')?.value,
      date: this.form.get('date')?.value,
      amount: parseFloat(this.form.get('amount')?.value),
    })
  }
}
