export class Contact {
  id: number;
  regDate: string;
  name: string;
  address: string;
  phone: string;
  curp: string;
  active: number;

  constructor(
    id: number, regDate: string, name: string, address: string, phone: string, curp: string, active: number
  ) {
    this.id = id;
    this.regDate = regDate;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.curp = curp;
    this.active = active;
  }
}
