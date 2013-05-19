#### NOTES



### BUGS

- Forgot to use backbone properly - player data shouldn't be in the view, rather model

- Some regexes don't work, seems case-insensitive isn't working, don't know why, it's clearly there...




### TODO

#### Do soon

- Use dt in game loop for constant speeds

- Consider nixing or changing use of backbone?

- think of way to make sure player doesn't start on a page over a link (or other active element?)

#### Do later

- Need to stip out base tag ie: <base href="http://www.univ-paris1.fr/">

- Some sites use framesets and dont have a body... so out stuff doesn't get appended, arg

- Detect error: getaddrinfo ENOTFOUND from request module -- handle it better...

- Impliment timeout in server to give up on slow urls and try again 




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
  - Anti-virus bots - they seek Harry out and destroy him
  - Search engine spiders - maybe they steal life or points or collectables from Harry, maybe they multiply or "sweep" the page in patterns

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

- Story:
  Hyperlink Harry.  

  One day while surfing the net, Harry's modem had a power surge and sucked Harry into the web.  

  Now Harry's digital consciousness is lost somewhere out in web land, bouncing from site to site, evading antivirus bots and seach engine spiders, and looking for his way back home.

  Will you help him?  How long can you survive?  Can you find his way back home?  Press "Start" to go find Harry now.

