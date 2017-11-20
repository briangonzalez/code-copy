import { Menu, Tray } from 'electron'
import * as mergeImg from 'merge-img'
import { listen } from 'auth-code-copy'
import * as path from 'path'

const bottomItems = [
  { role: 'quit' }
]

interface Code {
  code: string
  sender: string
}

function getMenu (codes: Code[] = []) {
  const middleItems = codes.length ?
  codes.map(({ code, sender }) => (
    { label: `Copy ${code}${sender ? ` from ${sender}` : ''}` }
  )) :
  [{ label: 'Listening for codes...' }]

  return Menu.buildFromTemplate([
    ...middleItems,
    { type: 'separator' },
    ...bottomItems
  ])
}

function updateTrayIconWithCode (code: string, tray: Tray): void {
  const numberPaths = code.split('')
  .map(n => path.join(__dirname, `numbers/${n}.png`))

  mergeImg(numberPaths)
  .then((img: any) => {
    const numericalIcon = path.join(__dirname, 'numerical-icon.png')
    img.write(numericalIcon, () => {
      tray.setImage(numericalIcon)
    })
  })
}

function updateTrayIconWithDefault (tray: any) {
  const icon = path.join(__dirname, 'icon.png')
  tray.setImage(icon)
}

let codes: Code[] = []
let timeout: any

function createTray (): void {
  const icon = path.join(__dirname, 'icon.png')
  const tray = new Tray(icon)
  const menu = getMenu()

  listen((err: any, { code, sender }: { code: string, sender: string }) => {
    if (err) throw err

    updateTrayIconWithCode(code, tray)
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => { updateTrayIconWithDefault(tray) }, 10000)

    codes = [{ code, sender }, ...codes]
    const newMenu = getMenu(codes)
    tray.setContextMenu(newMenu)
  })

  tray.setContextMenu(menu)
}

export {
  createTray,
  getMenu,
  updateTrayIconWithCode,
  updateTrayIconWithDefault
}
