exports.extractPeopleAlsoAsk = ($, isMobile) => {
    const peopleAlsoAsk = [];
    $('.related-question-pair').each((i, el) => {
        // String separation of date from text seems more plausible than all the selector variants
        const date = $(el).find('.Od5Jsd, .kX21rb').text().trim();
        const fullAnswer = $(el).find('.mod').text().trim();
        const dateMatch = fullAnswer.match(new RegExp(`(.+)${date}$`));
        const answer = dateMatch
            ? dateMatch[1]
            : fullAnswer;
        peopleAlsoAsk.push({
            question: $(el).find('div').eq(0).text().trim(),
            answer,
            url: $(el).find('a').attr('href'),
            title: isMobile ? $(el).find('a.sXtWJb').text().trim() : $(el).find('a h3').text().trim(),
            date,
        })
    });
    return peopleAlsoAsk;
};
