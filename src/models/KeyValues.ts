export class KeyValues {
    dataset: number;
    language: number;
    key: string;
    value: string;

    constructor(dataset: number,language: number,key: string, value: string) {
        this.dataset = dataset;
        this.language = language;
        this.key = key;
        this.value = value;
      }
}