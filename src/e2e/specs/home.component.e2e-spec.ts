import { browser, element, by } from 'protractor';


describe('Home', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have about button links to /#/about', () => {
    let aboutBtn = element(by.css('sd-home #navbar li:nth-child(1) a'));
    expect(aboutBtn.getText()).toEqual('About');
    expect(aboutBtn.getAttribute('href')).toContain('/#/about');
  });

  it('should have editor button links to /#/editor', () => {
    let editorBtn = element(by.css('sd-home #navbar li:nth-child(2) a'));
    expect(editorBtn.getText()).toEqual('Editor');
    expect(editorBtn.getAttribute('href')).toContain('/#/editor');
  });

  it('should have start links to /#/editor', () => {
    let startBtn = element(by.css('sd-home #get-started'));
    expect(startBtn.getText()).toEqual('Let\'s get started!');
    expect(startBtn.getAttribute('href')).toContain('/#/editor');
  });
});
