import { Component, Input } from '@angular/core';
import { Contact } from './contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'contact-detail',
  template: `
    <div *ngIf="contact">
        <h2>Contact Details</h2>
        <form>
          <div class="form-group">
              <label for="contact-first-name">First Name:</label>
              <input class="form-control" name="contact-first-name" [(ngModel)]="contact.firstName" placeholder="First"/>
          </div>
          <div class="form-group">
              <label for="contact-last-name">Last Name:</label>
              <input class="form-control" name="contact-last-name" [(ngModel)]="contact.lastName" placeholder="Last"/>
          </div>
          <div class="form-group">
              <label for="contact-email">Email:</label>
              <input class="form-control" name="contact-email" [(ngModel)]="contact.email" placeholder="example@abc.com"/>
          </div>

          <button class="btn btn-primary" *ngIf="!contact._id" (click)="createContact(contact)">Create</button>
          <button class="btn btn-info" *ngIf="contact._id" (click)="updateContact(contact)">Save</button>
        </form>
    </div>
    `
})
export class ContactDetail {
  @Input()
  contact: Contact;

  @Input()
  arrayHandler: Function;

  constructor (private contactService: ContactService) {}

  updateContact(toUpdate: Contact): void {
    this.contactService.updateContact(toUpdate).then((updated: Contact) => {
      this.arrayHandler(updated);
    });
  }

  createContact(newContact: Contact) {
    this.contactService.createContact(newContact).then((created: Contact) => {
      this.arrayHandler(created);
      this.contact = created;
    });
  }
}
