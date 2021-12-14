import { MoneyEntity } from "./money.entity";

export class ActivityEntity {
  constructor(
    private readonly _timestamp: Date,
    private readonly _money: MoneyEntity
  ) {}

  get timestamp(): Date {
    return this._timestamp;
  }

  get money(): MoneyEntity {
    return this._money;
  }
}
