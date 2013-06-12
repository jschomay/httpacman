#### NOTES



### BUGS

- Some regexes don't work, seems case-insensitive isn't working, don't know why, it's clearly there...

- sites that can still hyjack our window:
  - view-source:http://www.fedspending.org/apidoc.php

- can't seem to disable scrolling completly, plus pages jump to top on load despite my efforts.  Maybe just leave it as is?  Or do a overflow:hidden on body?

- Some sites have event listeners on elements (like scroll feedback on www.lynda.com), so they give errors since we strip all scripts, causing bad frame rates.  Here's a possible fix, or use regex to strip: http://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element




### TODO

#### Do soon

- play with easing on movement

- think of way to make sure player doesn't start on a page over a link (or other active element?)

#### Do later

- in components/index loop through all components passed in to mixin to extend with instead of hardcoding to use just sprite

- think about if entities should be under models/ since they now have draw functions

- find better way to access header bar height instead of hard coding 58 everywhere

- Need to strip out base tag ie: <base href="http://www.univ-paris1.fr/">

- Some sites use framesets and dont have a body... so out stuff doesn't get appended, arg

- there's really no reason to use backbone at all at this point... make the directors regular classes

- directional speed goes over the player speedlimit.  Not really a big deal, but if you want to fix it, check the length of the combined vy/vx vectors against the speedlimit before adding the acceleration instead of just checking vy and vx individually

- Detect error: getaddrinfo ENOTFOUND from request module -- handle it better...

- Impliment timeout in server to give up on slow urls and try again 

- we're using a lot of libraries that all polute the global space... use something like requirejs?

- Some servers (ex: www.retailmenot.com and www.whitepages.com) have given a 403 status (forbidden).  Maybe this is because it checks server agents?  Maybe we need to define ourself as a browser on our request.  Or maybe it's just because we're running on local host right now?




### IDEAS

- Each level has 2x # of enemies as last level (level=# of "hyperjumps")

- Put constant transparent header bar at top of each page wtih branding, level#, pause, help, and maybe a refresh (I'm stuck) buttons

- Eating links turns you into 'gobble mode' to eat ghosts/enemies

- One link is the escape route to 'hyperjump' to the next site

- Name - "Hyperlink Harry" or "Link Jumper"?

- What if hitting a link does a google query for the text of that link, sending you to the first page result.  That way we hopefully get better quality pages, and the content has some consistant thread.  Plus you get to influence where you end up.  But you'd end up seaching "home", "about us", "here", etc a lot.  We need some way to randomize that so we don't get the same web page each time.  One thought is to randomize the search result rank number we pull.  Or to add a random word to the link work.  Or keep a record of all visited sites or searched terms and adjust as necessary if it's a repeat.  Here's an idea - disable all inbound links (or make them give Harry some powerup or points or something, or make them solid?), and only let outbound links end the level.  That should help with getting rid of "home", "contact", etc, plus allow for more time on each level/site, since you could immediately leave a site from any nav bar or header logo usually.  There might be a case when a site has no outbound links.  In that case, we'd have to inject a random one somewhere, or put in a special "emergency exit" powerup item.

- Yahoo pipes can give us access to search results from a custom query.  Like... this:
  http://pipes.yahoo.com/pipes/pipe.run?_id=1b71cfefcc9933e084970aef476518ab&_render=json&searchInput=pacman+game
  But the problem with this is that we are getting specific news posts mostly instead of random home pages.  Maybe that is ok.  Test drive it.

- fyi, http://www.randomwebsitemachine.com/random_website/   seems better than urlroulette.com

- Images make you slow down, headers or something are always blocks.  Or look at css properties to influence game properties.  Could that work?


- Supposedly, all websites are connected by 19 clicks (http://abcnews.go.com/Technology/degrees-kevin-bacon-internet-edition-websites-19-clicks/story?id=18539905#.UZO4Ayv72K8).  It would be fun to make a game where you start on a random website and you have to find your way to your own homepage (or social profile?) by clicking links.  Is it possible?  Probably not practical

- I have this idea that Harry is lost, and needs to find his way back home.  What if we use ip locations to track all the points "around the world" where Harry lands, and you're trying to hit a site that has it's servers located in Harry's (ie, the users?) home state or city?  In this case the header bar might show the ip and location of the current site, maybe number of links too.

- Given the above idea, the game can have a win condition.  So what would happen then on screen?

- Enemies:
  - Anti-virus bots - they seek Harry out and destroy him.  Not sure what happens when Harry "dies".  Maybe he has to restart the level.  Maybe he goes back to the previous level.  Maybe he enters a "sub game" where he has to escape "quarantine" or something.  Or maybe he gets "quarantined" on the page, but I'm not sure what that means.  Maybe it puts a bubble around him that he has to break somehow.  Anti virus bots also seek out and destroy viruses and spam bots.
  - Search engine spiders - maybe they steal life or points or collectables from Harry, maybe they multiply or "sweep" the page in patterns.  Or, they don't multiply, but they just bounce around the page like a pong ball, so with many on a page, Harry has moving obstacles to avoid.  If one hits Harry, it "wraps" around him for a few seconds, slowing him down (or making his controls laggy?), and steals a certain amount of his link juice, then darts off the page and is gone.
  - Spambots - act like anti virus bots, but they are camouflaged, and when they hit you they "spam" you (maybe that slows you down).  Maybe this means they "plaster" a random ad (from where?) right under you, or better yet, if it hit's you, it makes a "pop-up" on the screen that covers everything under it.  Maybe an opportunity for monitization?  
  - Viruses - each virus divides at set intervals. Maybe they seek Harry out, or maybe they wander randomly (and wiggle like my first gen enemy tests).  If they hit you, maybe they mess up your controls (like randomly switch your key binding directions), or make you buggy (like you "jump" a few pixels in a random direction).  Somehow they damage you too probably.  Maybe they also leave "trails" of blackness everywhere they go?

- Abilities/powerups:
  - Cloak - enemies cant target Harry for a period of time
  - Decoy - clone of Harry that moves in interse directions, enemies target the clone
  - Some way to destroy an enemy, or trap it?

- Animation/transition ideas:
  - On enter/exit world Harry fades in/out with 0's and 1's particles effect.  Same on die, only bigger?
  - On level end, walk the DOM from bottom up, randomly sliding each element to the left or right off screen at different speeds and staggered start times to "take away" the page.  This could be awesome, would it work? - Yes it works! https://gist.github.com/jschomay/5608377

- Pacing: use some map of special level numbers to display instructions, notes/story, and add mechanics/entities.

- Backbone model and view implimentation thoughts - basically use them as a stage or director, rather then for game entities.
  - Model: 
    - In charge of crating all of the game entity instances (regular objects, not backbone models)
    - Holds a backbone collection OR custom [backbone model?] scene graph/quad tree of all entities
    - Game loop calls update on it.  It runs update on all entities.
  - View:
    - Knows how to render each type of entity (ex. knows the sprites for an enemy type)
    - Game loop calls draw on it. It renders each entity, using the proper render method and entity properties.
    - Has other special effects/animations

- Maybe make external links take you to where they point.  But if you get killed by an enemy, or run out of linkjuice, or hit refresh, only then does it take you to a new random site.

- Add a quest - use some kind of image recgoznition software, or find in text, so Harry can collect certain items.  Once he has them all, he can build a thing to get him back homme.

- Story:
  Hyperlink Harry.  

  One day while surfing the net, Harry's modem had a power surge and sucked Harry into the web.  

  Now Harry's digital consciousness is lost somewhere out in web land, bouncing from site to site, evading antivirus bots and seach engine spiders, and looking for his way back home.

  Will you help him?  How long can you survive?  Can you find his way back home?  Press "Start" to go find Harry now.

- What if Harry runs into another "human" on one of the levels?  Maybe he says to follow him, and if Harry goes through the same links, he follows him from page to page.  Maybe he leads him to the end goal?

- Twitter like comments to give in-level info.

- Link juice - Harry must gather enough link-juice before the "exit links" activate.  He gains linkjuice by walking over inbound links (each inbound link contains 1/numer of inbound links on page percent, and Harry needs to get over 70% for example.  This way he can beat any level that has at least one inbound link.).  Inbound links will probably have to "refill" after a set amount of time so Harry can get more juice if he loses some and can't escape.