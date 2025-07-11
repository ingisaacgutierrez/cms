import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';


@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})

export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
  this.messageService.getMessages();
  this.messageService.messageListChangedEvent.subscribe(
    (messages: Message[]) => {
      this.messages = messages;
    }
  );
}


  onAddMessage(message: Message) {
  this.messageService.addMessage(message);
}


}