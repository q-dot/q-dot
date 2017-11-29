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

const sendEmail = (fromEmail, customer, placeName, transporter) => {
  let mailOptions = {
    from: fromEmail + '@gmail.com',
    to: customer.email,
    subject: 'Your table booked at ' + placeName + ' is ready!',
    text: 'Hello ' + customer.name + '!\n\nThe table you booked with Q. is now ready for you. We hope you enjoy your dining experience at '
      + placeName + '\n\nBon Appétit,\nQ.'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  nameFormatter: nameFormatter,
  phoneNumberFormatter: phoneNumberFormatter,
  filterPhoneForNexmo: filterPhoneForNexmo,
  sendSMS: sendSMS,
  sendEmail: sendEmail
};
