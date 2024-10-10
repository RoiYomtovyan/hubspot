import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { APIcall } from '../api/api-call';

test.describe("contact oprations tests", () => {

    let loginPage: LoginPage;
    let apiCall: APIcall;
    let createdContactsId: string[]

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        apiCall = new APIcall(page)
        createdContactsId= []

    })

    test("create new contact and verify the contact data", async ({ page }) => {

        console.log('verify the current cotacts amount - verify its value is 2 contacts OOTB')
        await apiCall.countContacts(2)

        console.log('create new contact')
        const contact_id:string = await apiCall.createNewContact('test-data/user1_test1.json');
        createdContactsId.push(contact_id); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed

        console.log('verify the current cotacts amount - verify its value is 3 contacts since we adeed a new contact')
        await apiCall.countContacts(3)

        console.log('call the GET contact API and verify that the contact was added succssfully with the provided data')
        const contact_properties = await apiCall.getContact(contact_id)
        const listOfPropertiesToCompare = ["email","firstname","lastname"]
        await apiCall.verifyContactProperties('test-data/user1_test1.json',contact_properties ,listOfPropertiesToCompare)

        console.log('delete the created contact to clear the test data')
        await apiCall.deleteContact(contact_id)

    })


    test("update contact properties and verify the contact data", async ({ page }) => {

        console.log('create new contact')
        const contact_id:string = await apiCall.createNewContact('test-data/user2_test2.json');
        createdContactsId.push(contact_id); // place the contact_id in arrey to be deleted at the end of the run in case the test is failed


        console.log('update contact properties')
        await apiCall.updateContact(contact_id,'test-data/user2_updated_properties_test2.json')


        console.log('call the GET contact API and verify that the contact was added succssfully with the provided data')
        const contact_properties = await apiCall.getContact(contact_id)
        const listOfPropertiesToCompare = ["email","firstname","lastname"]
        await apiCall.verifyContactProperties('test-data/user2_updated_properties_test2.json',contact_properties ,listOfPropertiesToCompare)

        console.log('delete the created contact to clear the test data')
        await apiCall.deleteContact(contact_id)

    })

    test.afterAll (async ({ page }) => { 
        console.log('make sure to clean the test data in case a test was failed')
        for (let contact_id of createdContactsId ) {
            await apiCall.deleteContact(contact_id)


        }
    })

   

})
