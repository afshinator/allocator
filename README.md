
You work at a port and are in charge of vessel allocations. Each day, you are given
 a list of containers that need to be shipped and a list of vessels that are leaving that day. You need to assign the
 containers to those vessels so that they can get to their final destinations.  

 Your job is to create a frontend that does a super simplified version of this.  
 Specifically, using the API documented below, you should allow the user to:
 1) View all of the containers that need to be shipped
 2) View the vessels that are leaving today
 3) Assign containers to a vessel
 4) "Save" a vessel plan by posting to the API
 5) View any vessel plans they've created


Notes and things I would do differently if I started over...
- A friend told me about Tachyons CSS so I tried it.  I'm not in love but I like it.

- I wanted to drag n drop from one column to the next; I spent too much time exploring the two react libraries I found for drag and drop and wounding up using neither.

- I decided to not use redux.  Halfway through the effort I changed my mind, I should've used it.

- The end-result functionality turned out to be not nearly as intuitive and straightforward as I thought after I re-though the whole drag and drop thing.  Right now there's issues with mis-clicks when you click close to a vessel but not quite on it.

- There's plenty of re-factoring that needs to be done.  I dont like the names I chose for the right and left column widgets.  It would probably be best to look into which things I could put in a pure functional component.  The status bar and messaging system I set up turned out to be not the most straightforward.
 
