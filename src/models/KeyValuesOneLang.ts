import { KeyValues } from './KeyValues';

export class KeyValuesOneLang extends KeyValues {
  editedValue: string;

  constructor(
    dataset: number,
    language: number,
    key: string,
    value: string,
    editedValue: string
  ) {
    super(dataset, language, key, value);
    this.editedValue = value;
  }
}
