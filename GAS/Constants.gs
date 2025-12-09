// v1.10

const DEV_SPREADSHEET_APP_ID = '1lze7Z7bbPDIQRUaCagSQWXESewI7kqVfgQa5nitPRFM';
const GOOGLE_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';
const PDGA_URL_PREFIX = `https://www.pdga.com/`;
const ROUND_ALPHA = ["D", "G", "J", "M", "P"]

const DEV_PLAYER_SPREADSHEET_IDS = [
  { id: '1vbUcgMMRiH41GpdTqgqQklRRVH-W_k8LKdosaEbcXJ8/edit?gid=1623859890', name: "Don" },
];

//TODON: See if I can get rid of names
const PLAYER_SPREADSHEET_IDS = [
  { id: '1uVEARqNbGgES_16-PmFe5Fq25sSj9fkmWusW5EUdvr0/edit?gid=1623859890', name: "Syxy Mynxes" },
  { id: '19VsPtTxMgMfNmo31L3oRDXW8eS2daqIibqAjo3x3cic/edit?gid=1623859890', name: "Ginter" },
  { id: '1eN7tZq_WbBh9d5_ecBLW6oiBDENsWVhMekpjtkdl9oI/edit?gid=1623859890', name: "Langster's Paradise" },
  { id: '1hor7h02srtq8grLWJK2nYZYKNVAz6CJJnbaqBEJsNhc/edit?gid=1623859890', name: "Phenomenal Raptors" },
  { id: '1b9alrHxLK0nDar-GKrqu2-KthxjzALiQ88laPighO3U/edit?gid=1623859890', name: "Teem 5" },
  { id: '1cRcYl1Cd-KG5uRj-KSXNn38Dr1BQNSzrLM0ywAEF8aY/edit?gid=1623859890', name: "Laura" },
  { id: '1t5V0yhtqJgU5pta1rmg9rwiEtlGoaddf5LjrkHgrRuA/edit?gid=1623859890', name: "Bajari" },
  { id: '1DQDMgiXozCxEKbpOD3Zi4sPV_zZTMAaZ6ueiFhuuYpA/edit?gid=1623859890', name: "I live to Frolf" },
  { id: '1RnVrJ01zdvbfhk0q3S8TMtgPBXA5y11P1NwK2eOMk_k/edit?gid=1623859890', name: "Boost It" },
  { id: '1OOn4SzHDwwh0xaWXIpRBAwiH8HcLvhwhXJwU3PqQ__I/edit?gid=1623859890', name: "Jame Team" }
];

const TOURNAMENTS = [
  { id: 88276, name: 'Supreme Flight Open', start: new Date(2025, 1, 28), end: new Date(2025, 2, 2), cell: 'C14'},
  { id: 88277, name: 'Waco Annual Charity Open', start: new Date(2025, 2, 14), end: new Date(2025, 2, 16), cell: 'G14'},
  { id: 88279, name: 'The Open at Austin', start: new Date(2025, 2, 20), end: new Date(2025, 2, 23), cell: 'K14'},
  { id: 88282, name: 'Music City Open', start: new Date(2025, 3, 4), end: new Date(2025, 3, 6), cell: 'O14'},
  { id: 88282, name: 'Kansas City Wide Open', start: new Date(2025, 3, 18), end: new Date(2025, 3, 20), cell: 'C29'},
  { id: 88638, name: 'PDGA Champions Cup', start: new Date(2025, 4, 1), end: new Date(2025, 4, 4), cell: 'G29'},
  { id: 88284, name: 'Cascade Challenge', start: new Date(2025, 4, 16), end: new Date(2025, 4, 18), cell: 'K29'},
  { id: 88285, name: 'Konapiste Open', start: new Date(2025, 4, 23), end: new Date(2025, 4, 25), cell: 'O29'},
  { id: 88286, name: 'NW Disc Golf Championship', start: new Date(2025, 4, 29), end: new Date(2025, 5, 1), cell: 'C44'},
  { id: 88287, name: 'Ale Open', start: new Date(2025, 5, 6), end: new Date(2025, 5, 8), cell: 'G44'},
  { id: 88357, name: 'The Preserve Championship', start: new Date(2025, 5, 13), end: new Date(2025, 5, 15), cell: 'K44'},
  { id: 88651, name: 'USWDGC', start: new Date(2025, 5, 19), end: new Date(2025, 5, 22), cell: 'O44'},
  { id: 88288, name: 'Discmania Challenge', start: new Date(2025, 5, 27), end: new Date(2025, 5, 29), cell: 'C59'},
  { id: 88289, name: 'PCS Open', start: new Date(2025, 6, 4), end: new Date(2025, 6, 6), cell: 'G59'},
  { id: 90652, name: 'Krokhol Open', start: new Date(2025, 6, 11), end: new Date(2025, 6, 13), cell: 'K59'},
  { id: 89546, name: 'European DG Festival', start: new Date(2025, 6, 17), end: new Date(2025, 6, 20), cell: 'O59'},
  { id: 90947, name: 'PDGA Pro Worlds', start: new Date(2025, 6, 30), end: new Date(2025, 7, 3), cell: 'G74'},
  { id: 88290, name: 'Turku Open', start: new Date(2025, 7, 8), end: new Date(2025, 7, 10), cell: 'K74'},
  { id: 88293, name: 'Ledgestone Open', start: new Date(2025, 7, 14), end: new Date(2025, 7, 17), cell: 'C96'},
  { id: 88294, name: 'LWS Open at Idlewild', start: new Date(2025, 7, 22), end: new Date(2025, 7, 24), cell: 'G96'},
  { id: 0, name: 'Discraft Great Lakes Open', start: new Date(2025, 7, 28), end: new Date(2025, 7, 31), cell: 'K96'},
]