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
        <ul class="list-group">
          <li class="list-group-item"
            *ngFor="let contact of contacts"
            [class.active]="contact === selectedContact"
            (click)="selectContact(contact)">
            {{contact.name}}
            <span
              class="glyphicon glyphicon-remove pull-right"
              (click)="deleteContact(contact)">
            </span>
          </li>
        </ul>
      </div>

      <div class="col-md-4 col-md-offset-1">
        <contact-detail [contact]="selectedContact" [arrayHandler]="modifyContacts()"></contact-detail>
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

    constructor (private contactService: ContactService) {}

    ngOnInit() {
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

    // this is either created elem or an updated response is same for both
    // add returned value to array
    modifyContacts() {
        var contactsComp: ContactsComponent = this;
        return (contact: Contact) => {
          for (let i in contactsComp.contacts) {
             if (contactsComp.contacts[i]._id === contact._id) {
               contactsComp.contacts[i] = contact
               contactsComp.selectContact(contact)
               return
             }
          }
          contactsComp.contacts.push(contact)
          contactsComp.selectContact(contact)
        };
    }

    private removeContactFromContacts(c: Contact) {
      var idx = this.contacts.findIndex((contact) => {
        return contact._id === c._id;
      });
      if (idx !== -1) {
        return this.contacts.splice(idx, 1);
      }
      return this.contacts

    }

    deleteContact(contact: Contact) {
      this.contactService.deleteContact(contact).then( () => {
        this.removeContactFromContacts(contact);
        this.selectContact(null);
      });
    }

    getContacts() {
        this.contactService.getContacts().then((contacts: Contact[]) => {
            this.contacts = contacts;
        });
    }
}
