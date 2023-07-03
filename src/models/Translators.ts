export class Translators {
    recordId: number;
    languages: number;
    email: string;

    constructor(recordId: number,languages: number, email: string) {
        this.recordId = recordId;
        this.languages = languages;
        this.email = email;
      }
}