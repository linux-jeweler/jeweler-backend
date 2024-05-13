import { validateUserAgent } from '../../../src/helpers/UserAgentHelper';

describe('validateUserAgent', () => {
  describe('when the user agent is valid', () => {
    // it('returns the distro name', async () => {
    //   const req =
    //     'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36';
    //   const result = await validateUserAgent(req);
    //   expect(result).toBe('Linux');
    // });
  });

  describe('when the user agent is invalid', () => {
    it('returns null', async () => {
      const req = '';
      const result = await validateUserAgent(req);

      expect(result).toBe(null);
    });
  });
});
