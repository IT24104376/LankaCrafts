//------------   Tourist Interests   -----------------//         

export interface Interest {
  id: string;
  label: string;
  emoji: string;
}

export const INTERESTS: Interest[] = [
  { id: 'pottery', label: 'Pottery', emoji: '🏺' },
  { id: 'batik', label: 'Batik', emoji: '🎨' },
  { id: 'woodcarving', label: 'Wood Carving', emoji: '🪵' },
  { id: 'weaving', label: 'Weaving', emoji: '🧵' },
  { id: 'masks', label: 'Mask Making', emoji: '🎭' },
  { id: 'lacquer', label: 'Lacquer Work', emoji: '✨' },
  { id: 'drumming', label: 'Drumming', emoji: '🥁' },
  { id: 'cooking', label: 'Cooking', emoji: '🍛' },
];

export const INTEREST_MAP: Record<string, Interest> = Object.fromEntries(
  INTERESTS.map((i) => [i.id, i])
);


export interface Regions {
  id: string;
  label: string;
  emoji: string;
}

export const REGIONS: Regions[] = [
  { id: 'colombo', label: 'Colombo', emoji: '🏙️' },
  { id: 'kandy', label: 'Kandy', emoji: '🏔️' },
  { id: 'galle', label: 'Galle', emoji: '🏰' },
  { id: 'jaffna', label: 'Jaffna', emoji: '🌴' },
  { id: 'anuradhapura', label: 'Anuradhapura', emoji: '🏛️' },
  { id: 'sigiriya', label: 'Sigiriya', emoji: '🪨' },
  { id: 'ella', label: 'Ella', emoji: '🌿' },
  { id: 'trincomalee', label: 'Trincomalee', emoji: '🌊' },
  { id: 'negombo', label: 'Negombo', emoji: '⛵' },
  { id: 'other', label: 'Other', emoji: '📍' },
];

export const REGIONS_MAP: Record<string, Regions> = Object.fromEntries(
  REGIONS.map((i) => [i.id, i])
);