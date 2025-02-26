const athletes = [
    {
        "name": "Gannon Buhr",
        "PDGANum": 75412
    },
    {
        "name": "Ezra Aderhold",
        "PDGANum": 121715
    },
    {
        "name": "Anthony Barela",
        "PDGANum": 44382
    },
    {
        "name": "Eagle McMahon",
        "PDGANum": 37817
    },
    {
        "name": "Richard Wysocki",
        "PDGANum": 38008
    },
    {
        "name": "Parker Welck",
        "PDGANum": 39491
    },
    {
        "name": "Nick Newton",
        "PDGANum": 47689
    },
    {
        "name": "Noah Meintsma",
        "PDGANum": 56555
    },
    {
        "name": "Jake Brown",
        "PDGANum": 140954
    },
    {
        "name": "Ryan Jewell",
        "PDGANum": 180216
    },
    {
        "name": "Codi Wood",
        "PDGANum": 142689
    },
    {
        "name": "Connor Rock",
        "PDGANum": 73695
    },
    {
        "name": "Thomas Earhart",
        "PDGANum": 54106
    },
    {
        "name": "Levi Hancock",
        "PDGANum": 103050
    },
    {
        "name": "Chris Paetz",
        "PDGANum": 110290
    },
    {
        "name": "Jarod O'Brien",
        "PDGANum": 92426
    },
    {
        "name": "Kade Filimoehala",
        "PDGANum": 104984
    },
    {
        "name": "Max Nichols",
        "PDGANum": 21870
    },
    {
        "name": "Dan Schlitter",
        "PDGANum": 80219
    },
    {
        "name": "Zack Wysocki",
        "PDGANum": 61722
    },
    {
        "name": "Nate Toutolmin",
        "PDGANum": 157945
    },
    {
        "name": "Kai Kim",
        "PDGANum": 109378
    },
    {
        "name": "Jacob Courtis",
        "PDGANum": 56511
    },
    {
        "name": "Jedd Berger",
        "PDGANum": 152206
    },
    {
        "name": "Kyle Krieckhaus",
        "PDGANum": 154511
    },
    {
        "name": "Cooper Johnson",
        "PDGANum": 247459
    },
    {
        "name": "Dylan Almquist",
        "PDGANum": 175226
    },
    {
        "name": "Gavin Bos",
        "PDGANum": 187956
    },
    {
        "name": "Chris Ozolins",
        "PDGANum": 55049
    },
    {
        "name": "Bhrahsten Waugh",
        "PDGANum": 45463
    },
    {
        "name": "Dan Beck",
        "PDGANum": 181041
    },
    {
        "name": "Tanner Patoni",
        "PDGANum": 159008
    },
    {
        "name": "Tristan Tanner",
        "PDGANum": 99053
    },
    {
        "name": "Tyler Winston",
        "PDGANum": 93845
    },
    {
        "name": "Steven Gailey",
        "PDGANum": 31762
    },
    {
        "name": "Tanner Mihelic",
        "PDGANum": 194038
    },
    {
        "name": "Kyle Rogney",
        "PDGANum": 104760
    },
    {
        "name": "Kevin Degitis",
        "PDGANum": 157819
    },
    {
        "name": "James Beckner",
        "PDGANum": 49519
    },
    {
        "name": "Isaac Mangrum",
        "PDGANum": 139110
    },
    {
        "name": "Ryan Bain",
        "PDGANum": 196731
    },
    {
        "name": "Derek Winstanley",
        "PDGANum": 157617
    },
    {
        "name": "Houston Finch",
        "PDGANum": 258444
    },
    {
        "name": "Lance Trott",
        "PDGANum": 23363
    },
    {
        "name": "Zach Lyons-Wade",
        "PDGANum": 129701
    },
    {
        "name": "Donovan Farrell",
        "PDGANum": 181173
    },
    {
        "name": "Luke Humphrey",
        "PDGANum": 89895
    },
    {
        "name": "Preston Johnson",
        "PDGANum": 63143
    },
    {
        "name": "Tommy Gunz III",
        "PDGANum": 71392
    },
    {
        "name": "Ryan Crocker",
        "PDGANum": 192541
    },
    {
        "name": "Steven Key",
        "PDGANum": 25475
    },
    {
        "name": "Chris Warfield",
        "PDGANum": 52439
    },
    {
        "name": "Tyler Schrock",
        "PDGANum": 71872
    },
    {
        "name": "Andrew Singer",
        "PDGANum": 101939
    },
    {
        "name": "Jason Hawkinson",
        "PDGANum": 210018
    },
    {
        "name": "Jake Reedholm",
        "PDGANum": 224120
    },
    {
        "name": "Alex Kalange",
        "PDGANum": 266759
    },
    {
        "name": "Jordan Behn",
        "PDGANum": 191511
    },
    {
        "name": "Joshua Barnum",
        "PDGANum": 282310
    },
    {
        "name": "Mark Person",
        "PDGANum": 221608
    },
    {
        "name": "Jaylen Mosley",
        "PDGANum": 117274
    },
    {
        "name": "Malachi Vazquez",
        "PDGANum": 162249
    },
    {
        "name": "Jeffrey Korns",
        "PDGANum": 69287
    },
    {
        "name": "Gregory Bush",
        "PDGANum": 44965
    },
    {
        "name": "Mitchell Rainey",
        "PDGANum": 51880
    },
    {
        "name": "Julian Celis",
        "PDGANum": 103122
    },
    {
        "name": "Patrick Womack",
        "PDGANum": 228463
    },
    {
        "name": "Forrest Hierholzer",
        "PDGANum": 208424
    },
    {
        "name": "Colin Vercio",
        "PDGANum": 214961
    },
    {
        "name": "Michael Vazquez",
        "PDGANum": 154710
    },
    {
        "name": "Chris Metz",
        "PDGANum": 119729
    },
    {
        "name": "Stephen Winzer",
        "PDGANum": 196725
    },
    {
        "name": "Eugene Pantella",
        "PDGANum": 95171
    },
    {
        "name": "Cody VanHevel",
        "PDGANum": 60675
    },
    {
        "name": "Derek Warner",
        "PDGANum": 196752
    },
    {
        "name": "George McManus",
        "PDGANum": 203517
    },
    {
        "name": "Johnny Ringo",
        "PDGANum": 165440
    },
    {
        "name": "Christoffer Teudt",
        "PDGANum": 151800
    },
    {
        "name": "David Lim",
        "PDGANum": 79065
    },
    {
        "name": "Clayton Strayer",
        "PDGANum": 227085
    },
    {
        "name": "Michael O'Brien",
        "PDGANum": 21346
    },
    {
        "name": "Adrian Aviles",
        "PDGANum": 187407
    },
    {
        "name": "K Vegas Sterling",
        "PDGANum": 243139
    }
]

const tournamentId = 86522;