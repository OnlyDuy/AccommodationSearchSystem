import { AccommodationSearchSystemTemplatePage } from './app.po';

describe('AccommodationSearchSystem App', function() {
  let page: AccommodationSearchSystemTemplatePage;

  beforeEach(() => {
    page = new AccommodationSearchSystemTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
