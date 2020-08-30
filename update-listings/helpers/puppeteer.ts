import { Page, ElementHandle } from 'puppeteer';

export const getElementTextContent = (page: Page, el: ElementHandle<Element>): Promise<string> =>
  page.evaluate((el) => el.textContent, el);
