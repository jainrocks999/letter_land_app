# Story Time – Exercise Data

All exercises for the 10 stories in the kids' reading app: **before** the story, **during** the story (one quick question per page), and **after** the story (quiz).

The story text for every page is in `story-time-stories.md`. This file holds only the exercises.

---

## Where the exercises appear in the story

A story session always runs in the same order. The exercises sit at fixed points, so the story keeps moving and the child is never stuck on a page.

```text
Story list → 1. Before screen → 2. Story pages 1–5 (a quick question at each page turn) → 3. The End → 4. After quiz → 5. Games
```

### 1. Before the story — Before screen

- **When:** the child taps a story card in the story list.
- **What they see:** the story cover, and Buddy asking "Look at the cover! What do you see? What will happen?"
- **Exercise:** `WORDS`. Three new-word cards sit under the cover, each with a small picture. The child taps each card to hear the word; the card changes from "Tap me" to "Heard" and gives +1 star.
- **Then:** the child picks how to read (Listen / Together / My turn) and taps **Start the story**.

### 2. During the story — Reader screen

Each page shows a big picture, the sentence under it, and Buddy above the sentence.

**Reading the page (no question yet):**

- **Listen:** Buddy reads; each word lights up as it is read.
- **Together:** Buddy reads first, then the mic turns on and the child reads the same sentence (+5 stars).
- **My turn:** the child reads alone into the mic (+5 stars).
- **Tap a word** at any time: a "Sound it out" sheet slides up and splits the word into letters and sounds. Purple sight words show a "Say it fast!" sheet instead. These are help, not exercises, so they give no stars.

**The quick question (the during-story exercise):**

- **When:** the child has read the page and taps the **next-page arrow** (→) on the picture.
- **How it appears:** a question sheet slides up from the bottom of the screen, with Buddy and a label such as "QUICK QUESTION · FIND IT". It covers the buttons, but **the picture stays visible**, because `TAP`, `COUNT` and `PICTURE_Q` questions need it.
- **What the child does:**
  - `TAP`: taps the object directly in the picture.
  - All other types: taps one of the answer buttons in the sheet.
- **Right answer:** green tick, +1 star (Level 3: +3), and a **Turn the page** button. Tapping it turns to the next page.
- **Wrong answer:** the option shakes, Buddy gives the hint, and the child tries again.
- **Skip:** a Skip button turns the page without stars.
- **Only once:** if the child goes back and forward again, the question doesn't repeat.

**What each question is about:**

- Most questions are about the page just read (`SPELL`, `TAP`, `FILL`, `FEEL`, `COUNT`, `SOUND`).
- `PREDICT` is about the **next** page, so the child turns the page to find out if they were right.
- Level 3 page activities (`MAGIC_E`, `BUILD`, `FIND_SOUND`, `RHYME`, `PICTURE_Q`) appear the same way, in the same sheet, at the same moment.

### 3. The End

- **When:** the child taps → on page 5. Page 5 has no question.
- **What they see:** a "The End!" sheet with the story words they found, +15 stars (Level 3: +20), and two buttons: **Read again** and **Story quiz**.

### 4. After the story — Quiz screen

- **When:** the child taps **Story quiz** on The End sheet.
- **How it works:**
  - One step at a time, with a 5-part progress bar at the top.
  - The Next button only appears after a correct answer.
  - Each question has a speaker button so Buddy can read it.

| Step | Exercise | How it looks |
| --- | --- | --- |
| 1–3 | `WHO`, `WHERE`, `WHAT` / `WHY` / `FEEL` | The question in big text, with 3 big answer rows. Each row has a picture and a word. |
| 4 | `ORDER` | 3 story pictures with their sentences, shuffled. The child taps them in order and each gets a 1, 2 or 3 badge. A wrong order resets them. |
| 5 | `RETELL` | A big mic button, with the 3 helper words shown as a little path (hat → rat → nap). The recording is saved for the grown-up. |
| End | Stars, `GAMES`, `TALK` | Read / Understand / Spell stars, 3 game cards and a "Talk with your grown-up" card. |

### 5. Games

- **When:** the child taps a game card on the last quiz screen.
- **What they get:** the game opens with that story's **Games words**:
  - **Spell the words:** Word Build screen
  - **Put letters home:** the drag-and-drop letters screen
  - **Word bingo:** Letter Bingo, using whole words
- The Spell star on the end screen fills in once the child finishes one game.

### At a glance

| Exercise type | Screen | Shows up when | Child answers by |
| --- | --- | --- | --- |
| `WORDS` | Before screen | The story opens | Tapping the word cards |
| `SPELL`, `FILL`, `FEEL`, `COUNT`, `SOUND`, `PREDICT` | Reader | Tapping → after reading a page (pages 1–4) | Tapping a button in the question sheet |
| `TAP` | Reader | Tapping → after reading a page | Tapping the object in the picture |
| `MAGIC_E`, `BUILD`, `FIND_SOUND`, `RHYME`, `PICTURE_Q` | Reader (Level 3) | Tapping → after reading a page (pages 1–5) | Tapping in the activity sheet |
| `WHO`, `WHERE`, `WHAT`, `WHY`, `FEEL` | Quiz | After The End | Tapping a picture row |
| `ORDER` | Quiz | Step 4 | Tapping 3 pictures in order |
| `RETELL` | Quiz | Step 5 | Speaking into the mic |
| `TALK` | Quiz end screen | The end of the quiz | Talking with a grown-up (no input) |
| `GAMES` | Word Build, Letters, Bingo | Tapping a game card | Playing the game |

---

## Exercise types

| Code | Where | What the child does | Input |
| --- | --- | --- | --- |
| `WORDS` | Before | Taps 3 new word cards to hear them | Tap card |
| `SPELL` | During (L1, L2) | Picks the missing letter or blend in a word | 3 letter buttons |
| `TAP` | During | Taps an object in the page picture | Tap hotspot |
| `PREDICT` | During | Guesses what happens on the next page | 2 picture choices |
| `FILL` | During | Picks the word that fills the blank in the sentence | 2–3 word choices |
| `FEEL` | During | Picks how a character feels | 3 face choices |
| `COUNT` | During | Counts things in the picture | 3 number choices |
| `SOUND` | During | Picks the sound an animal or thing makes | 3 word choices |
| `MAGIC_E` | During (L3) | Adds an e to a word (kit → kite) | Tap +e |
| `BUILD` | During (L3) | Taps mixed-up words in the right order | Word chips |
| `FIND_SOUND` | During (L3) | Finds the word with the target sound (sh, ch) | 3 word choices |
| `RHYME` | During (L3) | Picks the word that rhymes | 3 word choices |
| `PICTURE_Q` | During (L3) | Answers a question by picking a picture | 3 picture choices |
| `WHO` / `WHERE` / `WHAT` / `WHY` / `FEEL` | After | Answers a story question | 3 picture choices |
| `ORDER` | After | Taps 3 story pictures in order (1, 2, 3) | Tap cards |
| `RETELL` | After | Tells the story into the mic, using 3 helper words | Mic |
| `TALK` | After | A question for the child and a grown-up to talk about | No input |
| `GAMES` | After | Story words used in Word Build, Put letters home and Word bingo | Word list |

## Stars

| Action | Stars |
| --- | --- |
| Hear a new word (before) | +1 each |
| Quick question correct (Level 1–2) | +1 |
| Page activity correct (Level 3) | +3 |
| Read a page aloud (My turn / Together) | +5 per page, once |
| Finish the story | +15 (Level 1–2), +20 (Level 3) |
| Quiz question correct | +1 |
| Story order correct | +2 |
| Retell recorded | +3 |

## Rules for every exercise

- **Answer order:** shuffle the options; the correct one is never always first.
- **Wrong answer:** shake the option, show the hint, let the child try again. No stars are taken away.
- **Skip:** every during-story question can be skipped.
- **Audio:** every question and every option has a speaker button.

---

# Level 1

## 1. Sam the Cat — short a

**Before – new words:** cat · hat · mat

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which letter is missing? c _ t | o · a · i | **a** | Say cat slowly: c… a… t. |
| 2 | `TAP` | Tap the hat in the picture! | Hotspot: the hat | **hat** | Look for something blue! |
| 3 | `PREDICT` | Who will sit on the hat? | a rat · a dog | **a rat** | Think of a word like cat and hat… |
| 4 | `FEEL` | How does Sam feel? | happy · surprised · sad | **surprised** | Look at his eyes and mouth again. |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who sat on the hat? | the cat · the rat · the dog | **the rat** |
| 2 | `WHERE` | Where was the hat? | in a box · on a bed · on a mat | **on a mat** |
| 3 | `WHAT` | What did Sam and the rat do at the end? | nap · run · eat | **nap** |
| 4 | `ORDER` | What happened first, next and last? | The hat is on a mat · Sam and the rat nap · Sam has a hat | **Sam has a hat → The hat is on a mat → Sam and the rat nap** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: hat · rat · nap | Any recording |
| — | `TALK` | Do you have a pet? What is its name? | | |

**Games words:** cat, hat, mat, rat, sat, nap

---

## 2. Pig in the Mud — short i

**Before – new words:** pig · dig · pit

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which letter is missing? b _ g | a · i · o | **i** | Say big slowly: b… i… g. |
| 2 | `TAP` | Tap the pig's curly tail! | Hotspot: the tail | **tail** | Look at the back of the pig! |
| 3 | `PREDICT` | What will go in the pit? | mud · a ball | **mud** | Look at the title of the story! |
| 4 | `FEEL` | How does the pig feel in the mud? | happy · scared · sad | **happy** | Look at the pig's big smile. |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who dug a pit? | the cat · the pig · the hen | **the pig** |
| 2 | `WHERE` | Where did the pig sit at the end? | on a bed · on a log · in the mud | **in the mud** |
| 3 | `WHAT` | What did the pig do first? | dig · nap · swim | **dig** |
| 4 | `ORDER` | What happened first, next and last? | The pig sits in the mud · A big pig sits · The pig digs a pit | **A big pig sits → The pig digs a pit → The pig sits in the mud** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: dig · pit · mud | Any recording |
| — | `TALK` | Do you like to play in mud or in water? | | |

**Games words:** pig, big, dig, pit, sit, win

---

## 3. Ten Red Hens — short e

**Before – new words:** ten · hen · pen

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which letter is missing? t _ n | a · e · o | **e** | Say ten slowly: t… e… n. |
| 2 | `TAP` | Tap the rain cloud! | Hotspot: the grey cloud | **cloud** | Look up in the sky! |
| 3 | `FILL` | A hen sits on a ___. | bed · bag | **bed** | Look at the picture. What is the hen on? |
| 4 | `COUNT` | How many hens get in the pen? | 5 · 10 · 2 | **10** | Count them with your finger! |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who sat on the bed? | a hen · a pig · a dog | **a hen** |
| 2 | `WHERE` | Where did the hens rest? | in a bed · in the pen · in the mud | **in the pen** |
| 3 | `WHAT` | What colour are the hens? | blue · green · red | **red** |
| 4 | `ORDER` | What happened first, next and last? | The hens get wet · The hens rest in the pen · Ten red hens | **Ten red hens → The hens get wet → The hens rest in the pen** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: wet · bed · pen | Any recording |
| — | `TALK` | How many people live in your home? Let's count! | | |

**Games words:** ten, red, hen, wet, bed, pen, yes

---

## 4. Dog on a Log — short o

**Before – new words:** dog · log · hop

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which letter is missing? d _ g | u · o · a | **o** | Say dog slowly: d… o… g. |
| 2 | `TAP` | Tap the log! | Hotspot: the log | **log** | It is big, round and brown. |
| 3 | `PREDICT` | What will the log do? | rock · sleep | **rock** | Logs can roll and wobble… |
| 4 | `FEEL` | How does the dog feel? | surprised · sleepy · sad | **surprised** | Look at the dog's big eyes. |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who hopped on the log? | the cat · the dog · the frog | **the dog** |
| 2 | `WHERE` | Where was the dog on page 3? | in a pen · in a pond · on top of the log | **on top of the log** |
| 3 | `WHAT` | What did the log do? | rock · fly · sing | **rock** |
| 4 | `ORDER` | What happened first, next and last? | The dog got off · A dog is on a log · The dog is on top | **A dog is on a log → The dog is on top → The dog got off** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: hop · top · rock | Any recording |
| — | `TALK` | What can you hop on? Show me a hop! | | |

**Games words:** dog, log, hop, top, got, off, stop

---

# Level 2

## 5. Frog Can Jump — fr, fl, cr, mp, nd

**Before – new words:** frog · pond · jump

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which sounds are missing? _ _ og | fr · fl · dr | **fr** | Say frog slowly: fr… o… g. |
| 2 | `TAP` | Tap a lily pad! | Hotspot: a lily pad | **lily pad** | It is round and green on the water. |
| 3 | `PREDICT` | Who is in the pond? | a crab · a cat | **a crab** | It lives in water and has claws! |
| 4 | `FEEL` | How does Frog feel when he sees the crab? | surprised · sleepy · sad | **surprised** | Look at Frog's eyes. |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who can jump? | the crab · the frog · the rock | **the frog** |
| 2 | `WHERE` | Where did Frog land? | on a log · on a bed · on a flat rock | **on a flat rock** |
| 3 | `WHAT` | What did Frog do at the end? | went to sleep · jumped back in the pond · ate lunch | **jumped back in the pond** |
| 4 | `ORDER` | What happened first, next and last? | He lands on a flat rock · Frog jumps back in the pond · Frog is in the pond | **Frog is in the pond → He lands on a flat rock → Frog jumps back in the pond** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: jump · rock · crab | Any recording |
| — | `TALK` | How far can you jump? Let's try! | | |

**Games words:** frog, pond, jump, flat, crab, back

---

## 6. Duck Gets Wet — ck, st, pl, gl

**Before – new words:** duck · rock · stick

**During – quick questions**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPELL` | Which sounds are missing? ro _ _ | ck · st · nd | **ck** | Say rock slowly: r… o… ck. |
| 2 | `TAP` | Tap the stick! | Hotspot: the stick | **stick** | It is thin and brown, near Duck. |
| 3 | `PREDICT` | What will Duck do? | jump in the pond · go to bed | **jump in the pond** | Duck is hot. What cools you down? |
| 4 | `SOUND` | What sound does a duck make? | quack · moo · woof | **quack** | Listen to page 5! |
| 5 | — | No question. The End sheet opens. | | | |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who got wet? | the duck · the frog · the dog | **the duck** |
| 2 | `WHY` | Why did Duck get wet? | it was cold · the sun was hot · he was sad | **the sun was hot** |
| 3 | `WHAT` | What did Duck peck at? | a hat · a bun · a stick | **a stick** |
| 4 | `ORDER` | What happened first, next and last? | Duck jumps in · Duck is on a rock · The sun is hot | **Duck is on a rock → The sun is hot → Duck jumps in** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: hot · jump · wet | Any recording |
| — | `TALK` | What do you do when it is very hot? | | |

**Games words:** duck, rock, stick, must, plop, glad

---

# Level 3

At Level 3, each page has its own activity worth +3 stars, instead of a short quick question.

## 7. Kate and the Kite — magic e

**Before – new words:** kite · ride · home

**During – page activities**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `MAGIC_E` | This says kit. Tap +e to make it kite! | +e | **kite** | — |
| 2 | `BUILD` | Build the sentence. | red. · The · is · kite | **The kite is red.** | Start with the word that has a big letter. |
| 3 | `PICTURE_Q` | Where is the kite? | bed · tree · box | **tree** | Look at the picture again! |
| 4 | `RHYME` | Which word sounds like take? | cat · kit · cake | **cake** | Say take, then say each word. |
| 5 | `BUILD` | Build the sentence. | so · happy! · She · is | **She is so happy!** | Start with the word that has a big letter. |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who has a kite? | Mike · Kate · Sam | **Kate** |
| 2 | `WHERE` | Where did the kite get stuck? | on a mat · in a box · in a tree | **in a tree** |
| 3 | `FEEL` | How did Kate feel at the end? | happy · sad · angry | **happy** |
| 4 | `ORDER` | What happened first, next and last? | The kite is in a tree · Kate and Mike take it home · Kate has a kite | **Kate has a kite → The kite is in a tree → Kate and Mike take it home** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: kite · tree · home | Any recording |
| — | `TALK` | Who helps you when something is stuck? | | |

**Games words:** kite, Kate, ride, take, home, Mike

---

## 8. The Big Ship — sh

**Before – new words:** ship · fish · shell

**During – page activities**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `FIND_SOUND` | Find the sh word. | chip · ship · slip | **ship** | Listen for /sh/, like "shh". |
| 2 | `BUILD` | Build the sentence. | fish. · A · has · man · a | **A man has a fish.** | Start with the word that has a big letter. |
| 3 | `PICTURE_Q` | Where did the fish go? | water · ship · shop | **water** | Look at the splash! |
| 4 | `RHYME` | Which word sounds like fish? | fist · dish · fan | **dish** | Say fish, then say each word. |
| 5 | `BUILD` | Build the sentence. | off. · ship · The · sets | **The ship sets off.** | Start with the word that has a big letter. |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who had a fish? | a duck · a man · Kate | **a man** |
| 2 | `WHERE` | Where did the fish hide? | in a box · in a hat · in a shell | **in a shell** |
| 3 | `WHAT` | What did the ship do at the end? | set off · went to sleep · ate lunch | **set off** |
| 4 | `ORDER` | What happened first, next and last? | The fish jumps in · The ship sets off · The big ship is at the dock | **The big ship is at the dock → The fish jumps in → The ship sets off** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: ship · fish · shell | Any recording |
| — | `TALK` | Have you ever seen a ship or a boat? Where? | | |

**Games words:** ship, fish, shell, wish, splash

---

## 9. Chip the Chick — ch

**Before – new words:** chick · bench · lunch

**During – page activities**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `FIND_SOUND` | Find the ch word. | kick · chick · shed | **chick** | Listen for /ch/, like a train: ch-ch! |
| 2 | `BUILD` | Build the sentence. | peck. · Chip · can | **Chip can peck.** | Start with the word that has a big letter. |
| 3 | `PICTURE_Q` | Where does Chip sit? | bed · bench · box | **bench** | Look at the picture again! |
| 4 | `RHYME` | Which word sounds like munch? | bench · bunch · bun | **bunch** | Say munch, then say each word. |
| 5 | `BUILD` | Build the sentence. | full. · is · Chip | **Chip is full.** | Start with the word that has a big letter. |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who is Chip? | a cat · a chick · a ship | **a chick** |
| 2 | `WHERE` | Where did Chip sit? | in a pen · on a bench · in a pond | **on a bench** |
| 3 | `WHY` | Why is Chip full? | he ran fast · he had a big lunch · he had a nap | **he had a big lunch** |
| 4 | `ORDER` | What happened first, next and last? | Chip has lunch · Chip is a chick · Chip sits on a bench | **Chip is a chick → Chip sits on a bench → Chip has lunch** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: chick · bench · lunch | Any recording |
| — | `TALK` | What did you have for lunch today? | | |

**Games words:** chick, chip, chin, bench, lunch, much, such

---

## 10. Mike Rides a Bike — magic e

**Before – new words:** bike · lake · home

**During – page activities**

| Page | Type | Question | Options | Answer | Hint if wrong |
| --- | --- | --- | --- | --- | --- |
| 1 | `MAGIC_E` | This says rid. Tap +e to make it ride! | +e | **ride** | — |
| 2 | `BUILD` | Build the sentence. | lake. · Mike · to · rides · the | **Mike rides to the lake.** | Start with the word that has a big letter. |
| 3 | `PICTURE_Q` | What did the bike hit? | tree · stone · cake | **stone** | Look at the front wheel! |
| 4 | `RHYME` | Which word sounds like bike? | bake · like · bit | **like** | Say bike, then say each word. |
| 5 | `BUILD` | Build the sentence. | ride! · a · What · fine | **What a fine ride!** | Start with the word that has a big letter. |

**After – quiz**

| Step | Type | Question | Options | Answer |
| --- | --- | --- | --- | --- |
| 1 | `WHO` | Who rides a bike? | Kate · Mike · Chip | **Mike** |
| 2 | `WHAT` | What did the bike hit? | a tree · a cake · a stone | **a stone** |
| 3 | `WHERE` | Where did Mike ride at the end? | home · to the lake · to the shop | **home** |
| 4 | `ORDER` | What happened first, next and last? | The bike hits a stone · Mike has a bike · He rides home | **Mike has a bike → The bike hits a stone → He rides home** |
| 5 | `RETELL` | Tell Buddy the story! | Helper words: bike · stone · home | Any recording |
| — | `TALK` | What should you wear when you ride a bike? | | |

**Games words:** bike, like, ride, Mike, lake, home, fine
