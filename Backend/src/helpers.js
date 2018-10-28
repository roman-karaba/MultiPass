import jwt from 'jsonwebtoken';

const secret = 'SuperTokenSecret';

module.exports.GenerateToken = (data) => {
  const payload = {
    matriculationId: data.matriculationId,
    firstName: data.firstName,
    lastName: data.lastName,
    userType: data.userType
  };
  try {
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });
    return token;
  } catch (error) {
    console.log('====== GENERATE TOKEN ERROR =====');
    console.log(error);
  }
};

module.exports.VerifyToken = (token) => {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    console.log('====== VERIFY TOKEN ERROR =====');
    console.log('Token is invalid or expired');
    return false;
  }
};

module.exports.DecodeToken = (token) => {
  try {
    const rawToken = jwt.decode(token, { json: true });
    return rawToken;
  } catch (error) {
    console.log('===== DECODE TOKEN ERROR =====');
    console.log(error);
    return { error: true };
  }
};

// eslint-disable-next-line
module.exports.getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

module.exports.StrToHex = (string => Buffer.from(string, 'utf8').toString('hex'));
module.exports.HexToStr = (hex => Buffer.from(hex, 'hex').toString('utf8'));
