import { browser, element, by, protractor } from 'protractor';


describe('About', () => {
    beforeEach(async () => {
        await browser.get('/#/about');
        return browser.driver.wait(function () {
            let until = protractor.ExpectedConditions;
            let elem = element(by.css('sd-about'));
            browser.wait(until.visibilityOf(elem), 10000);
            return elem;
        });
    });

    it('should have correct feature heading', async () => {
        expect(await element.all(by.css('sd-about h3')).get(0).getText()).toEqual('Features');
    });
});
