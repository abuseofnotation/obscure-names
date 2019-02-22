const superagent = require('superagent');
const _ = require('lodash');
const fs = require('fs');

const dir = './lists'

const args = require('yargs').argv

const maxQueries = args.maxQueries || 10;

if (!args.schema) {
    throw 'Please specify schema, e.g. "--schema cvc"'
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


const getNumberOfResultsBing = (q) => superagent.get('https://www.bing.com/search')
    .query({q})
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
    .then((res) => {
      const results = (res.text.split('<span class="sb_count">')[1]).trim().split(' ')[0];
      const resultsInt = parseInt(results.replaceAll(/[^0-9.]/, ""));

      return {word:q, results: resultsInt};
    });


const getNumberOfResultsGoogle = (q) => superagent.get('https://www.google.com/search')
    .query({q})
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
    .then((res) => {
      const results = (res.text.split('&#1054;&#1082;&#1086;&#1083;&#1086;')[1]).split(' ')[1];
      const resultsInt = parseInt(results.replaceAll(/[^0-9.]/, ""));

      return {word:q, results: resultsInt};
    });



const getNumberOfResults = getNumberOfResultsBing

const cache = (data, schema) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${schema}.json`, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
};

const getStats = (words, cacheKey) => {
    let promise = Promise.resolve([]);
    _.chunk(words, maxQueries)
        .forEach((chunk) => {
            promise = promise
                .then((value) => Promise.all(chunk.map(getNumberOfResults)).then((newWords) => {
                    console.log(newWords);
                    const words = sort(value.concat(newWords));
                    cache(words, cacheKey)
                    return words
                    
                }))
        })
    return promise;
}


const sort = (results) => 
    results
        .sort((a, b) => a.results - b.results)

const words = require('./schema')

const generateWordsPrivate = (beginning, schema, words) => {
    const letter = schema.slice(0, 1);
    const newSchema = schema.slice(1);
    const letters = words[letter];
    //console.log(letter, newSchema);

    if (newSchema === '') {
        return letters.map((letter) => beginning.concat(letter));
    } else {
        return letters
            .map((letter) => generateWordsPrivate(beginning.concat(letter),newSchema, words))
            .reduce((a, b) => a.concat(b));
    };

}

const generateWords = (schema, words) => generateWordsPrivate('', schema, words);

const getObscureNames = (schema) => 
    getStats(generateWords(schema, words), `${schema}`)
        .then((results) => sort(results)
        .map((result, i) => `${i} ${result.word}`))
        .then((resultsSorted) => console.log(resultsSorted.join('\n')));

getObscureNames(args.schema)
