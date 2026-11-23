// CLIENT SCRIPT
const ITEM_REGISTRY = Registry.of("item");

const DENYLIST = [
    /_wood/,
    /_stairs/,
    /_slab/,
    /_wall/,
    /_button/,
    /_shutter/,
    /_carpet/,
    /_trim/,
    /_trellis/,
    /_picket/,
    /handcrafted:.+_cup/,
    /handcrafted:.+_bowl/,
    /handcrafted:.+_crockery_combo/,
    /_gate/,
    /_trapdoor/,
    /:flag_/,
    /barrel/,
    /_hanging_sign/,
    /kitchen_hood_pipe/,
    /way_sign_/,
    /_side_table/,
    /_medium_pot/,
    /_wide_pot/,
    /_thick_pot/,
    /_tatami_mat/,
    /safety_net/,
    /hanging_canvas_sign/,
    /_railing/,
    /_tall_stool/,
    /_cabinet/,
    /(hc|handcrafted).{1,}_chair/,
    /(af|another_furniture).{1,}bench/,
    /(hc|handcrafted).{1,}bench/,
]

const tooltips = [];
tooltips.push({
    condition: item => item.hasTag("advref:extra_placeable") || (item.block && !item.block?.hasTag("minecraft:crops")),
    icon: "\uE001",
    expanded: "placed"
})
tooltips.push({
    condition: item => item.block?.hasTag("minecraft:crops"),
    icon: "\uE002",
    expanded: "planted"
})
tooltips.push({
    condition: item => item.block?.hasTag("advref:bonemealable"),
    icon: "\uE003",
    expanded: "bonemealed"
})
tooltips.push({
    condition: item => item.block?.hasTag("minecraft:bee_growables") || item.hasTag("minecraft:bee_food"),
    icon: "\uE004",
    expanded: "pollinated"
})
tooltips.push({
    condition: item => item.hasTag("advref:trellis_plantable"),
    icon: "\uE005",
    expanded: "planted on trellises"
})
tooltips.push({
    condition: item => item.hasTag("advref:throwable"),
    icon: "\uE006",
    expanded: "thrown"
})
tooltips.push({
    condition: item => item.hasTag("minecraft:arrows"),
    icon: "\uE007",
    expanded: "fired from a bow"
})
tooltips.push({
    condition: item => item.hasTag("advref:backpack_utilities"),
    icon: "\uE008",
    expanded: "put in a backpack's utility slot"
})
tooltips.push({
    condition: item => item.block?.hasTag("another_furniture:seats"),
    icon: "\uE009",
    expanded: "sat on"
})
tooltips.push({
    condition: item => item.hasTag("advref:healing_items"),
    icon: "\uE010",
    expanded: "used to heal you or others"
})
tooltips.push({
    condition: item => item.hasTag("advref:wearable"),
    icon: "\uE011",
    expanded: "worn"
})
tooltips.push({
    condition: item => item.hasTag("connectiblechains:hangable_items"),
    icon: "\uE012",
    expanded: "hung from catenaries"
})
tooltips.push({
    condition: item => item.block?.hasTag("advref:receives_redstone_power"),
    icon: "\uE013",
    expanded: "powered by redstone"
})
tooltips.push({
    condition: item => item.hasTag("advref:extinguishable"),
    icon: "\uE014",
    expanded: "extinguished"
})
tooltips.push({
    condition: item => item.block?.hasTag("advref:waxable"),
    icon: "\uE015",
    expanded: "waxed"
})
tooltips.push({
    condition: item => item.hasTag("another_furniture:flower_box_placeables"),
    icon: "\uE016",
    expanded: "potted"
})
tooltips.push({
    condition: item => item.hasTag("spawn:catches_octopus"),
    icon: "\uE017",
    expanded: "used to catch octopuses"
})

ItemEvents.modifyTooltips(event => {

    // TODO: is it possible to apply the tag filter in .getValues() instead? idk how filters work..
    ITEM_REGISTRY.getValues().forEach(item => {

        event.modify(item, tooltip => {
            tooltip.removeExactText({"text":"Placeable", "color": "dark_gray", "italics": true})
        })

        if (DENYLIST.some(piece => item.id.search(piece) != -1)) return;

        const icons = []
        const expanded = []
        tooltips.forEach(tooltip => {
            if (!tooltip.condition(item)) return;
            icons.push(tooltip.icon);
            expanded.push([{"text": "    " + tooltip.icon + " ", "font": "advref:tooltip_icons"}, {"text": tooltip.expanded, "color": "green"}]);
        })

        if (!icons.length) return;

        event.modify(item, { shift: false }, tooltip => {
            tooltip.insert(1, {"text": icons.join(" "), "font": "advref:tooltip_icons"})
        })

        // ensures a list of uses is properly formatted with an OXFORD COMMA.
        if (expanded.length > 1) {
            // splits items like "one, two, three"
            if (expanded.length > 2) {
                for (let i = expanded.length - 1; i > 0; i -= 1) {
                    expanded.splice(i, 0, {"text": ","})
                }
            }
            // inserts "and" before the last entry, like "one, two, and three"
            expanded.splice(expanded.length - 1, 0, {"text": " and"}); 
        }
        event.modify(item, { shift: true }, tooltip => {
            tooltip.insert(1, [[{"text": "Can be"}, expanded], ]);
        })
    })
})