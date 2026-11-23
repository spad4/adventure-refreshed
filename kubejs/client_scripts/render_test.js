const $LevelRenderer = Java.loadClass("net.minecraft.client.renderer.LevelRenderer");
const $RenderType = Java.loadClass("net.minecraft.client.renderer.RenderType");
const $RenderTooltipEvent$Pre = Java.loadClass("net.neoforged.neoforge.client.event.RenderTooltipEvent$Pre");
const $ModelData = Java.loadClass("net.neoforged.neoforge.client.model.data.ModelData")
const $Axis = Java.loadClass("com.mojang.math.Axis");
const $AABB = Java.loadClass("net.minecraft.world.phys.AABB");

//example
RenderJSClientEvents.registerItemDecorationsEvent(event => {
    event.register("diamond_sword", context => {
        var l = context.stack.getBarWidth();
        var i = context.stack.getBarColor();
        var j = context.xOffset + 2;
        var k = context.yOffset + 13;
        context.guiGraphics.fill($RenderType.guiOverlay(), j, k, j + 13, k + 2, -16777216);
        context.guiGraphics.fill($RenderType.guiOverlay(), j, k, j + l, k + 1, i | 0xFF000000);

    })
})
//example
RenderJSClientEvents.renderGuiEvent(event => {
    event.pre(pre => {
    })

    event.post(post => {
    })
})

NativeEvents.onEvent($RenderTooltipEvent$Pre, event => {
    var helper = RenderJSGuiRenderHelper.guiGraphicsPainter.update(event.getGraphics())
    var scaleX = 10
    var scaleY = 10
    event.getGraphics().pose().pushPose()
    event.getGraphics().pose().translate(event.screenWidth / 2 - 300, event.screenHeight / 2 - 100, 1000)
    event.getGraphics().pose().scale(scaleX, scaleY, 1)
    helper.renderItem(event.itemStack, 0, 0)
    event.getGraphics().pose().popPose()
})

RenderJSClientEvents.blockEntityRenderReloadEvent(event => {
    //set render function, support reload
    event.getRenderJSBlockEntityRender("rjs:test_block")
        .setCustomRender((renderer, context) => {
            var renderHelper = renderer.getLevelRenderHelper()
            var poseStack = context.poseStack
            poseStack.pushPose()
            poseStack.translate(0, 1, 0)
            renderHelper.renderSingleBlock(
                Blocks.GLASS.defaultBlockState(),
                context.poseStack,
                context.multiBufferSource,
                $LevelRenderer.getLightColor(context.blockEntity.level, context.blockEntity.blockPos.above()),
                context.packedOverlay,
                $ModelData.EMPTY,
                null
            )
            poseStack.translate(0.5, 0.2, 0.5)
            poseStack.mulPose($Axis.YP.rotationDegrees(Client.level.time + context.partialTick))

            renderHelper.renderItem(
                "diamond_sword",
                "ground",
                $LevelRenderer.getLightColor(context.blockEntity.level, context.blockEntity.blockPos.above()),
                context.packedOverlay,
                poseStack,
                context.multiBufferSource,
                context.blockEntity.level,
                0
            )
            poseStack.popPose()
        }
        )
        .setRenderBoundingBox(blockEntity => {
            return $AABB.INFINITE
        })
})

// RenderJSClientEvents.onLevelRender(event => {
//     //Selection Stage
//     if (event.stage == RenderJSLevelRenderStage.AFTER_ENTITIES) {
//         //setColor
//         event.setColor(255, 255, 255, 200)
//         //setRenderType
//         event.setTranslucentBlockRenderType()
//         //enableBlend
//         RenderJSRenderSystem.enableBlend()
//         //enableDepthTest
//         RenderJSRenderSystem.enableDepthTest()
//         //Position conversion
//         event.transformerCamera(event.poseStack, event.camera)
//         event.transformerToBlockPose(event.poseStack, BlockPos.ZERO)


//         event.pushPose()
//         // if you want render Texture or string you will need this,why? i dont know!
//         event.scale(-1, -1, 1)
//         event.drawTexture("minecraft:textures/item/apple.png", 0, 0, 16, 16)

//         event.popPose()
//         //renderblock

//         event.renderSingleBlock(Blocks.DIAMOND_BLOCK.defaultBlockState(), event.poseStack)
//         //restColor
//         event.restColor()
//     }
// })