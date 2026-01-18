import fetch from "node-fetch";
import * as fs from "fs";
import { access, readFile } from "fs/promises";
import { readdir } from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";

const tournaments = [
  {
    id: 88276,
    name: "Supreme Flight Open",
  },
  {
    id: 88277,
    name: "Waco Annual Charity Open",
  },
  {
    id: 88279,
    name: "The Open at Austin",
  },
  {
    id: 88282,
    name: "Music City Open",
  },
  {
    id: 88283,
    name: "Kansas City Wide Open",
  },
  {
    id: 88638,
    name: "PDGA Champions Cup",
  },
  {
    id: 88284,
    name: "Cascade Challenge",
  },
  {
    id: 88285,
    name: "Konopiste Open",
  },
  {
    id: 88286,
    name: "NW Disc Golf Championship",
  },
  {
    id: 88287,
    name: "Ale Open",
  },
  {
    id: 88357,
    name: "The Preserve Championship",
  },
  {
    id: 88651,
    name: "USWDGC",
  },
  {
    id: 88288,
    name: "Discmania Challenge",
  },
  {
    id: 88289,
    name: "PCS Open",
  },
  {
    id: 90652,
    name: "Krokhol Open",
  },
  {
    id: 89546,
    name: "European DG Festival",
  },
  {
    id: 90947,
    name: "PDGA Pro Worlds",
  },
  {
    id: 88290,
    name: "Turku Open",
  },
  {
    id: 88293,
    name: "Ledgestone Open",
  },
  {
    id: 88294,
    name: "LWS Open at Idlewild",
  },
  {
    id: 88296,
    name: "Discraft Great Lakes Open",
  },
];

function ensureFolderExists(folderPath: string): void {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Folder created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
  }

  const data: any = await response.json();

  return data;
}

async function fetchAndSaveData(url: string, filePath: string): Promise<void> {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url);

      // --- Do NOT retry on 404 ---
      if (response.status === 404) {
        console.error(`404 Not Found for URL: ${url}. Skipping.`);
        return;
      }

      // --- Retry on 429 with backoff or Retry-After ---
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : 1000 * Math.pow(2, attempt);

        console.warn(`429 received. Waiting ${waitTime}ms before retrying...`);
        await sleep(waitTime);
        attempt++;
        continue;
      }

      // --- Other non-OK statuses: throw and retry ---
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} for URL: ${url}`
        );
      }

      // --- Success path ---
      const data = await response.json();
      const jsonData = JSON.stringify(data, null, 2);

      fs.writeFile(filePath, jsonData, (err) => {
        if (err) throw err;
        console.log(`JSON data is saved to ${filePath}`);
      });

      return; // done
    } catch (error) {
      // Network errors, timeouts, etc.
      attempt++;
      const waitTime = 1000 * Math.pow(2, attempt);
      console.warn(`Error on attempt ${attempt}. Waiting ${waitTime}ms...`);
      await sleep(waitTime);
    }
  }

  console.error(
    `Failed to fetch data from ${url} after ${maxRetries} attempts.`
  );
}

async function obtainLayoutAndDivisionData() {
  for (const tourn of tournaments) {
    let folderPath = `assets/${tourn.id}`;
    ensureFolderExists(folderPath);

    let layoutUrl = `https://www.pdga.com/api/v1/live-tournaments/${tourn.id}/live-layouts?include=LiveLayoutDetails`;

    await fetchAndSaveData(layoutUrl, `${folderPath}/layout.json`);

    for (const division of ["FPO", "MPO"]) {
      for (const round of [1, 2, 3, 4, 5, 12]) {
        let url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tourn.id}&Division=${division}&Round=${round}`;
        await fetchAndSaveData(url, `${folderPath}/${division}-${round}.json`);
      }
    }
  }
}

async function saveJson(filePath: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await writeFile(filePath, json, "utf-8");
  console.log(`Saved JSON to ${filePath}`);
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const fileContents = await readFile(filePath, "utf-8");
  return JSON.parse(fileContents) as T;
}

async function listDivisionFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isFile() && !entry.name.toLowerCase().endsWith("layout.json")
    )
    .map((entry) => path.join(dirPath, entry.name));
}

async function produceManifest() {
  let tournsToSave: any[] = [];
  for (let tourn of tournaments) {
    let newTourn = { ...tourn, athletes: [] as any[] };
    const filenames = await listDivisionFiles(`./assets/${tourn.id}`);
    for (const filename of filenames) {
      const divMatch = filename.match(/[A-Z]{3}/);
      const division = divMatch ? divMatch[0] : null;
      const roundMatch = filename.match(/-(\d{1,2})\.json$/);
      const round = roundMatch ? roundMatch[1] : null;

      const data: any = await readJsonFile(filename);
      const scores = Array.isArray(data.data)
        ? data.data.reduce((acc, curr) => {
            return acc.concat(curr.scores);
          }, [])
        : data.data.scores;
      for (const score of scores) {
        const roundEntry = {
          scoreId: score.ScoreID,
          round,
          division,
        };
        const existing = newTourn.athletes.find(
          (athlete) => athlete.PDGANum == score.PDGANum
        );

        if (existing) {
          existing.rounds.push(roundEntry);
        } else {
          newTourn.athletes.push({
            PDGANum: score.PDGANum,
            Name: score.Name,
            rounds: [roundEntry],
          });
        }
      }
    }
    tournsToSave.push(newTourn);
  }
  await saveJson("manifest.json", tournsToSave);
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ultimateDataRetrieval() {
  const manifest: any = await readJsonFile("./manifest.json");
  for (const tournament of manifest) {
    const tournId = tournament.id;

    for (const athlete of tournament.athletes) {
      ensureFolderExists(`./assets/${tournId}/${athlete.PDGANum}`);
      for (const round of athlete.rounds) {
        if (round.scoreId) {
          ensureFolderExists(
            `./assets/${tournId}/${athlete.PDGANum}/${round.round}`
          );

          const scoreDataFileName = `./assets/${tournId}/${athlete.PDGANum}/${round.round}/scoreData.json`;
          if (!(await fileExists(scoreDataFileName))) {
            const scoreData: any = await readJsonFile(
              `./assets/${tournId}/${round.division}-${round.round}.json`
            );

            const normalizedScoreData = Array.isArray(scoreData.data)
              ? scoreData.data.reduce((acc, curr) => {
                  return acc.concat(curr.scores);
                }, [])
              : scoreData.data.scores;

            const scoreDataToSave = normalizedScoreData.find(
              (score) => score.PDGANum == athlete.PDGANum
            );
            await saveJson(scoreDataFileName, scoreDataToSave);
          } else {
            console.log(`File already exists: ${scoreDataFileName}`);
          }

          const holeBreakdownFileName = `./assets/${tournId}/${athlete.PDGANum}/${round.round}/holeBreakdownData.json`;
          if (!(await fileExists(holeBreakdownFileName))) {
            const holeBreakdownDataUrl = `https://www.pdga.com/api/v1/feat/live-scores/${round.scoreId}/hole-breakdowns`;
            await fetchAndSaveData(holeBreakdownDataUrl, holeBreakdownFileName);
          } else {
            console.log(`File already exists: ${holeBreakdownFileName}`);
          }

          const throwTimelineDataFileName = `./assets/${tournId}/${athlete.PDGANum}/${round.round}/throwTimelineData.json`;
          if (!(await fileExists(throwTimelineDataFileName))) {
            const throwTimelineDataUrl = `https://www.pdga.com/api/v1/feat/live-scores/${round.scoreId}/throw-timelines`;
            await fetchAndSaveData(
              throwTimelineDataUrl,
              throwTimelineDataFileName
            );
          } else {
            console.log(`File already exists: ${throwTimelineDataFileName}`);
          }
        }
      }
    }
  }
}

ultimateDataRetrieval();

// script 2:

// iterate over each tournament folder
// ignore layout inside
// for each division-round json file
//  > move to folder with same name
//  > produce a holeBreakdown + throwTimeline for each athlete
//    > MPO-1/holeBreakdowns/{pdga-id}/

// take this script and expand it to fetch data, hold onto a copy and then save it.
// using the copy, I can expand out and produce the additional calls for all the specific athleteData
//        > need to here account for what happens when a piece is missing
// then the structure becomes:
// {tournId}/{division}/{round}/{athleteId}/ there are three files here: score, holebreakdown, throwTimeline.

// {tournId}/{athleteId}/{round}/

// Division AND RunningPlace are held in score data block
// Hold onto raw data in a separate place, do not port to prototype, but use it for tracking missing data and such.

const structure = {
  id: 88276,
  name: "Supreme Flight Open",
  athletes: [
    {
      Name: "Holyn Handley",
      PDGANum: 107335,
      rounds: [
        {
          scoreId: 23842426,
          round: 2,
          division: "FPO",
        },
      ],
    },
  ],
};
