import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user_interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_BASE_URL: string = "http://localhost:4200/api/";
  constructor(private _httpService: HttpClient) { }

  getUsers() {
    return this._httpService.get(this.API_BASE_URL + "users");
  }

  // To get one user
  getUser(userId: number) {
    return this._httpService.get(`${this.API_BASE_URL}users/${userId}`)
  }

  // To save the user
  addUser(user: User) {
    return this._httpService.post(`${this.API_BASE_URL}users`,user)
  }

  // To update the user
  updateUser(user: User) {
    return this._httpService.put(`${this.API_BASE_URL}users/${user.id}`,user)
  }

  deleteUser(userId: number) {
    return this._httpService.delete(`${this.API_BASE_URL}users/${userId}`)
  }

}
