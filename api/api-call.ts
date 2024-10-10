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


    async verifyContactProperties(filePath: string, createdContactProperties: any, propertiesToCompare: string[]): Promise<void> {
        // Read and parse the JSON data from the file
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const dataFromFile = JSON.parse(jsonData);
        
        // Iterate over the array of properties to compare
        for (const property of propertiesToCompare) {
            const valueFromFile = dataFromFile.properties?.[property];
            const valueFromResponse = createdContactProperties?.[property];
    
            // Compare the values for the current property
            if (valueFromFile === valueFromResponse) {
                console.log(`${property} matches: `, valueFromFile);
            } else {
                throw new Error(`${property} mismatch: json1 has ${valueFromFile}, json2 has ${valueFromResponse}`);
            }
        }
    }
    


    async deleteContact(contactId:string) : Promise<void> {
        console.log(`Call for DELETE ${this.API_URL}/crm/v3/objects/contacts/${contactId}`);
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${this.API_URL}/crm/v3/objects/contacts/${contactId}`,
                headers: {
                    authorization: this.TOKEN 
                },
            });
    
            if (response.status !== 204) {
                throw new Error(`Failed with status code ${response.status}`);
            }
        
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    

    async updateContact(contactId:string , filePath:string) : Promise<void> {
        console.log(`Call for PATCH ${this.API_URL}/crm/v3/objects/contacts/${contactId}`);
        try {
            const jsonData = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(jsonData);
            const response = await axios({
                method: 'PATCH',
                data: data,
                url: `${this.API_URL}/crm/v3/objects/contacts/${contactId}`,
                headers: {
                    Accept: 'application/json',
                    authorization: this.TOKEN 
                },
            });
    
            if (response.status !== 200) {
                throw new Error(`Failed with status code ${response.status}`);
            }
        
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    
    
    
    
   
}