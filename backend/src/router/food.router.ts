import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asynceHandler from "express-async-handler";
import { FoodModel } from '../models/food.model';
const router=Router();


router.get("/seed",asynceHandler(
    async (req, res)=>{
        const foodsCount=await FoodModel.countDocuments();
        if(foodsCount>0){
            res.send("Seed is already done!");
            return;
        }

        await FoodModel.create(sample_foods);
        res.send("Seed is Done");
    }
))

router.get("",asynceHandler(
    async(req,res)=>{
    const foods=await FoodModel.find();
    res.send(foods);
}))

router.get("/search/:searchTerm",asynceHandler(async(req,res)=>{
    const searchRegex=new RegExp(req.params.searchTerm,'i');
    const foods=await FoodModel.find({name:{$regex:searchRegex}})
    // const searchTerm=req.params.searchTerm;
    // const foods=sample_foods.filter(food=>food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    res.send(foods);
}))

router.get("/tags",asynceHandler(
    async(req,res)=>{
    //This stage creates a new document for each element in the tags array, effectively splitting the array into separate documents.
    const tags=await FoodModel.aggregate([
    {
        $unwind:'$tags'
    },
    //$group stage is used to group documents based on a specified key, in this case, the tags field.
    {
        $group:{
            _id:'$tags',
            count:{$sum:1}
        }
    },
    {
        $project:{
            _id:0,
            name:'$_id',
            count:'$count'
        }
    }
]).sort({count:-1});
  const all = {
    name:'All',
    count:await FoodModel.countDocuments()
  }
    tags.unshift(all);
    res.send(tags);
}))

router.get("/tags/:tagName",asynceHandler(
    async(req,res)=>{
    const foods=await FoodModel.find({tags:req.params.tagName})
    // const tagName=req.params.tagName;
    // const foods=sample_foods.filter(food=>food.tags?.includes(tagName));
    res.send(foods);
}))

router.get("/:foodId",asynceHandler(
    async(req,res)=>{
    const food=await FoodModel.findById(req.params.foodId);
    // const foodId=req.params.foodId;
    // const foods=sample_foods.find(food =>food.id==foodId);
    res.send(food);
}))

export default router;