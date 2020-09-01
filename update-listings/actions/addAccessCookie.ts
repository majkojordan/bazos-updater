import { Page, SetCookie } from 'puppeteer';

const addAccessCookie = async (page: Page, cookie: SetCookie, validationUrl: string): Promise<boolean> => {
  await page.setCookie(cookie);

  // try to add new listing - form for adding should be displayed
  await page.goto(validationUrl);
  const isValidCookie = (await page.$('form[name="formpridani"]')) !== null;

  return isValidCookie;
};

export default addAccessCookie;
