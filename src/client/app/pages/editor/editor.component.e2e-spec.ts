describe('Editor', () => {
    beforeEach( () => {
        // Needed because the Monaco workers confuse webdriver
        browser.ignoreSynchronization = true;

        browser.get('/#/editor');
    });

    it('should have correct nav text for About', () => {
        let el = element(by.css('sd-navbar .navbar-right li:nth-child(1) a'));
        expect(el.getText()).toEqual('About');
    });

    it('should have correct nav text for Editor', () => {
        let el = element(by.css('sd-navbar .navbar-right li:nth-child(2) a'));
        expect(el.getText()).toEqual('Editor');
    });
});
