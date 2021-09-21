const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const mainFunc = async () => {

  const request1 = async () => {
    const file = await fetch('http://localhost:3000/file1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const bf = await file.buffer()

    return bf.toString()
  }

  const request2 = async () => {
    const file = await fetch('http://localhost:3000/file2',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const bf = await file.buffer()

    return bf.toString()
  }

  const[str1, str2] = await Promise.all([
    await request1(),
    await request2(),
  ])
  console.log("str2",str2)
   const arrString1 = str1.split('\r').join('').split('\n').join('').split('=').join('').split('')
   const arrString2 = str2.split('\r').join('').split('\n').join('').split('=').join('').split('')
  console.log("arr2", arrString2)


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
}


mainFunc().then()
