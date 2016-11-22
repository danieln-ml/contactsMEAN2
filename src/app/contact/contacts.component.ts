import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import {Http, Response} from '@angular/http';
import { Contact } from './contact';

@Component({
  selector: 'app-contacts',
  template: `
    <div class="row">
      <div class="col-md-4 col-md-offset-1">
        <h2>
          Contacts
          <button type="button" class="btn btn-success pull-right"  (click)="createNewContact()">
            <span class="glyphicon glyphicon-plus"></span>
          </button>
        </h2>

        <div *ngIf="loaded && contacts.length == 0" class="error">
          No Contacts add a contact
        </div>

        <ul *ngIf="loaded && contacts.length > 0" class="list-group">
          <li class="list-group-item"
            *ngFor="let contact of contacts"
            [class.active]="contact === selectedContact"
            (click)="selectContact(contact)">
            {{contact.name}}
          </li>
        </ul>
      </div>

      <div class="col-md-4 col-md-offset-1">
        <contact-detail
          [contact]="selectedContact"
          [createHandler]="addContact.bind(this)"
          [updateHandler]="updateContact.bind(this)"
          [deleteHandler]="deleteContact.bind(this)">
        </contact-detail>
      </div>
    </div>
  `,
  styleUrls: ['./contact.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {

    title: 'Contacts List'
    contacts: Contact[]
    selectedContact: Contact
    loaded: boolean

    constructor (private contactService: ContactService) {}

    ngOnInit() {
      this.loaded = false;
      this.getContacts();
    }

    selectContact(contact: Contact) {
        this.selectedContact = contact
    }

    createNewContact() {
        var contact: Contact = {
            name: '',
            email: '',
            phone: {
              work: '',
              mobile: ''
            }
        };
        this.selectContact(contact);
    }

    // Array Updates Funcitons
    deleteContact(contact: Contact) {
      var idx = this.contacts.findIndex((c) => {
        return c._id === contact._id;
      });
      if (idx !== -1) {
        return this.contacts.splice(idx, 1);
      }
      return this.contacts
    }

    addContact(contact: Contact) {
      this.contacts.push(contact)
      return this.contacts;
    }

    updateContact(contact: Contact) {
      for (let i in this.contacts) {
        if (this.contacts[i]._id === contact._id) {
          this.contacts[i] = contact
        }
      }
      return this.contacts;
    }

    // Promise Functions
    getContacts() {
      this.contactService.getContacts().then((contacts: Contact[]) => {
        this.loaded = true;
        this.contacts = contacts
      });
    }
}
