import { AzureFunction, Context } from '@azure/functions';
import { launch } from 'puppeteer';

import addListing from './actions/addListing';
import addAccessCookie from './actions/addAccessCookie';
import { sendNotification } from './helpers/utils';
import deleteListing from './actions/deleteListing';

/*
TODO:
  - add listing removal
  - file upload
  - db
  - whole logic - check if bkod cookie is valid, delete old and add new listing
*/

const run: AzureFunction = async (context?: Context) => {
  global.log = context.log;

  global.log('--------Started--------');

  const browser = await launch({
    headless: false,
    slowMo: 50, // slow down by 250ms
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);

  const isValidCookie = await addAccessCookie(page, {
    name: 'bkod',
    value: '85UEU0Q4L8',
    domain: '.bazos.sk',
    url: 'https://www.bazos.sk/',
    path: '/',
    httpOnly: false,
    secure: false,
  });

  if (!isValidCookie) {
    // SMS verification needed
    sendNotification('Expired cookie');
    global.log('SMS verification needed. Exiting...');
    return;
  }

  await deleteListing(page, 'HTC');

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
