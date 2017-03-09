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

    it('adding/removing tabs should work', (done) => {
        let btn = element(by.id('new-tab-button'));
        btn.click().then(() => {
            let tablist = element.all(by.css(
                '.split-pane-content-primary .nav-tabs .nav-item'));
            expect(tablist.count()).toBe(2);

            let closeTabBtn = element(by.css(
                '.split-pane-content-primary .nav-tabs ' +
                '.nav-item:last-child .close-tab'));
            closeTabBtn.click().then(() => {
                expect(tablist.count()).toBe(1);
                done();
            });
        });
    });
});
