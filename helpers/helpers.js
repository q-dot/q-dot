const changeCase = (name) => {
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
};

const nameFormatter = (name) => {
  if (name.includes(' ')) {
    return name.split(' ').map(changeCase).join(' ');
  } else {
    return changeCase(name);
  }
};

const phoneNumberFormatter = (number) => {
  return number.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
};

const filterPhoneForNexmo = (number) => {
  let numberPattern = /\d+/g;
  let result = number.match(numberPattern)[0];
  return result;
};

const sendSMS = (nexmoObj, virtualNumber, phoneToUse, placeName) => {
  let message = placeName + ' is ready for you! 🍽 - Q.\n';

  nexmoObj.message.sendSms(
    virtualNumber, phoneToUse, message, {type: 'unicode'}, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        // console.dir(responseData);
      }
    }
  );
};

module.exports = {
  nameFormatter: nameFormatter,
  phoneNumberFormatter: phoneNumberFormatter,
  filterPhoneForNexmo: filterPhoneForNexmo,
  sendSMS: sendSMS
};
