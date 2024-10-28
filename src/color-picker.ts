// TODO: these could be taken from enum. Currently these are duplicated in 2 places.
const COLORS = [
    '#2a3bab',
    '#00ffdd',
    '#64e8b8',
    '#00ff00',
    '#1c621c',
    '#ff0000',
    '#eff30f',
    '#d8a20e',
    '#621564',
    '#ffffff',
    '#ffc0c0',
    '#e97272',
]

/**
 * TODO: figure out if class with static methods is really the best approach. Maybe refactor to use as singleton.
 */
export class ColorPicker {
    private static currentColor = COLORS[0]
    private static selectedColorButton: HTMLButtonElement

    public static init() {
        const buttons = COLORS.map((colorHex) => {
            const btn = document.createElement('button')
            btn.style.color = colorHex
            btn.onclick = () => {
                console.log('Selected color: %c' + colorHex, 'color:' + colorHex)
                this.currentColor = colorHex // TODO: do not use window to store state like this.
                this.selectButton(btn)
            }

            return btn
        })

        this.selectButton(buttons[0])

        // TODO: do this some other way maybe:
        document.querySelector('.color-picker')?.append(...buttons)
    }

    /** TODO: maybe return Color enum member, not hex? */
    public static getCurrentColor() {
        return this.currentColor // Change this to color
    }

    private static selectButton(btn: HTMLButtonElement) {
        this.selectedColorButton?.classList.remove('active-color')
        btn.classList.add('active-color')
        this.selectedColorButton = btn
    }
}


