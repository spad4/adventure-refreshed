
const RARITY_MAP = new Map();

RARITY_MAP.set("RARE", [
    "handcrafted:bear_trophy",
    "handcrafted:blaze_trophy",
    "handcrafted:fox_trophy",
    "handcrafted:goat_trophy",
    "handcrafted:pufferfish_trophy",
    "handcrafted:salmon_trophy",
    "handcrafted:silverfish_trophy",
    "handcrafted:skeleton_horse_trophy",
    "handcrafted:spider_trophy",
    "handcrafted:tropical_fish_trophy",
    "handcrafted:wither_skeleton_trophy",
    "handcrafted:wolf_trophy",
    "handcrafted:phantom_trophy",
    "handcrafted:creeper_trophy",
    "handcrafted:skeleton_trophy",
    "handcrafted:evoker_trophy",
    "handcrafted:pillager_trophy",
    "handcrafted:vindicator_trophy",
    "handcrafted:witch_trophy",
    "nomansland:ancient_bronze_bell",
]);

ItemEvents.modification(event => {
    RARITY_MAP.forEach((list, rarity) => {
        list.forEach(item => {
            event.modify(item, i => { i.rarity = rarity })
        })
    })
});