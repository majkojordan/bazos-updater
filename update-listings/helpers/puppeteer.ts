import { Page, ElementHandle } from 'puppeteer';
import config from '../config/config';

export const getLaunchOptions = () =>
  config.env === 'Development'
    ? {
        headless: false,
        slowMo: 100,
      }
    : {};

export const getElementTextContent = (page: Page, el: ElementHandle<Element>): Promise<string> =>
  page.evaluate((el) => el.textContent, el);

export const clickAndNavigate = async (
  page: Page,
  { elementHandle, selector = '' }: { elementHandle?: ElementHandle<Element>; selector?: string },
) => {
  const action = elementHandle ? elementHandle.click() : page.click(selector);
  return await Promise.all([page.waitForNavigation(), action]);
};

export const fillInput = (page: Page, selector: string, value: string) =>
  page.$eval(selector, (el: HTMLInputElement, value) => (el.value = value), value);
