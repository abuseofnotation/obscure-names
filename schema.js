const v /* vowel */ = `aeiouy`.split(''); 

const c /* consonant */ = `bcdfghjklmnpqrstvxzw`.split('');

const a /* any */ = v.concat(c);
const w /* vowel without 'y' */ = `aeio`.split('');
const s /* consonant without 'q' and 'w' */= `bcdfghjklmnprstvxz`.split('');
module.exports = { v, c, a, w, s };
