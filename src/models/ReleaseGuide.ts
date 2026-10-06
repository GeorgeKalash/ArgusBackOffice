export class ReleaseGuide {
    release : string;
    moduleId : number;
    seqNo : number;
    subject: string;
    guide: string;

    constructor(release : string, moduleId : number, seqNo : number, subject: string, guide: string) {
        this.release  = release ;
        this.moduleId  = moduleId ;
        this.seqNo  = seqNo ;
        this.subject = subject;
        this.guide = guide;
      }
}