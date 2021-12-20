import { LoadAccountPort } from "../../domains/ports/out/load-account.port";
import { UpdateAccountStatePort } from "../../domains/ports/out/update-account-state.port";
import {
  AccountEntity,
  AccountId,
} from "../../domains/entities/account.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AccountOrmEntity } from "./account.orm-entity";
import { Repository } from "typeorm";
import { ActivityOrmEntity } from "./activity.orm-entity";
import { AccountMapper } from "./account.mapper";

@Injectable()
export class AccountPersistenceAdapterService
  implements LoadAccountPort, UpdateAccountStatePort
{
  constructor(
    private _accountRepository: Repository<AccountOrmEntity>,
    private _activityRepository: Repository<ActivityOrmEntity>
  ) {}
  updateAccountStatePort(account: AccountEntity) {
    throw new Error("Method not implemented.");
  }
  async loadAccount(accountId: AccountId): Promise<AccountEntity> {
    const account = await this._accountRepository.findOne({
      userId: accountId,
    });
    if (account === undefined) {
      throw new Error("Account not found");
    }
    const activities = await this._activityRepository.find({
      ownerAccountId: accountId,
    });

    return AccountMapper.mapToDomain(account, activities);
  }

  updateActivities(account: AccountEntity) {
    account.activityWindow.activities.forEach((activity) => {
      if (activity.id === null) {
        this._activityRepository.save(AccountMapper.mapToOrmEntity(activity));
      }
    });
  }
}
