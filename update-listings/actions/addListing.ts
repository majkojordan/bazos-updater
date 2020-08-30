import { Page } from 'puppeteer';
import { strict as assert } from 'assert';

import config from '../config/config';

interface ListingParams {
  category: string;
  subCategory: string;
  title: string;
  description: string;
  price: number;
}

const addListing = async (
  page: Page,
  { category, subCategory, title, description, price }: ListingParams,
): Promise<void> => {
  global.log(`Adding listing: ${title}`);

  // go to specific category page
  await page.goto(`https://${category}.bazos.sk/pridat-inzerat.php`);

  // select sub category
  const successfulSubCategorySelection = await page.evaluate(
    (label, selector) => {
      const normalizeStr = (str: string) =>
        str
          .normalize('NFD')
          .replace(/[\u0300-\u036f\s]/g, '')
          .toLocaleLowerCase();

      const selectEl = document.querySelector(selector);
      const normalizedLabel = normalizeStr(label);

      const optionToSelect = [...selectEl.options].find(
        (option) => normalizeStr(option.label) === normalizedLabel,
      );

      if (!(optionToSelect && optionToSelect.index)) {
        return false;
      }

      selectEl.selectedIndex = optionToSelect.index;
      return true;
    },
    subCategory,
    'select[name="category"]',
  );

  assert(successfulSubCategorySelection, new Error('Could not select specified sub category'));

  // item info
  await page.type('input[name="nadpis"]', title);
  await page.type('textarea[name="popis"]', description);
  await page.type('input[name="cena"]', String(price));

  // TODO - image upload

  // contact info
  const { name, email, phoneNumber, password, zipCode } = config.contactInfo;

  await page.type('input[name="lokalita"]', zipCode);
  await page.type('input[name="jmeno"]', name);
  await page.type('input[name="telefoni"]', phoneNumber);
  await page.type('input[name="maili"]', email);
  await page.type('input[name="heslobazar"]', password);

  // submit
  // await page.click('form[name="formpridani"] input[type=submit]');

  global.log('Added');
};

export default addListing;
