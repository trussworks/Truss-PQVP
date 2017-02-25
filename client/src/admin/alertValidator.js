const alertValidator = (values) => {
  const errors = {};

  if (!values.alertMessage) {
    errors.alertMessage = 'Required';
  }

  return errors;
};

export default alertValidator;
