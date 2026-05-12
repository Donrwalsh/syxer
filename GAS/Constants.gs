// v2.0

const DEV_SPREADSHEET_APP_ID = '1ved59LizeTL3E1i0OCUUSuUXydDVMDU9s_CFGTuLi90'; // Did not replace, probably don't need.
const GOOGLE_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';
const ROUND_ALPHA = ["D", "G", "J", "M", "P"]

const DEV_PLAYER_SPREADSHEET_IDS = [
  { id: '1ved59LizeTL3E1i0OCUUSuUXydDVMDU9s_CFGTuLi90/edit?gid=1623859890', name: "Dev Don" },
];

//TODON: See if I can get rid of names
const PLAYER_SPREADSHEET_IDS = [
  { id: '1XsbUX0_PDw7SG61AAT8HdU4JMrr7YtbZp-kHktgQuuE/edit?gid=1623859890', name: "Potato" },
  { id: '1QWrA3Ra_iRIs4xnt7kqkZM5SWS74e4fTSnW-CaHts8M/edit?gid=1623859890', name: "Markman's Fruit Basket" },
  { id: '152ebBuuielboQ5_wl57WPvvGFRfzZrEYakwh--cCzpQ/edit?gid=1623859890', name: "Thunder Kicks" },
  { id: '14WyNsmp5hINkfXdKeIvduKjw70nauO1sO0bgD2ApZLA/edit?gid=1623859890', name: "Gintertime" },
  { id: '1KCI1hzyDSYPwNGn4wI9PJjH781V2tmGhnTQtT-KqIzs/edit?gid=1623859890', name: "Euros with Gyros" },
  { id: '18Wo5jUl1JR5xwNOcpUBcA29RDfkYPQqnE-3q4hnAj00/edit?gid=1623859890', name: "Captain Crush" },
  { id: '1hLq0TtT-W6DhnpU7YdtFpzpLSzNsTChh_a10WprvhCg/edit?gid=1623859890', name: "Mrrcan HydroYEETing" },
  { id: '1fWoib94BDZLdgmoffFwqRax96z6jsu62XyKzA1FGVoQ/edit?gid=1623859890', name: "Jisc Joctah" },
  { id: '1FKuhBkm0rJr5kNejUSgP-exax2E7qnCA-njrEseX4a8/edit?gid=1623859890', name: "A Regular Guy" },
  { id: '1PvSExPb-La7pAxzMT11Val19A0yV6E0lBft_i6sX_tU/edit?gid=1623859890', name: "#BoostIT" },
  { id: '1AEvudBQLD73fbona9VTDPBG-2Rh3idw_HbmOSIPa46M/edit?gid=1623859890', name: "Hits Cage, OB!" },
  { id: '1sjvesZyywckADJHMoiXcWep2tfokQNNVH-oZ8Ng4CJU/edit?gid=1623859890', name: "Burger King" },
];

const TOURNAMENTS = [
  { id: 96401, name: 'Supreme Flight Open', start: new Date(2026, 1, 27), end: new Date(2026, 2, 1), cell: 'C14'},
  { id: 96402, name: 'Big Easy Open', start: new Date(2026, 2, 13), end: new Date(2026, 2, 15), cell: 'G14'},
  { id: 96403, name: 'Queen City Classic', start: new Date(2026, 2, 27), end: new Date(2026, 2, 29), cell: 'K14'},
  { id: 97336, name: 'PDGA Champions Cup', start: new Date(2026, 3, 9), end: new Date(2026, 3, 12), cell: 'O14'},
  { id: 96404, name: 'Jonesboro Open', start: new Date(2026, 3, 17), end: new Date(2026, 3, 19), cell: 'C29'},
  { id: 96407, name: 'KC Wide Open', start: new Date(2026, 3, 24), end: new Date(2026, 3, 26), cell: 'G29'},
  { id: 102001, name: 'Waco Annual Charity Open', start: new Date(2026, 4, 1), end: new Date(2026, 4, 3), cell: 'K29'},
  { id: 96408, name: 'The Open at Austin', start: new Date(2026, 4, 7), end: new Date(2026, 4, 10), cell: 'O29'},
  { id: 96409, name: 'OTB Open', start: new Date(2026, 4, 21), end: new Date(2026, 4, 24), cell: 'C44'},
  { id: 98193, name: 'Cascade Challenge', start: new Date(2026, 4, 29), end: new Date(2026, 4, 31), cell: 'G44'},
  { id: 96410, name: 'NW Disc Golf Championship', start: new Date(2026, 5, 4), end: new Date(2026, 5, 7), cell: 'K44'},
  { id: 97339, name: 'European Open', start: new Date(2026, 5, 18), end: new Date(2026, 5, 21), cell: 'O44'},
  { id: 96411, name: 'Swedish Open', start: new Date(2026, 5, 26), end: new Date(2026, 5, 28), cell: 'C59'},
  { id: 96412, name: 'Ale Open', start: new Date(2026, 6, 3), end: new Date(2026, 6, 5), cell: 'G59'},
  { id: 96413, name: 'Heinola Open', start: new Date(2026, 6, 10), end: new Date(2026, 6, 12), cell: 'K59'}, 
  { id: 97341, name: 'USWDGC', start: new Date(2026, 6, 16), end: new Date(2026, 6, 19), cell: 'O59'},
  { id: 100195, name: 'Champions Landing Open', start: new Date(2026, 6, 24), end: new Date(2026, 6, 26), cell: 'G74'},
  { id: 96414, name: 'Ledgestone Open', start: new Date(2026, 6, 30), end: new Date(2026, 7, 2), cell: 'K74'},
  { id: 96415, name: 'Discmania Challenge', start: new Date(2026, 7, 7), end: new Date(2026, 7, 9), cell: 'C96'},
  { id: 97344, name: 'PDGA Pro Worlds', start: new Date(2026, 7, 26), end: new Date(2026, 7, 30), cell: 'G96'},
  { id: 8675309, name: 'LWS Open at Idlewild', start: new Date(2026, 8, 4), end: new Date(2026, 8, 6), cell: 'K96'},
]
