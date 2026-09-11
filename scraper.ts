import fs from 'fs';

const redditUrls = [
  'askreddit',
  'CasualRO',
  'programare',
  'selfimprovement',
  'Biohackers',
  'socialskills',
  'selfimprovement',
  'PanicAttack',
  'askmanagers',
  'AskUK',
  'DecidingToBeBetter'
];

type Item = {
  title: string,
  description: string,
};

function writeFile(data: Item[]) {
  const filename = 'results.json';
  let existing: Item[] = [];

  if ( fs.existsSync(filename) ) {
    existing = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  }

  const combined = [...existing, ...data];

  const unique = new Map(combined.map(e => [e.title, e]));

  fs.writeFileSync(filename, JSON.stringify([...unique.values()], null, 2));
}

async function fetchURL(url: string) {
  try {

    const result = await fetch(`https://www.reddit.com/r/${url}/new.json`);
  
    const data = await result.json();

      return data.data.children.map((e: any) => (
        {
          title: e.data.title,
          description: e.data.selftext.replace(/\s*\n\s*/g, ' ').trim()
        }
      ));
  } catch(e) {
    console.log('Fetch failed with', e);
    return []
  }


}

async function main() {
  for (const item of redditUrls) {
    const results = await fetchURL(item);
    writeFile(results);
  }
}

main();