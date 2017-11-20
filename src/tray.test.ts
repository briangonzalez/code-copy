import 'jest'
import { createTray, getMenu, updateTrayIconWithCode, updateTrayIconWithDefault } from './tray'

test('getMenu', () => {
  const menu = getMenu()
  expect(cb).toHaveBeenCalledWith(null, { code: '123456', text: 'Your code is 123456' })
})
