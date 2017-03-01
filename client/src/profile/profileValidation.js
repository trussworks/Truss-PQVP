const profileValidation = (values) => {
  const errors = {};

  if (values.phone) {
    const strippedNum = values.phone.replace(/[^0-9]/g, '');
    if (strippedNum.length < 10 || strippedNum.length > 11 ||
        (strippedNum.length === 11 && strippedNum.charAt(0) !== '1')) {
      errors.phone = 'Invalid Phone Number. We expect a phone number to contain 10 digits.';
    }
  }

  return errors;
};

export default profileValidation;
