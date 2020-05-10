import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import FindOrCreateCategoryService from './FindOrCreateCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const acceptedTypes = ['income', 'outcome'];
    if (!acceptedTypes.includes(type)) {
      throw new AppError('Type not accepted', 400);
    }

    const balance = await transactionsRepository.getBalance();
    const explodeBalance = type === 'outcome' && balance.total < value;

    if (explodeBalance) {
      throw new AppError(
        `This transaction will explode your balance, don't do it.`,
        400,
      );
    }

    const findOrCreateCategory = new FindOrCreateCategoryService();

    const category_id = await findOrCreateCategory.execute(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
