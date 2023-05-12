export interface IBlog {
    _id: any,
    Title: string,
    CreateDate: any,
    Writer: string,
    Content: string,
    Image: string;
    Outstanding: boolean
  }

  export class Blog {
    constructor(
        public _id: any=null,
        public Title: string = '',
        public CreateDate: any = '',
        public Writer: string = '',
        public Content: string = '',
        public Image: string = '',
        public Outstanding: boolean = false
    ) { }
  }
