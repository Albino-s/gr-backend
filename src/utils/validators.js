export const stringError = 'Value should be a string';
export const numberError = 'Value should be a number';
export const nullError = 'Required field';
export const emptyError = 'Value should be an empty';
export const bodyError = 'Validation errors';
export const objectError = 'Value should not be an empty object';
export const inArrayErrorMessage = 'Unknown value, please use known values';
export const unknownErrorMessage = 'Undefined error message';
export const rulesArgumentTypeErrorMessage = 'Argument rules should be an Array type';
export const validationDataTypeErrorMessage = 'Data should be an Object type';

export const buildValidatorTypeErrorMessage = index =>
  `Validator is not an object. Index: ${index}`;
export const buildValidatorParamErrorMessage = index =>
  `Validator's property "param" should be a string type! Index: ${index}`;
export const buildValidatorRulesErrorMessage = (param, index) =>
  `Property "rules" of validator "${param}" should be Array type! Index: ${index}`;
export const buildValidatorFuncErrorMessage = name =>
  `Validator ${name} not found`;

export const errorsMessagesObject = {
  isString: {
    optional: true,
    errorMessage: stringError
  },
  isNumber: {
    optional: true,
    errorMessage: numberError
  },
  notEmpty: {
    errorMessage: nullError
  },
  empty: {
    errorMessage: emptyError
  },
  isObject: {
    errorMessage: objectError
  }
};

export const empty = {empty: errorsMessagesObject.empty};

export const rules = {
  inArray: (msg = inArrayErrorMessage, array) => ({
    name: 'inArray',
    options: [array],
    errorMessage: msg
  }),
  isString: (msg = stringError) => ({
    name: 'isString',
    errorMessage: msg
  }),
  isNumber: (msg = numberError) => ({
    name: 'isNumber',
    errorMessage: msg
  }),
  notEmpty: (msg = nullError) => ({
    name: 'notEmpty',
    errorMessage: msg
  }),
  empty: (msg = emptyError) => ({
    name: 'empty',
    errorMessage: msg
  }),
  isObject: (msg = objectError) => ({
    name: 'isObject',
    errorMessage: msg
  })
};

export const getErrorMessage = (validatorName, trasformer = rules) => {
  const f = trasformer[validatorName];
  if (f instanceof Function) {
    const rule = f();
    if (rule && rule.errorMessage) {
      return rule.errorMessage;
    }
    return unknownErrorMessage;
  }
  return unknownErrorMessage;
};

export const checkValidatorFunction = (name, func) => {
  if (!(func instanceof Function)) {
    throw new Error(buildValidatorFuncErrorMessage(name));
  }
};

export const customValidatorMethods = {
  inArray: (value, list) => list.indexOf(value) !== -1,
  isString: param => typeof param === 'string',
  isNumber: param => !isNaN(Number(param)),
  empty: param => !param,
  notEmpty: param => Boolean(param),
  isObject: param => typeof param === 'object' && Object.keys(param).length > 0
};

export const checkRules = rules => {
  if (!(rules instanceof Array)) {
    throw new Error(rulesArgumentTypeErrorMessage);
  }
};

export const checkValidationData = rules => {
  if (!(typeof rules === 'object')) {
    throw new Error(validationDataTypeErrorMessage);
  }
};

export const checkRule = (rule, index) => {
  if (!(rule instanceof Object)) {
    throw new Error(buildValidatorTypeErrorMessage(index));
  }
};

export const checkRuleParam = (ruleParam, index) => {
  if (!(typeof ruleParam === 'string')) {
    throw new Error(buildValidatorParamErrorMessage(index));
  }
};

export const checkRulesInCurrentRule = (rules, param, index) => {
  if (!(rules instanceof Array)) {
    throw new Error(buildValidatorRulesErrorMessage(param, index));
  }
};

export const buildError = (msg, param, value, elem) => ({msg, value, param, elem});

export const buildReadableError = (msg, param, value, elem) =>
  `${msg}! param: "${param}"; value: "${value}";` +
  `${(' element: ' + JSON.stringify(elem))}`;

export const validateObject = (rulesArray, data) => {
  checkRules(rulesArray);
  checkValidationData(data);
  const errors = [];
  rulesArray.forEach((rule, i) => {
    checkRule(rule, i);
    checkRuleParam(rule.param, i);
    const value = data[rule.param];
    if (!rule.optional || value) {
      checkRulesInCurrentRule(rule.rules, rule.param, i);
      rule.rules.forEach(validatorValue => {
        let validator = validatorValue;
        if (typeof validatorValue === 'string') {
          validator = rules[validatorValue];
          checkValidatorFunction(validatorValue, validator);
        }

        const validatorFunc = customValidatorMethods[validator.name];
        checkValidatorFunction(validator.name, validatorFunc);

        const isValid = validatorFunc(value, validator.options);

        if (!isValid) {
          const errorMessage = validator.errorMessage ?
            validator.errorMessage : getErrorMessage(validator.name);
          errors.push(buildError(errorMessage, rule.param, value, data));
        }
      });
    }
  });

  return errors;
};

export const validateArray = (validationObject, arrayOfData) => {
  let errors = [];
  arrayOfData.forEach(el => {
    errors = errors.concat(validateObject(validationObject, el));
  });
  return errors;
};

export const validate = (validationObject, data) => {
  if (data instanceof Array) {
    return validateArray(validationObject, data);
  }
  return validateObject(validationObject, data);
};
