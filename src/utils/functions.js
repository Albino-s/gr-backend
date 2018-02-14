import url from 'url';
import R, {compose as o} from 'ramda';
import {auth} from 'config';
import jwt from 'jsonwebtoken';

// foldP :: (a -> b -> Promise a) -> a -> [b] -> Promise a
// foldP(
//   (acc, url) => fetch(url).then(({status}) => R.append(status, acc)),
//   [],
//   ['/']
// )
// > Promise.resolve([200])
export const foldP = R.uncurryN(3, f => acc => R.reduce(
  (promise, ...item) => promise.then(acc => f(acc, ...item)),
  Promise.resolve(acc)
));

// normalizeTableName :: String -> String
// normalizeTableName('locations1')
// > location
const normalizeTableName = o(
  R.replace(/\d$/, ''), R.replace(/s(?=[^s]*$)/, '')
);

// safeDigitExtraction :: String -> String
// safeDigitExtraction('locations1')
// > '1'
// safeDigitExtraction(undefined)
// > ''
const safeDigitExtraction = o(
  R.propOr('', 0), R.match(/\d$/), R.defaultTo('')
);

// fields :: [a] -> Table -> [Query a]
// fields(['name'], cans)
// > [cans.name.as('canName')]
export const fields = names => (
  table,
  prefix = normalizeTableName(table.alias || table._name)
) => R.map(name => table[name].as(`${prefix}${
  R.concat(R.toUpper(R.head(name)), R.tail(name))
}${safeDigitExtraction(table.alias)}`), names);

export const pickQuick = (fields, values) => {
  const result = {};
  fields.forEach((val) => {
    result[val] = values[val];
  });
  return result;
};

// columns :: [a] -> [b] -> Table -> [b]
// columns(['id'], ['name'], sql.define({columns: ['id', 'surname']}))
// > ['name', 'surname']
export const columns = R.uncurryN(3, except => and => R.pipe(
  R.prop('columns'),
  R.groupBy(R.prop('name')),
  R.omit(except),
  R.keys,
  R.concat(and)
));

// toUnderscore :: String -> String
// toUnderscore('camelCaseString')
// > camel_case_string
// toUnderscore('not_camel_case_string')
// > not_camel_case_string
export const toUnderscore = R.pipe(
  R.replace(/([A-Z])/g, '_$1'),
  R.replace(/_([A-Z])/g, R.toLower)
);

// -- Transpile kebab-styled-string or underscored_string into camelStyledOne
// camelize :: String -> String
// camelize('string_splitted_using_underscores')
// > 'stringSplittedUsingUnderscores'
// camelize('kebab-styled-string')
// > 'kebabStyledString'
export const camelize = R.replace(/[_-]([a-z])/g,
  o(R.replace(/[_-]/g, ''), R.toUpper));

// -- Transpile CamelStyledString into kebab-styled-one
// kebabize :: String -> String
// kebabize('CamelStyledString')
// > 'camel-styled-string'
// -- also will skip whitespaces
// kebabize('Not A Camel String Actually')
// > 'not-a-camel-string-actually'
export const kebabize = R.replace(/(\s?[A-Z])/g,
  o(R.replace(/\s/, '-'), R.toLower));

// camelizeObject :: Object -> Object
// camelizeObject({
//   a_b: 1,
//   c_d: 2
// })
// > {
//   aB: 1,
//   cD: 2
// }
export const camelizeObject = R.pipe(
  // convert object to list of pairs [[key, value], [key, value]]
  R.toPairs,
  // iteratively apply camelize function to each key in the list
  R.map(R.over(R.lensIndex(0), camelize)),
  // reassamble an object from the list of pairs
  R.fromPairs
);

// paramsList :: Object -> [String]
// paramsList({a: 1, b: 2})
// > ['a=1', 'b=2']
const paramsList = o(R.map(R.join('=')), R.toPairs);

// splitQueryString :: String -> [String]
// splitQueryString('?a=1&b=2')
// > ['a=1', 'b=2']
const splitQueryString = o(R.split(/&/), R.replace(/^\?/, ''), R.defaultTo(''));

// buildQueryString :: [String] -> String
// buildQueryString(['a=1', 'b=2'])
// > '?a=1&b=2'
const buildQueryString = o(R.concat('?'), R.join('&'), R.filter(R.identity));

// insertParams :: Object -> String -> String
// insertParams({a: 1}, '?b=2')
// > '?a=1&b=2'
const insertParams = R.uncurryN(2, params => R.pipe(
  splitQueryString,
  R.concat(paramsList(params)),
  buildQueryString
));

// urlFormat :: Object -> URL -> URL
// urlFormat({a: 1}, 'http://example.com')
// > 'http://example.com?a=1'
export const urlFormat = R.uncurryN(2, params => R.pipe(
  url.parse,
  R.over(R.lensProp('search'), insertParams(params)),
  R.omit(['path', 'href', 'query']),
  url.format
));

// retry :: (() -> Promise) -> Number -> Promise
export const retry = (f, time) => new Promise((resolve, reject) =>
  setTimeout(() => f().then(resolve).catch(reject), time)
);

// promisify :: ((a -> b -> c) -> c) -> Promise(c, a)
export const promisify = f => new Promise((resolve, reject) =>
  f((err, result) => {
    if (err) {
      return reject(err);
    }
    resolve(result);
  })
);

export const decodeSecret = (clientSecret, isEncoded) => {
  return isEncoded ? new Buffer(clientSecret, 'base64') : clientSecret;
};

export const generateToken = ({time = "48h", secret = auth.clientSecret, email} = {}) => {
  secret = auth.isEncodedSecret ? new Buffer(secret, 'base64') : secret;
  return jwt.sign({
    iss: "nutritiousgrocer",
    aud: auth.clientId,
    email,
    algorithm: 'HS256'
  },
    secret, {expiresIn: time}
  );
};
