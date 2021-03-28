// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'

const token = Deno.env.get('NCU_TOKEN')
if (!token) {
  console.error('❌ 未设置 NCU_TOKEN 环境变量')
  Deno.exit(1)
}

const api = ky.extend({
  prefixUrl: 'http://jc.ncu.edu.cn/gate/student',
  method: 'POST',
  headers: { token },
})

const createForm = (data: Record<string, string>) => {
  const form: Record<string, string> = {}
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

  form.healthDetail = data.healthStatus
  form.isIsolation = data.isIsolate
  form.isolationPlace = data.isolatePlace

  return form
}

const editableFields = {
  省: 'addressProvince',
  市: 'addressCity',
  详细地址: 'addressInfo',
}

;(async () => {
  const { code, data } = await api('getPreSignInfo').json()

  if (code === '1') {
    console.error('❌ Token 过期')
    Deno.exit(1)
  }

  const last = new Date(data.signDate).getTime()
  const today = new Date().setHours(0, 0, 0, 0)
  const tomorrow = new Date().setHours(24, 0, 0, 0)

  console.log(`🕒 上次打卡时间：${data.signDate}`)
  console.log(`📍 上次打卡地点：${data.ipToAddress} (${data.ip})`)
  if (last >= today && last < tomorrow) console.log('✅ 今天已经打卡')
  else console.log('❌ 今天尚未打卡')

  const form = createForm(data)

  while (true) {
    console.log('\nℹ️ 本次打卡信息')

    for (const [label, field] of Object.entries(editableFields))
      console.log(`  ${label}：${form[field]}`)

    const answer = prompt('输入欲修改的项目名，或直接回车进行打卡:')
    if (answer === null) break
    else if (answer in editableFields) {
      const newValue = prompt(`输入新的“${answer}”:`)
      if (newValue !== null)
        form[editableFields[answer as keyof typeof editableFields]] = newValue
    } else console.error('❌ 输入无效')
  }

  const result = await api('signIn', {
    headers: {
      // https://github.com/denoland/deno/pull/9214
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(form),
  }).json<Record<string, unknown>>()

  if (result.code === '0') console.log('🎉 打卡成功')
  else console.error(result)
})()
