import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId: number = 0;
  private baseUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages(): void {
    this.http.get<Message[]>(this.baseUrl)
      .subscribe(
        (messages) => {
          this.messages = messages ?? [];
          this.maxMessageId = this.getMaxId();
          this.sortAndSend();
        },
        (error) => console.error('Error fetching messages:', error)
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message): void {
    if (!message) return;

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Message>(this.baseUrl, message, { headers })
      .subscribe(
        (newMessage) => {
          this.messages.push(newMessage);
          this.sortAndSend();
        }
      );
  }

  updateMessage(original: Message, updated: Message): void {
    if (!original || !updated) return;

    const pos = this.messages.findIndex(m => m.id === original.id);
    if (pos < 0) return;

    updated.id = original.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<Message>(`${this.baseUrl}/${original.id}`, updated, { headers })
      .subscribe(
        (updatedMessage) => {
          this.messages[pos] = updatedMessage;
          this.sortAndSend();
        }
      );
  }

  deleteMessage(message: Message): void {
    if (!message) return;

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) return;

    this.http.delete(`${this.baseUrl}/${message.id}`)
      .subscribe(
        () => {
          this.messages.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend(): void {
    this.messages.sort((a, b) =>
      a.subject.toLowerCase() > b.subject.toLowerCase() ? 1 : -1
    );
    this.messageListChangedEvent.next(this.messages.slice());
  }
}

