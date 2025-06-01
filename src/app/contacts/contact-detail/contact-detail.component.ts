import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from '../contact.service';



@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent {
  @Input() contact: Contact;

  constructor(
  private contactService: ContactService,
  private route: ActivatedRoute,
  private router: Router
) {}

ngOnInit(): void {
  this.route.params.subscribe((params: Params) => {
    const id = params['id'];
    this.contact = this.contactService.getContact(id);
  });
}

}
