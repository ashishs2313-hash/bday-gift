import originalStory from './birthday-story-source.txt?raw';

const sourceLines = originalStory
  .split(/\r?\n/)
  .filter((line) => line.trim() && line.trim() !== 'this to be added make good use of it');

const [salutation, ...storyLines] = sourceLines;

// Recovered first-person story text from the original V2 scrapbook pages.
// Keep the source wording and dates as found; no chat bubbles are reconstructed.
const beginningPages = [
  {
    label: '10th September, 2025',
    paragraphs: [
      "I still remember that morning like it was carved into me on purpose. The bus ride, AirPods in, world shut out. I'd already decided who I was going to be that day — someone who didn't need anyone new. I had my people from PUC, and some part of me had quietly promised: that's enough, don't let anyone else in. I didn't know yet how wrong I'd be.",
    ],
  },
  {
    label: 'The seminar hall',
    paragraphs: [
      "They made us sit in that seminar hall, rows and rows of strangers, and if I'm honest, my heart was doing something my mind refused to admit. I was nervous, yes, but somewhere underneath all that forced indifference, there was a small, stubborn hope — that maybe I'd find something, someone, worth remembering. I just wouldn't let myself believe it yet.",
      "You were there too, that day. But you were nothing more than a teacher to me then — one more face in a room full of faces. I didn't look twice. I sat in the middle row, fourth bench, right at the corner, half-present, mostly waiting for the hours to pass. I had no idea I was sitting a few feet away from someone who'd eventually mean more to me than almost anyone else in my life.",
    ],
  },
  {
    label: '15th September, 2025',
    paragraphs: [
      "Monday came, and I remember exactly what I was wearing — black shirt, grey pants, black shoes, white AirPods, like some quiet armor I carried everywhere. I sat down in my usual spot, ready to disappear into the crowd like I always did.",
      "But before the program began, you called my name. You asked me to come up and place flowers before the photo of God, as a gesture of respect to open the event. And god, I remember the fear that shot through me — not fear of the stage, but fear of being seen. I told myself, maybe she's already forgotten, maybe I can just stay hidden here in this sea of 150, 200 people.",
    ],
  },
  {
    label: 'The first time I was seen',
    paragraphs: [
      'But then you looked at me.',
      'And in that one look, every excuse I\'d made to stay invisible fell apart. I walked up. I placed the flowers. My hands were probably shaking, though I don\'t think anyone noticed but me.',
      "I didn't know it then, but that was the first time I existed to you — not as a name on a list, not as just another student, but as someone you actually saw.",
      "And then, almost like the universe wanted to make sure I never forgot that day, I got scolded. Not directly — but I knew it was for me. The bus was supposed to leave at 4, but your HOD had run long, and in the middle of that wait, restless, I'd slipped one AirPod into my ear. Just one. And somehow, that was enough to be noticed, enough to be indirectly called out.",
      'You knew it was me.',
    ],
  },
  {
    label: 'Where it all began',
    paragraphs: [
      "Later I found out — that's exactly how you remembered me. Not as a bright student, not as someone who stood out for the right reasons. You thought I looked older, maybe 24, someone who didn't quite fit the picture of a fresher. A boy with earphones, standing slightly apart from everyone else. That was your first memory of me. That was how this whole story began — not with something beautiful, but with something so small, so ordinary, that neither of us could have guessed where it would lead.",
      "I don't have a single photo of us from those days. Not one photograph of the version of me that walked in not wanting to feel anything, or the version of you who saw a stranger and simply noted, quietly, that boy with the earphones. All I have are four photos from the college's page — distant, impersonal, nothing that really holds either of us in it.",
      "But somehow, that's where it all started. Two strangers, standing in the same room, neither one of us knowing yet how much we'd come to mean to each other. You didn't know you'd become Amma. I didn't know I'd stop being just a student.",
      'We just… began. Quietly, imperfectly, without either of us noticing it was already happening.',
    ],
  },
];

// Recovered Album 2 story paragraphs. The source also contains message arrays;
// those are intentionally not rendered as reconstructed conversations here.
const bridgeEntries = [
  {
    label: '3rd October, 2025',
    paragraphs: [
      'It started so simply, almost forgettable. You sent me a text — "Join the group Ashish" — and I remember thinking, which group? You sent the link, I joined, and that was it. No sign at all that this was the beginning of something that would change everything.',
    ],
  },
  {
    label: '4th October, 2025',
    paragraphs: [
      'You were still so new to all of this — an assistant professor barely settled in, figuring out how to talk to a group of strangers who were supposed to call you "mam." I was new too, just an engineering student trying to make sense of everything. Somewhere between EEE model papers and Amogh\'s blueprint, we ended up in some ridiculous group conversation. Neither of us was trying to be anything — we were just two people figuring things out, and somehow that became funny.',
    ],
  },
  {
    label: '6th October, 2025',
    paragraphs: [
      'You posted "no class tomorrow, holiday" in the group, and I couldn\'t resist pointing out it was already on the calendar. You joked back — what if someone showed up by mistake — and made fun of all of us. I didn\'t know it then, but that was the first time I saw you as something other than just a teacher. You were chill. And somewhere in that small exchange, I was quietly enjoying myself more than I let on.',
    ],
  },
  {
    label: '9th October, 2025',
    paragraphs: [
      'You asked everyone to send their personal information, and I asked why, half-joking. But later that night — the night you\'ll never forget — I told you the college would be closed tomorrow. Someone died, I said. All of Mysuru\'s colleges would be shut, I insisted. You called us "gen alpha," I fired back that we were gen z, and either way, every student cares about a holiday the same way. I even said to check the news.',
      'It was completely fake. And somehow, that lie became the first real bridge between us.',
    ],
  },
  {
    label: '14th October, 2025',
    paragraphs: [
      'I asked you again if there was college the next day, and you threatened my attendance if I told anyone otherwise — but I could tell you were laughing while typing that. The real shift happened when you asked me about our unofficial group. That question opened a door neither of us had planned on opening.',
    ],
  },
  {
    label: '25th October, 2025',
    paragraphs: [
      'This was the day everything quietly changed. You asked more about the unofficial group, and what followed was a real conversation — not teacher-student, not formal, just two people talking. That was the day I first felt like you might actually be the chillest person I\'d met in this college.',
      'I had no idea, back then, how close we\'d become. No clue how much this would matter. Looking back now, I think we were always going to find each other — but the way we found each other, the specific, silly, human way — that was something we built, message by message, joke by joke. Like the universe left the door open, but we\'re the ones who walked through it.',
      'And then, out of nowhere, on some random day, you sent the message that changed the shape of everything:',
      'That one line did something no formal conversation ever could. It made this real.',
    ],
  },
  {
    label: 'The bridge I never told you about',
    paragraphs: [
      'But wait — before I move on to the next memory, there\'s something we almost forgot. Something I never forgot, even if you have.',
      'The Google Form. The one I made for you — the one you said you\'d give me a treat for, and never did. You never even used it, Amma. And somehow, that small, silly, slightly ridiculous thing became one of the most important bridges of our whole journey. If I hadn\'t said yes to making that form that day, I don\'t know if any of this would have happened the way it did.',
      'Funny how life works — from building a Google Form nobody used, to building your module notes years later. Same hands, same person, just a much longer way of saying I\'ve always shown up for you.',
      'I can say, without any doubt, that you becoming part of my life is the best decision I\'ve ever made.',
      'Thank you for always being there for me, Amma. This is just a glimpse — there\'s so much more still to tell.',
      'Love you, Amma. 🥰',
    ],
  },
];

const sunflowerParagraphs = [
  'you are my sunshine ♡',
  'bloom with grace ♡',
  'sunny days, happy ways',
  'You know the sunflower theory, Amma?',
  'They say a sunflower doesn\'t just grow toward the sun — it grows toward whatever light it can find, and once it finds it, it never turns away.',
  "That's exactly what you became for me. Not something I searched for, not something I planned — just someone who showed up, stayed warm, and somehow, without me even noticing, I stopped looking anywhere else.",
  "You are my sunshine, Amma. Not in the soft, poetic way people say it — in the very real way, where the days that had you in them were simply brighter than the ones that didn't.",
  'Thank you for being my light. Thank you for being the person I turn toward, every single time.',
  'Love you, Amma. 🌻💛',
];

export const phase3Chapters = [
  { id:'letter', title:salutation, theme:'letter', paragraphs:storyLines.slice(0, 6) },
  { id:'beginning', title:'The Beginning of Our Little Story', theme:'campus', entries:beginningPages },
  { id:'bridge', title:'The Bridge Between Us', theme:'bridge', entries:bridgeEntries },
  { id:'first-fight', title:'Our First Big Fight', theme:'new-year', paragraphs:storyLines.slice(6, 9) },
  { id:'lab-book', title:'The Mathematics Lab Book', theme:'notebook', paragraphs:storyLines.slice(9, 12), stickyNote:'nan maga ninu , nange yavaglu bekirodu nine kanda , I love you kanda' },
  { id:'after-fight', title:'After the Fight', theme:'warmth', paragraphs:storyLines.slice(12, 15) },
  { id:'bangalore', title:'Bangalore, Our Little Adventures', theme:'city', paragraphs:storyLines.slice(15, 18) },
  { id:'little-things', title:'All the Little Things', theme:'scrapbook', paragraphs:[storyLines[18]] },
  { id:'sunflower', title:'The Sunflower', theme:'sunflower', paragraphs:sunflowerParagraphs },
  { id:'life-changed', title:'Life Has Changed', theme:'quiet', paragraphs:[storyLines[19]] },
  { id:'yashoda', title:'', theme:'finale', vows:storyLines.slice(20, 22) },
];

// Phase 4 handoff references stay available in source and are not rendered in Phase 3.
export const reservedStoryContent = {
  birthdayParagraph: '', // Intentionally empty until Ashish provides the reserved paragraph.
  lines: storyLines.slice(22, 24),
  phaseFourHandoff: 'Continue to Our Memories →',
};
