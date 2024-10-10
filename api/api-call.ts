import test, { request, Page } from '@playwright/test';
import axios from 'axios'
import * as fs from 'fs/promises';


// Class for internal API calls
export class APIcall {

    API_URL : string
    TOKEN :string
   
    constructor(public page: Page) {
        this.page = page
        this.API_URL = 'https://api.hubapi.com'
        this.TOKEN = 'Bearer pat-na1-bb72ef71-e121-4633-a194-72c475ab65c8'
    }


    async createNewContact(filePath: string) {
        console.log(`Call for ${this.API_URL}/crm/v3/objects/contacts`);
        try {
            const jsonData = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(jsonData);
            const response = await axios({
                method: 'POST',
                url: `${this.API_URL}/crm/v3/objects/contacts`,
                data: data,
                headers: {
                    Accept: 'application/json',
                    authorization: this.TOKEN 
                },
            });
    
            console.log("the ID of the created user is :" ,response.data.id);
    
            if (response.status !== 201) {
                throw new Error(`Failed with status code ${response.status}`);
            }
    
            const result = await response.data.id;
            return result;
    
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async countContacts(expectedCountResult:number) {
        console.log(`Call for ${this.API_URL}/crm/v3/objects/contacts`);
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.API_URL}/crm/v3/objects/contacts`,
                headers: {
                    authorization: this.TOKEN 
                },
            });
    
            const contacts = response.data.results;
            console.debug("THE CONTACTS ARE: ", JSON.stringify(contacts));
    
            if (Array.isArray(contacts)) {
                const numberOfContacts = contacts.length;
                console.log(`Number of contacts: ${numberOfContacts}`);
    
                if (numberOfContacts === expectedCountResult) {
                    console.log("Verification passed: Correct number of contacts.");
                } else {
                    throw new Error(`Verification failed: Expected ${expectedCountResult} contacts, but got ${numberOfContacts}.`);
                }
            } else {
                console.debug("Response data is not an array.");
            }
    
            if (response.status !== 200) {
                throw new Error(`Failed with status code ${response.status}`);
            }
    
            return contacts;
    
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async getContact(contactId:string) {
        console.log(`Call for ${this.API_URL}/crm/v3/objects/contacts/${contactId}`);
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.API_URL}/crm/v3/objects/contacts/${contactId}`,
                headers: {
                    authorization: this.TOKEN 
                },
            });
    
            const contacts = response;
            console.debug("THE CONTACT DATA IS: ", response.data);
    
            if (response.status !== 200) {
                throw new Error(`Failed with status code ${response.status}`);
            }
    
            return response.data.properties;
    
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async verifyContactProperties(filePath: string, createdContactProperties: any): Promise<void> {
        
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const dataFromFile = JSON.parse(jsonData);
        const email1 = dataFromFile.properties?.email;
        const firstName1 = dataFromFile.properties?.firstname;
        const lastName1 = dataFromFile.properties?.lastname;
    
        // const dataFromResponse = JSON.parse(createdContactProperties);
        const email2 = createdContactProperties.email;
        const firstName2 = createdContactProperties.firstname;
        const lastName2 = createdContactProperties.lastname;
    
        // Compare email
        if (email1 === email2) {
            console.log("Email matches: ", email1);
        } else {
            throw new Error(`Email mismatch: json1 has ${email1}, json2 has ${email2}`);
        }
    
        // Compare first name
        if (firstName1 === firstName2) {
            console.log("First name matches: ", firstName1);
        } else {
            throw new Error(`First name mismatch: json1 has ${firstName1}, json2 has ${firstName2}`);
        }
    
        // Compare last name
        if (lastName1 === lastName2) {
            console.log("Last name matches: ", lastName1);
        } else {
            throw new Error(`Last name mismatch: json1 has ${lastName1}, json2 has ${lastName2}`);
        }
    }
    
    
    
    
   
}