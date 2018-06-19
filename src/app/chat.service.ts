import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  private socket;
  private observable;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  public sendMessage(msg: string, username: string) {
    this.socket.emit('message', msg, username);
    this.socket.emit('users');
  }

  public getMessages() {
    this.observable = new Observable(observer => {
        this.socket.on('message', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      });
    return this.observable;
  }

  public saveUsername(name: string) {
    this.socket.emit('users', name);
  }

  public getUsers() {
    this.observable = new Observable(observer => {
      this.socket.on('users', (data) => {
        /* for (let i = 0; i < data.users.length; i++) {
          this.user = {
            username: String
          }
          this.user.username = data.users[i];
          this.myArray.push(this.user);
        }

        observer.next(this.myArray); */
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return this.observable;
  }

}
