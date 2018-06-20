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

  /**
   *
   *
   * @param {string} msg
   * @param {string} username
   * @memberof ChatService
   */
  public sendMessage(msg: string, username: string) {
    this.socket.emit('message', msg, username);
  }

  /**
   *
   *
   * @returns
   * @memberof ChatService
   */
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

  /**
   *
   *
   * @param {string} name
   * @memberof ChatService
   */
  public saveUsername(name: string) {
    this.socket.emit('users', name);
  }

  /**
   *
   *
   * @returns
   * @memberof ChatService
   */
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
