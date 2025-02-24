const { test, expect } = require('@playwright/test');

async function handleCookieBanner(page) {
  const bannerLocator = page.locator('#body > div:nth-child(15) > div.mainContent');
  const acceptCookiesButton = page.locator(
    '#body > div:nth-child(15) > div.mainContent > div > div.pdynamicbutton > a.call'
  );
  const overlayLocator = page.locator('.truste_overlay');

  try {
   
    await page.waitForTimeout(1000);

 
    if (await overlayLocator.isVisible()) {
      console.log('Overlay detected. Attempting to hide it...');
      await page.evaluate(() => {
        const overlay = document.querySelector('.truste_overlay');
        if (overlay) {
          overlay.style.display = 'none';
          overlay.style.visibility = 'hidden';
        }
      });

      
      await page.waitForTimeout(500);
    }

    if (await bannerLocator.isVisible()) {
      console.log('Cookie banner detected.');

      if (await acceptCookiesButton.isVisible()) {
        console.log('Clicking "Accept All" button...');
        await acceptCookiesButton.scrollIntoViewIfNeeded();
        await acceptCookiesButton.click({ force: true });

        
        await page.waitForLoadState('networkidle'); 
        await page.waitForTimeout(1000); 
      } else {
        console.warn('"Accept All" button not visible. Skipping click.');
      }
    } else {
      console.log('No cookie banner detected. Proceeding...');
    }

    
    if ((await overlayLocator.isVisible()) || (await bannerLocator.isVisible())) {
      console.warn('Cookie banner or overlay still present. Retrying...');
      await handleCookieBanner(page); 
    }
  } catch (error) {
    console.error('Error handling cookie banner:', error);

    
    await page.screenshot({ path: 'cookie-banner-error.png' });
  }

 
  console.log('Final stabilization...');
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0)); 
}

test('Verify UK Health Research Authority page loads fine', async ({ page }) => {
  await page.goto('https://www.pega.com/customers/uk-health-research-authority-platform');
  await handleCookieBanner(page);
  await expect(page).toHaveTitle(/Modernizing to bring health research to the public/);
  console.log('Successfully landed in page and verified the HRA title...');
});

test('Verify Try Pega link and page loads fine', async ({ page }) => {
  await page.goto('https://www.pega.com',{waitUntil:"load"});
  await handleCookieBanner(page);
  await page.waitForTimeout(500);  
  await page.click('text=Try Pega');
  await expect(page).toHaveURL('https://www.pega.com/try-pega',{waitUntil:"load"});
  console.log('Successfully Landed in try-pega page...');
});

test("verify workflow automation and confirm page load", async ({ page }) => {
  
await page.goto("https://www.pega.com/products/platform/workflow-automation", { waitUntil: "load" });
await handleCookieBanner(page);  
await expect(page).toHaveTitle('Unlock business agility with workflow automation | Pega');
console.log('Successfully landed in page and verified the workflow automation title...')

});



