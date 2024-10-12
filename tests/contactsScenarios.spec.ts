import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { ContactApiCall } from '../api/api-call';

test.describe("contact oprations tests", () => {

    let loginPage: LoginPage;
    let contactApiCall: ContactApiCall;
    let createdContactsId: string[]

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        contactApiCall = new ContactApiCall(page)
        createdContactsId= []

    })

    test("test_1: create new contact and verify the contact data", async ({ page }) => {

        console.log('verify the current cotacts amount - verify its value is 2 contacts OOTB')
        await contactApiCall.countContacts(2)

        console.log('create new contact')
        const contact = await contactApiCall.createNewContact('test-data/user1_test1.json');
        createdContactsId.push(contact); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed

        console.log('verify the current cotacts amount - verify its value is 3 contacts since we adeed a new contact')
        await contactApiCall.countContacts(3)

        console.log('call the GET contact API and verify that the contact was added succssfully with the provided data')
        const contact_properties = await contactApiCall.getContact(contact)
        const listOfPropertiesToCompare = ["email","firstname","lastname"]
        await contactApiCall.verifyContactProperties('test-data/user1_test1.json',contact_properties ,listOfPropertiesToCompare)

        console.log('delete the created contact to clear the test data')
        await contactApiCall.deleteContact(contact)

    })

    test("test_2: verify you can not add contact with same primary key 'email'", async ({ page }) => {

        console.log('create new contact')
        const contact = await contactApiCall.createNewContact('test-data/user1_test2.json');
        createdContactsId.push(contact); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed

        console.log('Try to create new contact with same primary key "email"')
        let  contact_2 = await contactApiCall.createDuplicatedContact('test-data/user2_test2.json');

        console.log('verify the call starus is 409 (conflict)')
        await expect (contact_2.status).toBe(409)

        console.log('verify the call response message includes the duplicated contact id')
        await expect (contact_2.message).toBe(`Contact already exists. Existing ID: ${contact}`)

        console.log('delete the created contact to clear the test data')
        await contactApiCall.deleteContact(contact)

    })


    test("test_3: update contact properties and verify the contact data", async ({ page }) => {

        console.log('create new contact')
        const contact = await contactApiCall.createNewContact('test-data/user3_test3.json');
        createdContactsId.push(contact); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed

        console.log('update contact properties')
        await contactApiCall.updateContact(contact,'test-data/user3_updated_properties_test3.json')

        console.log('call the GET contact API and verify that the contact was added succssfully with the provided data')
        const contact_properties = await contactApiCall.getContact(contact)
        const listOfPropertiesToCompare = ["email","firstname","lastname"]
        await contactApiCall.verifyContactProperties('test-data/user3_updated_properties_test3.json',contact_properties ,listOfPropertiesToCompare)

        console.log('delete the created contact to clear the test data')
        await contactApiCall.deleteContact(contact)

    })

    test("test_4: try to update contact properties that not exists", async ({ page }) => {

        console.log('create new contact')
        const contact = await contactApiCall.createNewContact('test-data/user1_test4.json');
        createdContactsId.push(contact); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed

        console.log('try to update contact properties that not exists')
        let contact_update_response = await contactApiCall.updateNotExitingPropertiesOfContact(contact,'test-data/user1_updated_properties_test4.json')

        console.log('verify the call starus is 400 (bad request)')
        await expect (contact_update_response.status).toBe(400)

        console.log('verify the call response message indicated that the Property values that we want to update were not valid')
        await expect (contact_update_response.message).toContain(`Property values were not valid`)

        console.log('delete the created contact to clear the test data')
        await contactApiCall.deleteContact(contact)

    })

    test.afterAll (async ({}) => { 
        console.log('after all the tests finished we make sure to clean the test data in case a test was failed')
        for (let contact_id of createdContactsId ) {
            await contactApiCall.deleteContact(contact_id)


        }
    })

})
