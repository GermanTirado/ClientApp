import { Contact } from './contact.model';

export interface ResponseModel {
  message: string;
  success: number;
  data: Contact[];
}
