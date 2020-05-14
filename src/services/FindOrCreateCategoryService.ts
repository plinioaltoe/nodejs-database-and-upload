import { getRepository } from 'typeorm';
import Category from '../models/Category';

class FindOrCreateCategoryService {
  public async execute(title: string): Promise<string> {
    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({ title });

    if (!category) {
      category = categoryRepository.create({ title });
      await categoryRepository.save(category);
    }

    return category.id;
  }
}

export default FindOrCreateCategoryService;
