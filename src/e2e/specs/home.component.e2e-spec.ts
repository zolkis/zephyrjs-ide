import { browser, element, by } from 'protractor';


describe('Home', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have about button links to /#/about', async () => {
    let aboutBtn = element(by.css('sd-home #navbar li:nth-child(1) a'));
    expect(await aboutBtn.getText()).toEqual('About');
    expect(await aboutBtn.getAttribute('href')).toContain('/#/about');
  });

  it('should have editor button links to /#/editor', async () => {
    let editorBtn = element(by.css('sd-home #navbar li:nth-child(2) a'));
    expect(await editorBtn.getText()).toEqual('Editor');
    expect(await editorBtn.getAttribute('href')).toContain('/#/editor');
  });

  it('should have start links to /#/editor', async () => {
    let startBtn = element(by.css('sd-home #get-started'));
    expect(await startBtn.getText()).toEqual('Let\'s get started!');
    expect(await startBtn.getAttribute('href')).toContain('/#/editor');
  });
});
