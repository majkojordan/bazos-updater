import config from '../config/config';

const addAccessCookie = async (page, cookie): Promise<boolean> => {
  await page.setCookie(cookie);

  // try to add new listing - form for adding should be displayed
  await page.goto(config.cookieValidationUrl);
  const isValidCookie = (await page.$('form[name="formpridani"]')) !== null;

  return isValidCookie;
};

export default addAccessCookie;
