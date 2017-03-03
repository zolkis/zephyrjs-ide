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

    it('monaco editor should take full height', done => {
        browser.executeScript('return screen.availHeight;')
        .then((screenHeight: number) => {
            let el = element(by.id('monaco-editor-1'));
            el.getSize().then((monacoSize: any) => {
                // height calculated from a window height of 800px as specified
                // in protractor.conf.js.
                expect(monacoSize.height).toBe(490);

                let el = element(by.id('console-1'));
                el.getSize().then((consoleSize: any) => {
                    expect(consoleSize.height).toBe(566);
                    done();
                });
            });
        });
    });
});
