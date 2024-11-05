import { Color, COLORS } from './colors'

/** Created 12 color boxes for selecting color. */
export class ColorPicker {
    private currentColor!: Color
    private selectedColorButton!: HTMLButtonElement

    constructor(parentElement: HTMLElement) {
        const buttons = COLORS.map((colorHex) => {
            const btn = document.createElement('button')
            btn.style.color = colorHex
            btn.classList.add('color-option')
            btn.onclick = () => {
                this.markOptionAsSelected(btn, colorHex)
            }

            return btn
        })

        this.markOptionAsSelected(buttons[0], COLORS[0])
        parentElement.append(...buttons)
    }

    public getCurrentColor(): Color {
        return this.currentColor
    }

    private markOptionAsSelected(btn: HTMLButtonElement, colorHex: Color) {
        this.currentColor = colorHex
        this.selectedColorButton?.classList.remove('active-color')
        btn.classList.add('active-color')
        this.selectedColorButton = btn
    }
}
