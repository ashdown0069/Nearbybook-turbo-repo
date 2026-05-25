import { winstonLogger } from './winston.config';

describe('Winston Logger Config', () => {
  it('should be defined', () => {
    expect(winstonLogger).toBeDefined();
  });
});
