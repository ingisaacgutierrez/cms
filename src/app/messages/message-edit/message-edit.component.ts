import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject', { static: false }) subjectInputRef: ElementRef;
  @ViewChild('msgText', { static: false }) msgTextInputRef: ElementRef;

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const newMessage = new Message(
      '99',              
      subject,           
      msgText,           
      subject            
    );

    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
