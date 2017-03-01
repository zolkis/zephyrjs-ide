describe('App', () => {
    beforeEach( () => {
        browser.get('/');
    });

    it('should have a title', () => {
        expect(browser.getTitle()).toEqual('JS IDE for Zephyr OS');
    });

    it('should have <nav>', () => {
        expect(element(by.css('sd-navbar nav')).isPresent()).toEqual(true);
    });

});
