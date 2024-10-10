import { Locator, Page, expect } from "@playwright/test";
import Urls from "../helpers/Urls";


export default class LoginPage {

    private userNameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;


    constructor(protected page: Page) {
        this.userNameField = this.page.getByLabel('Email address');
        this.passwordField = this.page.getByLabel('Password');
        this.loginButton = this.page.locator('[data-test-id="password-login-button"]');
    }

    public async loginToApplication(username:string = "roiyomtovyan+1@gmail.com",
        password:string = 'RoiRoi12345!', url = Urls.BASE_URL) {
        console.log("login to the application", Urls.BASE_URL);
        await this.page.goto(url);
        await this.userNameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

}