export class Requests {
  recordId: number;
  accountId: number;
  userId: number;
  eventType: number;
  clockStamp: number;
  url: number;
  token: string;
  requestBody: string;

  constructor(
    recordId: number,
    accountId: number,
    userId: number,
    eventType: number,
    clockStamp: number,
    url: number,
    token: string,
    requestBody: string
  ) {
    this.recordId = recordId;
    this.token = token;
    this.accountId = accountId;
    this.userId = userId;
    this.eventType = eventType;
    this.clockStamp = clockStamp;
    this.url = url;
    this.requestBody = requestBody;
  }
}
