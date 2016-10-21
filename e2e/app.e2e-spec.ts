import { AngCliExpressPage } from './app.po';

describe('ang-cli-express App', function() {
  let page: AngCliExpressPage;

  beforeEach(() => {
    page = new AngCliExpressPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
