import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  @Input() contact: Contact;
  private contactSub: Subscription;
  private id: string;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.contact = this.contactService.getContact(this.id);
    });


    this.contactSub = this.contactService.contactListChangedEvent.subscribe(() => {
      this.contact = this.contactService.getContact(this.id);
    });
  }

  onDelete(): void {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }

  ngOnDestroy(): void {
    if (this.contactSub) {
      this.contactSub.unsubscribe();
    }
  }
}

