import { browser, element, by, protractor } from 'protractor';


describe('Home', () => {

  beforeEach(async () => {
    await browser.get('/');
    return browser.driver.wait(function () {
        let until = protractor.ExpectedConditions;
        let elem = element(by.css('sd-home'));
        browser.wait(until.visibilityOf(elem), 10000);
        return elem;
    });
  });

  it('should have editor button links to /#/editor', async () => {
    let editorBtn = element(by.css('sd-navbar li:nth-child(2) a'));
    expect(await editorBtn.getText()).toEqual('Editor');
    expect(await editorBtn.getAttribute('href')).toContain('/#/editor');
  });

  it('should have start links to /#/editor', async () => {
    let startBtn = element(by.css('sd-home #get-started'));
    expect(await startBtn.getText()).toEqual('LET\'S GET STARTED!');
    expect(await startBtn.getAttribute('href')).toContain('/#/editor');
  });
});
