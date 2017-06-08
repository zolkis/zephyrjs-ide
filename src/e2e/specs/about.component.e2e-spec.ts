import { browser, element, by } from 'protractor';


describe('About', () => {
    beforeEach(async () => {
        return await browser.get('/#/about');
    });

    it('should have correct feature heading', () => {
        expect(element.all(by.css('sd-about h3')).get(0).getText())
            .toEqual('Features');
    });
});
