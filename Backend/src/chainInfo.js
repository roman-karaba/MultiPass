const usersJSON = require('./usersJSON');
const multichainOptions = require('./multichainOptions');
const multichain = require('multichain-node')(multichainOptions);

const StrToHex = (string => Buffer.from(string, 'utf8').toString('hex'));
const HexToStr = (hex => Buffer.from(hex, 'hex').toString('utf8'));

async function init() {
  try {
    const data = {
      info: await multichain.getInfo(),
      streams: await multichain.listStreams(),
      userKeys: await multichain.listStreamKeys({ stream: 'users' }),
      courseKeys: await multichain.listStreamKeys({ stream: 'courses' })
    };
    console.log('\nChain info:');
    console.log(data.info);

    console.log('\nStreams:');
    console.log(data.streams);

    console.log('\nUser Keys:');
    console.log(data.userKeys);

    console.log('\nCourse Keys:');
    console.log(data.courseKeys);

    const me = await multichain.listStreamKeyItems({ stream: 'users', key: '01301624' });
    console.log(JSON.parse(HexToStr(me[me.length - 1].data)));

    const me2 = await multichain.listStreamKeyItems({ stream: 'users', key: '02301624' });
    console.log(JSON.parse(HexToStr(me2[me2.length - 1].data)));

    const teach = await multichain.listStreamKeyItems({ stream: 'users', key: '12345678' });
    console.log(JSON.parse(HexToStr(teach[teach.length - 1].data)));

    const teach2 = await multichain.listStreamKeyItems({ stream: 'users', key: '23456789' });
    console.log(JSON.parse(HexToStr(teach2[teach2.length - 1].data)));


    const pbm = await multichain.listStreamKeyItems({ stream: 'courses', key: '050077-2018S' });
    console.log(JSON.parse(HexToStr(pbm[pbm.length - 1].data)));
  } catch (err) {
    console.log(err);
  }
}


init();
