Ok, here goes a stream of consciousness for the data-get script update.

I am building a script that produces data organized as such:

{tournId}/{athleteId}/{round}/

Ok, so I adjusted the script to produce the structure I want but I'm hitting a ton of 429s right now. Hm.

Awesome, I was able to run it through the entire script just using a 429 retry strategy.

Alright, now I'm going to create a manifest file that describes the supplementary data that I will need to obtain.

Cool, got that to work with some reduce action. There's a 'pool' thing going on with 90947 that I didn't record at all. Otherwise, the manifest is all set to go.
