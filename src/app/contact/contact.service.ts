import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Contact } from './contact';
import { CONTACTS, CONTACT } from './mockContacts';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContactService {
    // URL to web API
    private contactsUrl = '/api/contacts';

    constructor (private http: Http) {}

    // get("/contacts")
    getContacts(): Promise<Contact[]> {
      return this.http.get(this.contactsUrl)
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
    }

    // delete("/contacts/:id")
    deleteContact(delContact: Contact): Promise<number> {
      return this.http.delete(this.contactsUrl + '/' + delContact._id)
                 .toPromise()
                 .then(response => response.json() as number)
                 .catch(this.handleError);
    }

    // post("/contacts")
    createContact(newContact: Contact): Promise<Contact> {
      return this.http.post(this.contactsUrl, newContact)
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.handleError);
    }

    // put("/contacts/:id")
    updateContact(putContact: Contact): Promise<Contact> {
      var putUrl = this.contactsUrl + '/' + putContact._id;
      return this.http.put(putUrl, putContact)
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
}
