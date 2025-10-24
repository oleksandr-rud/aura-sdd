/**
 * Use Case Base Class
 * KISS principle: simple use case pattern for application services
 */

import { Result } from '@/libs/utils'

export abstract class UseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<Result<TOutput, Error>>
}

export abstract class UseCaseWithValidation<TInput, TOutput> extends UseCase<TInput, TOutput> {
  abstract validate(input: TInput): Result<TInput, Error>

  async execute(input: TInput): Promise<Result<TOutput, Error>> {
    const validation = this.validate(input)

    if (validation.isErr()) {
      return Result.err(validation.unwrapErr())
    }

    return this.executeValidated(validation.unwrap())
  }

  protected abstract executeValidated(validInput: TInput): Promise<Result<TOutput, Error>>
}

export abstract class Query<TInput, TOutput> extends UseCase<TInput, TOutput> {}

export abstract class Command<TInput, TOutput> extends UseCase<TInput, TOutput> {}

// Helper function to execute use cases with error handling
export const executeUseCase = async <TInput, TOutput>(
  useCase: UseCase<TInput, TOutput>,
  input: TInput
): Promise<Result<TOutput, Error>> => {
  try {
    return await useCase.execute(input)
  } catch (error) {
    return Result.err(error as Error)
  }
}