import { AzureFunction, Context } from '@azure/functions';
import { launch } from 'puppeteer';

import addListing from './actions/addListing';
import setAccessCookie from './actions/setAccessCookie';
import deleteListing from './actions/deleteListing';
import config from './config/config';
import { getLaunchOptions } from './helpers/puppeteer';
import { sendNotification } from './helpers/utils';
import { downloadFiles } from './storage/azure';
import { init as initDb, close as closeDb, getAllItems } from './storage/db';
import { deleteFiles, deleteFolder } from './storage/local';

const { cookie, baseDownloadFolder } = config;

const run: AzureFunction = async (context?: Context) => {
  global.log = context.log;

  global.log('--------Started--------');

  const [browser] = await Promise.all([await launch(getLaunchOptions()), initDb()]);

  const page = await browser.newPage();
  page.setDefaultTimeout(5000);

  const isValidCookie = await setAccessCookie(
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
  global.log(`Updating ${listings.length} listings`);

  for (let listing of listings) {
    global.log(`Updating listing: ${listing.data?.title}`);

    await deleteListing(page, listing.data?.title);

    const imagePaths = await downloadFiles(listing.images, baseDownloadFolder, { remoteFolder: listing.folder });

    await addListing(page, {
      ...listing.data,
      imagePaths,
    });

    await deleteFiles(imagePaths);
  }

  await Promise.all([deleteFolder(baseDownloadFolder), browser.close(), closeDb()]);

  global.log('--------Successfully executed--------');
};

export default run;
