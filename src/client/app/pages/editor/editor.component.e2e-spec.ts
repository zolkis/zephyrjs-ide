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

    it('editing tab name should work', (done) => {
        let editBtn = element(by.css('.edit-tab')),
            closeBtn = element(by.css('.close-tab')),
            title = element(by.css('.tab-title')),
            input = element(by.css('.tab-title-editor'));

        expect(editBtn.isDisplayed()).toBe(false);
        expect(title.isDisplayed()).toBe(true);
        expect(input.isDisplayed()).toBe(false);

        // Let's click the edit button
        browser.executeScript('arguments[0].click()', editBtn).then(() => {
            setTimeout(() => {
                expect(title.isDisplayed()).toBe(false);
                expect(input.isDisplayed()).toBe(true);
                expect(closeBtn.isDisplayed()).toBe(false);

                input.sendKeys('NEW TITLE');
                input.sendKeys(protractor.Key.ENTER);

                expect(editBtn.isDisplayed()).toBe(false);
                expect(title.isDisplayed()).toBe(true);
                expect(input.isDisplayed()).toBe(false);

                expect(title.getText()).toBe('NEW TITLE');

                done();
            }, 100);
        });
    });
});
