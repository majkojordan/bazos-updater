import { Page } from 'puppeteer';
import { strict as assert } from 'assert';

import config from '../config/config';
import { clickAndNavigate, fillInput } from '../helpers/puppeteer';

interface ListingParams {
  category: string;
  subCategory: string;
  title: string;
  description: string;
  price: number;
  imagePaths: string[];
}

// contact info
const { name, email, phoneNumber, password, zipCode } = config.userInfo;

const addListing = async (
  page: Page,
  { category, subCategory, title, description, price, imagePaths }: ListingParams,
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

      const optionToSelect = [...selectEl.options].find((option) => normalizeStr(option.label) === normalizedLabel);

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
  await fillInput(page, 'input[name="nadpis"]', title);
  await fillInput(page, 'textarea[name="popis"]', description);
  await fillInput(page, 'input[name="cena"]', String(price));

  // image upload
  const uploadButton = await page.$('input[type="file"]');
  await uploadButton.uploadFile(...imagePaths);

  await fillInput(page, 'input[name="lokalita"]', zipCode);
  await fillInput(page, 'input[name="jmeno"]', name);
  await fillInput(page, 'input[name="telefoni"]', phoneNumber);
  await fillInput(page, 'input[name="maili"]', email);
  await fillInput(page, 'input[name="heslobazar"]', password);

  // submit
  // await clickAndNavigate(page, { selector: 'form[name="formpridani"] input[type=submit]' });

  global.log('Added');
};

export default addListing;
