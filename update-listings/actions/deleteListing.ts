import { Page, ElementHandle } from 'puppeteer';

import config from '../config/config';
import { removeEllipsis } from '../helpers/utils';
import { getElementTextContent } from '../helpers/puppeteer';

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
      await Promise.all([page.waitForNavigation(), await matchingLink.click()]);
      return true;
    }

    // XPath select as it makes selection by text possible
    nextPageBtn = (await page.$x('//p[@class="strankovani"]//a[b[text()="Ďalšia"]]'))[0];

    if (!nextPageBtn) {
      // listing does not exist
      return false;
    }

    await Promise.all([page.waitForNavigation(), await nextPageBtn.click()]);
  }
};

const deleteListing = async (page: Page, title: string): Promise<void> => {
  global.log(`Deleting listing: ${title}`);

  // go to my listings page
  await page.goto('https://www.bazos.sk/moje-inzeraty.php');

  // show my listings
  await page.type('input[name="mail"]', config.contactInfo.email);
  await page.click('form[name="formm"] input[type=submit]');

  const listingFound = await openListing(page, title);

  if (!listingFound) {
    // new listing
    global.log('Listing not found');
    return;
  }

  // TODO add deletion
  global.log('Deleted');
};

export default deleteListing;
