import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent {
  contact: Contact = new Contact('', '', '', '', '', null);
}
