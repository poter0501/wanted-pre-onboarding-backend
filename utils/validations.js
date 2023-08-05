exports.isValidEmail = (email) => {
    const parts = email.split('@');
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  };
  

exports.isValidPassword = (password) => {
    return password.length >= 8;
};