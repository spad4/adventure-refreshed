const TEN_SECONDS = 200; // in ticks

const REMOVE_ALL = [
    "#handcrafted:trophies"
];

const REMOVE_CRAFTING_SHAPELESS = [
    "minecraft:mushroom_stew",
    "minecraft:beetroot_soup",
    "minecraft:rabbit_stew",
    "nomansland:mashed_potatoes_with_mushrooms",
    "bountifulfares:crusted_beef",
    "bountifulfares:apple_compote_jar",
    "bountifulfares:orange_compote_jar",
    "bountifulfares:lemon_compote_jar",
    "bountifulfares:plum_compote_jar",
    "bountifulfares:hoary_compote_jar",
    "bountifulfares:leek_stew",
    "bountifulfares:fish_stew",
    "bountifulfares:apple_stew",
    "bountifulfares:coconut_stew",
    "bountifulfares:coconut_crusted_cod",
    "bountifulfares:passion_glazed_salmon",
    "bountifulfares:bountiful_stew",
    "farmersdelight:wheat_dough",
    "bountifulfares:passion_fruit_tart",
    "minecraft:pumpkin_pie",
    "bountifulfares:passion_fruit_tart",
    "bountifulfares:elderberry_tart",
    "bountifulfares:lapisberry_tart",
    "bountifulfares:glow_berry_tart",
    "bountifulfares:sweet_berry_tart",
    "bountifulfares:orange_pie",
    "bountifulfares:lemon_pie",
    "bountifulfares:plum_pie",
    "bountifulfares:hoary_pie",
    "nomansland:pear_cobbler",
    "bountifulfares:melon_pie",
    "farmersdelight:organic_compost",
    "bountifulfares:coconut_half",
    "supplementaries:lumisene_bucket",
    "supplementaries:lumisene_bottle",
];

const REMOVE_CRAFTING_SHAPED = [
    "minecraft:bread"
];

const REMOVE_COOKING_POT = [
    "bountifulfares:crimson_chow",
    "bountifulfares:warped_chow",
    "bountifulfares:sea_salad"
];

const REPLACE_WHEAT_WITH_FLOUR = [
    "minersdelight:bat_cookie",
    "minersdelight:crunchy_bar",
    "farmersdelight:sweet_berry_cookie",
    "farmersdelight:honey_cookie",
    "nomansdelight:nut_bun",
    "farmersdelight:apple_pie",
    "minecraft:cake",
    "spawn:date_cookie",
    "minecraft:cookie"
];

function itemToObject(id) {
    return id[0] == "#" ? { tag: id.substring(1) } : { item: id }
}

ServerEvents.recipes(event => {

    const editOutputShaped = (output, amount, shape, map) => {
        event.remove({ output: output, type: "minecraft:crafting_shaped" })
        event.shaped(Item.of(output, amount), shape, map)
    }

    const addShapeless = (output, amount, ingredients) => {
        event.shapeless(Item.of(output, amount), ingredients)
    }

    const addShaped = (output, amount, shape, map) => {
        event.shaped(Item.of(output, amount), shape, map)
    }

    const editShapeless = (output, amount, ingredients) => {
        event.remove({ output: output })
        event.shapeless(Item.of(output, amount), ingredients)
    }

    const editShapelessByInput = (input, output, amount, ingredients) => {
        event.remove({ input: input, output: output })
        event.shapeless(Item.of(output, amount), ingredients)
    }

    const editShaped = (output, amount, shape, map) => {
        event.remove({ output: output })
        event.shaped(Item.of(output, amount), shape, map)
    }

    const editShapedByInput = (input, output, amount, shape, map) => {
        event.remove({ input: input, output: output })
        event.shaped(Item.of(output, amount), shape, map)
    }

    const addCooking = (output, ingredients, amount, container, time) => {
        event.custom({
            type: "farmersdelight:cooking",
            ingredients: ingredients.map(itemToObject),
            result: {
                id: output,
                count: amount
            },
            container: {
                id: container,
                count: 1
            },
            cooktime: time
        })
    }

    const addCuttingSimple = (output, input, amount, tool) => {
        const ingredientObject = [itemToObject(input),]
        const toolObject = [itemToObject(tool),]
        event.custom({
            type: "farmersdelight:cutting",
            ingredients: ingredientObject,
            result: [{
                item: {
                    id: output,
                    count: amount
                }
            }],
            tool: toolObject
        })
    }

    const addMilling = (output, input, amount) => {
        const ingredientObject = [itemToObject(input),]
        event.custom({
            type: "bountifulfares:milling",
            ingredient: ingredientObject,
            result: {
                id: output
            },
            result_count: amount
        })
    }

    const editMilling = (output, input, amount) => {
        event.remove({ output: output, type: "bountifulfares:milling" })
        addMilling(output, input, amount)
    }

    const replaceWithCooking = (output, ingredients, amount, container, time) => {
        event.remove({ output: output })
        addCooking(output, ingredients, amount, container, time)
    }
    const replaceShapelessWithCooking = (output, ingredients, amount, container, time) => {
        event.remove({ output: output, type: "minecraft:crafting_shapeless" })
        addCooking(output, ingredients, amount, container, time)
    }

    const makeBlasting = (input, output, amount) => {
        event.blasting(Item.of(output, amount), input)
    }

    const replaceInput = (output, from, to) => {
        event.replaceInput({ output: output }, from, to)
    }

    REMOVE_ALL.forEach(item => {
        event.remove({ output: item })
    });

    REMOVE_CRAFTING_SHAPELESS.forEach(item => {
        event.remove({ output: item, type: "minecraft:crafting_shapeless" })
    });

    REMOVE_CRAFTING_SHAPED.forEach(item => {
        event.remove({ output: item, type: "minecraft:crafting_shaped" })
    });

    REMOVE_COOKING_POT.forEach(item => {
        event.remove({ output: item, type: "farmersdelight:cooking" })
    });

    REPLACE_WHEAT_WITH_FLOUR.forEach(item => {
        replaceInput(item, "minecraft:wheat", "bountifulfares:flour")
    });

    /** Blast Furnace Scrapping
     *  1 Tool -> 4 Nuggets * Ingot Count
     *  ex. 1 Iron Pickaxe -> 12 Iron Nuggets
     */
    event.remove({ type: "minecraft:smelting", output: "minecraft:iron_nugget" });
    event.remove({ type: "minecraft:blasting", output: "minecraft:iron_nugget" });
    event.remove({ type: "minecraft:smelting", output: "minecraft:gold_nugget" });
    event.remove({ type: "minecraft:blasting", output: "minecraft:gold_nugget" });
    makeBlasting("minecraft:iron_pickaxe", "minecraft:iron_nugget", 12);
    makeBlasting("minecraft:iron_axe", "minecraft:iron_nugget", 12);
    makeBlasting("minecraft:iron_sword", "minecraft:iron_nugget", 8);
    makeBlasting("minecraft:iron_hoe", "minecraft:iron_nugget", 8);
    makeBlasting("minecraft:iron_shovel", "minecraft:iron_nugget", 4);
    makeBlasting("minecraft:iron_helmet", "minecraft:iron_nugget", 20);
    makeBlasting("minecraft:iron_chestplate", "minecraft:iron_nugget", 32);
    makeBlasting("minecraft:iron_leggings", "minecraft:iron_nugget", 28);
    makeBlasting("minecraft:iron_boots", "minecraft:iron_nugget", 16);
    makeBlasting("minecraft:iron_horse_armor", "minecraft:iron_nugget", 24);
    makeBlasting("farmersdelight:iron_knife", "minecraft:iron_nugget", 4);
    makeBlasting("dungeonsdelight:iron_cleaver", "minecraft:iron_nugget", 12);
    makeBlasting("minecraft:golden_pickaxe", "minecraft:gold_nugget", 12);
    makeBlasting("minecraft:golden_axe", "minecraft:gold_nugget", 12);
    makeBlasting("minecraft:golden_sword", "minecraft:gold_nugget", 8);
    makeBlasting("minecraft:golden_hoe", "minecraft:gold_nugget", 8);
    makeBlasting("minecraft:golden_shovel", "minecraft:gold_nugget", 4);
    makeBlasting("minecraft:golden_helmet", "minecraft:gold_nugget", 20);
    makeBlasting("minecraft:golden_chestplate", "minecraft:gold_nugget", 32);
    makeBlasting("minecraft:golden_leggings", "minecraft:gold_nugget", 28);
    makeBlasting("minecraft:golden_boots", "minecraft:gold_nugget", 16);
    makeBlasting("minecraft:golden_horse_armor", "minecraft:iron_nugget", 24);
    makeBlasting("farmersdelight:golden_knife", "minecraft:gold_nugget", 4);
    makeBlasting("dungeonsdelight:golden_cleaver", "minecraft:gold_nugget", 12);
    makeBlasting("simplest_copper_gear:copper_pickaxe", "kubejs:copper_nugget", 12);
    makeBlasting("simplest_copper_gear:copper_axe", "kubejs:copper_nugget", 12);
    makeBlasting("simplest_copper_gear:copper_sword", "kubejs:copper_nugget", 8);
    makeBlasting("simplest_copper_gear:copper_hoe", "kubejs:copper_nugget", 8);
    makeBlasting("simplest_copper_gear:copper_shovel", "kubejs:copper_nugget", 4);
    makeBlasting("simplest_copper_gear:copper_helmet", "kubejs:copper_nugget", 20);
    makeBlasting("simplest_copper_gear:copper_chestplate", "kubejs:copper_nugget", 32);
    makeBlasting("simplest_copper_gear:copper_leggings", "kubejs:copper_nugget", 28);
    makeBlasting("simplest_copper_gear:copper_boots", "kubejs:copper_nugget", 16);

    /** Fences
     *  4 Planks -> 4 Fences
     */
    event.forEachRecipe({
        output: "#c:fences"
    }, recipe => {

        let output = Item.of(recipe.originalRecipeResult, 4);
        let ingredients = recipe.originalRecipeIngredients;

        event.shaped(output, [
            "#|#",
            "#|#"
        ],
            {
                "#": ingredients[0],
                "|": ingredients[1]
            }
        );
        recipe.remove()
    });

    /** Storage Blocks
     * 1 Storage Block -> 8 Ingots
     * 8 Ingots -> 1 Storage Block
     * 1 Ingot -> 8 Nuggets
     * 8 Nuggets -> 1 Ingot
     */
    event.forEachRecipe({
        output: "#c:storage_blocks"
    }, recipe => {

        let output = recipe.originalRecipeResult;
        let originalIngredient = recipe.originalRecipeIngredients[0]

        if (output == "minecraft:copper_block") return;

        recipe.remove();
        event.remove({
            input: SizedIngredient.of(output),
            output: originalIngredient
        });

        event.shaped(output, [
            "###",
            "# #",
            "###"
        ],
            {
                "#": originalIngredient
            });
        event.shapeless(Item.of(originalIngredient.first, 8), output);
    });

    event.forEachRecipe({
        input: "#c:nuggets",
        output: "#c:ingots"
    }, recipe => {

        let output = recipe.originalRecipeResult;
        let originalIngredient = recipe.originalRecipeIngredients[0]

        recipe.remove();
        event.remove({
            input: SizedIngredient.of(output),
            output: originalIngredient
        });

        event.shaped(output, [
            "###",
            "# #",
            "###"
        ],
            {
                "#": originalIngredient
            });
        event.shapeless(Item.of(originalIngredient.first, 8), output);
    });

    editOutputShaped("minecraft:copper_ingot", 1, [
        "###",
        "# #",
        "###"
    ],
        {
            "#": "kubejs:copper_nugget"
        }
    );

    editShapeless("kubejs:copper_nugget", 8, ["minecraft:copper_ingot"])

    /** Carpet
     * 2 Wool -> 4 Carpets
     */
    const updateCarpet = recipe => {

        let output = recipe.originalRecipeResult;
        let originalIngredient = recipe.originalRecipeIngredients[0]

        recipe.remove();
        event.remove({
            input: SizedIngredient.of(output),
            output: originalIngredient
        });

        event.shaped(Item.of(output, 4), [
            "##",
        ],
            {
                "#": originalIngredient
            }
        );
    }

    event.forEachRecipe({
        input: "#minecraft:wool",
        output: "#minecraft:wool_carpets"
    }, updateCarpet);

    editOutputShaped("minecraft:moss_carpet", 4,
        [
            "MM"
        ],
        {
            M: "minecraft:moss_block",
        }
    );
    editOutputShaped("bountifulfares:coir_carpet", 4,
        [
            "MM"
        ],
        {
            M: "bountifulfares:packed_coconut_coir",
        }
    );
    editOutputShaped("spawn:red_algae_carpet", 4,
        [
            "MM"
        ],
        {
            M: "spawn:red_algae_block",
        }
    );

    /** Glass Panes
     *  4 Glass -> 16 Panes
     *  4 Panes -> 1 Glass
     */
    event.forEachRecipe({
        input: "#c:glass_blocks",
        output: "#c:glass_panes"
    }, recipe => {

        let output = recipe.originalRecipeResult;
        let originalIngredient = recipe.originalRecipeIngredients[0];

        recipe.remove();

        event.shaped(output, [
            "##",
            "##"
        ],
            {
                "#": originalIngredient
            }
        );

    });

    /**
     * Counters
     */
    event.forEachRecipe({
        output: "#handcrafted:counters"
    }, recipe => {

        let output = recipe.originalRecipeResult;
        output.count = 1;
        let originalIngredient = recipe.originalRecipeIngredients.find(ingredient => ingredient.getFirst().id.indexOf("planks") != -1);

        let split_id = originalIngredient.getFirst().id.split(":");
        let namespace = split_id[0];
        let material = split_id[1].split("_")[0];

        const itemRegistry = Registry.of("item");
        const potentialForms = [
            `another_furniture:${material}_drawer`,
            `everycomp:af/${namespace}/${material}_drawer`
        ];
        let drawer_id = potentialForms.find(id => itemRegistry.contains(id));

        recipe.remove();
        event.shaped(output, [
            "C",
            "D"
        ],
            {
                D: drawer_id,
                C: "minecraft:calcite"
            }
        );
    })

    /** Bountiful Fares Tea
     *  -> Cooking Pot
     */

    replaceShapelessWithCooking(
        "bountifulfares:green_tea_bottle",
        ["bountifulfares:tea_leaves", "bountifulfares:tea_leaves"],
        1, "bountifulfares:jar", TEN_SECONDS
    );
    replaceShapelessWithCooking(
        "bountifulfares:black_tea_bottle",
        ["bountifulfares:dried_tea_leaves", "bountifulfares:dried_tea_leaves"],
        1, "bountifulfares:jar", TEN_SECONDS
    );
    replaceShapelessWithCooking(
        "bountifulfares:chamomile_tea_bottle",
        ["bountifulfares:chamomile_flowers", "bountifulfares:chamomile_flowers", "bountifulfares:chamomile_flowers", "bountifulfares:chamomile_flowers"],
        1, "bountifulfares:jar", TEN_SECONDS
    );
    replaceShapelessWithCooking(
        "bountifulfares:honeysuckle_tea_bottle",
        ["bountifulfares:honeysuckle", "bountifulfares:honeysuckle"],
        1, "bountifulfares:jar", TEN_SECONDS
    );
    replaceShapelessWithCooking(
        "bountifulfares:bellflower_tea_bottle",
        ["bountifulfares:violet_bellflower", "bountifulfares:violet_bellflower"],
        1, "bountifulfares:jar", TEN_SECONDS
    );
    replaceShapelessWithCooking(
        "bountifulfares:torchflower_tea_bottle",
        ["minecraft:torchflower", "minecraft:torchflower"],
        1, "bountifulfares:jar", TEN_SECONDS
    );


    /** Bountiful Fares Slice Compacting
     */

    const sliceCrafting = (output, slice_id, number) => {
        addShapeless(output, 1, new Array(number).fill(slice_id))
    }

    sliceCrafting("bountifulfares:passion_fruit_tart", "delightful_fares:passion_fruit_tart_slice", 4);
    sliceCrafting("bountifulfares:elderberry_tart", "delightful_fares:elderberry_tart_slice", 4);
    sliceCrafting("bountifulfares:glow_berry_tart", "delightful_fares:glow_berry_tart_slice", 4);
    sliceCrafting("bountifulfares:sweet_berry_tart", "delightful_fares:sweet_berry_tart_slice", 4);
    sliceCrafting("bountifulfares:lapisberry_tart", "delightful_fares:lapis_berry_tart_slice", 4);
    sliceCrafting("bountifulfares:cocoa_cake", "delightful_fares:cocoa_cake_slice", 7);
    sliceCrafting("bountifulfares:coconut_cake", "delightful_fares:coconut_cake_slice", 7);
    sliceCrafting("bountifulfares:sponge_cake", "delightful_fares:sponge_cake_slice", 7);
    sliceCrafting("bountifulfares:melon_pie", "delightful_fares:melon_pie_slice", 4);
    sliceCrafting("bountifulfares:orange_pie", "delightful_fares:orange_pie_slice", 4);
    sliceCrafting("bountifulfares:lemon_pie", "delightful_fares:lemon_pie_slice", 4);
    sliceCrafting("bountifulfares:plum_pie", "delightful_fares:plum_pie_slice", 4);
    sliceCrafting("bountifulfares:hoary_pie", "delightful_fares:hoary_pie_slice", 4);

    /**
     * Delightful Fares Tea Recipes
     * 1 Tea Ingredient -> 2 Tea Ingredients
     */
    editShapeless("delightful_fares:chamomile_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "bountifulfares:chamomile_flowers",
        "bountifulfares:chamomile_flowers",
        "bountifulfares:chamomile_flowers",
        "bountifulfares:chamomile_flowers",
    ]);
    editShapeless("delightful_fares:honeysuckle_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "bountifulfares:honeysuckle",
        "bountifulfares:honeysuckle",
    ]);
    editShapeless("delightful_fares:bellflower_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "bountifulfares:violet_bellflower",
        "bountifulfares:violet_bellflower",
    ]);
    editShapeless("delightful_fares:torchflower_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "minecraft:torchflower",
        "minecraft:torchflower",
    ]);
    editShapeless("delightful_fares:green_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "bountifulfares:tea_leaves",
        "bountifulfares:tea_leaves",
    ]);
    editShapeless("delightful_fares:black_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "bountifulfares:dried_tea_leaves",
        "bountifulfares:dried_tea_leaves",
    ]);
    editShapeless("delightful_fares:red_tea_bag", 1, [
        "delightful_fares:tea_bag",
        "delightful_fares:fermented_tea_leaves",
        "delightful_fares:fermented_tea_leaves",
    ]);

    /**
     * Spawn Shell Fragments -> No Man's Land Seashells
     */
    addShaped("spawn:casting_net", 1, [
        " S ",
        "RRR",
        "RRR"
    ], {
        S: "nomansland:seashells",
        R: "farmersdelight:rope"
    });
    addShaped("spawn:pigment_shifter", 1, [
        "SSS",
        "SHS",
        "PPP"
    ], {
        S: "nomansland:seashells",
        H: "minecraft:heart_of_the_sea",
        P: "#spawn:pigment_shifter_base"
    });
    addShapeless("minecraft:bone_meal", 1, ["nomansland:seashells"])

    const addShellCase = (color) => {
        addShaped("spawn:clam_case_" + color, 1, [
            " S ",
            "SDS",
            " S "
        ], {
            S: "nomansland:seashells",
            D: `minecraft:${color}_dye`
        });
    }

    addShellCase("white")
    addShellCase("yellow")
    addShellCase("red")
    addShellCase("purple")


    /**
     * Bountiful Fares, No Man's Land Recipes
     * Tarts, Pies -> Pie Crust
     */

    editOutputShaped("bountifulfares:passion_fruit_tart", 1,
        [
            "FFF",
            "SMS",
            "ECE",
        ],
        {
            F: "bountifulfares:passion_fruit",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            M: "#c:drinks/milk",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:elderberry_tart", 1,
        [
            "FFF",
            "SMS",
            "ECE",
        ],
        {
            F: "bountifulfares:elderberries",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            M: "#c:drinks/milk",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:lapisberry_tart", 1,
        [
            "FFF",
            "SMS",
            "ECE",
        ],
        {
            F: "bountifulfares:lapisberries",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            M: "#c:drinks/milk",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:glow_berry_tart", 1,
        [
            "FFF",
            "SMS",
            "ECE",
        ],
        {
            F: "minecraft:glow_berries",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            M: "#c:drinks/milk",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:sweet_berry_tart", 1,
        [
            "FFF",
            "SMS",
            "ECE",
        ],
        {
            F: "minecraft:sweet_berries",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            M: "#c:drinks/milk",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:orange_pie", 1,
        [
            "RRR",
            "FFF",
            "SCS",
        ],
        {
            F: "bountifulfares:orange",
            S: "minecraft:sugar",
            R: "bountifulfares:flour",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:lemon_pie", 1,
        [
            "RRR",
            "FFF",
            "SCS",
        ],
        {
            F: "bountifulfares:lemon",
            S: "minecraft:sugar",
            R: "bountifulfares:flour",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:plum_pie", 1,
        [
            "RRR",
            "FFF",
            "SCS",
        ],
        {
            F: "bountifulfares:plum",
            S: "minecraft:sugar",
            R: "bountifulfares:flour",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:hoary_pie", 1,
        [
            "RRR",
            "FFF",
            "SCS",
        ],
        {
            F: "bountifulfares:hoary_apple",
            S: "minecraft:sugar",
            R: "bountifulfares:flour",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("bountifulfares:melon_pie", 1,
        [
            "FFF",
            "SES",
            " C ",
        ],
        {
            F: "minecraft:melon_slice",
            S: "minecraft:sugar",
            E: "bountifulfares:citrus_essence",
            C: "farmersdelight:pie_crust",
        }
    );
    editOutputShaped("nomansland:pear_cobbler", 1,
        [
            "FFF",
            "SES",
            "WCW",
        ],
        {
            F: "nomansland:pear",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            C: "farmersdelight:pie_crust",
            W: "nomansland:walnuts",
        }
    );
    editOutputShaped("minecraft:pumpkin_pie", 1,
        [
            "PEP",
            "PSP",
            " C ",
        ],
        {
            P: "farmersdelight:pumpkin_slice",
            S: "minecraft:sugar",
            E: "minecraft:egg",
            C: "farmersdelight:pie_crust",
        }
    );

    /**
     * Misc Changes
     */

    event.remove({ type: "farmersdelight:dough" }); // dough from water bucket has a special recipe...
    event.remove({ mod: "spawn", input: "spawn:shell_fragments", output: "minecraft:bone_meal" });
    event.replaceInput({ mod: "minersdelight" }, "minersdelight:arthropod", "dungeonsdelight:spider_meat");
    event.replaceInput({ mod: "minersdelight" }, "minersdelight:baked_spider_leg", "dungeonsdelight:smoked_spider_meat");
    event.replaceInput({ mod: "spawn" }, "spawn:shell_fragments", "nomansland:seashells");
    addMilling("bountifulfares:walnut_mulch", "nomansland:walnuts", 1);
    editMilling("minecraft:raw_copper", "minecraft:copper_ore", 2);
    editMilling("minecraft:raw_copper", "minecraft:deepslate_copper_ore", 2);
    addShapeless("farmersdelight:wheat_dough", 4, [
        "minecraft:potion[potion_contents={potion:'minecraft:water'}]",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour"
    ]);
    addShapeless("farmersdelight:wheat_dough", 8, [
        "minecraft:water_bucket",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour"
    ]);
    addShapeless("farmersdelight:wheat_dough", 8, [
        "minersdelight:water_cup",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour"
    ]);
    editShapeless("bountifulfares:artisan_bread", 1, [
        "minecraft:egg",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour",
        "bountifulfares:flour"
    ]);
    editShapeless("farmersdelight:pie_crust", 1,
        [
            "#c:drinks/milk",
            "minecraft:egg",
            "bountifulfares:flour",
            "bountifulfares:flour",
            "bountifulfares:flour",
            "bountifulfares:flour"
        ]
    );
    editOutputShaped("nomansland:fruit_cake", 1,
        [
            "PBA",
            "FEF",
            "RRR",
        ],
        {
            F: "#c:drinks/milk",
            P: "nomansland:pear",
            B: "minecraft:sweet_berries",
            A: "minecraft:apple",
            E: "minecraft:egg",
            R: "bountifulfares:flour",
        }
    );
    editOutputShaped("nomansdelight:pesto_pizza", 1,
        [
            "FCF",
            "WEW",
        ],
        {
            F: "#c:foods/cooked_venison",
            E: "minecraft:egg",
            C: "nomansland:pesto_bottle",
            W: "bountifulfares:flour",
        }
    );
    addCooking("bountifulfares:crusted_beef",
        ["#c:foods/cooked_beef", "nomansland:walnuts", "minecraft:potato", "bountifulfares:elderberries"],
        1, "minecraft:bowl", TEN_SECONDS
    );
    editShapeless("bountifulfares:mushroom_stuffed_potato", 1, [
        "minecraft:baked_potato",
        "nomansland:grilled_mushrooms",
        "nomansland:grilled_mushrooms"
    ]);
    editShapeless("bountifulfares:ceramic_clay", 4, [
        "minecraft:clay_ball",
        "minecraft:clay_ball",
        "minecraft:clay_ball",
        "minecraft:clay_ball",
        "bountifulfares:feldspar"
    ]);
    editOutputShaped("supplementaries:sconce", 1,
        [
            "ITI"
        ],
        {
            T: "minecraft:torch",
            I: "minecraft:iron_nugget",
        }
    );
    editOutputShaped("supplementaries:sconce_soul", 1,
        [
            "ITI"
        ],
        {
            T: "minecraft:soul_torch",
            I: "minecraft:iron_nugget",
        }
    );
    editShapelessByInput("minecraft:bone", "minecraft:bone_meal", 2, ["minecraft:bone"])
    editShapedByInput("#minecraft:planks", "minecraft:bowl", 4,
        [
            "PPP",
            " P "
        ],
        {
            P: "#minecraft:planks"
        }
    );
    editShaped("minecraft:glass_bottle", 4,
        [
            "PPP",
            " P "
        ],
        {
            P: "minecraft:glass"
        }
    );
    editShaped("minecraft:flower_pot", 1,
        [
            "PPP",
            " P "
        ],
        {
            P: "minecraft:brick"
        }
    );
    editShaped("nomansland:bandage", 4,
        [
            "  P",
            "PPP"
        ],
        {
            P: "minecraft:string"
        }
    );
    editOutputShaped("bountifulfares:jar", 4,
        [
            "PPP",
            " P "
        ],
        {
            P: "bountifulfares:ceramic_clay"
        }
    );
    editOutputShaped("nomansland:spike_trap", 2,
        [
            "FIF",
            "III",
            "SRS"
        ],
        {
            F: "minecraft:flint",
            I: "minecraft:iron_nugget",
            S: "minecraft:smooth_stone",
            R: "minecraft:redstone"
        }
    );
    editOutputShaped("another_furniture:service_bell", 3,
        [
            " B ",
            "III"
        ],
        {
            I: "minecraft:iron_ingot",
            B: "minecraft:stone_pressure_plate"
        }
    );
    editOutputShaped("handcrafted:kitchen_hood", 1,
        [
            " B ",
            "BBB"
        ],
        {
            B: "minecraft:iron_bars"
        }
    );
    editOutputShaped("farmersdelight:skillet", 1,
        [
            " II",
            " BI",
            "B  "
        ],
        {
            B: "minecraft:brick",
            I: "minecraft:iron_ingot"
        }
    );
    editOutputShaped("bountifulfares:feldspar_lantern", 1,
        [
            " N ",
            "FTF",
            "NNN"
        ],
        {
            F: "bountifulfares:feldspar",
            T: "minecraft:torch",
            N: "minecraft:iron_nugget"
        }
    );
    editShapeless("farmersdelight:fruit_salad", 1, [
        "#c:foods/tree_fruits",
        "#c:foods/tree_fruits",
        "#c:foods/berry",
        "#c:foods/berry",
        "minecraft:melon_slice",
        "minecraft:melon_slice",
        "minecraft:bowl",
    ]);
    editOutputShaped("bountifulfares:gristmill", 1,
        [
            "PCP",
            "P P",
            "BBB"
        ],
        {
            P: "#minecraft:planks",
            C: "minecraft:copper_ingot",
            B: "minecraft:bricks"
        }
    );
    replaceWithCooking("farmersdelight:dog_food",
        [
            "farmersdelight:pumpkin_slice",
            "minecraft:bone_meal",
            "#c:foods/raw_meat",
            "farmersdelight:rice"
        ],
        1, "minecraft:bowl", TEN_SECONDS
    );
    addShapeless("farmersdelight:organic_compost", 1,
        [
            "#advref:compost_base",
            "#advref:brown_compost",
            "#advref:brown_compost",
            "#advref:brown_compost",
            "#advref:brown_compost",
            "#advref:green_compost",
            "#advref:green_compost",
            "#advref:green_compost",
            "#advref:green_compost"
        ]
    );
    addShaped("minersdelight:glazed_arachnid_limbs", 1,
        [
            "SHS",
            "SRS",
            "GBG"
        ],
        {
            S: "dungeonsdelight:smoked_spider_meat",
            H: "minecraft:honey_bottle",
            R: "farmersdelight:cooked_rice",
            G: "minecraft:glow_berries",
            B: "minecraft:bowl"
        }
    )
    event.shaped(
        Item.of("kubejs:canvas_backpack")
            .set("beansbackpacks:utilities", 1)
            .set("beansbackpacks:backpack", { size: 4, texture: "kubejs:canvas" }),
        [
            "CSC",
            "CPC",
            "CSC"
        ],
        {
            S: "minecraft:string",
            C: "farmersdelight:canvas",
            P: "nomansland:pebbles"
        }
    )
    editShaped("quark:framed_glass", 4, [
        "IGI",
        "G G",
        "IGI"
    ], {
        G: "minecraft:glass",
        I: "minecraft:iron_ingot"
    })
    editOutputShaped("beansbackpacks:backpack", 1,
        [
            "CSC",
            "CPC",
            "CSC"
        ],
        {
            S: "minecraft:string",
            C: "minecraft:leather",
            P: "minecraft:iron_ingot"
        }
    )
    event.shaped(
        Item.of("kubejs:botanists_bundle")
            .set("beansbackpacks:filter", "#advref:botanists_bundle_accepts")
            .set("beansbackpacks:bundle", { size: 8 }),
        [
            " S ",
            "CPC",
            " C "
        ],
        {
            S: "minecraft:string",
            C: "farmersdelight:canvas",
            P: "#advref:botanists_bundle_accepts"
        }
    )
    addCuttingSimple("bountifulfares:coconut_half", "bountifulfares:coconut", 2, "#minecraft:axes")
    editShapeless("nomansland:trail_mix", 3, [
        "#advref:trail_mix_seeds",
        "nomansland:pine_nuts",
        "nomansland:walnuts"
    ]);
    editShapelessByInput("minersdelight:gossypium", "minecraft:string", 1, ["minersdelight:gossypium"])

    event.remove({ input: "minecraft:waxed_copper_block", output: "minecraft:copper_ingot" });
})
