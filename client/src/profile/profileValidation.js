const profileValidation = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) {
    errors.phone = 'Required';
  } else {
    const strippedNum = values.phone.replace(/[^0-9]/g, '');
    if (strippedNum.length < 10 || strippedNum.length > 11 ||
        (strippedNum.length === 11 && strippedNum.charAt(0) !== '1')) {
      errors.phone = 'Invalid Phone Number. We expect a phone number to contain 10 digits.';
    }
  }

  return errors;
};

export default profileValidation;
