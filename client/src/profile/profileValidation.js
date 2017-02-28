const profileValidation = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = 'Required';
  } else {
    const strippedNum = values.phoneNumber.replace(/[^0-9]/g, '');
    console.log('stripped: ');
    console.log(strippedNum);
    if (strippedNum.length < 10 || strippedNum.length > 11 ||
        (strippedNum.length === 11 && strippedNum.charAt(0) !== '1')) {
      errors.phoneNumber = 'Invalid Phone Number. We expect a phone number to contain 10 digits.';
    }
  }

  return errors;
};

export default profileValidation;
