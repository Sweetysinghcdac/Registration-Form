import { Injectable } from '@angular/core';
import  {InMemoryDbService} from 'angular-in-memory-web-api';
import { User } from './user_interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService  implements InMemoryDbService{

  constructor() { }

  createDb(){
let users : User[] = [
  {id:1, title: 'Mr', firstName :  'Ajeet', lastName: 'Singh', dob : '28-07-2001',email:'sfsbgg@gmailcom', password: '2345wre', acceptTerms:true},
  {id:2, title: 'Mr', firstName :  'Rits', lastName: 'Singh', dob : '07-10-1996',email:'ssweet@gmailcom', password: '2345', acceptTerms:true}
];

return { users };

  }
   
  

}
