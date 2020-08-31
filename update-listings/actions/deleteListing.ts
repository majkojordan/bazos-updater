import { Page, ElementHandle } from 'puppeteer';

import config from '../config/config';
import { removeEllipsis } from '../helpers/utils';
import { getElementTextContent, clickAndNavigate, fillInput } from '../helpers/puppeteer';

const openListing = async (page: Page, title: string): Promise<boolean> => {
  let listingLinks: ElementHandle<Element>[] = [];
  let matchingLink: ElementHandle<Element> = null;
  let nextPageBtn: ElementHandle<Element> = null;

  while (true) {
    listingLinks = await page.$$('span[class="nadpis"] a');
    for (let link of listingLinks) {
      const linkTitle = await getElementTextContent(page, link);
      const trimmedLinkTitle = removeEllipsis(linkTitle);
      if (title.startsWith(trimmedLinkTitle)) {
        matchingLink = link;
        break;
      }
    }

    if (matchingLink) {
      // select listing and wait for new page load
      await clickAndNavigate(page, { elementHandle: matchingLink });
      return true;
    }

    // XPath select as it makes selection by text possible
    nextPageBtn = (await page.$x('//p[@class="strankovani"]//a[b[text()="Ďalšia"]]'))[0];

    if (!nextPageBtn) {
      // listing does not exist
      return false;
    }

    await clickAndNavigate(page, { elementHandle: nextPageBtn });
  }
};

const deleteListing = async (page: Page, title: string): Promise<void> => {
  global.log(`Deleting listing: ${title}`);

  const { email, password } = config.userInfo;

  // go to my listings page
  await page.goto('https://www.bazos.sk/moje-inzeraty.php');

  // show my listings
  await fillInput(page, 'input[name="mail"]', email);
  await page.click('form[name="formm"] input[type=submit]');

  const listingFound = await openListing(page, title);

  if (!listingFound) {
    // new listing
    global.log('Listing not found');
    return;
  }

  // delete
  await clickAndNavigate(page, { selector: 'a[href^="/zmazat/"]' });
  await fillInput(page, 'input[name="heslobazar"]', password);
  await clickAndNavigate(page, { selector: 'input[value="Zmazať"]' });

  global.log('Deleted');
};

export default deleteListing;
