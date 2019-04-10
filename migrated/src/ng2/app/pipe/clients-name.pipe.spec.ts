import { ClientsNamePipe } from './clients-name.pipe';

describe('ClientsNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ClientsNamePipe();
    expect(pipe).toBeTruthy();
  });
});
