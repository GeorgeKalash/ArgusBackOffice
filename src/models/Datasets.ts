export class Datasets {
    datasetId : number;
    name: string;
    editedValue: string;

    constructor(datasetId : number, name: string, editedValue: string) {
        this.datasetId  = datasetId ;
        this.name = name;
        this.editedValue = editedValue;
      }
}