const { isValidEmail, isValidPassword } = require('../utils/validations');

describe('Validations', () => {
  
  describe('isValidEmail', () => {
    test('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    test('should return false for invalid emails', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    test('should return true for valid passwords', () => {
      expect(isValidPassword('password123')).toBe(true);
    });

    test('should return false for short passwords', () => {
      expect(isValidPassword('pass12')).toBe(false);
    });
  });
});
