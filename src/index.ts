import { app } from 'electron'
import { createTray } from './tray'

app.dock.hide()

app.on('ready', () => {
  createTray()
})
