'use strict';

const {flat} = require("../../sharedUtils/arrayUtils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { LetterUtils } = require('./utils');

module.exports.saveLetters = async (event, context, callback) => {
    const towns = JSON.parse(event.Records[0].body);

    console.log(towns);
    const letterDataPromises = towns.map(async town => {
        let townData = await loadData(town.townLink);
        // If a page fails to load, it will return null.
        if(townData) {
            let townUtil = new LetterUtils(town, townData);
            return townUtil.getLetterLinks();
        }
        return null;
    });


    const letterData = await Promise.all(letterDataPromises)

    let letterUtils = flat(letterData).filter(Boolean);

    console.log(letterUtils);

    context.done(null, '');
};