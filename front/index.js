const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')


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

// Функция конверсии массива символов в общий объект файла
  const conversionFunction = (transformArray) => {
    let arrStr = []
    let arrNum = []
    let counter = 0
    let counterNum = 0

    transformArray.forEach((el)=> {

      // Запись ключей в отдельный массив ArrStr
      if(isNaN((Number(el)))) {
        counter +=1
      } else {
        counter = 0
      }
      if(counter === 1) {
        arrStr.push(el)
      }
      if(counter > 1) {
        const symbol = arrStr[arrStr.length - 1] + el
        arrStr[arrStr.length - 1] = symbol
      }

      //Запись чисел(значений) в отдельный массив ArrNum
      if(!isNaN((Number(el)))) {
        counterNum +=1
      } else {
        counterNum = 0
      }
      if(counterNum === 1) {
        arrNum.push(el)
      }
      if(counterNum > 1) {
        const symbol = arrNum[arrNum.length - 1] + el
        arrNum[arrNum.length -1] = symbol
      }
    })

    //Сборка Общего объекта из ArrStr(ключи) и ArrNum(значения)
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

//Общий объект
  const result = {}

// Запись ключей объекта первого файла в общий объект
  Object.keys(Obj1)
    .forEach(key => result[key] = Obj1[key])

// Запись ключей объекта второго файла и проверка на уникальность ключей в объектах
  Object.keys(Obj2)
    .forEach((key) => {
      let overallResult= 0
      for (let j in result) {

        if (j === key) {
          overallResult = result[key] + Obj2[key]
        }
      }

      if(overallResult) {
        result[key] = overallResult
      } else {
        result[key] = Obj2[key]
      }
    })

// Преобразование общего объекта в массив строк
  const finalArrString = []
  Object.keys(result).forEach(key => {
    const el = key + '=' + result[key]
    finalArrString.push(el)
  })

  const finalString = finalArrString.sort().join('\n')

//Создание файла с конечным результатом
  fs.appendFile('finalFile.txt', finalString, function (err) {
    if (err) {
      // append failed
    } else {
      // done
    }
  })
}

mainFunc().then()
