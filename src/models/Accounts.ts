export class Accounts {
  accountId: number;
  accountName: string;
  api: string;

    constructor(accountId: number, accountName: string, api: string) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.api = api;
      }
}