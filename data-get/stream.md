Ok, here goes a stream of consciousness for the data-get script update.

I am building a script that produces data organized as such:

{tournId}/{athleteId}/{round}/

Ok, so I adjusted the script to produce the structure I want but I'm hitting a ton of 429s right now. Hm.

Awesome, I was able to run it through the entire script just using a 429 retry strategy.

Alright, now I'm going to create a manifest file that describes the supplementary data that I will need to obtain.

Cool, got that to work with some reduce action. There's a 'pool' thing going on with 90947 that I didn't record at all. Otherwise, the manifest is all set to go.

Note that I should probably kill the top-level MPO-1, FPO-2, etc. data because it's duplicative. Or maybe it doesn't matter, idk.

Haha, my plans to just drop the assets folder into the angular assets spot is foiled by the sheer amount of data. ~350MB across 32k files and 14k folders. Not a chance.

So the task is to construct a single file that distills all the stuff from the ugly, unwieldy collection of 32k files. I wrote a script that does it by repurposing my gas and after I got the first tournament working, I removed the break for all tournaments and it worked!

This is something like a 97.5% data compression, hell yeah.

Well, let's keep it going. I need a map of athlete names to PDGANums next.

Cool, that was simple. I think that I'm in a good spot to transition over to porting this data into the frontend and seeing what I can do with it. But first, I'm going to go be a human for a while! I spent the last 4.5 hours putting all this together and I'm feeling very satisfied with where it's at.
