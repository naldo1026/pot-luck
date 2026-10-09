import type { ConnectionsPuzzle } from '../types';

/**
 * Connections puzzles for levels 26–50.
 * 26–35: medium-hard. 36–49: hard. 50: the grand finale.
 * Groups marked `personalSlot: true` are self-contained and safe to swap for inside jokes.
 */
export const puzzles26to50: ConnectionsPuzzle[] = [
  {
    level: 26,
    groups: [
      { name: 'SPICE GIRLS NICKNAMES', words: ['SCARY', 'SPORTY', 'POSH', 'BABY'], difficulty: 0 },
      { name: '___BREAD', words: ['GINGER', 'SHORT', 'SODA', 'CORN'], difficulty: 1 },
      { name: 'GLAZE FINISHES', words: ['MATT', 'GLOSS', 'SATIN', 'CRACKLE'], difficulty: 2 },
      { name: 'THROW A ___', words: ['TANTRUM', 'PARTY', 'SICKIE', 'POT'], difficulty: 3 },
    ],
  },
  {
    level: 27,
    groups: [
      { name: 'WEASLEYS', words: ['RON', 'GINNY', 'PERCY', 'BILL'], difficulty: 0 },
      { name: 'S CLUB 7 MEMBERS', words: ['JO', 'RACHEL', 'TINA', 'PAUL'], difficulty: 1 },
      { name: 'FAMOUS PERRYS', words: ['FRED', 'KATY', 'GRAYSON', 'TYLER'], difficulty: 2 },
      { name: 'PALINDROMES', words: ['HANNAH', 'KAYAK', 'LEVEL', 'RADAR'], difficulty: 3 },
    ],
  },
  {
    level: 28,
    groups: [
      { name: 'BRITISH PUDDINGS', words: ['TRIFLE', 'CRUMBLE', 'SYLLABUB', 'ROLY-POLY'], difficulty: 0 },
      { name: 'POTTERY TOOLS', words: ['RIB', 'WIRE', 'NEEDLE', 'SPONGE'], difficulty: 1 },
      { name: '___ BEAN', words: ['RUNNER', 'BROAD', 'KIDNEY', 'BUTTER'], difficulty: 2 },
      { name: '___FLY', words: ['DRAGON', 'FIRE', 'HOUSE', 'FRUIT'], difficulty: 3 },
    ],
  },
  {
    level: 29,
    groups: [
      // ✏️ swap for your own
      {
        name: 'NORTHAMPTON PARKS',
        words: ['ABINGTON', "BECKET'S", 'DELAPRE', 'RACECOURSE'],
        difficulty: 0,
        personalSlot: true,
      },
      { name: 'STRICTLY DANCES', words: ['RUMBA', 'SAMBA', 'JIVE', 'WALTZ'], difficulty: 1 },
      { name: 'NATO ALPHABET', words: ['ECHO', 'OSCAR', 'JULIET', 'FOXTROT'], difficulty: 2 },
      { name: 'ANAGRAMS OF FRUIT', words: ['AMONG', 'PAGER', 'LUMP', 'MILE'], difficulty: 3 },
    ],
  },
  {
    level: 30,
    groups: [
      { name: 'HOGWARTS TEACHERS', words: ['FLITWICK', 'MOODY', 'SPROUT', 'TRELAWNEY'], difficulty: 0 },
      { name: 'COTTAGE GARDEN FLOWERS', words: ['FOXGLOVE', 'PEONY', 'SWEET PEA', 'LUPIN'], difficulty: 1 },
      { name: 'BRITISH SCULPTORS', words: ['GORMLEY', 'HEPWORTH', 'MOORE', 'KAPOOR'], difficulty: 2 },
      { name: 'HIDDEN BODY PARTS', words: ['TULIP', 'SHANDY', 'PHARMACY', 'WHIPPET'], difficulty: 3 },
    ],
  },
  {
    level: 31,
    groups: [
      { name: 'GAVIN & STACEY CHARACTERS', words: ['NESSA', 'SMITHY', 'BRYN', 'DORIS'], difficulty: 0 },
      { name: 'TIMES OF DAY', words: ['DUSK', 'NOON', 'TWILIGHT', 'DAWN'], difficulty: 1 },
      {
        name: 'JACQUELINE WILSON BOOKS',
        words: ['SECRETS', 'CANDYFLOSS', 'SLEEPOVERS', 'MIDNIGHT'],
        difficulty: 2,
      },
      { name: '___ JAR', words: ['COOKIE', 'JAM', 'KILNER', 'BELL'], difficulty: 3 },
    ],
  },
  {
    level: 32,
    groups: [
      { name: 'TUBE LINES', words: ['CENTRAL', 'JUBILEE', 'BAKERLOO', 'DISTRICT'], difficulty: 0 },
      { name: 'BECKHAM FAMILY', words: ['VICTORIA', 'BROOKLYN', 'ROMEO', 'HARPER'], difficulty: 1 },
      { name: '___ LIGHTS', words: ['NORTHERN', 'FAIRY', 'TRAFFIC', 'SPOT'], difficulty: 2 },
      { name: '___ BRIDGE', words: ['TOWER', 'DRAW', 'SUSPENSION', 'CONTRACT'], difficulty: 3 },
    ],
  },
  {
    level: 33,
    groups: [
      { name: 'WESTLIFE MEMBERS', words: ['SHANE', 'KIAN', 'MARK', 'BRIAN'], difficulty: 0 },
      { name: 'WAYS TO MAKE A POT', words: ['COIL', 'SLAB', 'THROW', 'PINCH'], difficulty: 1 },
      { name: 'SLANG FOR STEAL', words: ['NICK', 'SWIPE', 'NAB', 'BAG'], difficulty: 2 },
      { name: '___ TOWER', words: ['WATCH', 'CONTROL', 'IVORY', 'LIFT'], difficulty: 3 },
    ],
  },
  {
    level: 34,
    groups: [
      { name: 'PRINCES', words: ['WILLIAM', 'GEORGE', 'LOUIS', 'EDWARD'], difficulty: 0 },
      { name: 'MCFLY MEMBERS', words: ['TOM', 'DANNY', 'DOUGIE', 'HARRY'], difficulty: 1 },
      { name: 'QUIDDITCH TERMS', words: ['SNITCH', 'QUAFFLE', 'BLUDGER', 'SEEKER'], difficulty: 2 },
      { name: 'EGG ___', words: ['BEATER', 'TIMER', 'CUP', 'SHELL'], difficulty: 3 },
    ],
  },
  {
    level: 35,
    groups: [
      // ✏️ swap for your own
      {
        name: 'HIGH STREET SHOPS',
        words: ['GREGGS', 'PRIMARK', 'ARGOS', 'SUPERDRUG'],
        difficulty: 0,
        personalSlot: true,
      },
      {
        name: 'PAPER CRAFTS',
        words: ['QUILLING', 'DECOUPAGE', 'COLLAGE', 'PAPIER-MACHE'],
        difficulty: 1,
      },
      { name: 'THINGS THAT BITE', words: ['MIDGE', 'GNAT', 'FLEA', 'TICK'], difficulty: 2 },
      {
        name: 'HIDDEN CAPITAL CITIES',
        words: ['ORIGAMI', 'CHROME', 'MOSQUITO', 'CLIMATE'],
        difficulty: 3,
      },
    ],
  },
  {
    level: 36,
    groups: [
      { name: 'THROW DOWN FACES', words: ['KEITH', 'RICH', 'SIOBHAN', 'SARA'], difficulty: 0 },
      { name: 'MUSIC GENRES', words: ['GRIME', 'FOLK', 'INDIE', 'EMO'], difficulty: 1 },
      { name: 'PARTS OF A HOUSE', words: ['LOFT', 'PORCH', 'CELLAR', 'GARAGE'], difficulty: 2 },
      {
        name: 'SOUND LIKE SEA CREATURES',
        words: ['SOUL', 'PLACE', 'MUSCLE', 'WAIL'],
        difficulty: 3,
      },
    ],
  },
  {
    level: 37,
    groups: [
      { name: 'WORDS FOR COLD', words: ['PARKY', 'NIPPY', 'CHILLY', 'BALTIC'], difficulty: 0 },
      { name: '___ SEA', words: ['NORTH', 'IRISH', 'CASPIAN', 'CORAL'], difficulty: 1 },
      {
        name: 'GLAZE FAULTS',
        words: ['CRAZING', 'CRAWLING', 'PINHOLING', 'SHIVERING'],
        difficulty: 2,
      },
      { name: '___LINE', words: ['DEAD', 'PUNCH', 'HEM', 'SKY'], difficulty: 3 },
    ],
  },
  {
    level: 38,
    groups: [
      { name: 'BRITISH TREES', words: ['OAK', 'BIRCH', 'ROWAN', 'WILLOW'], difficulty: 0 },
      {
        name: 'WORDS FOR NONSENSE',
        words: ['TOSH', 'TWADDLE', 'PIFFLE', 'CODSWALLOP'],
        difficulty: 1,
      },
      {
        name: 'FOOTBALL NICKNAMES',
        words: ['COBBLERS', 'POTTERS', 'CANARIES', 'TOFFEES'],
        difficulty: 2,
      },
      { name: '___ CONE', words: ['WAFFLE', 'PINE', 'TRAFFIC', 'NOSE'], difficulty: 3 },
    ],
  },
  {
    level: 39,
    groups: [
      { name: 'GARDEN BIRDS', words: ['WREN', 'STARLING', 'GOLDFINCH', 'JAY'], difficulty: 0 },
      { name: 'BATMAN CHARACTERS', words: ['JOKER', 'RIDDLER', 'PENGUIN', 'ROBIN'], difficulty: 1 },
      {
        name: 'POTTERY DECORATION',
        words: ['SGRAFFITO', 'MISHIMA', 'BURNISH', 'LUSTRE'],
        difficulty: 2,
      },
      { name: 'SOUND LIKE LETTERS', words: ['QUEUE', 'EWE', 'SEA', 'TEA'], difficulty: 3 },
    ],
  },
  {
    level: 40,
    groups: [
      { name: 'HERBS', words: ['BASIL', 'CHIVES', 'THYME', 'ROSEMARY'], difficulty: 0 },
      { name: 'SHADES OF GREEN', words: ['EMERALD', 'JADE', 'FOREST', 'OLIVE'], difficulty: 1 },
      { name: 'BRAINY TYPES', words: ['BOFFIN', 'EGGHEAD', 'SWOT', 'SAGE'], difficulty: 2 },
      { name: '___ SAUCE', words: ['MINT', 'BREAD', 'BROWN', 'APPLE'], difficulty: 3 },
    ],
  },
  {
    level: 41,
    groups: [
      // ✏️ swap for your own
      {
        name: 'RETRO TOYS',
        words: ['TAMAGOTCHI', 'FURBY', 'POGS', 'BRATZ'],
        difficulty: 0,
        personalSlot: true,
      },
      {
        name: 'SCHOOL PE SPORTS',
        words: ['NETBALL', 'ROUNDERS', 'LACROSSE', 'ATHLETICS'],
        difficulty: 1,
      },
      { name: '___ OFF', words: ['DANCE', 'KICK', 'SHOW', 'TELL'], difficulty: 2 },
      {
        name: 'ARTISTS MINUS A LETTER',
        words: ['HOCKEY', 'TUNER', 'BAKE', 'BANKS'],
        difficulty: 3,
      },
    ],
  },
  {
    level: 42,
    groups: [
      {
        name: 'LOVE ISLAND TERMS',
        words: ['CASA AMOR', 'BOMBSHELL', 'RECOUPLING', 'HIDEAWAY'],
        difficulty: 0,
      },
      { name: 'SEWING BOX', words: ['THIMBLE', 'BOBBIN', 'PINS', 'SCISSORS'], difficulty: 1 },
      {
        name: 'FOOTBALL CLUB SUFFIXES',
        words: ['VILLA', 'ARGYLE', 'ROVERS', 'ALBION'],
        difficulty: 2,
      },
      { name: 'CRYSTAL ___', words: ['MAZE', 'BALL', 'CLEAR', 'PALACE'], difficulty: 3 },
    ],
  },
  {
    level: 43,
    groups: [
      { name: 'BASIC TASTES', words: ['SWEET', 'SOUR', 'SALTY', 'UMAMI'], difficulty: 0 },
      { name: 'TRADITIONAL TIPPLES', words: ['CIDER', 'MEAD', 'STOUT', 'BITTER'], difficulty: 1 },
      { name: 'FAMOUS POTTERS', words: ['LEACH', 'COPER', 'RIE', 'PERRY'], difficulty: 2 },
      {
        name: 'HIDDEN POTTERS',
        words: ['COPERNICUS', 'CLIFFHANGER', 'BLEACHED', 'CALORIE'],
        difficulty: 3,
      },
    ],
  },
  {
    level: 44,
    groups: [
      { name: 'SOUPS', words: ['BROTH', 'CHOWDER', 'GAZPACHO', 'MINESTRONE'], difficulty: 0 },
      { name: 'IMPERIAL UNITS', words: ['POUND', 'STONE', 'PINT', 'GALLON'], difficulty: 1 },
      { name: 'TYPES OF FIRING', words: ['RAKU', 'PIT', 'SAGGAR', 'BISQUE'], difficulty: 2 },
      { name: 'WILD CATS', words: ['OUNCE', 'LYNX', 'PUMA', 'CARACAL'], difficulty: 3 },
    ],
  },
  {
    level: 45,
    groups: [
      { name: 'EMBROIDERY STITCHES', words: ['CHAIN', 'STEM', 'BACK', 'FEATHER'], difficulty: 0 },
      { name: 'LONDON AREAS', words: ['CAMDEN', 'SOHO', 'BRIXTON', 'HACKNEY'], difficulty: 1 },
      {
        name: 'SCOTTISH CITIES',
        words: ['PERTH', 'STIRLING', 'INVERNESS', 'GLASGOW'],
        difficulty: 2,
      },
      {
        name: 'BAKES NAMED AFTER PLACES',
        words: ['ECCLES', 'BAKEWELL', 'CHELSEA', 'DUNDEE'],
        difficulty: 3,
      },
    ],
  },
  {
    level: 46,
    groups: [
      { name: 'SPICES', words: ['NUTMEG', 'PAPRIKA', 'CUMIN', 'TURMERIC'], difficulty: 0 },
      { name: 'TYPES OF PAINT', words: ['ACRYLIC', 'GOUACHE', 'EMULSION', 'OIL'], difficulty: 1 },
      { name: 'JAMES ___', words: ['CORDEN', 'BLUNT', 'MAY', 'MARTIN'], difficulty: 2 },
      { name: '___ GIRL', words: ['TAMMY', 'SPICE', 'BOND', 'POSTER'], difficulty: 3 },
    ],
  },
  {
    level: 47,
    groups: [
      // ✏️ swap for your own
      {
        name: 'STEPS MEMBERS',
        words: ['CLAIRE', 'FAYE', 'LISA', 'LEE'],
        difficulty: 0,
        personalSlot: true,
      },
      {
        name: 'NORTHAMPTONSHIRE TOWNS',
        words: ['TOWCESTER', 'BRACKLEY', 'RUSHDEN', 'DESBOROUGH'],
        difficulty: 1,
      },
      { name: 'PARTS OF A BOOK', words: ['BLURB', 'INDEX', 'JACKET', 'PREFACE'], difficulty: 2 },
      { name: 'ANAGRAMS OF BIRDS', words: ['SPINE', 'GREET', 'RENT', 'RAPTOR'], difficulty: 3 },
    ],
  },
  {
    level: 48,
    groups: [
      {
        name: 'HALLOWEEN COSTUMES',
        words: ['GHOST', 'VAMPIRE', 'ZOMBIE', 'SKELETON'],
        difficulty: 0,
      },
      { name: 'KEYBOARD KEYS', words: ['SHIFT', 'ENTER', 'TAB', 'ESCAPE'], difficulty: 1 },
      { name: '___ GUITAR', words: ['BASS', 'LEAD', 'RHYTHM', 'ACOUSTIC'], difficulty: 2 },
      { name: '___CRAFT', words: ['WITCH', 'SPACE', 'STAGE', 'AIR'], difficulty: 3 },
    ],
  },
  {
    level: 49,
    groups: [
      {
        name: 'HARRY POTTER PLACES',
        words: ['HOGSMEADE', 'AZKABAN', 'GRINGOTTS', 'BURROW'],
        difficulty: 0,
      },
      { name: '___ BANK', words: ['PIGGY', 'FOOD', 'DOGGER', 'BLOOD'], difficulty: 1 },
      { name: '___ ALLEY', words: ['DIAGON', 'BLIND', 'TIN PAN', 'BOWLING'], difficulty: 2 },
      { name: '___ GREEN', words: ['GRETNA', 'VILLAGE', 'BOTTLE', 'PEA'], difficulty: 3 },
    ],
  },
  {
    level: 50,
    groups: [
      {
        name: 'WORD GAMES',
        words: ['WORDLE', 'SCRABBLE', 'BOGGLE', 'CONNECTIONS'],
        difficulty: 0,
      },
      { name: 'THINGS YOU DO TO CLAY', words: ['WEDGE', 'THROW', 'TRIM', 'GLAZE'], difficulty: 1 },
      { name: 'TENNIS TERMS', words: ['DEUCE', 'ACE', 'LET', 'RALLY'], difficulty: 2 },
      { name: '___ OF MY LIFE', words: ['TIME', 'LOVE', 'LIGHT', 'STORY'], difficulty: 3 },
    ],
  },
];
