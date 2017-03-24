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

    it('adding/removing tabs should work', () => {
        let btn = element(by.id('new-tab-button'));
        btn.click();

        let tablist = element.all(by.css('#tab-bar .nav-item'));
        expect(tablist.count()).toBe(2);

        let closeTabBtn = element(by.css('#tab-bar .nav-item:last-child .close-tab'));
        closeTabBtn.click();
        expect(tablist.count()).toBe(1);
    });

    it('editing tab title should work', () => {
        let editBtn = element(by.css('.edit-tab')),
            closeBtn = element(by.css('.close-tab')),
            title = element(by.css('.tab-title')),
            input = element(by.css('.tab-title-editor'));

        expect(editBtn.isDisplayed()).toBe(false);
        expect(title.isDisplayed()).toBe(true);
        expect(input.isDisplayed()).toBe(false);

        // Let's click the edit button
        browser.executeScript('arguments[0].click()', editBtn);
        browser.wait(protractor.ExpectedConditions.visibilityOf(input), 1000);
        expect(title.isDisplayed()).toBe(false);
        expect(input.isDisplayed()).toBe(true);
        expect(closeBtn.isDisplayed()).toBe(false);

        input.sendKeys('NEW TITLE');
        input.sendKeys(protractor.Key.ENTER);

        expect(editBtn.isDisplayed()).toBe(false);
        expect(title.isDisplayed()).toBe(true);
        expect(input.isDisplayed()).toBe(false);

        expect(title.getText()).toBe('NEW TITLE');
    });

    it('trying to have two tabs with the same title should fail', () => {
        let newTabBtn = element(by.id('new-tab-button'));

        // Set up two tabs
        newTabBtn.click();
        let tabs = element.all(by.css('#tab-bar .nav-item'));
        expect(tabs.count()).toBe(2);
        expect(tabs.get(0).getText()).toBe('TAB # 1');
        expect(tabs.get(1).getText()).toBe('TAB # 2');

        // Rename second oab
        browser.executeScript('arguments[0].click()',
            element(by.css('#tab-bar .nav-item:last-child .edit-tab')));
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
    });


    it('toggling the console should work', () => {
        let toggleBtn = element(by.css('#editor-footer button.toggle-console')),
            console = element(by.css('sd-console'));

        expect(console.isDisplayed()).toBe(true);
        // Using browser.executeScript because otherwise a notification about
        // missing webusb support would receive the click :)
        browser.executeScript('arguments[0].click()', toggleBtn);
        expect(console.isDisplayed()).toBe(false);
    });

    it('saving a file should work', () => {
        let saveBtn = element(by.css('.monaco-toolbar .save')),
            filesLink = element(by.css('.primary-sidebar a.files'));

        saveBtn.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.save-modal'))), 1000);
        // No filename is there by default if the tab is pristine
        expect(element(by.css('.save-modal input')).getAttribute('value')).toBe('');
        // Cancel
        element(by.css('.save-modal .modal-footer button[data-dismiss="modal"]')).click();
        browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-backdrop'))), 1000);

        // Let's rename the tab
        browser.executeScript('arguments[0].click()', element(by.css('.edit-tab')));
        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.tab-title-editor'))), 1000);
        element(by.css('.tab-title-editor')).sendKeys('New title');
        element(by.css('.tab-title-editor')).sendKeys(protractor.Key.ENTER);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.css('.tab-title-editor'))), 1000);

        // Now we click the save button again
        saveBtn.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.save-modal'))), 1000);
        // The title is there as a default for the filename
        expect(element(by.css('.save-modal input')).getAttribute('value')).toBe('New title');
        // Save
        element(by.css('.save-modal .modal-footer .btn-primary')).click();
        browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-backdrop'))), 1000);
        filesLink.click();
        expect(element.all(by.css('.secondary-sidebar .files li')).count()).toBe(1);
        expect(element(by.css('.secondary-sidebar .files .filename')).getText()).toMatch('New title');
        expect(element(by.css('.secondary-sidebar .files .size')).getText()).toBe('0 bytes');

        browser.executeScript('localStorage.removeItem("zephyrjs-ide.FILES.New title");');
    });

    it('files link in sidebar should have correct count', () => {
        let count = element(by.css('ng-sidebar aside ul li a.files .count')),
            emptyLabel = element(by.css('.secondary-sidebar .files .empty')),
            filesLink = element(by.css('.primary-sidebar a.files')),
            saveBtn = element(by.css('.monaco-toolbar .save')),
            saveModal = element(by.css('.save-modal')),
            filenameInput = element(by.css('.save-modal input[name="filename"]'));

        expect(count.getText()).toBe('(0)');

        filesLink.click();
        expect(emptyLabel.isPresent()).toBe(true);
        filesLink.click();

        saveBtn.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(saveModal), 1000);
        expect(saveModal.isDisplayed()).toBe(true);

        filenameInput.sendKeys('FILENAME');
        filenameInput.sendKeys(protractor.Key.ENTER);
        browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-backdrop'))), 1000);
        expect(count.getText()).toBe('(1)');

        filesLink.click();
        expect(emptyLabel.isPresent()).toBe(false);
        filesLink.click();

        browser.executeScript('localStorage.removeItem("zephyrjs-ide.FILES.FILENAME");');
    });

    it('examples link in sidebar should have correct count', () => {
        let count = element(by.css('ng-sidebar aside ul li a.examples .count'));
        expect(count.getText()).toBe('(5)');
    });

    it('secondary sidebar toggles when clicking on Files menu', () => {
        let filesLink = element(by.css('.primary-sidebar a.files')),
            secondarySidebar = element(by.css('.secondary-sidebar aside'));

        filesLink.click();
        expect(secondarySidebar.getCssValue('transform')).toBe('none');

        filesLink.click();
        expect(secondarySidebar.getCssValue('transform')).not.toBe('none');
    });

    it('secondary sidebar toggles when clicking on Examples menu', () => {
        let examplesLink = element(by.css('.primary-sidebar a.examples')),
            secondarySidebar = element(by.css('.secondary-sidebar aside'));

        examplesLink.click();
        expect(secondarySidebar.getCssValue('transform')).toBe('none');

        examplesLink.click();
        expect(secondarySidebar.getCssValue('transform')).not.toBe('none');
    });


    it('secondary sidebar closes when clicking on close button', () => {
        let filesLink = element(by.css('.primary-sidebar a.files')),
            secondarySidebar = element(by.css('.secondary-sidebar aside')),
            closeBtn = element(by.css('.secondary-sidebar aside .close'));

        filesLink.click();
        expect(secondarySidebar.getCssValue('transform')).toBe('none');

        closeBtn.click();
        expect(secondarySidebar.getCssValue('transform')).not.toBe('none');
    });

    it('clicking on a file should open it', () => {
        let saveBtn = element(by.css('.monaco-toolbar .save')),
            filesLink = element(by.css('.primary-sidebar a.files')),
            saveModal = element(by.css('.save-modal')),
            filenameInput = element(by.css('.save-modal input[name="filename"]')),
            secondarySidebar = element(by.css('.secondary-sidebar aside')),
            filename: protractor.ElementFinder = null;

        // Save file
        saveBtn.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(saveModal), 1000);
        expect(saveModal.isDisplayed()).toBe(true);
        filenameInput.sendKeys('FILENAME');
        filenameInput.sendKeys(protractor.Key.ENTER);
        browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-backdrop'))), 1000);

        // Open sidebar
        filesLink.click();
        element(by.css('.secondary-sidebar aside ul li:first-child a.filename')).click();

        // The secondary sidebar closes.
        expect(secondarySidebar.getCssValue('transform')).not.toBe('none');

        // The tab count is still 1.
        let tablist = element.all(by.css('#tab-bar .nav-item'));
        expect(tablist.count()).toBe(1);

        // The title of the tab is what we set.
        expect(element(by.css('#tab-bar .nav-item:first-child .tab-title')).getText()).toBe('FILENAME');

        // Opening the same file again should direct to the same tab again
        filesLink.click();
        filename = element(by.css('.secondary-sidebar aside ul li:first-child a.filename'));
        filename.click();

        // The tab count is still 1.
        expect(tablist.count()).toBe(1);

        // The title of the only tab is still what we set.
        expect(element(by.css('#tab-bar .nav-item:first-child .tab-title')).getText()).toBe('FILENAME');

        browser.executeScript('localStorage.removeItem("zephyrjs-ide.FILES.FILENAME");');
    });

    it('clicking on an example should open it', () => {
        let examplesLink = element(by.css('.primary-sidebar a.examples')),
            secondarySidebar = element(by.css('.secondary-sidebar aside')),
            filename: protractor.ElementFinder = null;

        // Open sidebar
        examplesLink.click();
        element(by.css('.secondary-sidebar aside ul li:first-child a.example')).click();

        // The secondary sidebar closes.
        expect(secondarySidebar.getCssValue('transform')).not.toBe('none');

        // The tab count is now 2.
        let tablist = element.all(by.css('#tab-bar .nav-item'));
        expect(tablist.count()).toBe(2);

        // Opening the same file again should direct to the same tab again
        examplesLink.click();
        filename = element(by.css('.secondary-sidebar aside ul li:first-child a.example'));
        filename.click();

        // The tab count is still 2.
        expect(tablist.count()).toBe(2);
    });

    it('deleting a file should work', () => {
        let saveBtn = element(by.css('.monaco-toolbar .save')),
            filesLink = element(by.css('.primary-sidebar a.files')),
            saveModal = element(by.css('.save-modal')),
            filenameInput = element(by.css('.save-modal input[name="filename"]')),
            count = element(by.css('.primary-sidebar a.files .count'));

        // Save file
        saveBtn.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(saveModal), 1000);
        expect(saveModal.isDisplayed()).toBe(true);
        filenameInput.sendKeys('FILENAME');
        filenameInput.sendKeys(protractor.Key.ENTER);
        browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-backdrop'))), 1000);

        // Open sidebar
        filesLink.click();

        // Click delete button
        element(by.css('.secondary-sidebar .files .delete')).click();

        expect(count.getText()).toBe('(0)');
        browser.executeScript('localStorage.removeItem("zephyrjs-ide.FILES.FILENAME");');
    });
});
