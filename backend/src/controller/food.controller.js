const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItemsRaw = await foodModel.find({})
    // Normalize field names so frontend always receives `savesCount`
    const foodItems = foodItemsRaw.map((f) => ({
        ...f.toObject(),
        savesCount: (f.savesCount ?? f.saveCount ?? 0),
        likeCount: (f.likeCount ?? 0)
    }))

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        // fetch updated savesCount to return to client
        let updatedFood = await foodModel.findById(foodId);
        // guard: don't allow negative counts
        if (updatedFood && updatedFood.savesCount < 0) {
            await foodModel.findByIdAndUpdate(foodId, { $set: { savesCount: 0 } });
            updatedFood = await foodModel.findById(foodId);
        }

        console.log(`User ${user._id} unsaved food ${foodId}, savesCount=${updatedFood?.savesCount}`);

        return res.status(200).json({
            message: "Food unsaved successfully",
            save: false,
            savesCount: updatedFood?.savesCount ?? 0
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    // fetch updated savesCount to return to client
    let updatedFood = await foodModel.findById(foodId);
    // guard: ensure non-negative
    if (updatedFood && updatedFood.savesCount < 0) {
        await foodModel.findByIdAndUpdate(foodId, { $set: { savesCount: 0 } });
        updatedFood = await foodModel.findById(foodId);
    }
    console.log(`User ${user._id} saved food ${foodId}, savesCount=${updatedFood?.savesCount}`);

    res.status(201).json({
        message: "Food saved successfully",
        save,
        savesCount: updatedFood?.savesCount ?? 0
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    // Normalize nested food documents so frontend can rely on `savesCount` and `likeCount`
    const normalized = savedFoods.map((s) => {
        const food = s.food && s.food.toObject ? s.food.toObject() : s.food;
        if (food) {
            food.savesCount = food.savesCount ?? food.saveCount ?? 0;
            food.likeCount = food.likeCount ?? 0;
        }
        return { ...s.toObject(), food };
    });

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods: normalized
    });

}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}