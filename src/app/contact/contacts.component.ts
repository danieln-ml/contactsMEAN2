import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import {Http, Response} from '@angular/http';
import { Contact } from './contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contacts.component.html',
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

    // this is either created elem or an updated response is same for both
    // add returned value to array
    modifyContacts(contact: Contact) {
        for (let i in this.contacts) {
           if (this.contacts[i]._id === contact._id) {
             this.contacts[i] = contact
             return
           }
        }
        this.contacts.push(contact)
    }

    createNewContact() {
        var contact: Contact = {
            firstName: '',
            lastName: '',
            email: ''
        };
        this.selectContact(contact);
    }

    private removeContactFromContacts(c: Contact) {
      var idx = this.contacts.findIndex(function(contact) {
        return contact._id === c._id;
      });
      if (idx != -1) {
        return this.contacts.splice(idx, 1);
      }
      return this.contacts

    }

    deleteContact(contact: Contact) {
      this.contactService.deleteContact(contact).then((function() {
        this.removeContactFromContacts(contact);
        this.selectContact(null);
      }).bind(this));
    }

    getContacts() {
        this.contactService.getContacts().then((contacts: Contact[]) => {
            console.log(contacts);
            this.contacts = contacts;
        });
    }
}
