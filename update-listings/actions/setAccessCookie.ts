import { Page, SetCookie } from 'puppeteer';

const setAccessCookie = async (page: Page, cookie: SetCookie, validationUrl: string): Promise<boolean> => {
  global.log('Setting access cookie');
  await page.setCookie(cookie);

  // try to add new listing - form for adding should be displayed
  await page.goto(validationUrl);
  const isValidCookie = (await page.$('form[name="formpridani"]')) !== null;

  return isValidCookie;
};

export default setAccessCookie;
