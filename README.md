# Pokémon VGC Multi-Target Damage Calculator

This is a tool currently in development for performing damage calculations against multiple targets. It is intended to help with teambuilding, matchup planning and exploring various battle scenarios.

The current inputs are two teams formatted in PokePastes or Pokémon Showdown!-styled text. The GUI will then generate a cross-table showing all relevant damage calculations between the two teams.

Planned features in development / to-do list:

- Reorganize layout & presentation
- Interface to allow editing of team information
- Statistics
- Allow calculations vs. more than 6 Pokémon

Optimized for VGC formats in Pokémon Scarlet & Violet.

![image](https://github.com/AquaDragon/js-gui/assets/22651173/9b2612f6-db15-4f51-98d3-db4b213114d8)

## Dependencies

Damage calculations are performed by the scripts from the [VGC Damage Calculator](https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator/) by Nimbasa City Post. 

To maintain version control, a [fork](https://github.com/AquaDragon/NCP-VGC-Damage-Calculator) of the respository was created and is referenced as a submodule in ``imports/dmgcalc-NCP``. 

- If this is the first time the repository is being set up, run the following command on the command line to initialize the submodule:
```
git submodule update --init --recursive
```

- To update the submodule, run:
```
git submodule update --remote --merge
```

## Credits

- Type & Pokémon sprite icons + item sprite sheet: https://play.pokemonshowdown.com/sprites/
- [VGC Damage Calculator](https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator/) by Nimbasa City Post
