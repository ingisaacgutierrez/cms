import { Component } from '@angular/core';
import { Message } from '../message.model';


@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})

export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Hello', 'Hi there!', 'Alice'),
    new Message('2', 'Angular', 'Angular is awesome!', 'Bob'),
    new Message('3', 'Meeting', 'Let\'s meet at 5pm.', 'Charlie')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}