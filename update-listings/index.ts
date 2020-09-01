import { AzureFunction, Context } from '@azure/functions';
import { launch } from 'puppeteer';

import addListing from './actions/addListing';
import addAccessCookie from './actions/addAccessCookie';
import { sendNotification } from './helpers/utils';
import deleteListing from './actions/deleteListing';
import config from './config/config';
import { downloadFiles } from './storage/azure';
import { deleteFiles } from './storage/local';

/*
TODO:
  - db
  - multiple listings
*/

const run: AzureFunction = async (context?: Context) => {
  global.log = context.log;

  global.log('--------Started--------');

  const browser = await launch(
    config.env === 'Development'
      ? {
          headless: false,
          slowMo: 100,
        }
      : {},
  );
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

  const filenames = ['sample.jpg', '1.jpg', '2.jpg'];
  const imagePaths = await downloadFiles(filenames);

  await addListing(page, {
    category: 'mobil',
    subCategory: 'HTC',
    title: 'HTC',
    description: 'desc',
    price: 100,
    imagePaths,
  });

  await deleteFiles(imagePaths);
  await browser.close();

  global.log('--------Successfully executed--------');
};

export default run;
