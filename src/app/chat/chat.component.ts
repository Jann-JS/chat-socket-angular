import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as io from 'socket.io-client';
import { ChatService } from '../chat.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages = [];
  public username = '';
  public connectionMessage;
  public connectionUsers;
  public connectionOnline;
  public userOnline = [];
  public newMsg = '';
  public check: Boolean = false;

  constructor(private chatService: ChatService) { }

  /**
   *
   *
   * @param {string} value
   * @memberof ChatComponent
   */
  public sendMessage(value: string) {
    this.newMsg = value;
    this.username = sessionStorage.getItem('add-user');
    this.chatService.sendMessage(this.newMsg, this.username);
    this.newMsg = '';
    if (this.messages.length > 8) {
      this.messages.splice(0, 1);
    }
  }

  /**
   *
   *
   * @param {string} name
   * @memberof ChatComponent
   */
  public onUserName(name: string) {
    sessionStorage.setItem('add-user', name);
    this.chatService.saveUsername(name);
    this.check = true;
    this.username = '';
  }

  ngOnInit() {
    this.connectionOnline = this.chatService.getUsers().subscribe(data => {
      this.userOnline.push(data);
    });
    this.connectionMessage = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    });
  }

  ngOnDestroy() {
    this.connectionMessage.unsubscribe();
    this.connectionOnline.unsubscribe();
  }

}
