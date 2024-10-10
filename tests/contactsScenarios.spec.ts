import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { APIcall } from '../api/api-call';

test.describe("contact oprations tests", () => {

    let loginPage: LoginPage;
    let apiCall: APIcall;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        apiCall = new APIcall(page)
    })

    test("create new contact and verify the contact was created", async ({ page }) => {
        console.log('verify the current cotacts amount - verify its value is 2 contacts OOTB')
        await apiCall.countContacts(2)

        console.log('create new contact')
        let contact_id:string = await apiCall.createNewContact('test-data/user1_test1.json');

        console.log('verify the current cotacts amount - verify its value is 3 contacts since we adeed a new contact')
        await apiCall.countContacts(3)

        console.log('call the GET contact API and verify that the contact was added succssfully with the provided data')
        let contact_properties = await apiCall.getContact(contact_id)
        await apiCall.verifyContactProperties('test-data/user1_test1.json',contact_properties)

    })

})
