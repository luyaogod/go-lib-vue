export function taskTimeDiff(START: number[], END: number[]): number {
  // 获取当前时间
  const now = new Date()

  const targetStart = new Date()
  targetStart.setHours(START[0], START[1], START[2], START[3])

  const targetEnd = new Date()
  targetEnd.setHours(END[0], END[1], END[2], END[3])

  let timeDiff = 0

  if (now > targetStart && now < targetEnd) {
    timeDiff = 0
  } else if (now > targetEnd) {
    const tomorrwTargetStart = new Date()
    tomorrwTargetStart.setHours(START[0], START[1], START[2], START[3])
    tomorrwTargetStart.setDate(targetStart.getDate() + 1)
    timeDiff = tomorrwTargetStart.getTime() - now.getTime()
  } else {
    timeDiff = targetStart.getTime() - now.getTime()
  }
  return timeDiff
}
