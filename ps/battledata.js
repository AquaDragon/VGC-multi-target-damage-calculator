/*
    Functions borrowed from the Pokemon Showdown client.
    Used to determine item's sprite position within the sprite sheet.

    Source: play.pokemonshowdown.com/js/battledata.js
    24 Aug 2023
*/

function toID(text) {
    var _text, _text2;

    if ((_text = text) != null && _text.id) {
        text = _text.id;
    } else if ((_text2 = text) != null && _text2.userid) {
        text = _text2.userid;
    }

    if (typeof text !== 'string' && typeof text !== 'number') {
        return '';
    }

    return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getItemIcon(item) {
    var _item;
    var num = 0;

    if (typeof item === 'string' && PS_BATTLE_ITEMS) {
        item = PS_BATTLE_ITEMS[toID(item)];
    } 

    if ((_item = item) != null && _item.spritenum) {
        num = _item.spritenum;
    }

    var top = Math.floor(num / 16) * 24;
    var left = num % 16 * 24;

    var spritesheetURL = 'itemicons-sheet.png'

    return 'background: transparent url(' + spritesheetURL + ') no-repeat scroll -' +
        left + 'px -' + top + 'px';
};

