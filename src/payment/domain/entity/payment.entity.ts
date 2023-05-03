interface PaymentSlipEntityProps {
  code: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  type: string;
  recipient: {
    name: string;
    document: string;
  };
}

export class PaymentSlipEntity {
  constructor(private readonly props: PaymentSlipEntityProps) {
    this.validate();
  }

  validate() {
    if (this.paymentDate < this.dueDate) {
      throw new Error("Payment date must be greater than due date");
    }
    if (this.type != "NPC") {
      throw new Error("Payment slip type must be NPC");
    }
  }

  get code() {
    return this.props.code
  }

  get recipientName() {
    return this.props.recipient.name
  }

  get recipientDocument() {
    return this.props.recipient.document
  }

  get type() {
    return this.props.type;
  }

  get dueDate() {
    return this.props.dueDate;
  }

  get amount() {
    return this.props.amount;
  }

  get paymentDate(): Date {
    return this.props.paymentDate;
  }

  private lateFees(): number {
    const valueForDelay = 0.02;
    return this.props.amount * valueForDelay;
  }

  private dailyFine() {
    const diffInMs: number = Math.abs(
      this.dueDate.getTime() - this.paymentDate.getTime()
    );
    const millisecondsInDay = 1000 * 3600 * 24;
    const diffInDays = Math.ceil(diffInMs / millisecondsInDay);
    const valueForDaily = 0.01 * (1 / 30);
    return this.formatTheNumber(diffInDays * valueForDaily * this.amount);
  }

  get interestAmountCalculated() {
    const percentageTotal = (this.totalAmountWithFine * 100) / this.amount;
    return this.formatTheNumber(percentageTotal - 100);
  }

  get totalAmountWithFine(): number {
    return this.formatTheNumber(this.fineAmountCalculated + this.amount);
  }

  get fineAmountCalculated() {
    return this.formatTheNumber(this.dailyFine() + this.lateFees());
  }

  private formatTheNumber(value: number) {
    return parseFloat(value.toFixed(2));
  }
}
