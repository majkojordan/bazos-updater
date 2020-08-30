import { AzureFunction, Context } from '@azure/functions';
import { launch } from 'puppeteer';

/*
TODO:
  - git
  - add prettier
  - add listing removal
  - file upload
  - db
  - whole logic - check if it is possible to add, delete old and add new
*/

import addListing from './actions/addListing';

const run: AzureFunction = async (context?: Context) => {
  global.log = context.log;

  global.log('--------Started--------');

  const browser = await launch({
    headless: false,
    slowMo: 50, // slow down by 250ms
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);

  await page.setCookie({
    name: 'bkod',
    value: '85UEU0Q4L8',
    domain: '.bazos.sk',
    url: 'https://www.bazos.sk/',
    path: '/',
    httpOnly: false,
    secure: false,
  });

  await addListing(page, {
    category: 'mobil',
    subCategory: 'HTC',
    title: 'HTC',
    description: 'desc',
    price: 100,
  });

  await browser.close();

  global.log('--------Successfully executed--------');
};

export default run;
