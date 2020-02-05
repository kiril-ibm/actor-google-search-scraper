const { join } = require('path');
const { promises } = require('fs');
const { load } = require('cheerio');

exports.loadFixtureFile = name => promises.readFile(
    join(__dirname, 'html', name), { encoding: 'utf8' },
);

exports.loadFixtureHtmlWithCheerio = async name => load(await exports.loadFixtureFile(`${name}.html`), {
    xmlMode: true,
});

exports.loadPair = async name => ({
    $: await exports.loadFixtureHtmlWithCheerio(name),
    json: JSON.parse(await exports.loadFixtureFile(`${name}.json`)),
});
