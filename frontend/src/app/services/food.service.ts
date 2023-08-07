import { Injectable } from '@angular/core';
import { Food } from '../shared/models/food';
import { sample_foods, sample_tags } from '../data';
import { Tag } from '../shared/models/tag';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { FOOD_BY_ID_URL, FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL } from '../shared/models/constants/url';

@Injectable({
  providedIn: 'root'
})

export class FoodService {

  constructor(private http:HttpClient) { }

  getAll():Observable<Food[]>{
    // return sample_foods;
    return this.http.get<Food[]>(FOODS_URL);

  }

  getAllFoodsBySearchTerm(searchTerm:string){
    // return this.getAll().filter(food=>food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL+searchTerm)
  }

  getAllTag():Observable<Tag[]>{
     return this.http.get<Tag[]>(FOODS_TAGS_URL );
  }

  getAllFoodByTag(tag:string):Observable<Food[]>{
      return (tag=="All")?
      this.getAll():
      this.http.get<Food[]>(FOODS_BY_TAG_URL+tag);
      // this.getAll().filter(food=>food.tags?.includes(tag));
  }
  getFoodById(foodId:string):Observable<Food>{
    // return this.getAll().find(food =>food.id==foodId) ?? new Food();
    return this.http.get<Food>(FOOD_BY_ID_URL+foodId);

  }
}
