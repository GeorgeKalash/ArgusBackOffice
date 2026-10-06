export class Releases {
    release : string;
    date: Date;
    notes: string;

    constructor(release : string, date: Date, notes: string) {
        this.release  = release ;
        this.date  = date ;
        this.notes = notes;
      }
}