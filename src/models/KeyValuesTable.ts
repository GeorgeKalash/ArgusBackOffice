export class KeyValuesTable {
  key: number;
  language: number;
  value1: string;
  value2: string;
  editedValue2: string;

  constructor(key: number,language: number, value1: string, value2: string, editedValue2: string) {
    this.key = key;
    this.language = language;
    this.value1 = value1;
    this.value2 = value2;
    this.editedValue2 = editedValue2;
  }
}
