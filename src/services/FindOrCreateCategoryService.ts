import Category from '../models/Category';

class FindOrCreateCategoryService {
  public async execute(title: string): Promise<string> {
    let category = await Category.findOne({ title });

    if (!category) {
      category = new Category();
      category.title = title;
      await category.save();
    }

    return category.id;
  }
}

export default FindOrCreateCategoryService;
