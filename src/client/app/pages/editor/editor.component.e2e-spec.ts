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

    it('editing tab title should work', (done) => {
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
                browser.wait(
                    protractor.ExpectedConditions.visibilityOf(input), 5000);
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

    it('trying to have two tabs with the same title should fail', (done) => {
        let newTabBtn = element(by.id('new-tab-button'));

        let promises = [
            // Set up two tabs
            newTabBtn.click().then(() => {
                let tabs = element.all(by.css('#tab-bar .nav-item'));
                expect(tabs.count()).toBe(2);
                expect(tabs.get(0).getText()).toBe('TAB # 1');
                expect(tabs.get(1).getText()).toBe('TAB # 2');
            }),

            // Rename second oab
            browser.executeScript(
                'arguments[0].click()',
                element(by.css(
                    '#tab-bar .nav-item:last-child .edit-tab'))).then(() => {
                let input = element(by.css('#tab-bar .nav-item:last-child .tab-title-editor'));
                browser.wait(() => { return input.isDisplayed(); }, 1000);

                // Error status
                input.sendKeys('Tab # 1');
                input.sendKeys(protractor.Key.ENTER);
                expect(input.getAttribute('class')).toMatch('has-error');
                expect(input.isDisplayed()).toBe(true);

                // Esc doesn't let you leave editing
                input.sendKeys(protractor.Key.ESCAPE);
                expect(input.isDisplayed()).toBe(true);

                // Sending a new key remove the error status
                input.sendKeys('0');
                expect(input.getAttribute('class')).not.toMatch('has-error');
            })
        ];

        protractor.promise.all(promises).then(done);
    });


    it('toggling the console should work', (done) => {
        let toggleBtn = element(by.css('#editor-footer button.toggle-console')),
            console = element(by.css('sd-console'));

        expect(console.isDisplayed()).toBe(true);
        browser.executeScript('arguments[0].click()', toggleBtn).then(() => {
            setTimeout(() => {
                expect(console.isDisplayed()).toBe(false);
                done();
            }, 100);
        });
    });
});
