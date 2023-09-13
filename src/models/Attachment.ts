export class Attachment {
  resourceId: number;
  layoutId: number;
  fileName: string;

  constructor(resourceId: number, layoutId: number, fileName: string) {
    this.resourceId = resourceId;
    this.layoutId = layoutId;
    this.fileName = fileName;
  }
}
