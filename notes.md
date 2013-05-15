#### NOTES



### BUGS

- Forgot to use backbone properly - player data shouldn't be in the view, rather model

- Some regexes don't work, seems case-insensitive isn't working, don't know why, it's clearly there...




### TODO

- Use dt in game loop for constant speeds

- Consider nixing backbone?

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

- What if hitting a link does a google query for the text of that link, sending you to the first page result.  That way we hopefully get better quality pages, and the content has some consistant thread.  Plus you get to influence where you end up.

- Images make you slow down, headers or something are always blocks.  Or look at css properties to influence game properties.  Could that work?