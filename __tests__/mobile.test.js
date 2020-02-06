const mobile = require('../src/extractors/mobile');
const { loadFixtureHtmlWithCheerio, loadPair } = require('./utils');
const Apify = require('apify');

describe('mobile extractors', () => {
    /* eslint-disable no-loop-func */
    // const snapshot = {
    //     mobile: {},
    //     weblight: {},
    //     weblight2: {},
    //     'desktop-like': {}
    // };

    for (const type of [
        'mobile',
        'weblight',
        'weblight2',
        'desktop-like'
    ]) {
        describe(`${type}`, () => {
            test('determineLayout', async () => {
                const html = await loadFixtureHtmlWithCheerio(type);
                expect(mobile.determineLayout(html)).toEqual(type.replace(/\d/, ''));
            });

            test('extractOrganicResults', async () => {
                const { $, json } = await loadPair(type);
                const results = mobile.extractOrganicResults($, 'google.com');

                // snapshot[type].organicResults = results;

                expect(results).toEqual(json.organicResults);
            });

            test('extractPaidProducts', async () => {
                const { $, json } = await loadPair(type);
                const results = mobile.extractPaidProducts($, 'google.com');

                // snapshot[type].paidProducts = results;

                expect(results).toEqual(json.paidProducts);
            });

            test('extractPaidResults', async () => {
                const { $, json } = await loadPair(type);
                const results = mobile.extractPaidResults($, 'google.com');

                // snapshot[type].paidResults = results;

                expect(results).toEqual(json.paidResults);
            });

            test('extractRelatedQueries', async () => {
                const { $, json } = await loadPair(type);
                const results = mobile.extractRelatedQueries($, 'google.com');

                // snapshot[type].relatedQueries = results;

                expect(results).toEqual(json.relatedQueries);
            });
        });
    }

    // afterAll(async () => {
    //     await Apify.pushData(snapshot);
    // });
});
