export class KeyValues {
    dataset: number;
    language: number;
    key: number;
    value: string;

    constructor(dataset: number,language: number,key: number, value: string) {
        this.dataset = dataset;
        this.language = language;
        this.key = key;
        this.value = value;
      }
}