import type { WordleLevel } from '../types';

// 50 Wordle levels. Themes (pottery, arts & crafts, very English things,
// Northampton, cosy things) are interleaved, and difficulty ramps up:
//   1–10  warm-up: common words, no repeated letters
//   11–30 medium
//   31–50 trickier: double letters, rarer letters, lots of "neighbour" words
// Notes are double-quoted, so straight apostrophes are fine inside them.
// Entries marked personalSlot are placeholders for your own inside jokes.

export const wordleLevels: WordleLevel[] = [
  // Levels 1–10: warm-up
  { level: 1, answer: 'THROW', note: "Potters don't really throw clay (not on purpose, anyway!) – 'throw' comes from the Old English for 'to twist or turn'." },
  { level: 2, answer: 'SCONE', note: "Devon puts the cream on first, Cornwall the jam – and nobody can agree if it rhymes with 'gone' or 'cone'. Pop the kettle on!" },
  { level: 3, answer: 'SAINT', note: "Northampton Saints have called Franklin's Gardens home for well over a century, cheered on by a sea of black, green and gold." },
  { level: 4, answer: 'BRUSH', note: 'The finest watercolour brushes are traditionally made from Kolinsky sable hair – they hold loads of paint and still keep a perfect point.' },
  { level: 5, answer: 'HONEY', note: "Busy bees make beeswax too – a crafter's secret weapon for candles, batik, and stopping sewing thread from tangling." },
  { level: 6, answer: 'SHARD', note: 'Broken pottery outlasts almost everything, so archaeologists use shards to date ancient sites. Even a smashed pot can make history!' },
  // ✏️ swap for your own
  { level: 7, answer: 'ROBIN', note: "Robins cover Christmas cards because Victorian postmen wore red uniforms and were nicknamed 'robins'. Your post, delivered by robin!", personalSlot: true },
  { level: 8, answer: 'LACES', note: "Northampton Town FC are nicknamed the Cobblers, a nod to the town's centuries of shoemaking. Lace up and kick off!" },
  { level: 9, answer: 'CRAFT', note: "'Craft' comes from the Old English 'cræft', meaning strength or skill – so making things by hand has always been a proper talent." },
  { level: 10, answer: 'CREAM', note: "Josiah Wedgwood's cream-coloured pottery so charmed Queen Charlotte in the 1760s that he renamed it 'Queen's Ware'. Very fancy!" },

  // Levels 11–30: medium
  { level: 11, answer: 'CHINA', note: 'Bone china is a very English invention – it really does contain bone ash, and Josiah Spode perfected the recipe in Stoke-on-Trent around 1800.' },
  { level: 12, answer: 'CUPPA', note: "Britain gets through roughly 100 million cups of tea a day. Pop the kettle on – that's one more for the tally." },
  // ✏️ swap for your own
  { level: 13, answer: 'PEONY', note: "Peonies are a classic motif on Chinese porcelain, where the 'king of flowers' stands for wealth and honour. Pretty and posh!", personalSlot: true },
  { level: 14, answer: 'SUEDE', note: "'Suede' comes from the French 'gants de Suède' – gloves from Sweden. Northampton's shoemakers have been turning it into gorgeous shoes for decades." },
  { level: 15, answer: 'QUILT', note: "'Quilt' comes from the Latin 'culcita', a stuffed mattress or cushion. Every quilt is really a very pretty, very cosy sandwich." },
  { level: 16, answer: 'PINCH', note: 'Pinch pots are one of the oldest ways to make pottery: a ball of clay, a thumb and some patience. No wheel required!' },
  { level: 17, answer: 'CORGI', note: "The late Queen owned more than 30 corgis during her reign. The name is thought to come from the Welsh for 'dwarf dog'." },
  { level: 18, answer: 'SHIRE', note: "Northamptonshire is known as the county of 'spires and squires', thanks to its many church spires and grand country houses." },
  // ✏️ swap for your own
  { level: 19, answer: 'EASEL', note: "'Easel' comes from the Dutch 'ezel', meaning donkey – because it carries the load of your painting. Hard-working little thing!", personalSlot: true },
  { level: 20, answer: 'FLORA', note: "Flora was the Roman goddess of flowers. Press a petal or leaf into soft clay and you'll get a gorgeous botanical imprint." },
  { level: 21, answer: 'GLAZE', note: 'A glaze is basically a thin coat of glass. It goes on dull and chalky, then melts in the kiln into that glossy finish.' },
  { level: 22, answer: 'PANTO', note: "Oh yes it is! Panto is a proper British Christmas tradition, with a dame (usually a bloke in a frock) and plenty of 'It's behind you!'" },
  { level: 23, answer: 'BOOTS', note: 'Kinky Boots – the film and the hit musical – was inspired by a real Northamptonshire shoe factory: W. J. Brookes in Earls Barton.' },
  // For her 🌸
  { level: 24, answer: 'SWEET', note: "The frilly 'Spencer' sweet peas grown all over the world began at Althorp, just outside Northampton, around 1900. Northamptonshire's finest sweet pea… just like you 🌸" },
  { level: 25, answer: 'SCORE', note: 'The golden rule of joining clay: score and slip! Scratch both surfaces, add a dab of slip, and handles stay put.' },
  { level: 26, answer: 'TWEED', note: "Tweed's name supposedly began as a mix-up: a London merchant misread 'tweel' (Scots for twill) and thought of the River Tweed." },
  { level: 27, answer: 'ABBEY', note: 'Delapre Abbey began life as a nunnery in the 1100s, and the 1460 Battle of Northampton, in the Wars of the Roses, was fought beside it.' },
  { level: 28, answer: 'OCHRE', note: 'Ochre is one of the oldest pigments around – people painted cave walls with it tens of thousands of years ago. Note the British spelling!' },
  { level: 29, answer: 'DUVET', note: "Brits mostly slept under sheets and blankets until Terence Conran's Habitat popularised the 'continental quilt' – the duvet – in the 1960s." },
  { level: 30, answer: 'MOULD', note: 'In slip casting, liquid clay is poured into a plaster mould. The plaster drinks up the water, leaving a clay skin that becomes the pot.' },

  // Levels 31–50: trickier
  // ✏️ swap for your own
  { level: 31, answer: 'BOBBY', note: "British police are called bobbies after Sir Robert Peel, who set up London's Metropolitan Police in 1829. Bobby, as in Robert!", personalSlot: true },
  { level: 32, answer: 'UPPER', note: "A shoe's upper is everything above the sole, and stitching it together is called 'closing' – a skill Northampton's shoe factories still practise." },
  { level: 33, answer: 'PATCH', note: 'English paper piecing is a classic patchwork method: fabric is tacked around paper shapes, often hexagons, then stitched together.' },
  { level: 34, answer: 'WEDGE', note: "Wedging clay squeezes out air bubbles and evens out the texture before you throw. It's like kneading bread, just muddier." },
  { level: 35, answer: 'COCOA', note: 'Cadbury began in 1824, when John Cadbury opened a Birmingham shop selling tea, coffee and drinking cocoa. Hot chocolate, anyone?' },
  // ✏️ swap for your own
  { level: 36, answer: 'SOGGY', note: 'Bake Off dreads a soggy bottom, and so do potters: leave water pooling inside a freshly thrown pot and its base can crack as it dries.', personalSlot: true },
  { level: 37, answer: 'LIGHT', note: "The National Lift Tower, built for testing lifts, is nicknamed the 'Northampton Lighthouse' – not bad for a town nowhere near the sea." },
  { level: 38, answer: 'SKEIN', note: 'A skein is a loosely wound bundle of yarn – and also the word for a flock of geese in flight. Knitters and birdwatchers, unite!' },
  { level: 39, answer: 'CRAZE', note: 'Crazing is that fine web of cracks in a glaze, caused when glaze and clay shrink at different rates. Some potters do it on purpose!' },
  { level: 40, answer: 'TELLY', note: "The BBC launched the world's first regular 'high-definition' TV service from Alexandra Palace in 1936. Britain's love of the telly starts there." },
  { level: 41, answer: 'CROSS', note: "Northampton's Eleanor Cross at Hardingstone is one of only three originals left – Edward I built them in the 1290s for his late Queen Eleanor." },
  // ✏️ swap for your own
  { level: 42, answer: 'DOUGH', note: "Potters and bakers have loads in common: one popular way to wedge clay is called 'ram's head', and it's a lot like kneading dough.", personalSlot: true },
  { level: 43, answer: 'SEPIA', note: "'Sepia' is Greek for cuttlefish – the original warm brown ink really was made from cuttlefish ink. Very fishy, very artistic." },
  { level: 44, answer: 'OXIDE', note: 'Metal oxides colour glazes: cobalt gives blue, copper can turn green or even red, and iron gives warm browns. Chemistry, but pretty!' },
  { level: 45, answer: 'FIVER', note: "The 2016 Churchill fiver was the Bank of England's first polymer banknote – tough enough to survive a trip through the wash." },
  { level: 46, answer: 'HELIX', note: "Francis Crick, who helped crack DNA's double helix, was born in Weston Favell, now part of Northampton. Brains as well as brogues!" },
  // ✏️ swap for your own
  { level: 47, answer: 'GAUGE', note: "UK knitting patterns usually call it 'tension' rather than 'gauge'. Always knit a swatch, or that jumper might turn into a dress!", personalSlot: true },
  { level: 48, answer: 'POTTY', note: "In British slang, being 'potty' about something means you're mad about it – and being potty about pottery is the best kind." },
  { level: 49, answer: 'QUEUE', note: 'Take away the last four letters of QUEUE and it still sounds exactly the same. Queuing politely: the most British pastime of all.' },
  { level: 50, answer: 'HEART', note: "That's all 50 Wordles done – thrown, glazed and fired! Every one was made with heart, just for you. Well done, you absolute star." },
];
