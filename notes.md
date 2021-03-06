
TODO
=========================================================

Do soon
---------------------------------------------------------

- on 'onHit' for solid items, move back to @_wasAt (must issolate x and y first in collision algorythim, maybe have _hitX and _hitY bools get set on all hits)

- we're at the point where pages with 1k+ of links are lagging at 30fps, due to all the collision detections (50 entities (enemies) x 1k+ checks per frame!).  So it's time to impliment a quad tree.

- fix 58's in player's move

- make 'movable' a component (player overrides for scrolling movement style)

- start all enemies off screen, makes level start easier and play is better

- use session instead of form to communicate nextLevelUrl to server.  This also  has the benefit of storing the current url to serve files correctly (instead of getting /play for /favicon for example)

- deal with 0 external links situation (better)

- consider using levenshtein distance on domain vs link to determin external to avoid similar domains (like internation)

- figure out links that are relative to localhost:8000, try to filter them out (found on facebook)



Do later
---------------------------------------------------------

- use 'gameState:[event]' events to trigger info messages based on levels/state

- make tab title and favicon be hyperlink harry instead of random site's

- directional speed goes over the player speedlimit.  Not really a big deal, but if you want to fix it, check the length of the combined vy/vx vectors against the speedlimit before adding the acceleration instead of just checking vy and vx individually

- Impliment timeout in server to give up on slow urls and try again 

- we're using a lot of libraries that all polute the global space... use something like requirejs?

- Since we gather hyperlinks on window.onload, links that get added after that by ajax don't get included, and worse, the entities might be in the wrong spot.  I'm using a setTimeout to try to accomadate for this, but it's not an ideal solution because it is speculative and varries based on browser, computer, and connection speed.  It seems to work well for me for now for the record.  I'm not sure if there's a better way.



BUGS
=========================================================

- Sites that won't work or have problems (Maybe put them on a list of rejected sites on the server so we don't get this problem):
  - pandora.com wont load completely.  They communicate with the server to launch the app, and because our Origin is not pandora.com, Acess-Control-Allow-Origin won't give us anything (many sites have this error).  I don't think there's anyway to fix this, none that I know of anyway, without somehow spoofing the Origin, which isn't what we want to do. As it is, a loading page comes up, but it counts links which are covered, but you can still get them blidly.

  - http://www.capzles.com/ also doesn't work (and some others) because they try to load http://localhost:8000/crossdomain.xml.  I can't find where they request that, maybe in flash.  What ever does, it's getting the wrong origin.  Setting <base> doesn't help.  Maybe in this case our server can see if we have the file, and if not, it can request it from a replaced version of that url and then return it

  - studio.inmobi.com/ui/index.html - same 'different origins error', I don't think we can get around that, the page is all blank

  - http://www.snagfilms.com/ doesn't load

  - http://www.criminalsearches.com/ redirects, they are doing something tricky, maybe submitting a form or using encrypted javascript.  

  - http://www.kiva.org/start claims links that dont show

  - google plus pages don't work :(

  - http://www.lynda.com/ doesn't always show the canvas elements, not sure why

  - thesaurus.com/ didn't work at one point, but worked after pressing P, maybe test again and set running to true

  - https://www.tripit.com/ redirects

- Sites that use an iframe mess up the game because the iframe wont scroll.



IDEA LOG
=========================================================

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
  - Anti-virus bots - they seek Harry out and destroy him.  Not sure what happens when Harry "dies".  Maybe he has to restart the level.  Maybe he goes back to the previous level.  Maybe he enters a "sub game" where he has to escape "quarantine" or something.  Or maybe he gets "quarantined" on the page, but I'm not sure what that means.  Maybe it puts a bubble around him that he has to break somehow.  Anti virus bots also seek out and destroy viruses and spam bots.  They target me, and if they hit me, they send me to a random page.  Also, they get blocked by links.
  - Search engine spiders - maybe they steal life or points or collectables from Harry, maybe they multiply or "sweep" the page in patterns.  Or, they don't multiply, but they just bounce around the page like a pong ball, so with many on a page, Harry has moving obstacles to avoid.  If one hits Harry, it "wraps" around him for a few seconds, slowing him down (or making his controls laggy?), and steals a certain amount of his link juice, then darts off the page and is gone.
  - Spambots - act like anti virus bots, but they are camouflaged, and when they hit you they "spam" you (maybe that slows you down).  Maybe this means they "plaster" a random ad (from where?) right under you, or better yet, if it hit's you, it makes a "pop-up" on the screen that covers everything under it.  Maybe an opportunity for monitization?  
  - Viruses - each virus divides at set intervals. Maybe they seek Harry out, or maybe they wander randomly (and wiggle like my first gen enemy tests).  If they hit you, maybe they mess up your controls (like randomly switch your key binding directions), or make you buggy (like you "jump" a few pixels in a random direction).  Somehow they damage you too probably.  Maybe they also leave "trails" of blackness everywhere they go?
  - A mouse pointer.  "Harry landed on a page being viewed by a user right now, run!".  The pointer follows Harry around and can go over any obstacles.  If it touches you it "pins" you and you can't move for a certain amount of time.  Maybe it drags you somewhere.  Then it darts offscreen and may come back randomly.

- Abilities/powerups:
  - Cloak - enemies cant target Harry for a period of time
  - Decoy - clone of Harry that moves in interse directions, enemies target the clone
  - Some way to destroy an enemy, or trap it?
  - Pointer - used to collect words?
  - Escape portal - activates the 'R' key?

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

  Can you help him?  Press "Start" to go find Harry now.

- What if Harry runs into another "human" on one of the levels?  Maybe he says to follow him, and if Harry goes through the same links, he follows him from page to page.  Maybe he leads him to the end goal?

- Twitter like comments to give in-level info.

- Link juice - Harry must gather enough link-juice before the "exit links" activate.  He gains linkjuice by walking over inbound links (each inbound link contains 1/numer of inbound links on page percent, and Harry needs to get over 70% for example.  This way he can beat any level that has at least one inbound link.).  Inbound links will probably have to "refill" after a set amount of time so Harry can get more juice if he loses some and can't escape.


data for game (displayed in header bar)

- level #
- current url
- # internal links
- # external links
- linkjuice meter (# collected internal links)
- powerups?

levels manifest
- # of each enemy type to put in based on level #


- thinking about link gathering more, here's some thoughts: you need to gather at least 50% of the total internal links on the page to escape the page.  Gathering a link litterally removes it from the page.  Spiders can gobble up links too. This means there is a possible fail condition, if the spider(s) get atleast half the links.  In that case, how do you get to exit the page?  One idea is you dont, you have to replay the level (or site), or you get deducted a level.  But maybe more fun, would be that you can steal all of the links the spider collected (rather than the spider stealing them from you).  But you have to catch him first, and he's faster than you.  But maybe he only bounces unintelligently (or sweeps), so if you use obstacles (like slow images and solid headers?) to your advantage, you can catch him and get his links to exit.  On that note, maybe spambots turn links into minus linkjuice if you collect them.  In order to "purify" the link you need to do something - what?

- trying to figure out what to do about internal and external links.  My original idea of gathering x number of internal links to "activate" external links to "hyperjump" throuh (either taking to that link, or a new random page) may not work.  This code finds the number of internal and external links per page: `_.groupBy($('a').map(function (){return this.href}), function(link){var re = new RegExp(window.currentUrl);return link.match(re)})`.  In most sites I've explored, some sites (like news sites) have tons of external links, but most sites have only around 10%, and many sites (like branded sites) only have external links to facebook, twitter, etc.  So this means that if you follow the links, you'll end up on those social media brand pages very often.  Maybe that's not such a bad thing, because from there you can get out easily to other sites, and you'll have interesting material, so maybe that's actually good, plus you'll get the feel of the real life ebb and flow of search spiders and how the web is linked.  The other option of making it random seems a bit strange if you're hunting for links.  The alternative I was going to suggest was after collecting the required numbre of links you either direction hyperjump, or a "portal" of some kind opens up for you to get to.  But the more I think of it, the more I'm liking using the external links.  Even if you end up on twitter often, you'll get a different page and can read different content each time, plus you'll have an idea of what to look for when it's time to get off a page (look for the social media icons).

  So in that case, the only question is what to do when there aren't any external links (or internal links).  Maybe introduce some kind of black hole that sucks you into a new random page, and that's where the random hyperjumping comes in, since it's no longer like stuble upon if you're chosing where to go.  This same "black hole" thing could happen if you fail to gather enough links.

- Another cool enemy (or friend?) could be a spider or something that starts on each page with you and escapes through a link, and if you follow that link, you'll catch up with him.  (If you don't follow that link, maybe you "randomly" come across him on another site.)  So what happens when you hit him?  Maybe he leads you to something (like the google bot always goes for google plus), or if you catch him, he gives you some powerup or story, or way to progress to new levels.

- Idea from talking with Alan - when running over a <p> tag, harry highlights the word he is on, and the user can "gather" that word (not sure of the ui).  Then if harry catches a seach engine spider, he can use his gathered words to make a search phrase and be taken to the results page for it.  This way the user can control where he goes more, if we give him tasks and goals.

- Social Harry - I could make a twitter page that tweets the location of harry on each new hyperlink.  Maybe this is the page you have to get to in the end?

- After testing the game play with external hyperlinks working, I'm finding that it's not as awesome as I expected.  In fact, we may need to rethink this.  The problems I ran into include - getting 'stuck' in a 'site family loop', like sites where the only external links are international versions, or privacy pages or things like that with no way to get back out into the "open waters".  Also some pages don't even have external links.  This is especially a problem with important sites like some aggregators and even Facebook - instead of a rich link field, almost all are internal.  Also many pages simply don't work or are 404.  

  So the question is, what to do about this?  One direction is to improve my internal/external detection to pick up some likes that are missed (like bit.ly) and pass on subdomains, but I'm not sure how much that will help.  Another is to change my strategy on what is internal and external, but I don't know what that means exactely.  Another direction is to drop the link following idea and just collect enough links to do a random jump, but this kind of loses a nice part of controlling where you are.  The only way to make that work is to make part of the story invovle random hyperjumps, or introduce some new element like the random jump button that activates after filled with link juice.  Collecting words on the page could be employed maybe to make the random jump not so random.  

- I'VE GOT THE ENDING!!  When you finally find your way "back home" it takes you to the hyperlink harry hompage!  And you realize "oh sh!t, it's all just a game!".  Like Limbo, only cooler, because you can run around on the page that you had already entered been on to start the game.  And, since we control that page, we can inject stuff into it, like "you win" message/animation, maybe leader board, etc, plus the twitter feed of where harry has been.  Sweet B-)

- Ads block Harry.

- Anti virus bots chase Harry, viruses and spambots.  Spambots randomly spawn ads (try to get real current ads or parodies?) that block Harry like page ads and destroy links under them?  Or do they go away if you hit the close button?  Viruses destroy random parts of the page (or what they are over?) by turning them black (or white).  

- <html> "code view" where harry is literally over the html code.  He could still run around and collect links maybe.  Maybe viruses send harry to this view, or maybe it's a bonus or special level.

- Anti virus bots behaviour ai upgrade - add dynamic obidience: Each bot gets a primary task (kill virus/Harry), but has other tasks it can do too (like see what's happening at nearest friend, stalk a friend, switch targets, go look at something that's not a target, nap, malfunction).  Each bot gets an "obidience quotiant" that determins upon creation if it follows the primary task or picks one of the other tasks as well.  In addition, based on the obidience quotiant, the bot may "get distracted," switch tasks, or get back on the primary task either at random times, or at certain evens (like killing a virus, or getting to far away from Harry).  This would be interesting to see what happens now that these critters have some "free will" (like game of life)

- remove internal/external links hyperlink concept.  Instead, once your hyperjump linkjuice meter is full enough, press 'space' to activate hyperjump.  If you don't have enough linkjuice, it warns you that you don't have enough linkjuice to escape the current domain.  You can press 'space' again to jump to an internal link (random or the last one you got) and try again, though you'll be stuck in "domain purgatory" untill you can hyperjump out and your level doesn't advance.

- if a virus hits you, maybe you have ten seconds to either escape or find an antivirus bot, or health(?), and if you dont, then it jumps you to a "bad site" like the terrible 90's design sites (ooh, maybe all links give you a version from the waybackmachine?), or naptser, or a jail site, or a health site about viruses, or the wikipedia site about viruses or something like that, and your level doesn't advance.

- if an anti virus bot hits you, you get 'quarantined' - the screen gets covered in white or black, with just a small (growing?) viewable area around your character

- spambots or viruses turn images on page into something else?

- viruses maybe affects Harry in different ways - some send him to a virus page, maybe others make him glitch, or mirror the world under Harry, or shrink Harry.

- boss pages - at specific levels, load a pag that is extra difficult (like where's waldo maybe) or has a boss on it, or their facebook page or something special

- make links and adds "shimmer" as you scroll