import http from 'http'
import readline from 'readline'

const token = process.env.NCU_TOKEN

const last = () =>
  new Promise((resolve) => {
    http
      .request(
        'http://jc.ncu.edu.cn/gate/student/getPreSignInfo',
        {
          method: 'POST',
          headers: { token },
        },
        (response) => {
          let chunks = ''

          response.setEncoding('utf8')
          response.on('data', (chunk) => (chunks += chunk))
          response.on('end', () => resolve(JSON.parse(chunks)))
        }
      )
      .end()
  })

const sign = (data) =>
  new Promise((resolve) => {
    const request = http.request(
      'http://jc.ncu.edu.cn/gate/student/signIn',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          token,
        },
      },
      (response) => {
        response.on('data', () => {})
        response.on('end', resolve)
      }
    )
    request.write(data)
    request.end()
  })

const createForm = (data) => {
  const form = {}
  const fields = [
    'inChina',
    'addressProvince',
    'addressCity',
    'temperatureStatus',
    'temperature',
    'isIll',
    'closeHb',
    'closeIll',
    'userId',
    'addressInfo',
    'isGraduate',
    'healthStatus',
    'isIsolate',
    'isolatePlace',
  ]

  for (const field of fields) form[field] = data[field]

  form.isIsolation = data.isIsolate
  form.isolationPlace = data.isolatePlace
  form.healthDetail = '无异常'

  return form
}

const editableFields = {
  省: 'addressProvince',
  市: 'addressCity',
  详细地址: 'addressInfo',
}

console.log('⏳ 正在获取上次打卡信息\n')

last().then(({ data }) => {
  const form = createForm(data)

  const now = new Date().getTime()
  const today = new Date().setHours(0, 0, 0, 0)
  const tomorrow = new Date().setHours(24, 0, 0, 0)

  if (now > today && now < tomorrow) console.log('✅ 今天已经打过卡啦')
  console.log(`🕒 上次打卡时间：${data.signDate}`)
  console.log(`📍 上次打卡地点：${data.ipToAddress} (${data.ip})`)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = () => {
    console.log('\nℹ️ 本次打卡信息')

    for (const [label, field] of Object.entries(editableFields))
      console.log(`  ${label}：${form[field]}`)

    rl.question(
      '\n按回车进行打卡，或输入需要修改的项目名并按回车：',
      (label) => {
        if (label === '') {
          rl.close()

          const formData = []

          for (const [key, value] of Object.entries(form))
            formData.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )

          sign(formData.join('&')).then(() => console.log('✅ 打卡成功'))
        } else if (label in editableFields)
          rl.question(`输入新的“${label}”：`, (newValue) => {
            form[editableFields[label]] = newValue
            question()
          })
        else {
          console.log(`❌ 是不是打错字啦！`)
          question()
        }
      }
    )
  }

  question()
})
