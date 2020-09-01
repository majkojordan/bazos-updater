import { AzureFunction, Context } from '@azure/functions';
import { launch } from 'puppeteer';

import addListing from './actions/addListing';
import addAccessCookie from './actions/addAccessCookie';
import { sendNotification } from './helpers/utils';
import deleteListing from './actions/deleteListing';
import config from './config/config';
import { downloadFiles } from './storage/azure';
import { deleteFiles } from './storage/local';
import { init as initDb, getAllItems } from './storage/db';

const { env, cookie } = config;

const run: AzureFunction = async (context?: Context) => {
  global.log = context.log;

  global.log('--------Started--------');

  await initDb();

  const browser = await launch(
    env === 'Development'
      ? {
          headless: false,
          slowMo: 100,
        }
      : {},
  );
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);

  const isValidCookie = await addAccessCookie(
    page,
    {
      name: 'bkod',
      value: cookie.value,
      domain: '.bazos.sk',
      url: 'https://www.bazos.sk/',
      path: '/',
    },
    cookie.validationUrl,
  );

  if (!isValidCookie) {
    // SMS verification needed
    sendNotification('Expired cookie');
    global.log('SMS verification needed. Exiting...');
    return;
  }

  const listings = await getAllItems('listings');

  for (let listing of listings) {
    await deleteListing(page, 'HTC');

    const imagePaths = await downloadFiles(listing.images);

    await addListing(page, {
      ...listing.data,
      imagePaths,
    });

    await deleteFiles(imagePaths);
  }

  await browser.close();

  global.log('--------Successfully executed--------');
};

export default run;
