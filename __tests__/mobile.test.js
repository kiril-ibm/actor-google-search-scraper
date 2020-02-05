const mobile = require('../src/extractors/mobile');
const { loadFixtureHtmlWithCheerio } = require('./utils');

describe('mobile', () => {
    test('determineLayout', async () => {
        for (const type of ['mobile', 'weblight', 'weblight2', 'desktop-like']) {
            const html = await loadFixtureHtmlWithCheerio(type);
            expect(mobile.determineLayout(html)).toEqual(type.replace(/\d/, ''));
        }
    });
});
