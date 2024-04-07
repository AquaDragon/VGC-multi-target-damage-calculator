const samplePastes = [

// Sample Paste 1

`Tornadus @ Focus Sash
Ability: Prankster
Level: 50
Tera Type: Ghost
EVs: 20 HP / 252 SpA / 236 Spe
Naive Nature
- Air Slash
- Knock Off
- Tailwind
- Protect

Ogerpon-Hearthflame @ Hearthflame Mask
Ability: Mold Breaker
Level: 50
Tera Type: Fire
EVs: 36 HP / 212 Atk / 4 Def / 4 SpD / 252 Spe
Jolly Nature
IVs: 20 SpA
- Ivy Cudgel
- Grassy Glide
- Horn Leech
- Spiky Shield

Urshifu @ Life Orb
Ability: Unseen Fist
Level: 50
Tera Type: Dark
EVs: 172 HP / 140 Atk / 28 Def / 12 SpD / 156 Spe
Adamant Nature
- Close Combat
- Wicked Blow
- Detect
- Sucker Punch

Landorus-Therian @ Choice Scarf
Ability: Intimidate
Level: 50
Tera Type: Rock
EVs: 132 HP / 116 Atk / 4 Def / 4 SpD / 252 Spe
Adamant Nature
- Stomping Tantrum
- Rock Slide
- Rock Tomb
- U-turn

Rillaboom @ Assault Vest
Ability: Grassy Surge
Level: 50
Tera Type: Fire
EVs: 252 HP / 116 Atk / 4 Def / 76 SpD / 12 Spe
Adamant Nature
IVs: 8 SpA
- Grassy Glide
- High Horsepower
- U-turn
- Fake Out

Gholdengo @ Choice Specs
Ability: Good as Gold
Level: 50
Tera Type: Steel
EVs: 212 HP / 4 Def / 180 SpA / 4 SpD / 108 Spe
Modest Nature
IVs: 0 Atk
- Make It Rain
- Shadow Ball
- Thunderbolt
- Power Gem`,

// Sample Paste 2: https://pokepast.es/0d2b100d4ef07dc5

`Shiftry @ Focus Sash
Ability: Wind Rider
Level: 50
Tera Type: Steel
EVs: 252 Atk / 4 Def / 252 Spe
Adamant Nature
- Fake Out
- Knock Off
- Leaf Blade
- Icy Wind

Articuno @ Never-Melt Ice
Ability: Snow Cloak
Level: 50
Tera Type: Fire
EVs: 156 HP / 12 Def / 196 SpA / 4 SpD / 140 Spe
Modest Nature
- Blizzard
- Tailwind
- Freeze-Dry
- Protect

Ninetales-Alola @ Light Clay
Ability: Snow Warning
Level: 50
Tera Type: Water
EVs: 20 HP / 68 Def / 220 SpA / 12 SpD / 188 Spe
Timid Nature
- Moonblast
- Blizzard
- Aurora Veil
- Fake Tears

Heatran @ Life Orb
Ability: Flash Fire
Level: 50
Tera Type: Fairy
EVs: 20 HP / 4 Def / 252 SpA / 4 SpD / 228 Spe
Timid Nature
- Heat Wave
- Earth Power
- Flash Cannon
- Protect

Landorus-Therian @ Assault Vest
Ability: Intimidate
Level: 50
Tera Type: Water
EVs: 132 HP / 116 Atk / 4 Def / 44 SpD / 212 Spe
Adamant Nature
- Stomping Tantrum
- U-turn
- Earthquake
- Rock Slide

Ogerpon @ Choice Scarf
Ability: Defiant
Level: 50
Tera Type: Grass
EVs: 68 HP / 252 Atk / 4 Def / 4 SpD / 180 Spe
Jolly Nature
- U-turn
- Wood Hammer
- Superpower
- Stomping Tantrum`,

// Sample Paste 3: https://pokepast.es/33772be2cbcfdb52

`Okidogi @ Assault Vest
Ability: Guard Dog
Level: 50
Tera Type: Water
EVs: 172 HP / 172 Atk / 4 Def / 140 SpD / 20 Spe
Adamant Nature
- Gunk Shot
- Ice Punch
- Knock Off
- Drain Punch

Glastrier @ Clear Amulet
Ability: Chilling Neigh
Level: 50
Tera Type: Water
EVs: 204 HP / 28 Atk / 116 Def / 156 SpD / 4 Spe
Careful Nature
- Icicle Crash
- Heavy Slam
- Protect
- Stomping Tantrum

Landorus-Therian @ Safety Goggles
Ability: Intimidate
Level: 50
Tera Type: Flying
EVs: 132 HP / 116 Atk / 4 Def / 4 SpD / 252 Spe
Jolly Nature
- Stomping Tantrum
- Tera Blast
- U-turn
- Protect

Tornadus @ Covert Cloak
Ability: Prankster
Level: 50
Tera Type: Ghost
EVs: 252 HP / 4 SpA / 252 Spe
Timid Nature
IVs: 0 Atk
- Bleakwind Storm
- Taunt
- Tailwind
- Protect

Amoonguss @ Sitrus Berry
Ability: Regenerator
Level: 50
Tera Type: Water
EVs: 228 HP / 124 Def / 156 SpD
Calm Nature
IVs: 0 Atk / 23 Spe
- Protect
- Rage Powder
- Pollen Puff
- Spore

Chi-Yu @ Choice Specs
Ability: Beads of Ruin
Level: 50
Tera Type: Water
EVs: 132 HP / 252 Def / 116 SpA / 4 Spe
Modest Nature
IVs: 0 Atk
- Dark Pulse
- Overheat
- Heat Wave
- Snarl`,

// Sample Paste 4: https://pokepast.es/99c2335d7af1f925

`Indeedee-F @ Psychic Seed
Ability: Psychic Surge
Level: 50
Tera Type: Dragon
EVs: 252 HP / 252 Def / 4 SpA
Relaxed Nature
IVs: 0 Atk / 0 Spe
- Follow Me
- Trick Room
- Dazzling Gleam
- Helping Hand

Armarouge @ Twisted Spoon
Ability: Flash Fire
Level: 50
Tera Type: Grass
EVs: 252 HP / 252 SpA / 4 SpD
Quiet Nature
IVs: 0 Atk / 0 Spe
- Heat Wave
- Expanding Force
- Trick Room
- Wide Guard

Hatterene @ Life Orb
Ability: Magic Bounce
Level: 50
Tera Type: Flying
EVs: 252 HP / 252 SpA / 4 SpD
Quiet Nature
IVs: 0 Atk / 0 Spe
- Psychic
- Trick Room
- Dazzling Gleam
- Tera Blast

Ursaluna @ Flame Orb
Ability: Guts
Level: 50
Tera Type: Ghost
EVs: 252 HP / 252 Atk / 4 SpD
Brave Nature
IVs: 0 Spe
- Headlong Rush
- Facade
- Swords Dance
- Protect

Urshifu @ Choice Scarf
Ability: Unseen Fist
Level: 50
Tera Type: Dark
EVs: 4 HP / 252 Atk / 252 Spe
Adamant Nature
- Wicked Blow
- Close Combat
- U-turn
- Taunt

Torkoal @ Charcoal
Ability: Drought
Level: 50
Tera Type: Fire
EVs: 252 HP / 252 SpA / 4 SpD
Quiet Nature
IVs: 0 Atk / 0 Spe
- Eruption
- Heat Wave
- Protect
- Earth Power`,

// Sample Paste 5: https://pokepast.es/1d1b87bce87a8077

`Gyarados @ Sitrus Berry
Ability: Intimidate
Level: 50
Tera Type: Fairy
EVs: 4 HP / 252 Atk / 252 Spe
Jolly Nature
- Waterfall
- Tera Blast
- Dragon Dance
- Protect

Volcarona @ Leftovers
Ability: Flame Body
Level: 50
Tera Type: Dragon
EVs: 252 HP / 100 SpA / 156 Spe
Modest Nature
IVs: 0 Atk
- Heat Wave
- Struggle Bug
- Quiver Dance
- Protect

Iron Bundle @ Booster Energy
Ability: Quark Drive
Level: 50
Tera Type: Ghost
EVs: 252 HP / 4 Def / 100 SpA / 132 SpD / 20 Spe
Timid Nature
IVs: 0 Atk
- Hydro Pump
- Icy Wind
- Aurora Veil
- Encore

Sinistcha @ Wiki Berry
Ability: Hospitality
Level: 50
Tera Type: Dragon
EVs: 228 HP / 60 Def / 220 SpD
Bold Nature
IVs: 0 Atk
- Matcha Gotcha
- Calm Mind
- Rage Powder
- Strength Sap

Ninetales-Alola @ Choice Specs
Ability: Snow Warning
Level: 50
Tera Type: Fire
EVs: 20 HP / 4 Def / 252 SpA / 4 SpD / 228 Spe
Modest Nature
IVs: 0 Atk
- Blizzard
- Freeze-Dry
- Dazzling Gleam
- Aurora Veil

Iron Hands @ Assault Vest
Ability: Quark Drive
Level: 50
Tera Type: Grass
EVs: 76 HP / 252 Atk / 4 Def / 172 SpD / 4 Spe
Adamant Nature
- Wild Charge
- Drain Punch
- Heavy Slam
- Fake Out`,
];
