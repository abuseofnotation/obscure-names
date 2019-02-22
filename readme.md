obscure-names
===
A command-line tool that generates random names and sorts them by obscurity by scraping search engines.

Usage
===

The command accepts a schema parameter where you specify a pattern based on which names will be generated

- `v` - vowel
- `c` - consonant
- `a` - any letter.

You can add your own symbols by editing `schema.js`.


So, for example this command would return names which contain a vowel, a consonant and another vowel (like `aba`, `ovi` etc.)

```
node obscure-names.js --schema vcv
```

On the second stage, the tool uses Bing search (Google is also supported, but it is very restrictive so its turned off) to check which of these names are most obscure.

Words are sorted in search results in /lists/<pattern>.json

```
[
    {
        "word": "yle",
        "results": 92
    },
    {
        "word": "yqe",
        "results": 257000
    },
    {
        "word": "yqi",
        "results": 276000
    },
    {
        "word": "yqo",
        "results": 287000
    },
    {
        "word": "yqa",
        "results": 307000
    },
    {
        "word": "yxo",
        "results": 307000
    },
    {
        "word": "ijy",
        "results": 322000
    },
    {
        "word": "ejy",
        "results": 325000
    },
```
Show me the data
===

The `/lists` folder of this repo contains results from some runs.

