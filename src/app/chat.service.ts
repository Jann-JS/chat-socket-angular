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
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return this.observable;
  }

}
