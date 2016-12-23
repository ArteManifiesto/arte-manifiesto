var moment = require('moment');
var email = require('../app/controllers/email');
var _ = require('lodash');

global.limits = {
  usersHome: 4,
  worksHome: 15,
  categoriesHome: 8,
  feed: 10,
  blog: 20,
  singlePost: 3,
  singleChapter: 3
};

global.attributes = {
  privateUser: ['id', 'username', 'firstname', 'lastname', 'fullname', 'pseudonimo', 'photo', 'typeName','city', 'country', 'featured']
};

global.countries = [
    {
        "name": "Afghanistan",
        "code": "AF"
    },
    {
        "name": "Åland Islands",
        "code": "AX"
    },
    {
        "name": "Albania",
        "code": "AL"
    },
    {
        "name": "Algeria",
        "code": "DZ"
    },
    {
        "name": "American Samoa",
        "code": "AS"
    },
    {
        "name": "Andorra",
        "code": "AD"
    },
    {
        "name": "Angola",
        "code": "AO"
    },
    {
        "name": "Anguilla",
        "code": "AI"
    },
    {
        "name": "Antarctica",
        "code": "AQ"
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AG"
    },
    {
        "name": "Argentina",
        "code": "AR"
    },
    {
        "name": "Armenia",
        "code": "AM"
    },
    {
        "name": "Aruba",
        "code": "AW"
    },
    {
        "name": "Australia",
        "code": "AU"
    },
    {
        "name": "Austria",
        "code": "AT"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ"
    },
    {
        "name": "Bahamas",
        "code": "BS"
    },
    {
        "name": "Bahrain",
        "code": "BH"
    },
    {
        "name": "Bangladesh",
        "code": "BD"
    },
    {
        "name": "Barbados",
        "code": "BB"
    },
    {
        "name": "Belarus",
        "code": "BY"
    },
    {
        "name": "Belgium",
        "code": "BE"
    },
    {
        "name": "Belize",
        "code": "BZ"
    },
    {
        "name": "Benin",
        "code": "BJ"
    },
    {
        "name": "Bermuda",
        "code": "BM"
    },
    {
        "name": "Bhutan",
        "code": "BT"
    },
    {
        "name": "Bolivia",
        "code": "BO"
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "BA"
    },
    {
        "name": "Botswana",
        "code": "BW"
    },
    {
        "name": "Bouvet Island",
        "code": "BV"
    },
    {
        "name": "Brazil",
        "code": "BR"
    },
    {
        "name": "British Indian Ocean Territory",
        "code": "IO"
    },
    {
        "name": "Brunei Darussalam",
        "code": "BN"
    },
    {
        "name": "Bulgaria",
        "code": "BG"
    },
    {
        "name": "Burkina Faso",
        "code": "BF"
    },
    {
        "name": "Burundi",
        "code": "BI"
    },
    {
        "name": "Cambodia",
        "code": "KH"
    },
    {
        "name": "Cameroon",
        "code": "CM"
    },
    {
        "name": "Canada",
        "code": "CA"
    },
    {
        "name": "Cape Verde",
        "code": "CV"
    },
    {
        "name": "Cayman Islands",
        "code": "KY"
    },
    {
        "name": "Central African Republic",
        "code": "CF"
    },
    {
        "name": "Chad",
        "code": "TD"
    },
    {
        "name": "Chile",
        "code": "CL"
    },
    {
        "name": "China",
        "code": "CN"
    },
    {
        "name": "Christmas Island",
        "code": "CX"
    },
    {
        "name": "Cocos (Keeling) Islands",
        "code": "CC"
    },
    {
        "name": "Colombia",
        "code": "CO"
    },
    {
        "name": "Comoros",
        "code": "KM"
    },
    {
        "name": "Congo",
        "code": "CG"
    },
    {
        "name": "Congo, The Democratic Republic of the",
        "code": "CD"
    },
    {
        "name": "Cook Islands",
        "code": "CK"
    },
    {
        "name": "Costa Rica",
        "code": "CR"
    },
    {
        "name": "Cote D\"Ivoire",
        "code": "CI"
    },
    {
        "name": "Croatia",
        "code": "HR"
    },
    {
        "name": "Cuba",
        "code": "CU"
    },
    {
        "name": "Cyprus",
        "code": "CY"
    },
    {
        "name": "Czech Republic",
        "code": "CZ"
    },
    {
        "name": "Denmark",
        "code": "DK"
    },
    {
        "name": "Djibouti",
        "code": "DJ"
    },
    {
        "name": "Dominica",
        "code": "DM"
    },
    {
        "name": "Dominican Republic",
        "code": "DO"
    },
    {
        "name": "Ecuador",
        "code": "EC"
    },
    {
        "name": "Egypt",
        "code": "EG"
    },
    {
        "name": "El Salvador",
        "code": "SV"
    },
    {
        "name": "Equatorial Guinea",
        "code": "GQ"
    },
    {
        "name": "Eritrea",
        "code": "ER"
    },
    {
        "name": "Estonia",
        "code": "EE"
    },
    {
        "name": "Ethiopia",
        "code": "ET"
    },
    {
        "name": "Falkland Islands (Malvinas)",
        "code": "FK"
    },
    {
        "name": "Faroe Islands",
        "code": "FO"
    },
    {
        "name": "Fiji",
        "code": "FJ"
    },
    {
        "name": "Finland",
        "code": "FI"
    },
    {
        "name": "France",
        "code": "FR"
    },
    {
        "name": "French Guiana",
        "code": "GF"
    },
    {
        "name": "French Polynesia",
        "code": "PF"
    },
    {
        "name": "French Southern Territories",
        "code": "TF"
    },
    {
        "name": "Gabon",
        "code": "GA"
    },
    {
        "name": "Gambia",
        "code": "GM"
    },
    {
        "name": "Georgia",
        "code": "GE"
    },
    {
        "name": "Germany",
        "code": "DE"
    },
    {
        "name": "Ghana",
        "code": "GH"
    },
    {
        "name": "Gibraltar",
        "code": "GI"
    },
    {
        "name": "Greece",
        "code": "GR"
    },
    {
        "name": "Greenland",
        "code": "GL"
    },
    {
        "name": "Grenada",
        "code": "GD"
    },
    {
        "name": "Guadeloupe",
        "code": "GP"
    },
    {
        "name": "Guam",
        "code": "GU"
    },
    {
        "name": "Guatemala",
        "code": "GT"
    },
    {
        "name": "Guernsey",
        "code": "GG"
    },
    {
        "name": "Guinea",
        "code": "GN"
    },
    {
        "name": "Guinea-Bissau",
        "code": "GW"
    },
    {
        "name": "Guyana",
        "code": "GY"
    },
    {
        "name": "Haiti",
        "code": "HT"
    },
    {
        "name": "Heard Island and Mcdonald Islands",
        "code": "HM"
    },
    {
        "name": "Holy See (Vatican City State)",
        "code": "VA"
    },
    {
        "name": "Honduras",
        "code": "HN"
    },
    {
        "name": "Hong Kong",
        "code": "HK"
    },
    {
        "name": "Hungary",
        "code": "HU"
    },
    {
        "name": "Iceland",
        "code": "IS"
    },
    {
        "name": "India",
        "code": "IN"
    },
    {
        "name": "Indonesia",
        "code": "ID"
    },
    {
        "name": "Iran, Islamic Republic Of",
        "code": "IR"
    },
    {
        "name": "Iraq",
        "code": "IQ"
    },
    {
        "name": "Ireland",
        "code": "IE"
    },
    {
        "name": "Isle of Man",
        "code": "IM"
    },
    {
        "name": "Israel",
        "code": "IL"
    },
    {
        "name": "Italy",
        "code": "IT"
    },
    {
        "name": "Jamaica",
        "code": "JM"
    },
    {
        "name": "Japan",
        "code": "JP"
    },
    {
        "name": "Jersey",
        "code": "JE"
    },
    {
        "name": "Jordan",
        "code": "JO"
    },
    {
        "name": "Kazakhstan",
        "code": "KZ"
    },
    {
        "name": "Kenya",
        "code": "KE"
    },
    {
        "name": "Kiribati",
        "code": "KI"
    },
    {
        "name": "Korea, Democratic People\"S Republic of",
        "code": "KP"
    },
    {
        "name": "Korea, Republic of",
        "code": "KR"
    },
    {
        "name": "Kuwait",
        "code": "KW"
    },
    {
        "name": "Kyrgyzstan",
        "code": "KG"
    },
    {
        "name": "Lao People\"S Democratic Republic",
        "code": "LA"
    },
    {
        "name": "Latvia",
        "code": "LV"
    },
    {
        "name": "Lebanon",
        "code": "LB"
    },
    {
        "name": "Lesotho",
        "code": "LS"
    },
    {
        "name": "Liberia",
        "code": "LR"
    },
    {
        "name": "Libyan Arab Jamahiriya",
        "code": "LY"
    },
    {
        "name": "Liechtenstein",
        "code": "LI"
    },
    {
        "name": "Lithuania",
        "code": "LT"
    },
    {
        "name": "Luxembourg",
        "code": "LU"
    },
    {
        "name": "Macao",
        "code": "MO"
    },
    {
        "name": "Macedonia, The Former Yugoslav Republic of",
        "code": "MK"
    },
    {
        "name": "Madagascar",
        "code": "MG"
    },
    {
        "name": "Malawi",
        "code": "MW"
    },
    {
        "name": "Malaysia",
        "code": "MY"
    },
    {
        "name": "Maldives",
        "code": "MV"
    },
    {
        "name": "Mali",
        "code": "ML"
    },
    {
        "name": "Malta",
        "code": "MT"
    },
    {
        "name": "Marshall Islands",
        "code": "MH"
    },
    {
        "name": "Martinique",
        "code": "MQ"
    },
    {
        "name": "Mauritania",
        "code": "MR"
    },
    {
        "name": "Mauritius",
        "code": "MU"
    },
    {
        "name": "Mayotte",
        "code": "YT"
    },
    {
        "name": "Mexico",
        "code": "MX"
    },
    {
        "name": "Micronesia, Federated States of",
        "code": "FM"
    },
    {
        "name": "Moldova, Republic of",
        "code": "MD"
    },
    {
        "name": "Monaco",
        "code": "MC"
    },
    {
        "name": "Mongolia",
        "code": "MN"
    },
    {
        "name": "Montserrat",
        "code": "MS"
    },
    {
        "name": "Morocco",
        "code": "MA"
    },
    {
        "name": "Mozambique",
        "code": "MZ"
    },
    {
        "name": "Myanmar",
        "code": "MM"
    },
    {
        "name": "Namibia",
        "code": "NA"
    },
    {
        "name": "Nauru",
        "code": "NR"
    },
    {
        "name": "Nepal",
        "code": "NP"
    },
    {
        "name": "Netherlands",
        "code": "NL"
    },
    {
        "name": "Netherlands Antilles",
        "code": "AN"
    },
    {
        "name": "New Caledonia",
        "code": "NC"
    },
    {
        "name": "New Zealand",
        "code": "NZ"
    },
    {
        "name": "Nicaragua",
        "code": "NI"
    },
    {
        "name": "Niger",
        "code": "NE"
    },
    {
        "name": "Nigeria",
        "code": "NG"
    },
    {
        "name": "Niue",
        "code": "NU"
    },
    {
        "name": "Norfolk Island",
        "code": "NF"
    },
    {
        "name": "Northern Mariana Islands",
        "code": "MP"
    },
    {
        "name": "Norway",
        "code": "NO"
    },
    {
        "name": "Oman",
        "code": "OM"
    },
    {
        "name": "Pakistan",
        "code": "PK"
    },
    {
        "name": "Palau",
        "code": "PW"
    },
    {
        "name": "Palestinian Territory, Occupied",
        "code": "PS"
    },
    {
        "name": "Panama",
        "code": "PA"
    },
    {
        "name": "Papua New Guinea",
        "code": "PG"
    },
    {
        "name": "Paraguay",
        "code": "PY"
    },
    {
        "name": "Peru",
        "code": "PE"
    },
    {
        "name": "Philippines",
        "code": "PH"
    },
    {
        "name": "Pitcairn",
        "code": "PN"
    },
    {
        "name": "Poland",
        "code": "PL"
    },
    {
        "name": "Portugal",
        "code": "PT"
    },
    {
        "name": "Puerto Rico",
        "code": "PR"
    },
    {
        "name": "Qatar",
        "code": "QA"
    },
    {
        "name": "Reunion",
        "code": "RE"
    },
    {
        "name": "Romania",
        "code": "RO"
    },
    {
        "name": "Russian Federation",
        "code": "RU"
    },
    {
        "name": "RWANDA",
        "code": "RW"
    },
    {
        "name": "Saint Helena",
        "code": "SH"
    },
    {
        "name": "Saint Kitts and Nevis",
        "code": "KN"
    },
    {
        "name": "Saint Lucia",
        "code": "LC"
    },
    {
        "name": "Saint Pierre and Miquelon",
        "code": "PM"
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "code": "VC"
    },
    {
        "name": "Samoa",
        "code": "WS"
    },
    {
        "name": "San Marino",
        "code": "SM"
    },
    {
        "name": "Sao Tome and Principe",
        "code": "ST"
    },
    {
        "name": "Saudi Arabia",
        "code": "SA"
    },
    {
        "name": "Senegal",
        "code": "SN"
    },
    {
        "name": "Serbia and Montenegro",
        "code": "CS"
    },
    {
        "name": "Seychelles",
        "code": "SC"
    },
    {
        "name": "Sierra Leone",
        "code": "SL"
    },
    {
        "name": "Singapore",
        "code": "SG"
    },
    {
        "name": "Slovakia",
        "code": "SK"
    },
    {
        "name": "Slovenia",
        "code": "SI"
    },
    {
        "name": "Solomon Islands",
        "code": "SB"
    },
    {
        "name": "Somalia",
        "code": "SO"
    },
    {
        "name": "South Africa",
        "code": "ZA"
    },
    {
        "name": "South Georgia and the South Sandwich Islands",
        "code": "GS"
    },
    {
        "name": "Spain",
        "code": "ES"
    },
    {
        "name": "Sri Lanka",
        "code": "LK"
    },
    {
        "name": "Sudan",
        "code": "SD"
    },
    {
        "name": "Suriname",
        "code": "SR"
    },
    {
        "name": "Svalbard and Jan Mayen",
        "code": "SJ"
    },
    {
        "name": "Swaziland",
        "code": "SZ"
    },
    {
        "name": "Sweden",
        "code": "SE"
    },
    {
        "name": "Switzerland",
        "code": "CH"
    },
    {
        "name": "Syrian Arab Republic",
        "code": "SY"
    },
    {
        "name": "Taiwan, Province of China",
        "code": "TW"
    },
    {
        "name": "Tajikistan",
        "code": "TJ"
    },
    {
        "name": "Tanzania, United Republic of",
        "code": "TZ"
    },
    {
        "name": "Thailand",
        "code": "TH"
    },
    {
        "name": "Timor-Leste",
        "code": "TL"
    },
    {
        "name": "Togo",
        "code": "TG"
    },
    {
        "name": "Tokelau",
        "code": "TK"
    },
    {
        "name": "Tonga",
        "code": "TO"
    },
    {
        "name": "Trinidad and Tobago",
        "code": "TT"
    },
    {
        "name": "Tunisia",
        "code": "TN"
    },
    {
        "name": "Turkey",
        "code": "TR"
    },
    {
        "name": "Turkmenistan",
        "code": "TM"
    },
    {
        "name": "Turks and Caicos Islands",
        "code": "TC"
    },
    {
        "name": "Tuvalu",
        "code": "TV"
    },
    {
        "name": "Uganda",
        "code": "UG"
    },
    {
        "name": "Ukraine",
        "code": "UA"
    },
    {
        "name": "United Arab Emirates",
        "code": "AE"
    },
    {
        "name": "United Kingdom",
        "code": "GB"
    },
    {
        "name": "United States",
        "code": "US"
    },
    {
        "name": "United States Minor Outlying Islands",
        "code": "UM"
    },
    {
        "name": "Uruguay",
        "code": "UY"
    },
    {
        "name": "Uzbekistan",
        "code": "UZ"
    },
    {
        "name": "Vanuatu",
        "code": "VU"
    },
    {
        "name": "Venezuela",
        "code": "VE"
    },
    {
        "name": "Viet Nam",
        "code": "VN"
    },
    {
        "name": "Virgin Islands, British",
        "code": "VG"
    },
    {
        "name": "Virgin Islands, U.S.",
        "code": "VI"
    },
    {
        "name": "Wallis and Futuna",
        "code": "WF"
    },
    {
        "name": "Western Sahara",
        "code": "EH"
    },
    {
        "name": "Yemen",
        "code": "YE"
    },
    {
        "name": "Zambia",
        "code": "ZM"
    },
    {
        "name": "Zimbabwe",
        "code": "ZW"
    }
];

global.cities = [
    'Lima',
    'Arequipa',
    'Trujillo',
    'Chiclayo',
    'Iquitos',
    'Piura',
    'Cusco',
    'Chimbote',
    'Huancayo',
    'Tacna',
    'Juliaca',
    'Ica',
    'Cajamarca',
    'Pucallpa',
    'Sullana',
    'Ayacucho',
    'Chincha',
    'Huánuco',
    'Huacho',
    'Tarapoto',
    'Puno',
    'Huaraz',
    'Tumbes',
    'Pisco',
    'Huaral',
    'Moyobamba',
    'Puerto Maldonado',
    'Moquegua',
    'Cerro de Pasco',
    'Barranca',
    'Yurimaguas',
    'Chancay',
    'Andahuaylas',
    'Ilo',
    'Talara',
    'Abancay',
    'Lambayeque',
    'Tingo María',
    'Chulucanas',
    'Sicuani',
    'Mala',
    'Huancavelica',
    'Pacasmayo',
    'Tarma',
    'Sechura',
    'Guadalupe',
    'Bagua'
  ];
global.feedVerbs = ['like-work', 'follow-user', 'create-work'];

global.fbPermissions = [
  'email'     , 'user_about_me',
  'user_birthday', 'user_friends',
  'user_website'
];

global.lift = function (app) {
  var server = app.listen(app.get('port'), function () {
    var url = 'http://127.0.0.1:' + server.address().port + '/auth/login';
    console.log('Express server listening  on ' + url);
  });
};

global.config = {
  search: {
    entities: ['works', 'users', 'products', 'collections'],
    orders: {
      works: ['newest', 'popularity', 'hottest'],
      users: ['popularity', 'newest', 'hottest'],
      collections: ['newest'],
      products: ['newest', 'popularity', 'hottest', 'price_asc', 'price_desc']
    },
    times: ['day', 'week', 'month', 'year'],
    params: {
      works: ['order', 'time', 'featured', 'term'],
      users: ['order', 'time', 'featured', 'term'],
      collections: ['order', 'time', 'featured', 'term'],
      products: ['order', 'time', 'name', 'featured', 'lo_p', 'hi_p', 'term']
    }
  }
};

global.getStoreCollection = function (user) {
  var query = {store: true, limit: 1};
  return user.getCollections(query).then(function (collections) {
    return collections[0];
  });
};

global.goToLogin = function(req, res, message){
  var returnTo = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.cookie('return_to', returnTo, {maxAge: 3600000, domain: '.' + global.cf.app.domain});
  req.flash('errorMessage', message);
  return res.redirect('/auth/login');
};

global.nameSlugify = function (scope, value) {
  var time = moment().format('DDMMYYhhmmss');
  var nSlugifyTemp = scope.getDataValue('nameSlugify');
  if (nSlugifyTemp) {
    var nSlugify = nSlugifyTemp.split('-');
    var nSlugifyTime = parseInt(nSlugify[nSlugify.length - 1], 10);
    if (_.isNumber(nSlugifyTime)) {
      scope.setDataValue('nameSlugify', global.slugify(value + '-' + nSlugifyTime));
    } else {
      scope.setDataValue('nameSlugify', global.slugify(value + '-' + time));
    }
  } else {
    scope.setDataValue('nameSlugify', global.slugify(value + '-' + time));
  }
  scope.setDataValue('name', value);
}
global.slugify = function (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

global.discoverGenerator = function (entity, req) {
  var options = {};
  options.entity = entity;
  options.name = 'items';
  options.page = req.params.page;
  options.limit = 25;

  var query = {where: {}, build: true};
  query.viewer = req.viewer;
  query.order = [global.getOrder(req.query.order)];

  query.order[0][0].col = '`' + entity  +  '`.`' + query.order[0][0].col + '`';

  if (req.query.featured)
    query.where.featured = true;

  if (req.query.time)
    query.where.createdAt = {
      $between: [moment().startOf(req.query.time).toDate(), moment().toDate()]
    };
  if(req.query.order === 'hottest') {
    query.where.createdAt = {
      $between: [moment().subtract(7, 'd').toDate(), moment().toDate()]
    };
  }
  if (req.query.lo_p || req.query.hi_p)
    query.where.finalPrice = {
      $between: [req.query.lo_p || 0, req.query.hi_p || 3000]
    };

  if (req.query.term) {
    if (entity === 'Work' || entity === 'Product') {
      if (req.query.term.substring(0, 1) !== '#') {
        query.where.$and = global.db.sequelize.literal(
          "MATCH(" + entity +".name, " + entity + ".description) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
        );
      }

      if (req.query.term.substring(0, 1) === '#') {
        if (req.params.value !== 'all') {
          query.include = [{model: global.db.Category, where: {nameSlugify: req.params.value}}]
        }
      }
    }
    if (entity === 'User') {
      query.where.$and = global.db.sequelize.literal(
        "MATCH(firstname, lastname, username, pseudonimo) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
      );
    }
    if (entity === 'Collection') {
      query.where.$and = global.db.sequelize.literal(
        "MATCH(name, description) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
      );
    }
  }
  return {options: options, query: query};
}

var beforePagination = function (req, discover) {
  var isTag = false;

  var tempEntity = discover.options.entity;
  discover.options.tempEntity = tempEntity;
  var query = {where: {nameSlugify: req.params.value}};
  var tempModel = 'Category';
  if (req.query.term && req.query.term.substring(0, 1) === '#') {
    query = {where: {name: req.query.term.substring(1, req.query.term.length)}};
    tempModel = 'Tag';
  } else {
    if (req.params.value === 'all') {
      return global.getPaginationEntity(discover.options, discover.query);
    }
  }

  return global.db[tempModel].find(query).then(function (model) {
    if (!model)
      return global.getPaginationEntity(discover.options, discover.query, true)

    if(tempModel === 'Category' && tempEntity === 'Product') {
      return global.db.Category.findAll({where: {
        ParentCategoryId: model.id
      }}).then(function(categories) {
        // global.db.Product.findAll({where: {
        //   CategoryId: {$in: _.pluck(categories, 'id')}
        // }});
        tempModel = 'Product';
        discover.query.where.CategoryId = {$in: _.pluck(categories, 'id')};
        return global.getPaginationEntity(discover.options, discover.query);
      });
      // global.db.Category.findAll({where: {P}})
    }


    var method;
    switch (tempEntity) {
      case 'Work':
        method = 'getWorks';
        break;
      case 'User':
        method = 'getSpecialties';
        break;
      case 'Product':
        method = 'getProducts';
        break;
    }
    discover.options.entity = model;
    discover.options.method = method;
    discover.options.association = true;

    return global.getPaginationEntity(discover.options, discover.query);
  });
}

global.searchWorks = function (req) {
  var discover = discoverGenerator('Work', req);
  discover.query.where.public = true;
  discover.query.addUser = true;
  discover.query.order.push([global.db.sequelize.col('id')]);
  return beforePagination(req, discover);
};

global.searchUsers = function (req) {
  var discover = discoverGenerator('User', req);
  discover.query.where.firstname = {ne: null};
  discover.query.where.username = {$not: ['artemanifiesto']};
  discover.query.attributes = global.attributes.privateUser;
  discover.query.order.push([global.db.sequelize.col('id')]);
  return beforePagination(req, discover);
};

global.searchCollections = function (req) {
  var discover = discoverGenerator('Collection', req);
  discover.query.where.public = true;
  discover.query.where.meta = 'works';
  discover.query.addUser = true;
  discover.query.order.push([global.db.sequelize.col('id')]);
  return beforePagination(req, discover);
};

global.searchProducts = function (req) {
  var discover = discoverGenerator('Product', req);
  discover.query.where.published = true;
  if(req.profile) discover.query.where.UserId = req.profile.id;
  discover.query.addUser = true;
  discover.query.include = discover.query.include || [];
  discover.query.include.push(global.db.Work);
  discover.query.include.push(global.db.Category);
  discover.query.order.push([global.db.sequelize.col('id')]);

  return beforePagination(req, discover);
};

global.getPagination = function (page, limit) {
  var split = parseInt(page.split('-')[1], 10);
  page = _.isNaN(split) ? 1 : split;
  page = page > 10000 ? 1 : page;
  var offset = page > 0 ? ((page - 1) * limit) : 0;
  return {page: page, limit: limit, offset: offset};
};

global.getParameter = function (data, value) {
  var index = data.indexOf(value);
  if (index < 0)index = 0;
  return data[index];
};

global.getUrlParameter = function (url, sParam) {
  var sPageURL = url.substring(1)
  var sURLVariables = sPageURL.split('&')
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] == sParam)
      return sParameterName[1]
  }
};

global.encodeToQuery = function (data) {
  var ret = [];
  var param;
  for (param in data)
    ret.push(encodeURIComponent(param) + "=" + encodeURIComponent(data[param]));
  return ret.join("&");
};

global.getOrder = function (order) {
  switch (order) {
    case 'popularity':
    case 'hottest':
      order = [global.db.sequelize.col('popularity'), 'DESC'];
      break;
    case 'newest':
      order = [global.db.sequelize.col('createdAt'), 'DESC'];
      break;
    case 'price_asc':
      order = [global.db.sequelize.col('finalPrice'), 'ASC'];
      break;
    case 'price_desc':
      order = [global.db.sequelize.col('finalPrice'), 'DESC'];
      break;
  }
  return order;
};

global.emails = {
  verify: function (req, options) {
    options.subject = 'Arte Manifiesto - Confirmación de email'
    return email.send(req, options, 'verify').then();
  },
  forgot: function (req, options) {
    options.subject = 'Arte Manifiesto - Cambio de contraseña'
    return email.send(req, options, 'forgot').then();
  },
  availability: function (req, options) {
    options.subject = 'Arte Manifiesto - Disponibilidad de Obra'
    return email.send(req, options, 'availability').then();
  },
  confirm: function (req, options) {
    options.subject = 'Arte Manifiesto - Confirmación de pedido'
    return email.send(req, options, 'confirm').then();
  },
  sell: function (req, options) {
    options.subject = 'Arte Manifiesto - Producto Vendido'
    return email.send(req, options, 'sell').then();
  },
  am: function (req, options) {
    options.subject = 'Arte Manifiesto - Producto Vendido'
    return email.send(req, options, 'am').then();
  }
};


global.getPaginationEntity = function (options, query, empty) {
  var pages = global.getPagination(options.page, options.limit);
  query = _.assign(query, {offset: pages.offset, limit: pages.limit});

  if (empty)
    return {
      items: [],
      pagination: {
        total: 0, page: pages.page, limit: pages.limit,
        pages: Math.ceil(0 / pages.limit)
      }
    };

  var promises = [];
  if (!options.association) {
    promises = [global.db[options.entity].findAll(query)]
    query = _.omit(query, 'build', 'offset', 'limit', 'addUser', 'group');
    promises.push(global.db[options.entity].count(query));
  }
  else {
    promises = [options.entity[options.method](query)];
    query = _.omit(query, 'build', 'addUser');
    var identifier = options.tempEntity ? options.tempEntity + '.id' : 'id';
    query.attributes = ['*',
      [global.db.sequelize.fn('COUNT', global.db.sequelize.col(identifier)), 'total']
    ];
    query = _.omit(query, 'build', 'offset', 'limit');
    promises.push(options.entity[options.method](query));
  }

  return global.db.Sequelize.Promise.all(promises).then(function (data) {
    var total, result = {items: data[0]};
    if (!options.association)
      total = data[1];
    else
      total = data[1][0].getDataValue('total');
    result.pagination = {
      total: total,
      page: pages.page,
      limit: pages.limit,
      pages: Math.ceil(total / pages.limit)
    };
    return result;
  });
};

global.objectToParameters = function (element) {
  return Object.keys(element).map(function (key) {
    return key + '=' + element[key];
  }).join('&');
};

global.replaceAt = function (text, index, character) {
  return text.substr(0, index) + character + text.substr(index + character.length);
};

global.getOnly = function (entity, items) {
  return {};
};


global.beforeFind = function (options, fn) {
  if (options.addUser) {
    options.include = options.include || [];
    options.include.push({model: global.db.User, 
      attributes: global.attributes.privateUser
    });
  }
  fn(null, options);
};

global.afterFind = function (items, options, fn) {
  if ((items === null) ||
    (_.isArray(items) && items.length < 1))
    return fn(null, options);

  if (options.build) {
    var promises = [];
    var addPromise = function (item) {
      if (options.build)
        promises.push(item.buildParts(options));
    };

    if (!_.isArray(items))
      addPromise(items);

    for (var i = 0; i < items.length; i++)
      addPromise(items[i]);

    return global.db.Sequelize.Promise.all(promises).then(function () {
      return fn(null, options);
    });
  }
  return fn(null, options);
}
