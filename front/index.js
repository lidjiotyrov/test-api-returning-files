const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const mainFunc = async () => {

  const requestFile = async (fileNum) => {
    const file = await fetch(`http://localhost:3000/file${fileNum}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const bf = await file.buffer()
    const string = bf.toString()
    const arraySymbols = string.split('\r').join('').split('\n').join('').split('=').join('').split('')
    return arraySymbols
  }

  const[arrString1, arrString2] = await Promise.all([
    await requestFile(1),
    await requestFile(2),
  ])

  const conversionFunction = (transformArray) => {
    let arrStr = []
    let arrNum = []
    let counter = 0
    let counterNum = 0

    transformArray.forEach((el)=> {
      if(isNaN((Number(el)))) {
        counter +=1
      } else {
        counter = 0
      }
      if(counter && counter === 1) {
        arrStr.push(el)
      }
      if(counter && counter > 1) {
        const symbol = arrStr[arrStr.length - 1] + el
        arrStr[arrStr.length - 1] = symbol
      }
      if(!isNaN((Number(el)))) {
        counterNum +=1
      } else {
        counterNum = 0
      }
      if(counterNum && counterNum === 1) {
        arrNum.push(el)
      }
      if(counterNum && counterNum > 1) {
        const symbol = arrNum[arrNum.length - 1] + el
        arrNum[arrNum.length -1] = symbol
      }
    })

    let Obj = {}

    for(let i=0; i < arrStr.length; i++) {
      let counter = 0
      for (let j in Obj) {

        if (j === arrStr[i]) {
          counter = Number(Obj[j]) + Number(arrNum[i])
        }
      }

      if (counter) {
        Obj[arrStr[i]] = counter
      } else {
        Obj[arrStr[i]] = +arrNum[i]
      }
    }

    return Obj
  }
  const Obj1 = conversionFunction(arrString1)
  const Obj2 = conversionFunction(arrString2)
  console.log("Obj1", Obj1)
  console.log("Obj2", Obj2)

  const result = {};

  Object.keys(Obj1)
    .forEach(key => result[key] = Obj1[key]);

  Object.keys(Obj2)
    .forEach((key) => {

      let counter = 0
      for (let j in result) {

        if (j === key) {
          counter = result[key] + Obj2[key]
        }
      }
      if(counter) {
        result[key] = counter
      } else {
        result[key] = Obj2[key]
      }
    })
  console.log("Result", result)
}


mainFunc().then()
