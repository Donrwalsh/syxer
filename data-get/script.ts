import fetch from "node-fetch";
import * as fs from "fs";

function normalizeWindowsFolderName(input: string): string {
  // Trim whitespace
  let name = input.trim();

  // Replace whitespace (spaces, tabs, newlines) with underscores
  name = name.replace(/\s+/g, "_");

  // Replace invalid characters with underscores
  name = name.replace(/[<>:"/\\|?*]/g, "_");

  // Windows does not allow folder names ending with a period or space
  name = name.replace(/[. ]+$/g, "");

  // If the name becomes empty, use a fallback
  if (name.length === 0) {
    name = "folder";
  }

  // Reserved Windows device names (case-insensitive)
  const reserved = new Set([
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ]);

  if (reserved.has(name.toUpperCase())) {
    name = name + "_";
  }

  return name;
}

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

async function fetchAndSaveData(url: string, filePath: string): Promise<void> {
  try {
    await sleep(500);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }

    const data: any = await response.json();

    // Convert the JavaScript object back into a JSON string
    const jsonData = JSON.stringify(data, null, 2);

    // Write the JSON string to a file using Node's File System module
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        throw err;
      }
      console.log(`JSON data is saved to ${filePath}`);
    });
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  }
}

[
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
].forEach(async (tourn) => {
  let folderPath = `data/${normalizeWindowsFolderName(tourn.name)}`;
  ensureFolderExists(folderPath);

  let layoutUrl = `https://www.pdga.com/api/v1/live-tournaments/${tourn.id}/live-layouts?include=LiveLayoutDetails`;

  await fetchAndSaveData(layoutUrl, `${folderPath}/layout.json`);

  ["FPO", "MPO"].forEach(async (division) => {
    [1, 2, 3, 4, 5, 12].forEach(async (round) => {
      let url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tourn.id}&Division=${division}&Round=${round}`;
      await fetchAndSaveData(url, `${folderPath}/${division}-${round}.json`);
    });
  });
});
