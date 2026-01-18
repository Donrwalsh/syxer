Ok, here goes a stream of consciousness for the data-get script update.

I am building a script that produces data organized as such:

{tournId}/{athleteId}/{round}/

Ok, so I adjusted the script to produce the structure I want but I'm hitting a ton of 429s right now. Hm.

Awesome, I was able to run it through the entire script just using a 429 retry strategy.
