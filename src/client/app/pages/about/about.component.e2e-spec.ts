describe('About', () => {
    beforeEach( () => {
        browser.get('/#/about');
    });

    it('should have correct feature heading', () => {
        expect(element.all(by.css('sd-about h3')).get(0).getText())
            .toEqual('Features');
    });
});
