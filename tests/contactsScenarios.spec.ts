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
        let contact_id:string = await apiCall.createNewContact('test-data/user1_test1.json');
        let contact_properties = await apiCall.getContact(contact_id)
        await apiCall.countContacts(3)
        await apiCall.verifyContactProperties('test-data/user1_test1.json',contact_properties)

    })

})
