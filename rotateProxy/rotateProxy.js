// return a the same proxy 5 times and then move to the next
// after all proxy in array used wait 10mins
// then restart from the first

require("dotenv").config();

const newProxy = () => {
  const proxies = [
    `${process.env.PROXY1}`,
    `${process.env.PROXY12}`,
    `${process.env.PROXY3}`,
    `${process.env.PROXY5}`,
    `${process.env.PROXY6}`,
    `${process.env.PROXY7}`,
    `${process.env.PROXY9}`,
    `${process.env.PROXY2}`,
    `${process.env.PROXY10}`,
    `${process.env.PROXY11}`,
    `${process.env.PROXY13}`,
    `${process.env.PROXY14}`,
    `${process.env.PROXY15}`,
    `${process.env.PROXY16}`,
    `${process.env.PROXY17}`,
    `${process.env.PROXY18}`,
    `${process.env.PROXY19}`,
    `${process.env.PROXY20}`,
    `${process.env.PROXY21}`,
    `${process.env.PROXY22}`,
    `${process.env.PROXY23}`,
    `${process.env.PROXY24}`,
    `${process.env.PROXY25}`,
    `${process.env.PROXY26}`,
    `${process.env.PROXY27}`,
    `${process.env.PROXY28}`,
    `${process.env.PROXY29}`,
    `${process.env.PROXY30}`,
    `${process.env.PROXY31}`,
    `${process.env.PROXY32}`,
    `${process.env.PROXY33}`,
    `${process.env.PROXY34}`,
    `${process.env.PROXY35}`,
    `${process.env.PROXY36}`,
    `${process.env.PROXY37}`,
    `${process.env.PROXY38}`,
    `${process.env.PROXY39}`,
    `${process.env.PROXY40}`,
    `${process.env.PROXY41}`,
    `${process.env.PROXY42}`,
    `${process.env.PROXY43}`,
    `${process.env.PROXY44}`,
    `${process.env.PROXY45}`,
    `${process.env.PROXY46}`,
    `${process.env.PROXY47}`,
    `${process.env.PROXY48}`,
    `${process.env.PROXY49}`,
    `${process.env.PROXY50}`,
    `${process.env.PROXY51}`,
    `${process.env.PROXY52}`,
    `${process.env.PROXY53}`,
    `${process.env.PROXY54}`,
    `${process.env.PROXY55}`,
    `${process.env.PROXY56}`,
    `${process.env.PROXY57}`,
    `${process.env.PROXY58}`,
    `${process.env.PROXY59}`,
    `${process.env.PROXY60}`,
    `${process.env.PROXY61}`,
    `${process.env.PROXY62}`,
    `${process.env.PROXY63}`,
    `${process.env.PROXY64}`,
    `${process.env.PROXY65}`,
    `${process.env.PROXY66}`,
    `${process.env.PROXY67}`,
    `${process.env.PROXY68}`,
    `${process.env.PROXY69}`,
    `${process.env.PROXY70}`,
    `${process.env.PROXY71}`,
    `${process.env.PROXY72}`,
    `${process.env.PROXY73}`,
    `${process.env.PROXY74}`,
    `${process.env.PROXY75}`,
    `${process.env.PROXY76}`,
    `${process.env.PROXY77}`,
    `${process.env.PROXY78}`,
    `${process.env.PROXY79}`,
    `${process.env.PROXY80}`,
    `${process.env.PROXY81}`,
    `${process.env.PROXY82}`,
    `${process.env.PROXY83}`,
    `${process.env.PROXY84}`,
    `${process.env.PROXY85}`,
    `${process.env.PROXY86}`,
    `${process.env.PROXY87}`,
    `${process.env.PROXY88}`,
    `${process.env.PROXY89}`,
    `${process.env.PROXY90}`,
    `${process.env.PROXY91}`,
    `${process.env.PROXY92}`,
    `${process.env.PROXY93}`,
    `${process.env.PROXY94}`,
    `${process.env.PROXY95}`,
    `${process.env.PROXY96}`,
    `${process.env.PROXY97}`,
    `${process.env.PROXY98}`,
    `${process.env.PROXY99}`,
    `${process.env.PROXY100}`,
  ];

  let random = Math.floor(Math.random() * 97);
  let newProxy = proxies[random];

  console.log(`proxy n° ${random}`);
  return newProxy;
};

module.exports = newProxy;
