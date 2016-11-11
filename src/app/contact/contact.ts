export class Contact {
  _id?: number;
  name: string;
  email: string;
  phone: {
    mobile: string;
    work: string;
  }
}
class Phones {
  mobile: string;
  work: string;
}
