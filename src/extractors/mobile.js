const { ensureItsAbsoluteUrl } = require('./ensure_absolute_url');

/**
 * there are 3 possible mobile layouts, we need to find out
 * which one is the current by looking at some unique elements
 * on the page
 *
 * @returns {'weblight' | 'mobile' | 'desktop-like'}
 */
const determineLayout = ($) => {
    if ($('meta[content*="xml"]').length > 0) {
        // this version is the lowest-end possible
        // all links are appended with googleweblight.com
        return 'weblight';
    }

    if ($('meta[name="viewport"]').length > 0 && !$('html[itemscope]').length) {
        // this version is intermediate and has a layout
        // made only for mobile. the desktop-like with JS enabled
        // doesn't apply itemscope to the <html> tag
        return 'mobile';
    }

    // assume a desktop layout, selectors are more or less
    // the same from the full desktop version
    return 'desktop-like';
};

exports.determineLayout = determineLayout;

/**
 * Extracts URL from /url?q=[site here]
 * Sometimes it's nested
 *
 * @param {string} url
 * @param {string} hostname
 */
const getUrlFromParameter = (url, hostname) => {
    if (!url) {
        return '';
    }

    try {
        let parsedUrl = new URL(ensureItsAbsoluteUrl(url, hostname));
        let query = (parsedUrl.searchParams.get('q') || url);

        if (query.includes('googleweblight')) {
            // nested url, must get the url from `lite_url` query param
            parsedUrl = new URL(query);
            query = parsedUrl.searchParams.get('lite_url') || query;
        }

        return query;
    } catch (e) {
        return '';
    }
};

exports.extractOrganicResults = ($, hostname) => {
    const searchResults = [];

    const layout = determineLayout($);

    if (layout === 'desktop-like') {
        $('#ires, .srg > div').each((index, el) => {
            const siteLinks = [];
            $(el)
                .find('hr')
                .next()
                .find('a')
                .each((i, siteLinkEl) => {
                    siteLinks.push({
                        title: $(siteLinkEl).text(),
                        url: $(siteLinkEl).attr('href'),
                        description: null,
                    });
                });

            searchResults.push({
                title: $(el)
                    .find('a div[role="heading"]')
                    .text(),
                url: $(el)
                    .find('a')
                    .first()
                    .attr('href'),
                displayedUrl: $(el)
                    .find('a')
                    .first('span')
                    .text(),
                description: $(el)
                    .find('div[jsname="ao5mud"] > div > div')
                    .text(),
                siteLinks,
            });
        });
    }

    if (layout === 'mobile') {
        $('#main > div:not([class])')
            .filter((index, el) => {
                return $(el).find('a[href^="/url?"]').length > 0;
            })
            .each((index, el) => {
                const $el = $(el);

                searchResults.push({
                    title: $el
                        .find('a > div')
                        .eq(0)
                        .text(),
                    url: getUrlFromParameter(
                        $el
                            .find('a')
                            .first()
                            .attr('href'),
                        hostname,
                    ),
                    displayedUrl: $el
                        .find('a > div')
                        .eq(1)
                        .text(),
                    description: $el.find('.s3v9rd').first().text(),
                });
            });
    }

    if (layout === 'weblight') {

    }

    return searchResults;
};

exports.extractPaidResults = ($, hostname) => {
    const ads = [];

    const layout = determineLayout($);

    if (layout === 'desktop-like') {
        $('.ads-ad').each((index, el) => {
            const siteLinks = [];
            $(el)
                .find('hr')
                .next()
                .find('a')
                .each((i, siteLinkEl) => {
                    siteLinks.push({
                        title: $(siteLinkEl).text(),
                        url: $(siteLinkEl).attr('href'),
                        description: null,
                    });
                });

            ads.push({
                title: $(el)
                    .find('a div[role="heading"]')
                    .text(),
                url: $(el)
                    .find('a')
                    .first()
                    .attr('href'),
                displayedUrl: $(el)
                    .find('a')
                    .first('span')
                    .text(),
                description: $(el)
                    .find('hr')
                    .first()
                    .next()
                    .text(),
                siteLinks,
            });
        });
    }

    if (layout === 'mobile') {
        $('#main > div')
            .filter((i, el) => {
                return $(el).find('a[href*="aclk"]').length > 0;
            })
            .each((i, el) => {
                const $el = $(el);

                ads.push({
                    title: $el
                        .find('[role="heading"]'),
                    description: $el
                        .find('.yDYNvb')
                        .text(),
                    url: $el
                        .find('a[href*="aclk"]')
                        .attr('href'),
                });
            });
    }

    return ads;
};

exports.extractPaidProducts = ($, hostname) => {
    const products = [];

    $('.shopping-carousel-container .pla-unit-container').each((i, el) => {
        const headingEl = $(el).find('[role="heading"]');
        const siblingEls = headingEl.nextAll();
        const displayedUrlEl = siblingEls.last();
        const prices = [];

        siblingEls.each((index, siblingEl) => {
            if (siblingEl !== displayedUrlEl[0]) prices.push($(siblingEl).text());
        });

        products.push({
            title: headingEl.text(),
            url: $(el).find('a').attr('href'),
            displayedUrl: $(el).find('.a').text(),
            prices,
        });
    });

    return products;
};

exports.extractTotalResults = () => {
    return 'N/A';
};

exports.extractRelatedQueries = ($, hostname) => {
    const related = [];

    const layout = determineLayout($);

    if (layout === 'desktop-like') {
        $('div[data-hveid="CA8QAA"] a').each((index, el) => {
            related.push({
                title: $(el).text(),
                url: ensureItsAbsoluteUrl($(el).attr('href'), hostname),
            });
        });
    }

    if (layout === 'mobile') {

    }

    return related;
};
