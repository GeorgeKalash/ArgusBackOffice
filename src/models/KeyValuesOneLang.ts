import { KeyValues } from './KeyValues';

export class KeyValuesOneLang extends KeyValues {
  editedValue: string;

  constructor(
    dataset: number,
    language: number,
    key: number,
    value: string,
    editedValue: string
  ) {
    super(dataset, language, key, value);
    this.editedValue = value;
  }
}
