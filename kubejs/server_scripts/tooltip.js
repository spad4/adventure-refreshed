const $ShapeMap = Java.loadClass("dev.tazer.clutternomore.shape.ShapeMap");

// CLIENT SCRIPT
const ITEM_REGISTRY = Registry.of("item");
const BLOCK_REGISTRY = Registry.of("block");

const PLACEABLE_DENYLIST = [
    "minecraft:sweet_berries",
];

const PLACEABLE_OVERRIDES = [
    "minecraft:writable_book",
    "minecraft:written_book",
    "minecraft:book",
    "minecraft:stick",
    "minecraft:blaze_rod",
    "minecraft:gunpowder",
    "minecraft:painting",
    "minecraft:armor_stand",
    "supplementaries:hat_stand",
    "supplementaries:pancake",
    "labels:label",
    "minecraft:item_frame",
    "minecraft:glow_item_frame",
    "quark:glass_item_frame",
    "quark:glowing_glass_item_frame",
    "minecraft:gunpowder",
    "spawn:captured_octopus",
    "spawn:angler_fish_bucket",
    "spawn:bluefish_bucket",
    "spawn:herring_bucket",
    "spawn:pilot_fish_bucket",
    "spawn:baby_sunfish_bucket",
    "spawn:blenny_bucket",
    "spawn:tuna_egg_bucket",
    "spawn:seahorse_bucket",
    "spawn:coastal_crab_bucket",
    "spawn:baby_sea_cow_bucket",
    "spawn:baby_flukeshroom_bucket",
    "spawn:baby_seal_bucket",
    "supplementaries:lumisene_bucket",
    "bountifulfares:ceramic_dish",
    "dungeonsdelight:wardenzolas",
];

const QUARK_POTTABLE = [
    "minecraft:beetroot_seeds",
    "minecraft:sweet_berries",
    "bountifulfares:sweet_berry_pips",
    "minecraft:carrot",
    "minecraft:glow_berries",
    "minecraft:chorus_flower",
    "minecraft:cocoa_beans",
    "minecraft:large_fern",
    "minecraft:lilac",
    "minecraft:melon_seeds",
    "minecraft:nether_sprouts",
    "minecraft:nether_wart",
    "minecraft:peony",
    "minecraft:pitcher_plant",
    "minecraft:potato",
    "minecraft:pumpkin_seeds",
    "minecraft:sea_pickle",
    "minecraft:short_grass",
    "minecraft:sugar_cane",
    "minecraft:tall_grass",
    "minecraft:twisting_vines",
    "minecraft:vine",
    "minecraft:weeping_vines",
    "minecraft:wheat_seeds",
]

const tooltips = [];
tooltips.push({
    condition: (item) =>
       !PLACEABLE_DENYLIST.includes(item.id) && (item.hasTag("dynamiccrosshair:blocks") || PLACEABLE_OVERRIDES.includes(item.id) || (item.block && !item.block?.hasTag("minecraft:crops"))),
    icon: "\uE001",
    expanded: "place",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("minecraft:crops"),
    icon: "\uE002",
    expanded: "plant",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("advref:bonemealable"),
    icon: "\uE003",
    expanded: "bonemeal",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("minecraft:bee_growables") || item.hasTag("minecraft:bee_food"),
    icon: "\uE004",
    expanded: "be pollinated",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:trellis_plantable"),
    icon: "\uE005",
    expanded: "plant on trellises",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:throwable"),
    icon: "\uE006",
    expanded: "throw",
});
tooltips.push({
    condition: (item) => item.hasTag("minecraft:arrows"),
    icon: "\uE007",
    expanded: "fire from a bow",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:backpack_utilities"),
    icon: "\uE008",
    expanded: "put in a backpack's utility slot",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("another_furniture:seats"),
    icon: "\uE009",
    expanded: "sit on",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:healing_items"),
    icon: "\uE010",
    expanded: "heal you or others",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:wearable"),
    icon: "\uE011",
    expanded: "wear",
});
tooltips.push({
    condition: (item) => item.hasTag("connectiblechains:hangable_items"),
    icon: "\uE012",
    expanded: "hang from catenaries",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("advref:receives_redstone_power"),
    icon: "\uE013",
    expanded: "power with redstone",
});
tooltips.push({
    condition: (item) => item.hasTag("advref:extinguishable"),
    icon: "\uE014",
    expanded: "extinguish",
});
tooltips.push({
    condition: (item) => item.block?.hasTag("advref:waxable"),
    icon: "\uE015",
    expanded: "wax",
});
tooltips.push({
    condition: (item) => {
        if (!item.block) return;
        if (QUARK_POTTABLE.includes(item.id)) return true;
        let split = item.block.id.split(":");
        let potted = split[0] + ":potted_" + split[1];
        return BLOCK_REGISTRY.contains(potted);
    },
    icon: "\uE016",
    expanded: "plant in pot",
});
tooltips.push({
    condition: (item) => item.hasTag("spawn:catches_octopus"),
    icon: "\uE017",
    expanded: "use to catch octopuses",
});

ItemEvents.modifyTooltips((event) => {
    ITEM_REGISTRY.getValues().forEach((item) => {

        if ($ShapeMap["isShape(net.minecraft.world.item.Item)"](item)) return;
        if (SHAPE_GROUPS.some(shape => item.id.includes(shape))) return;

        const icons = [];
        const expanded = [];
        tooltips.forEach((tooltip) => {
            if (!tooltip.condition(item)) return;
            icons.push(tooltip.icon);
            expanded.push([
                { text: "    " + tooltip.icon + " ", font: "advref:tooltip_icons" },
                { text: tooltip.expanded, color: "green" },
            ]);
        });

        if (!icons.length) return;

        event.modify(item, { shift: false }, (tooltip) => {
            tooltip.insert(1, { text: icons.join(" "), font: "advref:tooltip_icons" });
        });

        // ensures a list of uses is properly formatted with an OXFORD COMMA.
        if (expanded.length > 1) {
            // splits items like "one, two, three"
            if (expanded.length > 2) {
                for (let i = expanded.length - 1; i > 0; i -= 1) {
                    expanded.splice(i, 0, { text: "," });
                }
            }
            // inserts "and" before the last entry, like "one, two, and three"
            expanded.splice(expanded.length - 1, 0, { text: " and" });
        }
        event.modify(item, { shift: true }, (tooltip) => {
            tooltip.insert(1, [[{ text: "Can" }, expanded]]);
        });
    });
});
